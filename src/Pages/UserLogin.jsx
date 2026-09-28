import Footer from "@/app-components/Footer";
import Design from "@/app-components/customer-form/Design";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/app-components/utilities/AuthContext"
import BackButton from "@/app-components/BackButton";

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
    <div className="relative grid min-h-screen w-full bg-surface md:flex">
      <Design
        text1={
          "Entre em sua conta e retorne a Criar ou integrar desafios, tendo todas as vantagens sem ficar para trás, voltando de onde parou e tendo acesso a novas oportunidades de criar seu portfólio."
        }
        text2={
          "Continue evoluindo suas habilidades com novos desafios, acompanhe seu progresso em tempo real e destaque seus projetos para conquistar ainda mais oportunidades no mercado."
        
        }
      />
      <section className="flex min-h-screen w-full flex-col items-start justify-start px-5 py-24 md:w-1/2">
        <div className="flex w-full gap-y-6 max-w-md flex-col items-start justify-start rounded-3xl border border-white/10 bg-surface-light/60 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-10">
          <BackButton />
          <div className="flex gap-x-4">
            <h2 className="text-4xl text-brand font-extrabold">Pressione</h2>
            <h2 className="text-4xl text-highlight font-extrabold">Return</h2>
          </div>
          <p className="text-brand text-xl font-medium">
            Preencha seus dados
          </p>
          <form
            className="flex w-full flex-col items-center justify-center gap-y-6 py-8"
            onSubmit={handleLogin}
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-none border-white/10 bg-surface px-4 py-3.5 text-sm font-semibold text-content focus:border-highlight"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-none border-white/10 bg-surface px-4 py-3.5 text-sm font-semibold text-content focus:border-highlight"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-highlight px-8 py-4 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110"
            >
              Entrar
            </button>

            <Link
              to={"/cadastroUser"}
              className="text-center font-medium text-brand-light hover:text-highlight"
            >
              Não tenho uma conta. Cadastre-se.
            </Link>
          </form>
          {message && (
  <p className="text-danger text-lg font-semibold">
    {message}
  </p>
)}
        </div>
      </section>
      <div className="w-full absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}
