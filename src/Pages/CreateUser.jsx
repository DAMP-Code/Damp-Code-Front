import AuthShell, { AuthField, authButtonClass } from "@/app-components/auth/AuthShell";
import { useState } from "react";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const user = {
      name,
      email,
      password,
      tecnologias: [] // pode mandar vazio por enquanto
    };

    try {
      const response = await fetch(
        "https://localhost:7092/api/Auth/register/participante",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.json();

      console.log("Usuário criado:", data);

      setMessage("Usuário criado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      lede="Para participar dos hackathons, com ranking e reconhecimento."
      asideTitle="Entre nos desafios e construa portfólio."
      asideText="Empresas publicam o problema. Você entra com prazo, prêmio e stack à vista."
      points={["Hackathons de empresas e comunidades", "Progresso visível no ranking", "Uma conta para todos os desafios"]}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField
          label="Nome completo"
          name="name"
          autoComplete="name"
          placeholder="Seu nome"
          value={name}
          required
          minLength={8}
          maxLength={150}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          required
          minLength={8}
          maxLength={150}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Senha"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mínimo de 10 caracteres"
          value={password}
          required
          minLength={10}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          label="Confirmar senha"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={password}
          required
          minLength={10}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
        <Link to="/loginUser" className="text-center text-sm font-medium text-brand-light hover:text-highlight">
          Já tenho conta. Fazer login.
        </Link>
      </form>
      {message ? (
        <p className="mt-5 rounded-xl border border-white/10 bg-surface px-4 py-3 text-center text-sm text-content">
          {message}
        </p>
      ) : null}
    </AuthShell>
  );
};

export default CreateUser;
