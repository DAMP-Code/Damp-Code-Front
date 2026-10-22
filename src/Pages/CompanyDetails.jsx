import AuthShell, { authButtonClass, authFieldClass } from "@/app-components/auth/AuthShell";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RegistrationContext } from "@/app-components/utilities/RegistrationContext";

const CompanyDetails = () => {
  // pega um contexto e usa
  const { registrationData } = useContext(RegistrationContext);

  // novos estados
  const [cnpj, setCnpj] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...registrationData, // nome, email, senha
      cnpj,
      area,
      descricao: description,
      // divide e tira espaços
      tecnologias: technologies.split(",").map((t) => t.trim()),
    };

    try {
      const response = await fetch(
        "https://localhost:7092/api/Auth/register/empresa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao criar empresa!");
      }

      // se der certo
      // console.log("TUDO CERTO!")

      setMessage("Usuário criado com sucesso!");

      setCnpj("");
      setCompanyName("");
      setArea("");
      setDescription("");
      setTechnologies("");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar usuário!");
    }
  }
  if (!registrationData?.email) {
    return (
      <AuthShell
        title="Cadastro incompleto"
        lede="Os dados de acesso ainda não foram preenchidos."
        asideTitle="A conta de empresa começa pelo acesso."
        asideText="Nome, email e senha ficam guardados neste navegador até você concluir o cadastro."
        points={["Volte um passo", "Preencha nome, email e senha", "Depois informe a empresa"]}
      >
        <Link to="/cadastroEmpresa" className={authButtonClass}>
          Voltar ao cadastro
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      wide
      title="Dados da empresa"
      lede="Esses dados completam a conta. Nome e email já vieram do passo anterior."
      asideTitle="Falta o perfil da empresa."
      asideText="CNPJ, área e uma descrição curta. As tecnologias entram separadas por vírgula."
      points={["CNPJ com ou sem pontuação", "Área de atuação", "Stack que a empresa usa"]}
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-content">
            Nome
            <input value={registrationData.name || ""} disabled className={authFieldClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-content sm:col-span-1">
            Email
            <input value={registrationData.email || ""} disabled className={authFieldClass} />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-content">
          CNPJ
          <input
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
            minLength={14}
            maxLength={18}
            pattern="\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}"
            className={`${authFieldClass} invalid:border-danger`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-content">
          Área de atuação
          <input
            placeholder="Fintech, SaaS, logística"
            value={area}
            required
            minLength={3}
            maxLength={50}
            onChange={(e) => setArea(e.target.value)}
            className={`${authFieldClass} invalid:border-danger`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-content">
          Descrição
          <textarea
            placeholder="O que a empresa faz"
            value={description}
            required
            minLength={10}
            maxLength={300}
            onChange={(e) => setDescription(e.target.value)}
            className={`${authFieldClass} min-h-32 resize-y invalid:border-danger`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-content">
          Tecnologias
          <input
            placeholder="React, .NET, Node"
            value={technologies}
            required
            minLength={2}
            onChange={(e) => setTechnologies(e.target.value)}
            className={`${authFieldClass} invalid:border-danger`}
          />
        </label>

        <button type="submit" className={authButtonClass}>
          Finalizar cadastro
        </button>
      </form>
      {message ? (
        <p className="mt-5 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-content">{message}</p>
      ) : null}
    </AuthShell>
  );
};

export default CompanyDetails;
