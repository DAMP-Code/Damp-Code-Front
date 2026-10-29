import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import Title from "@/app-components/Title";

const API = "https://localhost:7092/api/Hackathons";

function formatDateTime(date) {
  if (!date) return "";
  const value = new Date(date);
  return `${value.toLocaleDateString("pt-BR")} às ${value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

const panelClass = "flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-surface-light p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)]";
const codeClass = "max-h-[560px] min-h-[320px] overflow-auto whitespace-pre rounded-xl border border-brand bg-surface p-4 font-mono text-sm text-content";

// Comparação manual da empresa: solução de referência ao lado do código entregue.
const SubmissionsReview = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [hackathon, setHackathon] = useState(null);
  const [entries, setEntries] = useState([]);
  const [reference, setReference] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [shown, setShown] = useState(null); // versão mostrada (a que vale ou uma antiga)
  const [error, setError] = useState("");

  const token = user?.token;
  const hackathonUrl = `${API}/${encodeURIComponent(id)}`;

  useEffect(() => {
    async function load() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [hackathonResponse, entriesResponse, referenceResponse] = await Promise.all([
          fetch(hackathonUrl, { headers }),
          fetch(`${hackathonUrl}/entregas`, { headers }),
          fetch(`${hackathonUrl}/referencia`, { headers }),
        ]);
        if (hackathonResponse.ok) setHackathon(await hackathonResponse.json());
        if (!entriesResponse.ok) {
          const data = await entriesResponse.json().catch(() => null);
          setError(data?.detail || "Não foi possível carregar as entregas.");
          return;
        }
        const list = await entriesResponse.json();
        setEntries(list);
        setSelectedId(list.find((item) => item.submissionId)?.submissionId ?? null);
        if (referenceResponse.ok) setReference(await referenceResponse.json());
      } catch (loadError) {
        console.error(loadError);
        setError("Erro ao conectar com o servidor");
      }
    }

    load();
  }, [hackathonUrl, token]);

  useEffect(() => {
    if (!selectedId) return;

    async function loadDetail() {
      try {
        const response = await fetch(`${hackathonUrl}/entregas/${encodeURIComponent(selectedId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        setDetail(data);
        setShown(data.atual);
      } catch (detailError) {
        console.error(detailError);
      }
    }

    loadDetail();
  }, [hackathonUrl, selectedId, token]);

  async function showVersion(number) {
    try {
      const response = await fetch(
        `${hackathonUrl}/entregas/${encodeURIComponent(selectedId)}/versoes/${encodeURIComponent(number)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.ok) setShown(await response.json());
    } catch (versionError) {
      console.error(versionError);
    }
  }

  const delivered = entries.filter((item) => item.submissionId);
  const missing = entries.filter((item) => !item.submissionId);
  const shownInfo = detail?.versoes.find((item) => item.versao === shown?.versao);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:p-8">
        <BackButton />
        <Title text1={"Entregas"} text2={hackathon ? ` - ${hackathon.titulo}` : ""} />

        {error ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            {/* LISTA */}
            <aside className={panelClass}>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Entregaram ({delivered.length})</h3>
              {delivered.length === 0 && <p className="text-sm text-content-secondary">Nenhuma entrega ainda.</p>}
              <ul className="flex flex-col gap-2">
                {delivered.map((entry) => (
                  <li key={entry.submissionId}>
                    <button
                      onClick={() => setSelectedId(entry.submissionId)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition hover:border-highlight ${
                        selectedId === entry.submissionId ? "border-highlight bg-surface" : "border-white/10"
                      }`}
                    >
                      <span className="font-medium">{entry.nome}</span>
                      <span className="block text-sm text-content-secondary">
                        v{entry.versaoAtual} · {formatDateTime(entry.enviadoEm)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider">Sem entrega ({missing.length})</h3>
              <ul className="flex flex-col gap-1 text-sm text-content-secondary">
                {missing.map((entry) => (
                  <li key={entry.nome}>{entry.nome}</li>
                ))}
              </ul>
            </aside>

            {/* COMPARAÇÃO */}
            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className={panelClass}>
                <h3 className="font-semibold">Solução de referência</h3>
                <p className="text-sm text-content-secondary">{reference?.linguagem || "—"}</p>
                {reference?.codigo ? (
                  <pre className={codeClass}>{reference.codigo}</pre>
                ) : (
                  <p className="text-content-secondary">Nenhuma referência cadastrada. Dá para adicionar ao editar o Hackathon.</p>
                )}
              </div>

              <div className={panelClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{detail ? detail.nome : "Selecione uma entrega"}</h3>
                  {detail && (
                    <select
                      value={shown?.versao ?? ""}
                      onChange={(e) => showVersion(e.target.value)}
                      className="rounded-xl border border-brand bg-surface-light p-2 text-content"
                    >
                      {detail.versoes.map((version) => (
                        <option key={version.versao} value={version.versao}>
                          v{version.versao}{version.vale ? " (vale esta)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {shownInfo && (
                  <p className="text-sm text-content-secondary">
                    {shownInfo.linguagem} · {shownInfo.enviadoPor} · {formatDateTime(shownInfo.enviadoEm)}
                    {shown?.nomeArquivo && ` · ${shown.nomeArquivo}`}
                  </p>
                )}
                {shown ? <pre className={codeClass}>{shown.codigo}</pre> : <p className="text-content-secondary">—</p>}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SubmissionsReview;
