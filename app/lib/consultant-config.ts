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
    name: process.env.CONSULTANT_NAME || "Kohi & de Souza",
    title: process.env.CONSULTANT_TITLE || "Assessoria Empresarial",
    phone: process.env.CONSULTANT_PHONE || "(53) 99953-5131",
    email: process.env.CONSULTANT_EMAIL || "",
    website: process.env.CONSULTANT_WEBSITE || "",
    logoUrl: process.env.CONSULTANT_LOGO_URL || "/logo-kohi-de-souza.png",
  };
}
