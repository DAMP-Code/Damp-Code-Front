import AuthLink from "@/app-components/auth/AuthLink";
import AuthShell, { AuthField, PasswordMeter, authButtonClass } from "@/app-components/auth/AuthShell";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/app-components/utilities/apiUrl";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // aviso só depois que a confirmação tem o tamanho da senha, para não reclamar enquanto a pessoa digita
  const passwordsDiffer = confirmPassword.length >= password.length && confirmPassword !== "" && confirmPassword !== password;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const passwordsMatch = confirmPassword !== "" && confirmPassword === password;

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      // se o aviso embaixo do campo já está na tela, não repete a mensagem
      setMessage(passwordsDiffer ? "" : "As senhas não são iguais. Digite a mesma senha nos dois campos.");
      return;
    }

    setLoading(true);
    setMessage("");
    setCreated(false);

    const user = {
      name,
      email,
      password,
      tecnologias: [] // pode mandar vazio por enquanto
    };

    try {
      const response = await fetch(
        `${API_URL}/api/Auth/register/participante`,
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

      setMessage("Conta criada! Agora é só entrar com o seu e-mail e senha.");
      setCreated(true);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      mode="participante"
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
        >
          <PasswordMeter value={password} min={10} />
        </AuthField>
        <AuthField
          label="Confirmar senha"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={confirmPassword}
          required
          minLength={10}
          aria-invalid={passwordsDiffer}
          aria-describedby={passwordsDiffer ? "confirm-password-hint" : undefined}
          onChange={(e) => setConfirmPassword(e.target.value)}
        >
          {passwordsDiffer && (
            <span id="confirm-password-hint" className="text-sm font-normal text-danger">
              As senhas não são iguais.
            </span>
          )}
          {passwordsMatch && <span className="text-xs font-normal text-success">As senhas são iguais.</span>}
        </AuthField>
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
        <AuthLink to="/loginUser" className="text-center text-sm font-medium text-brand-light hover:text-highlight">
          Já tenho conta. Fazer login.
        </AuthLink>
      </form>
      {message ? (
        <p
          className={`mt-5 rounded-xl border px-4 py-3 text-center text-sm animate-in fade-in slide-in-from-bottom-1 duration-300 ${created ? "border-success/40 bg-success/10 text-success" : "border-white/10 bg-surface text-content"}`}
        >
          {message}
          {created ? (
            <>
              {" "}
              <AuthLink to="/loginUser" className="font-semibold underline">
                Entrar
              </AuthLink>
            </>
          ) : null}
        </p>
      ) : null}
    </AuthShell>
  );
};

export default CreateUser;
