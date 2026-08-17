import type { Diagnostic } from "./diagnostics";

export const numeric = (value: number | null | undefined) => Number.isFinite(Number(value)) ? Number(value) : 0;
export const ratio = (value: number, base: number) => base > 0 ? value / base : null;

export function calculateFinancialMetrics(d: Diagnostic) {
  const revenue = numeric(d.dre_faturamento), taxes = numeric(d.dre_impostos), purchases = numeric(d.dre_compras);
  const payroll = numeric(d.dre_folha), admin = numeric(d.dre_despesas_adm), cash = numeric(d.ativo_caixa_bancos);
  const receivables = numeric(d.ativo_contas_receber), inventory = numeric(d.ativo_estoques), otherReceivables = numeric(d.ativo_outros_receber);
  const fixedAssets = numeric(d.ativo_imobilizado), suppliers = numeric(d.passivo_fornecedores), bankShort = numeric(d.passivo_bancos_curto);
  const overdueTaxes = numeric(d.passivo_impostos), otherLiabilities = numeric(d.passivo_outras_obrigacoes), bankLong = numeric(d.passivo_bancos_longo);
  const capital = numeric(d.passivo_capital_social), employees = numeric(d.funcionarios_qtd);
  const netRevenue = revenue - taxes, grossResult = netRevenue - purchases, operatingResult = grossResult - payroll - admin;
  const currentAssets = cash + receivables + inventory + otherReceivables, totalAssets = currentAssets + fixedAssets;
  const currentLiabilities = suppliers + bankShort + overdueTaxes + otherLiabilities, bankDebt = bankShort + bankLong;
  const totalLiabilities = currentLiabilities + bankLong, workingCapital = currentAssets - currentLiabilities;
  const dryAssets = cash + receivables + otherReceivables, accumulated = totalAssets - totalLiabilities - capital, equity = capital + accumulated;
  return { revenue,taxes,purchases,payroll,admin,cash,receivables,inventory,otherReceivables,fixedAssets,suppliers,bankShort,overdueTaxes,otherLiabilities,bankLong,capital,employees,netRevenue,grossResult,operatingResult,currentAssets,totalAssets,currentLiabilities,bankDebt,totalLiabilities,workingCapital,dryAssets,accumulated,equity,
    operatingMargin:ratio(operatingResult,revenue),currentLiquidity:ratio(currentAssets,currentLiabilities),dryLiquidity:ratio(dryAssets,currentLiabilities),immediateLiquidity:ratio(cash,currentLiabilities),debtToAssets:ratio(totalLiabilities,totalAssets),bankDebtToRevenue:ratio(bankDebt,revenue),bankShortShare:ratio(bankShort,bankDebt),bankLongShare:ratio(bankLong,bankDebt),revenuePerEmployee:employees>0?revenue/employees:null,resultPerEmployee:employees>0?operatingResult/employees:null,payrollPerEmployee:employees>0?payroll/employees:null,payrollWeight:ratio(payroll,revenue),adminWeight:ratio(admin,revenue),taxWeight:ratio(taxes,revenue),purchaseWeight:ratio(purchases,revenue) };
}
