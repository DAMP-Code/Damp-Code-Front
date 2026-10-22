import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManageChallenges = () => {
  const [hackathons, setHackathons] = useState([]);
  const navigate = useNavigate();

  async function fetchHackathons() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("https://localhost:7092/api/Hackathons");
      const data = await response.json();
      const companyHackathons = data.filter((h) => h.empresa === user.name);
      setHackathons(companyHackathons);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchHackathons();
  }, []);

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

  function generatePdf() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Relatório de Hackathons", 20, 20);

    autoTable(doc, {
      head: [["Nome", "Status", "Premiação"]],
      body: hackathons.map((h) => [
        h.titulo,
        h.status ? "Ativo" : "Inativo",
        `R$ ${h.premiacao}`,
      ]),
    });

    doc.save("relatorio.pdf");
  }

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
                      hackathon.status
                        ? "bg-success/20 text-success"
                        : "bg-danger/20 text-danger"
                    }`}
                  >
                    {hackathon.status ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td className="px-6 py-5 text-content-secondary">100</td>

                <td className="px-6 py-5 text-content-secondary">
                  {new Date(hackathon.dataFinal).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white">
                      Delete
                    </button>

                    <button className="rounded-lg bg-warning/20 px-4 py-2 text-sm font-medium text-warning transition hover:bg-warning hover:text-surface">
                      Edit
                    </button>

                    <button
                      className="rounded-lg bg-brand/20 px-4 py-2 text-sm font-medium text-brand-light transition hover:bg-brand hover:text-white"
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
