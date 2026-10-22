import AuthShell, { AuthField, authButtonClass } from "@/app-components/auth/AuthShell";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/app-components/utilities/AuthContext"
import { MOCK_ACCOUNTS } from "@/mock/seed";

// 🧠 RESUMO DO FLUXO
// Usuário envia form
// impede reload
// envia POST pra API
// API responde
// verifica erro
// pega JSON
// salva no navegador


export default function UserLogin() {
  // O useState é uma função que retorna um array com dois elementos: o valor atual do estado e uma função para atualizá-lo. A sintaxe básica é:
  const { setUser } = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    // impede o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // validação simples: verifica se os campos estão vazios
    if (!email || !password) {
      // mostra mensagem para o usuário
      setMessage("Preencha todos os campos");
      // interrompe a execução da função
      return;
    }

    try {
      // faz uma requisição POST para sua API de login
      const response = await fetch("https://localhost:7092/api/Auth/login", {
        method: "POST", // tipo da requisição
        headers: {
          "Content-Type": "application/json", // informa que o corpo é JSON
        },
        // envia email e senha convertidos para JSON
        body: JSON.stringify({ email, password }),
      });

      // verifica se a resposta NÃO foi bem sucedida (status diferente de 200-299)
      if (!response.ok) {
        // mostra erro para o usuário
        setMessage("Email ou senha inválidos");
        // para a execução
        return;
      }

      // converte a resposta da API (JSON) em objeto JavaScript
      const data = await response.json();

      // salva os dados do usuário no navegador (localStorage)
      // isso permite manter o usuário "logado"
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data)

      // 🔥 redireciona com base no tipo de usuário
      if (data.role === "empresa") {
        // se for empresa → vai para dashboard da empresa
        navigate("/dashboard/Empresa");
      } else {
        // senão (participante) → vai para outro dashboard
        navigate("/dashboard/participante");
      }
    } catch (error) {
      // captura erros como falha de conexão com o servidor
      console.error(error);

      // mostra mensagem amigável para o usuário
      setMessage("Erro ao conectar com o servidor");
    }
  }

  return (
    <AuthShell
      title="Entrar"
      lede="O mesmo acesso vale para participante e empresa."
      asideTitle="Volte para os desafios de onde parou."
      asideText="Acompanhe ranking, prêmios e os hackathons em que você já entrou."
      points={["Retome um desafio ativo", "Acesse o dashboard da sua conta", "Participe com o mesmo login"]}
    >
      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="ana@dampcode.dev"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={authButtonClass}>
          Entrar
        </button>
        <Link to="/cadastroUser" className="text-center text-sm font-medium text-brand-light hover:text-highlight">
          Não tenho uma conta. Cadastre-se.
        </Link>
        <Link to="/cadastroEmpresa" className="text-center text-sm font-medium text-content-secondary hover:text-content">
          Quero publicar como empresa.
        </Link>
      </form>
      {import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== "false" ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm leading-relaxed text-content-secondary">
          <p className="font-medium text-content">Contas de teste</p>
          {MOCK_ACCOUNTS.map((account) => (
            <p key={account.email}>
              {account.label}: {account.email} / {account.password}
            </p>
          ))}
        </div>
      ) : null}
      {message ? <p className="mt-4 text-sm font-semibold text-danger">{message}</p> : null}
    </AuthShell>
  );
}
