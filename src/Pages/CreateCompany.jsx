import AuthShell, { AuthField, authButtonClass } from "@/app-components/auth/AuthShell";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegistrationContext  } from "@/app-components/utilities/RegistrationContext";

const CreateCompany = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {registrationData, setRegistrationData} = useContext(RegistrationContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const basicData  = {
      name,
      email,
      password
    };

    setRegistrationData(basicData );
    
  navigate("/cadastroEmpresa/detalhes");

  //   const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  
  // {message && <p>{message}</p>}
  }

  return (
    <AuthShell
      title="Conta de empresa"
      lede="O próximo passo pede CNPJ, área e uma descrição curta."
      asideTitle="Publique o desafio e encontre quem resolve."
      asideText="Defina o problema, o prêmio e o prazo. A avaliação pode ser por IA ou manual."
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
        />
        <button type="submit" className={authButtonClass}>
          Continuar
        </button>
        <Link to="/loginUser" className="text-center text-sm font-medium text-brand-light hover:text-highlight">
          Já tenho conta. Fazer login.
        </Link>
      </form>
    </AuthShell>
  );
};

export default CreateCompany;
