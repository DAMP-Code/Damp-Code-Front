import AuthLink from "@/app-components/auth/AuthLink";
import AuthShell, { AuthField, PasswordMeter, authButtonClass } from "@/app-components/auth/AuthShell";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegistrationContext  } from "@/app-components/utilities/RegistrationContext";
import { navigateWithTransition } from "@/app-components/utilities/viewTransition";

const CreateCompany = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  // aviso só depois que a confirmação tem o tamanho da senha, para não reclamar enquanto a pessoa digita
  const passwordsMatch = confirmPassword !== "" && confirmPassword === password;
  const passwordsDiffer = confirmPassword.length >= password.length && confirmPassword !== "" && confirmPassword !== password;

  const {registrationData, setRegistrationData} = useContext(RegistrationContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      // se o aviso embaixo do campo já está na tela, não repete a mensagem
      setMessage(passwordsDiffer ? "" : "As senhas não são iguais. Digite a mesma senha nos dois campos.");
      return;
    }

    const basicData  = {
      name,
      email,
      password
    };

    setRegistrationData(basicData );
    
  navigateWithTransition(navigate, "/cadastroEmpresa/detalhes");

  //   const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  
  // {message && <p>{message}</p>}
  }

  return (
    <AuthShell
      mode="empresa"
      step={1}
      title="Conta de empresa"
      lede="O próximo passo pede CNPJ, área e uma descrição curta."
      asideTitle="Publique o desafio e encontre quem resolve."
      asideText="Defina o problema, o prêmio e o prazo. A nota de cada entrega é sugerida pela sua solução de referência, e quem decide é você."
      points={["Hackathon com a cara da empresa", "Prêmio e prazo visíveis no card", "Acesso ao painel de desafios"]}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField
          label="Nome"
          name="name"
          autoComplete="name"
          placeholder="Nome da pessoa responsável"
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
          placeholder="time@empresa.com"
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
        <button type="submit" className={authButtonClass}>
          Continuar
        </button>
        <AuthLink to="/loginUser" className="text-center text-sm font-medium text-brand-light hover:text-highlight">
          Já tenho conta. Fazer login.
        </AuthLink>
      </form>
      {message ? (
        <p className="mt-5 rounded-xl border border-white/10 bg-surface px-4 py-3 text-center text-sm text-content">
          {message}
        </p>
      ) : null}
    </AuthShell>
  );
};

export default CreateCompany;
