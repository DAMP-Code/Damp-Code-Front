import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import Title from "@/app-components/Title";
import { prizeLabel } from "@/app-components/utilities/prizes";

const API = "https://localhost:7092/api/Hackathons";

const panelClass = "flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-surface-light p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)]";

// Ranking por nota e escolha livre dos vencedores de cada posição premiada.
const EvaluationRanking = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [hackathon, setHackathon] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [winners, setWinners] = useState({}); // submissionId -> posição do prêmio (string vazia = nenhum)
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const token = user?.token;
  const hackathonUrl = `${API}/${encodeURIComponent(id)}`;

  function applyEvaluation(data) {
    setEvaluation(data);
    setWinners(
      Object.fromEntries(
        data.entregas.filter((item) => item.posicaoPremio != null).map((item) => [item.submissionId, String(item.posicaoPremio)]),
      ),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [hackathonResponse, evaluationResponse] = await Promise.all([
          fetch(hackathonUrl, { headers }),
          fetch(`${hackathonUrl}/avaliacao`, { headers }),
        ]);
        if (cancelled) return;
        if (hackathonResponse.ok) setHackathon(await hackathonResponse.json());
        if (!evaluationResponse.ok) {
          const data = await evaluationResponse.json().catch(() => null);
          setError(data?.detail || "Não foi possível carregar o ranking.");
          return;
        }
        const data = await evaluationResponse.json();
        if (!cancelled) applyEvaluation(data);
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) setError("Erro ao conectar com o servidor");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [hackathonUrl, token]);

  // devolve true se salvou
  async function saveWinners() {
    const vencedores = Object.entries(winners)
      .filter(([, position]) => position !== "")
      .map(([submissionId, position]) => ({ posicao: Number(position), submissionId }));
    const response = await fetch(`${hackathonUrl}/vencedores`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ vencedores }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.detail || "Não foi possível salvar os vencedores.");
      return false;
    }
    applyEvaluation(await response.json());
    return true;
  }

  async function handleSave() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (await saveWinners()) setMessage("Vencedores salvos.");
    } catch (saveError) {
      console.error(saveError);
      setError("Erro ao conectar com o servidor");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    const used = new Set(Object.values(winners).filter((position) => position !== "").map(Number));
    const empty = evaluation.premios.filter((prize) => !used.has(prize.posicao)).map((prize) => prize.posicao);
    if (empty.length > 0) {
      const text =
        empty.length === 1
          ? `A posição ${empty[0]} ficou sem vencedor. Publicar assim mesmo?`
          : `As posições ${empty.join(", ")} ficaram sem vencedor. Publicar assim mesmo?`;
      if (!window.confirm(text)) return;
    }
    const confirmText = hackathon?.fase === "Em avaliação"
      ? "Publicar o resultado encerra o Hackathon e não dá para mudar nota, comentário ou vencedores depois. Continuar?"
      : "Depois de publicado, o resultado não pode mais ser alterado (nota, comentário ou vencedores). Continuar?";
    if (!window.confirm(confirmText)) return;

    setBusy(true);
    setError("");
    setMessage("");
    try {
      // grava a escolha da tela antes de publicar
      if (!(await saveWinners())) return;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${hackathonUrl}/resultado`, { method: "POST", headers });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.detail || "Não foi possível publicar o resultado.");
        return;
      }
      const evaluationResponse = await fetch(`${hackathonUrl}/avaliacao`, { headers });
      if (evaluationResponse.ok) applyEvaluation(await evaluationResponse.json());
      setMessage("Resultado publicado.");
    } catch (publishError) {
      console.error(publishError);
      setError("Erro ao conectar com o servidor");
    } finally {
      setBusy(false);
    }
  }

  const published = Boolean(evaluation?.resultadoPublicado);
  const canEdit = Boolean(evaluation?.podeAvaliar) && !published;

  // posição na ordem do ranking por nota (a lista já vem ordenada)
  const rows = (evaluation?.entregas ?? []).map((entry, index) => ({ ...entry, ranking: index + 1 }));
  // publicado: premiados nas posições dos prêmios, os demais em seguida pela ordem do ranking
  let ordered = rows;
  if (published) {
    let next = evaluation.premios.length + 1;
    ordered = rows
      .map((entry) => ({ ...entry, final: entry.posicaoPremio ?? next++ }))
      .sort((a, b) => a.final - b.final);
  }

  const prizeByPosition = Object.fromEntries((evaluation?.premios ?? []).map((prize) => [prize.posicao, prize]));
  const selectClass = "rounded-xl border border-brand bg-surface p-2 text-content disabled:opacity-60";

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:p-8">
        <BackButton />
        <Title text1={"Avaliação"} text2={hackathon ? ` - ${hackathon.titulo}` : ""} />

        {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}
        {message && <p className="rounded-xl border border-white/10 bg-surface-light px-5 py-3 text-content-secondary">{message}</p>}

        {evaluation && (
          <div className={panelClass}>
            <p className="text-sm text-content-secondary">
              {published
                ? "Resultado publicado. Classificação final, só leitura."
                : canEdit
                  ? "Escolha o vencedor de cada prêmio, mesmo que não seja o primeiro da nota."
                  : "A avaliação abre quando as submissões terminam."}
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[680px] w-full border-collapse">
                <thead className="text-left text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">{published ? "Classificação" : "Posição"}</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Semelhança</th>
                    <th className="px-4 py-3">Nota</th>
                    <th className="px-4 py-3">Prêmio</th>
                    <th className="px-4 py-3">Código</th>
                  </tr>
                </thead>
                <tbody>
                  {ordered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-5 text-content-secondary">Nenhuma entrega ainda.</td>
                    </tr>
                  )}
                  {ordered.map((entry) => {
                    const mine = winners[entry.submissionId] ?? "";
                    const taken = new Set(
                      Object.entries(winners)
                        .filter(([submissionId, position]) => position !== "" && submissionId !== entry.submissionId)
                        .map(([, position]) => Number(position)),
                    );
                    const free = evaluation.premios.filter((prize) => !taken.has(prize.posicao));
                    const prize = entry.posicaoPremio != null ? prizeByPosition[entry.posicaoPremio] : null;
                    return (
                      <tr key={entry.submissionId} className="border-t border-border">
                        <td className="px-4 py-4 font-semibold">{published ? `${entry.final}º` : `${entry.ranking}º`}</td>
                        <td className="px-4 py-4">{entry.nome}</td>
                        <td className="px-4 py-4 text-content-secondary">
                          {entry.semelhanca != null ? `${entry.semelhanca}%` : "—"}
                        </td>
                        <td className="px-4 py-4">{entry.nota != null ? entry.nota : <span className="text-content-secondary">Sem nota</span>}</td>
                        <td className="px-4 py-4">
                          {canEdit ? (
                            <select
                              aria-label={`Prêmio de ${entry.nome}`}
                              value={mine}
                              disabled={busy}
                              onChange={(e) => setWinners((current) => ({ ...current, [entry.submissionId]: e.target.value }))}
                              className={selectClass}
                            >
                              <option value="">Nenhum</option>
                              {free.map((item) => (
                                <option key={item.posicao} value={item.posicao}>
                                  {item.posicao}º lugar - {prizeLabel(item)}
                                </option>
                              ))}
                            </select>
                          ) : prize ? (
                            <span>{prize.posicao}º lugar - {prizeLabel(prize)}</span>
                          ) : (
                            <span className="text-content-secondary">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            to={`/dashboard/Empresa/entregas/${encodeURIComponent(id)}?entrega=${encodeURIComponent(entry.submissionId)}`}
                            className="font-medium text-highlight hover:underline"
                          >
                            Ver código
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {canEdit && (
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={busy}
                  className="rounded-xl bg-highlight px-5 py-2 font-semibold text-surface transition hover:opacity-90 disabled:opacity-60"
                >
                  Salvar vencedores
                </button>
                <button
                  onClick={handlePublish}
                  disabled={busy}
                  className="rounded-xl bg-success/20 px-5 py-2 font-semibold text-success transition hover:bg-success hover:text-surface disabled:opacity-60"
                >
                  Publicar resultado
                </button>
              </div>
            )}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default EvaluationRanking;
