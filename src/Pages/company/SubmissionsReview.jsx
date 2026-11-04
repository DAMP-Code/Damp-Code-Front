import { Link, useParams } from "react-router-dom";
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
  const [notes, setNotes] = useState({}); // nota por entrega, para a lista da esquerda
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

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

        // a lista de notas só vem quando a fase de avaliação permite
        const evaluationResponse = await fetch(`${hackathonUrl}/avaliacao`, { headers });
        if (evaluationResponse.ok) {
          const evaluation = await evaluationResponse.json();
          setNotes(Object.fromEntries(evaluation.entregas.map((item) => [item.submissionId, item.nota])));
        }
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
        setScore(String(data.nota ?? data.semelhanca ?? ""));
        setComment(data.comentario ?? "");
        setSaveError("");
        setSaved(false);
        setNotes((current) => ({ ...current, [data.submissionId ?? selectedId]: data.nota ?? null }));
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

  async function saveScore() {
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const response = await fetch(`${hackathonUrl}/entregas/${encodeURIComponent(selectedId)}/avaliacao`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nota: score === "" ? null : Number(score), comentario: comment }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setSaveError(data?.detail || "Não foi possível salvar a nota.");
        return;
      }
      const data = await response.json();
      setNotes((current) => ({ ...current, [selectedId]: data.nota }));
      setDetail((current) => ({ ...current, nota: data.nota, comentario: data.comentario }));
      setSaved(true);
    } catch (saveFailure) {
      console.error(saveFailure);
      setSaveError("Erro ao conectar com o servidor");
    } finally {
      setSaving(false);
    }
  }

  const delivered = entries.filter((item) => item.submissionId);
  const missing = entries.filter((item) => !item.submissionId);
  const shownInfo = detail?.versoes.find((item) => item.versao === shown?.versao);
  const currentInfo = detail?.versoes.find((item) => item.vale);
  const differentLanguage =
    Boolean(reference?.linguagem && currentInfo?.linguagem) && currentInfo.linguagem !== reference.linguagem;
  const hasNote = detail?.nota !== null && detail?.nota !== undefined;

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:p-8">
        <BackButton />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title text1={"Entregas"} text2={hackathon ? ` - ${hackathon.titulo}` : ""} />
          <Link to={`/dashboard/Empresa/avaliacao/${encodeURIComponent(id)}`} className="font-medium text-highlight hover:underline">
            Ver ranking
          </Link>
        </div>

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
                      <span className="block text-sm text-content-secondary">
                        {notes[entry.submissionId] != null ? `Nota ${notes[entry.submissionId]}` : "Sem nota"}
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

                {detail && (detail.podeAvaliar || hasNote) && (
                  <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
                    <p className="text-sm text-content-secondary">
                      {detail.semelhanca != null ? `Semelhança com a referência: ${detail.semelhanca}%` : "Sem referência"}
                    </p>
                    {differentLanguage && (
                      <p className="text-sm text-highlight">Linguagem diferente da referência</p>
                    )}
                    {detail.podeAvaliar ? (
                      <>
                        <label className="flex flex-col gap-1 text-sm">
                          Nota (0–100)
                          <input
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="rounded-xl border border-brand bg-surface p-2 text-content"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                          Comentário
                          <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="rounded-xl border border-brand bg-surface p-2 text-content"
                          />
                        </label>
                        {saveError && <p className="text-sm text-danger">{saveError}</p>}
                        {saved && <p className="text-sm text-content-secondary">Nota salva.</p>}
                        <button
                          onClick={saveScore}
                          disabled={saving}
                          className="self-start rounded-xl bg-highlight px-5 py-2 font-semibold text-surface transition hover:opacity-90 disabled:opacity-60"
                        >
                          {saving ? "Salvando..." : "Salvar nota"}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm">
                        Nota: <strong>{detail.nota}</strong>
                        {detail.comentario && <span className="block text-content-secondary">{detail.comentario}</span>}
                      </p>
                    )}
                  </div>
                )}
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
