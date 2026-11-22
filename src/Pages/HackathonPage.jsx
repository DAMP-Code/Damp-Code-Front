import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import JoinHackathon from "@/app-components/hackathon-page/JoinHackathon";
import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import HackathonView from "@/app-components/hackathon-page/HackathonView";

const HackathonPage = () => {
  const { id } = useParams();

  const { user } = useContext(AuthContext);

  const [hackathon, setHackathon] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [modules, setModules] = useState([]);
  const [result, setResult] = useState(null);
  // recarrega a contagem de participantes depois de uma inscrição
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function loadHackathon() {
      // com token, a empresa dona também consegue ver o próprio rascunho
      const response = await fetch(
        `https://localhost:7092/api/Hackathons/${encodeURIComponent(id)}`,
        user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined,
      );

      if (!response.ok) {
        setNotFound(true);
        return;
      }

      const data = await response.json();

      setHackathon(data);
    }

    loadHackathon();
  }, [id, user?.token, reload]);

  // material de apoio (módulos e conteúdos); sem módulos a seção não aparece
  useEffect(() => {
    async function loadModules() {
      try {
        const response = await fetch(
          `https://localhost:7092/api/Hackathons/${encodeURIComponent(id)}/modulos`,
          user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined,
        );
        if (response.ok) setModules(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadModules();
  }, [id, user?.token]);

  // classificação final, só depois que a empresa publica o resultado
  useEffect(() => {
    if (!hackathon?.resultadoPublicado) return;

    async function loadResult() {
      try {
        const response = await fetch(
          `https://localhost:7092/api/Hackathons/${encodeURIComponent(id)}/resultado`,
          user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined,
        );
        if (response.ok) setResult(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadResult();
  }, [id, user?.token, hackathon?.resultadoPublicado]);

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <p className="mx-auto flex min-h-[50vh] w-11/12 max-w-7xl items-center text-lg text-content-secondary">
          {notFound ? "Hackathon não encontrado." : "Carregando o hackathon."}
        </p>
        <Footer />
      </div>
    );
  }

  // a empresa (ou o admin) vê a página como o participante veria, com o atalho para o painel
  const isParticipantView = !user || user.role === "participante";
  const action = isParticipantView ? (
    <JoinHackathon hackathon={hackathon} onChanged={() => setReload((value) => value + 1)} />
  ) : user.role === "empresa" ? (
    <div className="flex flex-col gap-3">
      <p className="text-content-secondary">Você está vendo a página como os participantes veem.</p>
      <Link to="/dashboard/Empresa" className="font-semibold text-highlight hover:underline">
        Gerenciar no painel
      </Link>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <section
        style={{ backgroundColor: hackathon.corFundo }}
        className="flex min-h-screen w-full flex-col gap-6 overflow-hidden px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <BackButton />
          <HackathonView hackathon={hackathon} action={action} modules={modules} result={result} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HackathonPage;
