export type ConsultantConfig = {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
};

export function getConsultantConfig(): ConsultantConfig {
  return {
    name: process.env.CONSULTANT_NAME || "Cristian Barbosa",
    title: process.env.CONSULTANT_TITLE || "Consultor Financeiro",
    phone: process.env.CONSULTANT_PHONE || "(53) 99953-5131",
    email: process.env.CONSULTANT_EMAIL || "cristianbarbosa.cf@gmail.com",
    website: process.env.CONSULTANT_WEBSITE || "https://www.cristianbarbosa.com.br",
    logoUrl: process.env.CONSULTANT_LOGO_URL || "",
  };
}
