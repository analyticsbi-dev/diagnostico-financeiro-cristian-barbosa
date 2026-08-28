"use client";
import { useState } from "react";
export function Login({ error = false }: { error?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <main className="login-shell"><section className="login-story" aria-label="Apresentação do painel">
    <div className="brand"><img className="login-brand-logo" src="/logo-kohi-de-souza.png" alt="Kohi & de Souza - Assessoria Empresarial" /></div>
    <div className="story-copy"><span className="eyebrow">Painel interno</span><h1>Clareza financeira para uma devolutiva que transforma.</h1><p>DRE, balanço patrimonial e indicadores essenciais reunidos em uma análise direta e profissional.</p></div>
    <div className="story-proof"><strong>Visão completa.</strong> Decisões com confiança.</div>
  </section><section className="login-panel"><form className="login-card" action="/api/login" method="post">
    <div className="mini-brand"><img className="login-mini-logo" src="/logo-kohi-de-souza.png" alt="Kohi & de Souza - Assessoria Empresarial" /></div><span className="eyebrow">Acesso restrito</span><h2>Bem-vindo</h2><p>Entre para acessar os diagnósticos das empresas.</p>
    {error && <div className="login-error" role="alert">Usuário ou senha incorretos. Tente novamente.</div>}
    <label htmlFor="username">Usuário</label><input id="username" name="username" autoComplete="username" placeholder="Seu nome de usuário" required />
    <label htmlFor="password">Senha</label><div className="password-field"><input id="password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Sua senha" required /><button type="button" onClick={() => setVisible(!visible)}>{visible ? "Ocultar" : "Mostrar"}</button></div>
    <button className="primary-button" type="submit">Acessar painel <span>→</span></button><small>Seus dados financeiros permanecem protegidos.</small>
  </form></section></main>;
}
