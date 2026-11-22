import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import EmptyState from "@/app-components/EmptyState";
import EditableAvatar from "@/app-components/account/EditableAvatar";
import AccountForms from "@/app-components/account/AccountForms";
import ScoreChart from "@/app-components/charts/ScoreChart";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { prizeLabel } from "@/app-components/utilities/prizes";

const API = "https://localhost:7092/api";

// cor do selo de cada fase (mesmas cores do painel da empresa)
const phaseStyles = {
  Publicado: "bg-success/20 text-success",
  Ativo: "bg-success/20 text-success",
  "Em avaliação": "bg-warning/20 text-warning",
  Encerrado: "bg-white/10 text-content-secondary",
  Cancelado: "bg-danger/20 text-danger",
};

const runningPhases = ["Publicado", "Ativo", "Em avaliação"];

const panelClass = "rounded-2xl border border-white/10 bg-surface-light p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-6";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : null;
}

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [participations, setParticipations] = useState(null);
  const [companyAccess, setCompanyAccess] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();

  // vindo de /conta (ou de um link com #configuracoes), rola até as configurações
  useEffect(() => {
    if (location.hash !== "#configuracoes") return;
    const timer = setTimeout(() => document.getElementById("configuracoes")?.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user?.token}` };

    async function loadParticipations() {
      try {
        const response = await fetch(`${API}/Participations/me`, { headers });
        if (!response.ok) {
          setError("Não foi possível carregar suas inscrições.");
          setParticipations([]);
          return;
        }
        const data = await response.json();
        setParticipations(data.inscricoes ?? []);
      } catch (error) {
        console.error(error);
        setError("Não foi possível conectar com o servidor.");
        setParticipations([]);
      }
    }

    // funcionário de empresa ganha o selo da empresa no perfil
    async function loadCompany() {
      try {
        const response = await fetch(`${API}/Companies/me`, { headers });
        if (response.ok) setCompanyAccess(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadParticipations();
    loadCompany();
  }, [user?.token]);

  const list = participations ?? [];
  const results = list.filter((item) => item.resultado?.nota != null);
  const placed = list.filter((item) => item.resultado?.posicao != null);
  const best = placed.reduce(
    (current, item) => (!current || item.resultado.posicao < current.resultado.posicao ? item : current),
    null,
  );
  const prizes = list.filter((item) => item.resultado?.premio);
  const running = list.filter((item) => runningPhases.includes(item.fase)).length;
  const average = results.length
    ? Math.round(results.reduce((sum, item) => sum + item.resultado.nota, 0) / results.length)
    : null;

  const stats = [
    { label: "Inscrições", value: list.length },
    { label: "Em andamento", value: running },
    { label: "Resultados publicados", value: results.length },
    { label: "Nota média", value: average ?? "—" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:py-12">
        {/* IDENTIDADE */}
        <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-surface-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <EditableAvatar size="lg" />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{user?.name}</h1>
              <p className="truncate text-content-secondary">{user?.email}</p>
              {companyAccess && (
                <span className="mt-1 w-fit rounded-full bg-brand/25 px-3 py-1 text-sm font-medium text-brand-light">
                  Membro da {companyAccess.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-5 md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0 md:text-right">
            <span className="text-sm text-content-secondary">Melhor colocação</span>
            {best ? (
              <>
                <span className="text-5xl font-bold leading-none text-highlight sm:text-6xl">
                  {best.resultado.posicao}º
                </span>
                <span className="text-sm text-content-secondary">
                  de {best.resultado.totalClassificados} em {best.titulo}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-content-secondary">Sem resultado ainda</span>
            )}
          </div>
        </section>

        {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}

        {participations === null ? (
          <p className="text-content-secondary">Carregando seu perfil…</p>
        ) : list.length === 0 ? (
          <EmptyState
            title="Você ainda não entrou em nenhum Hackathon"
            text="Quando você se inscrever, suas notas, colocações e prêmios aparecem aqui."
            actionLabel="Explorar Hackathons"
            to="/"
          />
        ) : (
          <>
            {/* NÚMEROS */}
            <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-surface-light/60 p-4 sm:p-5">
                  <dt className="text-sm text-content-secondary">{stat.label}</dt>
                  <dd className="text-3xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* NOTAS */}
              <section className={`${panelClass} min-w-0 lg:col-span-3`}>
                <h2 className="text-lg font-semibold">Suas notas</h2>
                {results.length >= 2 ? (
                  <ScoreChart results={results.map((item) => ({ titulo: item.titulo, nota: item.resultado.nota }))} />
                ) : results.length === 1 ? (
                  <p className="mt-3 text-content-secondary">
                    Nota <b className="text-content">{results[0].resultado.nota}</b> em {results[0].titulo}. O gráfico aparece a partir do segundo resultado.
                  </p>
                ) : (
                  <p className="mt-3 text-content-secondary">As notas aparecem quando a empresa publica o resultado.</p>
                )}
              </section>

              {/* PRÊMIOS */}
              <section className={`${panelClass} lg:col-span-2`}>
                <h2 className="text-lg font-semibold">Prêmios</h2>
                {prizes.length === 0 ? (
                  <p className="mt-3 text-content-secondary">Nenhum prêmio por enquanto. Os prêmios de cada posição aparecem na página do Hackathon.</p>
                ) : (
                  <ul className="mt-4 flex flex-col gap-3">
                    {prizes.map((item) => (
                      <li key={item.hackathonId} className="flex items-start gap-3 rounded-xl bg-surface/50 p-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-highlight font-bold text-surface">
                          {item.resultado.premio.posicao}º
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium">{prizeLabel(item.resultado.premio)}</p>
                          <p className="text-sm text-content-secondary">
                            {item.resultado.premio.descricao || item.titulo}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* HISTÓRICO */}
            <section className={panelClass}>
              <h2 className="text-lg font-semibold">Histórico</h2>
              <ul className="mt-2 flex flex-col">
                {list.map((item) => (
                  <li
                    key={item.hackathonId}
                    className="flex flex-col gap-2 border-t border-white/10 py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/hackathon/${encodeURIComponent(item.hackathonId)}`}
                        className="font-medium hover:text-highlight hover:underline"
                      >
                        {item.titulo}
                      </Link>
                      <p className="text-sm text-content-secondary">
                        {item.empresa}
                        {item.equipe ? `, equipe ${item.equipe.nome}` : ", individual"}
                        {formatDate(item.dataInicio) ? `, começa em ${formatDate(item.dataInicio)}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm">
                      {item.resultado?.posicao != null && (
                        <span className="font-semibold text-highlight">
                          {item.resultado.posicao}º de {item.resultado.totalClassificados}
                        </span>
                      )}
                      {item.resultado?.nota != null && (
                        <span className="text-content-secondary">nota {item.resultado.nota}</span>
                      )}
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 font-semibold ${phaseStyles[item.fase] || phaseStyles.Encerrado}`}>
                        {item.fase}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
        {/* CONFIGURAÇÕES: tudo da conta fica no próprio perfil */}
        <section id="configuracoes" className="flex scroll-mt-28 flex-col gap-4 pt-4">
          <div>
            <h2 className="text-2xl font-bold">Configurações da conta</h2>
            <p className="text-content-secondary">Para trocar a foto ou a cor, clique na sua foto lá em cima.</p>
          </div>
          <AccountForms />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
