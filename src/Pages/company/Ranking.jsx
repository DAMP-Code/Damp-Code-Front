import BackButton from "@/app-components/BackButton";
import EmptyState from "@/app-components/EmptyState";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import ParticipantsChart from "@/app-components/charts/ParticipantsChart";
import PrizeChart from "@/app-components/charts/PrizeChart";
import StatusChart from "@/app-components/charts/StatusChart";
import TechnologyChart from "@/app-components/charts/TechnologyChart";
import { participantCount } from "@/app-components/charts/chartTheme";
import Title from "@/app-components/Title";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { totalPrize } from "@/app-components/utilities/prizes";
import React, { useContext, useEffect, useState } from "react";

const runningPhases = ["Publicado", "Ativo", "Em avaliação"];

// total sem centavos para caber no cartão do celular
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const panelClass = "min-w-0 rounded-2xl border border-white/10 bg-surface-light p-4 shadow-xl sm:p-6";

const Ranking = () => {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHackathons() {
      try {
        // todos os Hackathons da empresa (inclusive rascunhos); vale também para funcionários
        const response = await fetch("https://localhost:7092/api/Hackathons/empresa", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!response.ok) {
          setError("Não foi possível carregar os Hackathons da empresa.");
          setHackathons([]);
          return;
        }
        setHackathons(await response.json());
      } catch (error) {
        console.error(error);
        setError("Não foi possível conectar com o servidor.");
        setHackathons([]);
      }
    }

    loadHackathons();
  }, [user?.token]);

  const list = hackathons ?? [];
  const active = list.filter((h) => h.fase !== "Cancelado");
  const published = active.filter((h) => h.fase !== "Rascunho");
  const stats = [
    { label: "Hackathons", value: list.length },
    { label: "Em andamento", value: list.filter((h) => runningPhases.includes(h.fase)).length },
    { label: "Inscrições", value: published.reduce((sum, h) => sum + participantCount(h), 0) },
    { label: "Em prêmios", value: money.format(active.reduce((sum, h) => sum + totalPrize(h), 0)) },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:p-10">
        <BackButton />
        <Title text1={"Dashboard"} text2={"Da empresa"} />

        {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}

        {hackathons === null ? (
          <p className="text-content-secondary">Carregando os dados da empresa…</p>
        ) : list.length === 0 ? (
          <EmptyState
            title="Nenhum Hackathon ainda"
            text="Os gráficos aparecem aqui depois que a empresa criar o primeiro Hackathon."
            actionLabel="Criar Hackathon"
            to="/cadastroHackaton"
          />
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col gap-1 rounded-2xl border border-white/10 bg-surface-light/60 p-4 sm:p-5">
                  <dt className="text-sm text-content-secondary">{stat.label}</dt>
                  <dd className="whitespace-nowrap text-xl font-semibold sm:text-3xl">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className={panelClass}>
                <h2 className="text-lg font-semibold">Hackathons por fase</h2>
                <StatusChart hackathons={list} />
              </section>

              <section className={panelClass}>
                <h2 className="text-lg font-semibold">Inscritos por Hackathon</h2>
                {published.length > 0 ? (
                  <ParticipantsChart hackathons={published} />
                ) : (
                  <p className="mt-3 text-content-secondary">Aparece depois que um Hackathon for publicado.</p>
                )}
              </section>

              <section className={panelClass}>
                <h2 className="text-lg font-semibold">Prêmios em dinheiro por Hackathon</h2>
                {active.some((h) => totalPrize(h) > 0) ? (
                  <PrizeChart hackathons={active} />
                ) : (
                  <p className="mt-3 text-content-secondary">Nenhum Hackathon tem prêmio em dinheiro.</p>
                )}
              </section>

              <section className={panelClass}>
                <h2 className="text-lg font-semibold">Tecnologias mais pedidas</h2>
                {list.some((h) => h.tecnologias?.length) ? (
                  <TechnologyChart hackathons={list} />
                ) : (
                  <p className="mt-3 text-content-secondary">Nenhum Hackathon tem tecnologias cadastradas.</p>
                )}
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Ranking;
