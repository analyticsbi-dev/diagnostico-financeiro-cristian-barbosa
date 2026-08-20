export type ConsultantConfig = {
  name: string;
  title: string;
  contact: string;
  logoUrl: string;
};

export function getConsultantConfig(): ConsultantConfig {
  return {
    name: process.env.CONSULTANT_NAME || "Cristian Barbosa",
    title: process.env.CONSULTANT_TITLE || "Consultor Financeiro",
    contact: process.env.CONSULTANT_CONTACT || "Contato não configurado",
    logoUrl: process.env.CONSULTANT_LOGO_URL || "",
  };
}
