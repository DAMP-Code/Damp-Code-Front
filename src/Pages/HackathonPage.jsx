import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "@/app-components/BackButton";
import HackathonTitle from "@/app-components/hackathon-creation/HackathonTitle";
import HackathonSubtitle from "@/app-components/hackathon-creation/HackathonSubtitle";

const HackathonPage = () => {
  function getMethodDescription(method) {
    switch (method) {
      case "Autodata":
        return "O desempenho dos participantes será avaliado automaticamente com base em métricas de atividade, entregas e engajamento na plataforma.";

      case "Avaliação IA":
        return "Uma inteligência artificial analisará os projetos enviados, considerando qualidade, inovação e aderência ao desafio.";

      case "Avaliação Manual":
        return "Os projetos serão avaliados manualmente por uma equipe especializada da empresa.";

      default:
        return method;
    }
  }

  const { id } = useParams();

  const [hackathon, setHackathon] = useState(null);

  useEffect(() => {
    async function loadHackathon() {
      const response = await fetch(
        `https://localhost:7092/api/Hackathons/${id}`,
      );

      const data = await response.json();

      setHackathon(data);
    }

    loadHackathon();
  }, [id]);

  if (!hackathon) {
    return <p className="flex min-h-screen items-center justify-center bg-surface text-lg font-semibold text-brand-light">Carregando...</p>;
  }

  return (
    <section
      style={{ backgroundColor: hackathon.corFundo }}
      className="
      w-full
      min-h-screen
      text-white
      px-5
      lg:px-10
      py-8
      flex
      flex-col
      gap-y-8
      overflow-hidden
    "
    >
      {/* VOLTAR */}
      <div className="mx-auto w-full max-w-7xl">
        <BackButton />
      </div>

      {/* HEADER */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-black/15 p-5 shadow-2xl backdrop-blur-sm sm:p-8 lg:flex-row lg:items-center">
        <div className="flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center lg:w-3/4">
          <img
            className="max-h-36 w-32 rounded-2xl object-contain lg:w-52"
            src={hackathon.logo || "/src/assets/DAMPCode.svg"}
            alt=""
          />

          <HackathonTitle
            text1={hackathon.titulo}
            text2={` - ${hackathon.empresa}`}
            color1={hackathon.corPrincipal}
            color2={hackathon.corSecundaria}
          />
        </div>

        <button
          style={{
            backgroundColor: hackathon.corPrincipal,
          }}
          className="
          px-8
          py-3
          rounded-xl
          font-semibold
          text-lg
          shadow-lg
          hover:-translate-y-1 hover:brightness-110
          transition-all
        "
        >
          Participar
        </button>
      </div>

      {/* INFO */}
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3 border-b border-white/10 pb-6 text-sm text-zinc-300 [&_p]:rounded-full [&_p]:border [&_p]:border-white/10 [&_p]:bg-black/15 [&_p]:px-4 [&_p]:py-2">
        <p>
          Área:
          <b>{hackathon.area}</b>
        </p>

        <p>{hackathon.participantes || "X pessoas já entraram"}</p>

        <p>
          Premiação:
          <b> R$ {hackathon.premiacao}</b>
        </p>

        <p>
          Termina em {new Date(hackathon.dataFinal).toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* CONTEÚDO */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ESQUERDA */}
        <div className="flex flex-col gap-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-6 backdrop-blur-sm">
            <HackathonSubtitle
              text1="DESCRIÇÃO"
              text2=" DO HACKATHON"
              color1={hackathon.corPrincipal}
              color2={hackathon.corSecundaria}
            />

            <p className="text-zinc-300 leading-relaxed mt-3">
              {hackathon.descricao}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-6 backdrop-blur-sm">
            <HackathonSubtitle
              text1="MÉTODO DE"
              text2=" AVALIAÇÃO"
              color1={hackathon.corPrincipal}
              color2={hackathon.corSecundaria}
            />

            <p className="text-zinc-300 mt-3">
              {getMethodDescription(hackathon.metodo)}
            </p>
          </div>
        </div>

        {/* DIREITA */}
        <div className="rounded-2xl border border-white/10 bg-black/15 p-6 backdrop-blur-sm">
          <HackathonSubtitle
            text1="TECNOLOGIAS"
            text2=" UTILIZADAS"
            color1={hackathon.corPrincipal}
            color2={hackathon.corSecundaria}
          />

          <div className="flex flex-wrap gap-4 mt-5">
            {hackathon.tecnologias?.map((technology, index) => (
              <span
                key={index}
                style={{
                  borderColor: hackathon.corPrincipal,
                }}
                className="
                border
                px-4
                py-2
                rounded-full bg-black/15
              "
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HackathonPage;
