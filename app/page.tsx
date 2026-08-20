import { cookies } from "next/headers";
import { Login } from "./ui/Login";
import { Dashboard } from "./ui/Dashboard";
import { isAuthenticated } from "./lib/auth";
import { loadDiagnostics } from "./lib/diagnostics";
import { getConsultantConfig } from "./lib/consultant-config";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const session = (await cookies()).get("diagnostico_session")?.value;
  if (!(await isAuthenticated(session))) return <Login error={(await searchParams).erro === "1"} />;
  const { diagnostics, source, error } = await loadDiagnostics();
  return <Dashboard initialDiagnostics={diagnostics} source={source} loadError={error} consultant={getConsultantConfig()} />;
}
