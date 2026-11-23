import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import Title from "@/app-components/Title";
import EmptyState from "@/app-components/EmptyState";
import ResultBoard from "@/app-components/hackathon-page/ResultBoard";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { API_URL } from "@/app-components/utilities/apiUrl";

const API = `${API_URL}/api/Hackathons`;

// Ranking dos Hackathons com resultado publicado: escolha o desafio e veja a classificação final.
const ResultsRanking = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hackathons, setHackathons] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHackathons() {
      try {
        const response = await fetch(API);
        const data = response.ok ? await response.json() : [];
        // os mais recentes primeiro (pelo fim da avaliação)
        const published = (Array.isArray(data) ? data : [])
          .filter((item) => item.resultadoPublicado)
          .sort((a, b) => new Date(b.dataFimAvaliacao || 0) - new Date(a.dataFimAvaliacao || 0));
        setHackathons(published);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar os Hackathons.");
        setHackathons([]);
      }
    }

    loadHackathons();
  }, []);

  const selectedId = searchParams.get("hackathon") || hackathons?.[0]?.hackathonId;
  const selected = hackathons?.find((item) => String(item.hackathonId) === String(selectedId));

  useEffect(() => {
    if (!selectedId) return;
    let active = true;

    async function loadResult() {
      setResult(null);
      try {
        const response = await fetch(
          `${API}/${encodeURIComponent(selectedId)}/resultado`,
          user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined,
        );
        if (!response.ok) {
          if (active) setError("Não foi possível carregar o resultado deste Hackathon.");
          return;
        }
        const data = await response.json();
        if (active) {
          setError("");
          setResult(data);
        }
      } catch (error) {
        console.error(error);
        if (active) setError("Não foi possível conectar com o servidor.");
      }
    }

    loadResult();
    return () => {
      active = false;
    };
  }, [selectedId, user?.token]);

  const mine = result?.classificacao.find((entry) => entry.voce);

  return (
    <div className="min-h-screen bg-surface text-content">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
        <div>
          <Title text1={"Ranking"} text2={"dos Hackathons"} />
          <p className="max-w-2xl text-content-secondary">
            A classificação final de cada desafio aparece aqui depois que a empresa publica o resultado.
          </p>
        </div>

        {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}

        {hackathons === null ? (
          <p className="text-content-secondary">Carregando…</p>
        ) : hackathons.length === 0 ? (
          <EmptyState
            title="Nenhum resultado publicado ainda"
            text="Quando uma empresa publicar o resultado de um Hackathon, a classificação aparece aqui."
            actionLabel="Ver desafios abertos"
            to="/explore"
          />
        ) : (
          <>
            {/* escolha do Hackathon */}
            <div role="tablist" aria-label="Hackathons com resultado" className="flex gap-2 overflow-x-auto pb-1">
              {hackathons.map((item) => {
                const isSelected = String(item.hackathonId) === String(selectedId);
                return (
                  <button
                    key={item.hackathonId}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSearchParams({ hackathon: item.hackathonId })}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-left transition ${
                      isSelected ? "border-highlight bg-highlight/10" : "border-white/10 bg-surface-light hover:border-white/25"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-content">{item.titulo}</span>
                    <span className="block text-xs text-brand-light">{item.empresa}</span>
                  </button>
                );
              })}
            </div>

            <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-surface-light p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-light">{selected?.empresa}</p>
                  <h2 className="text-2xl font-bold">{selected?.titulo}</h2>
                  {result && (
                    <p className="text-sm text-content-secondary">
                      {result.totalClassificados === 1 ? "1 classificado" : `${result.totalClassificados} classificados`}
                    </p>
                  )}
                </div>
                {selected && (
                  <Link
                    to={`/hackathon/${encodeURIComponent(selected.hackathonId)}`}
                    className="shrink-0 font-semibold text-highlight hover:underline"
                  >
                    Ver o desafio
                  </Link>
                )}
              </div>

              {mine && (
                <p className="rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3 font-medium text-content">
                  Você ficou em <b className="text-highlight">{mine.posicao}º lugar</b>
                  {result.totalClassificados ? ` de ${result.totalClassificados}` : ""}
                  {mine.nota != null ? `, com nota ${mine.nota}` : ""}.
                </p>
              )}

              {result === null ? <p className="text-content-secondary">Carregando o resultado…</p> : <ResultBoard result={result} />}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ResultsRanking;
