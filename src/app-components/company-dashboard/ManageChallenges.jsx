import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API = "https://localhost:7092/api/Hackathons";

// cor do selo de cada fase
const phaseStyles = {
  Rascunho: "bg-white/10 text-content-secondary",
  Publicado: "bg-success/20 text-success",
  Ativo: "bg-success/20 text-success",
  "Em avaliação": "bg-warning/20 text-warning",
  Encerrado: "bg-danger/20 text-danger",
  Cancelado: "bg-danger/20 text-danger",
};

const ManageChallenges = () => {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    async function fetchHackathons() {
      try {
        // todos os Hackathons da empresa, inclusive rascunhos e cancelados
        const response = await fetch(`${API}/empresa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        setHackathons(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    fetchHackathons();
  }, [token, reload]);

  // const hackathons = [
  //   {
  //     hackathonId: 1,
  //     titulo: "Bahhh",
  //     status: "Ativo",
  //     DataFinal: "2026-05-30T03:00:00.000+00:00"
  //   },
  //   {
  //     hackathonId: 2,
  //     titulo: "Bahhh2",
  //     status: "Ativo",
  //     DataFinal: "2026-05-30T03:00:00.000+00:00"
  //   },
  //   {
  //     hackathonId: 3,
  //     titulo: "Bahhh3",
  //     status: "Ativo",
  //     DataFinal: "2026-05-30T03:00:00.000+00:00"
  //   }
  // ]

  async function runAction(hackathon, method, path, confirmation) {
    if (confirmation && !window.confirm(confirmation)) return;
    setError("");
    try {
      const response = await fetch(`${API}/${encodeURIComponent(hackathon.hackathonId)}${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.detail || "Não foi possível concluir a ação.");
        return;
      }
      setReload((value) => value + 1);
    } catch (error) {
      console.error(error);
      setError("Não foi possível concluir a ação.");
    }
  }

  function generatePdf() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Relatório de Hackathons", 20, 20);

    autoTable(doc, {
      head: [["Nome", "Status", "Premiação"]],
      body: hackathons.map((h) => [
        h.titulo,
        h.fase,
        `R$ ${h.premiacao}`,
      ]),
    });

    doc.save("relatorio.pdf");
  }

  const actionClass = "rounded-lg px-4 py-2 text-sm font-medium transition";

  return (
    <div className="min-h-screen w-full max-w-7xl bg-surface px-4 py-8 text-content sm:px-6 lg:p-8">
      <button
        onClick={generatePdf}
        className="
      bg-brand
      hover:bg-brand-hover
      px-5
      py-3
      rounded-xl
      text-white
      font-semibold
      transition
      mb-5
    "
      >
        📄 Gerar Relatório PDF
      </button>
      {error && (
        <p className="mb-5 rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-light shadow-[0_20px_55px_rgba(0,0,0,0.24)]">
        <table className="min-w-[760px] w-full border-collapse">
          <thead className="bg-surface text-content">
            <tr className="text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Participantes</th>
              <th className="px-6 py-4">Data Final</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {hackathons.map((hackathon) => (
              <tr
                key={hackathon.hackathonId}
                className="border-t border-border transition hover:bg-white/5"
              >
                <td className="px-6 py-5 font-medium">{hackathon.titulo}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      phaseStyles[hackathon.fase] || phaseStyles.Rascunho
                    }`}
                  >
                    {hackathon.fase}
                  </span>
                </td>

                <td className="px-6 py-5 text-content-secondary">{hackathon.participantes}</td>

                <td className="px-6 py-5 text-content-secondary">
                  {hackathon.dataFinal
                    ? new Date(hackathon.dataFinal).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {["Rascunho", "Publicado", "Ativo"].includes(hackathon.fase) && (
                      <button
                        className={`${actionClass} bg-warning/20 text-warning hover:bg-warning hover:text-surface`}
                        onClick={() => navigate(`/cadastroHackaton/${hackathon.hackathonId}`)}
                      >
                        Editar
                      </button>
                    )}

                    {hackathon.fase === "Rascunho" && (
                      <>
                        <button
                          className={`${actionClass} bg-success/20 text-success hover:bg-success hover:text-surface`}
                          onClick={() => runAction(hackathon, "POST", "/publicar")}
                        >
                          Publicar
                        </button>
                        <button
                          className={`${actionClass} bg-danger/20 text-danger hover:bg-danger hover:text-white`}
                          onClick={() => runAction(hackathon, "DELETE", "", `Apagar o rascunho "${hackathon.titulo}"?`)}
                        >
                          Apagar
                        </button>
                      </>
                    )}

                    {hackathon.fase === "Em avaliação" && (
                      <button
                        className={`${actionClass} bg-success/20 text-success hover:bg-success hover:text-surface`}
                        onClick={() => runAction(hackathon, "POST", "/encerrar")}
                      >
                        Encerrar
                      </button>
                    )}

                    {["Ativo", "Em avaliação", "Encerrado"].includes(hackathon.fase) && (
                      <button
                        className={`${actionClass} bg-highlight/20 text-highlight hover:bg-highlight hover:text-surface`}
                        onClick={() => navigate(`/dashboard/Empresa/entregas/${encodeURIComponent(hackathon.hackathonId)}`)}
                      >
                        Entregas
                      </button>
                    )}

                    {["Publicado", "Ativo", "Em avaliação"].includes(hackathon.fase) && (
                      <button
                        className={`${actionClass} bg-danger/20 text-danger hover:bg-danger hover:text-white`}
                        onClick={() => runAction(hackathon, "POST", "/cancelar", `Cancelar "${hackathon.titulo}"? Ele some das listagens públicas.`)}
                      >
                        Cancelar
                      </button>
                    )}

                    <button
                      className={`${actionClass} bg-brand/20 text-brand-light hover:bg-brand hover:text-white`}
                      onClick={() =>
                        navigate(`/hackathon/${hackathon.hackathonId}`)
                      }
                    >
                      Detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageChallenges;
