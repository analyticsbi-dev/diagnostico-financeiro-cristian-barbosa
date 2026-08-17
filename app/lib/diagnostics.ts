export type Diagnostic = {
  id:number|string; nome:string; whatsapp:string; email:string; cidade:string; faturamento:string; funcionarios:string; controle:string; desafio:string; origem:string;
  empresa_nome:string; cnpj:string|null; atividade:string; funcionarios_qtd:number;
  ativo_caixa_bancos:number; ativo_contas_receber:number; ativo_estoques:number; ativo_outros_receber:number; ativo_imobilizado:number;
  passivo_fornecedores:number; passivo_bancos_curto:number; passivo_impostos:number; passivo_outras_obrigacoes:number; passivo_capital_social:number; passivo_bancos_longo:number;
  dre_faturamento:number; dre_impostos:number; dre_compras:number; dre_folha:number; dre_despesas_adm:number; created_at:string; updated_at?:string; status?:string;
};

let cached:{at:number;data:Diagnostic[]}|null=null;
function base64ToText(value:string){ return Buffer.from(value,"base64").toString("utf8"); }
function pemToBytes(pem:string){ const body=pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,""); return Uint8Array.from(atob(body),(c)=>c.charCodeAt(0)); }
function url64(input:Uint8Array|string){ const bytes=typeof input==="string"?new TextEncoder().encode(input):input; let binary=""; bytes.forEach((b)=>binary+=String.fromCharCode(b)); return btoa(binary).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_"); }

async function serviceAccountToken(){
  const raw=process.env.GOOGLE_SERVICE_ACCOUNT_JSON; if(!raw)return null;
  const service=JSON.parse(raw); const now=Math.floor(Date.now()/1000);
  const header=url64(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const claim=url64(JSON.stringify({iss:service.client_email,scope:"https://www.googleapis.com/auth/drive.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`;
  const key=await crypto.subtle.importKey("pkcs8",pemToBytes(service.private_key),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const signature=new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned)));
  const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:`${unsigned}.${url64(signature)}`})});
  if(!response.ok)throw new Error("Falha na autenticação da conta de serviço.");
  return (await response.json() as {access_token:string}).access_token;
}

async function fetchDriveData(){
  const fileId=process.env.GOOGLE_DRIVE_FILE_ID; const token=process.env.GOOGLE_DRIVE_ACCESS_TOKEN||await serviceAccountToken();
  if(!fileId||!token)throw new Error("Integração com o Google Drive ainda não configurada.");
  const response=await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok)throw new Error("Não foi possível ler o arquivo do Google Drive.");
  return await response.json() as Diagnostic[];
}

export async function loadDiagnostics():Promise<{diagnostics:Diagnostic[];source:string;error?:string}>{
  try{
    if(cached&&Date.now()-cached.at<60_000)return{diagnostics:cached.data,source:"Drive · cache de 60s"};
    let data:Diagnostic[]; let source="Google Drive · atualizado agora";
    if(process.env.DIAGNOSTICS_JSON_BASE64){data=JSON.parse(base64ToText(process.env.DIAGNOSTICS_JSON_BASE64));source="Cópia de desenvolvimento do Drive";}else data=await fetchDriveData();
    cached={at:Date.now(),data}; return{diagnostics:data,source};
  }catch(error){return{diagnostics:[],source:"Google Drive",error:error instanceof Error?error.message:"Erro inesperado ao carregar os dados."};}
}
