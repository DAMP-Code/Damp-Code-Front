import React, { useContext, useState } from "react";
import { RegistrationContext } from "@/app-components/utilities/RegistrationContext";
import Footer from "@/app-components/Footer";
import LightPillar from '@/app-components/LightPillar';

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
    return <p>Volte e preencha o cadastro primeiro</p>;
  }
  return (
    
    <div className="relative w-full min-h-screen bg-surface overflow-hidden">

  {/* 🔹 FUNDO */}
  <div className="absolute inset-0 z-0">
    <LightPillar
      topColor="#5227FF"
      bottomColor="#FF9FFC"
      intensity={1}
      rotationSpeed={0.3}
      glowAmount={0.002}
      pillarWidth={3}
      pillarHeight={0.4}
      noiseIntensity={0.5}
      pillarRotation={25}
      interactive={false}
      mixBlendMode="screen"
      quality="high"
    />
  </div>

  {/* 🔹 CONTEÚDO */}
  <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-16">

    <form className="flex w-full max-w-xl flex-col gap-y-8 rounded-3xl border border-white/20 bg-surface-light/75 p-6
    shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-10"
        onSubmit={handleSubmit}  > 
        <h2 className="text-3xl text-highlight font-bold text-center">
          Complete seu cadastro empresarial
        </h2>

        {/* 🔹 Dados do usuário (vindos do Context) */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-xl text-brand font-semibold">Dados Básicas</h3>

          <input
            value={registrationData.name || ""}
            disabled
            className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-lg text-content-secondary disabled:opacity-70"
          />

          <input
            value={registrationData.email || ""}
            disabled
            className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-lg text-content-secondary disabled:opacity-70"
          />
        </div>

        {/* 🔹 Dados da empresa */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-xl text-brand font-semibold">
            Dados Avançados
          </h3>

          <input
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            //verificações
            required
            minLength={14}
            maxLength={18}
            pattern="\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}"
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-lg text-content focus:border-highlight invalid:border-danger"
          />

          <input
            placeholder="Área de atuação (ex: Fintech, SaaS...)"
            value={area}
            required
            minLength={3}
            maxLength={50}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-lg text-content focus:border-highlight invalid:border-danger"
          />

          <textarea
            placeholder="Descrição da empresa"
            value={description}
            required
            minLength={10}
            maxLength={300}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 resize-y rounded-xl border border-white/10 bg-surface px-4 py-3 text-lg text-content focus:border-highlight invalid:border-danger"
          />

          <input
            placeholder="Tecnologias (separadas por vírgula: React, .NET, Node)"
            value={technologies}
            required
            minLength={2}
            onChange={(e) => setTechnologies(e.target.value)}
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-lg text-content focus:border-highlight invalid:border-danger"
          />
        </div>

        {/* 🔹 Botão */}
        <button
          type="submit"
          className="rounded-xl bg-highlight py-4 text-xl font-bold text-surface shadow-[0_14px_35px_rgba(255,234,0,0.16)] hover:-translate-y-0.5 hover:brightness-110"
        >
          Finalizar cadastro
        </button>    </form>

    {message && <p className="mt-5 rounded-xl border border-white/10 bg-surface-light/90 px-5 py-3 text-lg text-content shadow-lg">{message}</p>}

  </div>

  {/* 🔹 FOOTER */}
  <div className="relative z-10">
    <Footer />
  </div>

</div>
  );
};

export default CompanyDetails;
