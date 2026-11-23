import React, { useContext, useEffect, useState } from "react";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import Title from "@/app-components/Title";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { API_URL } from "@/app-components/utilities/apiUrl";

const API = `${API_URL}/api/Companies`;

// 14380200000121 -> 14.380.200/0001-21
function formatCnpj(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 14) return value || "—";
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

// Admin: empresas que se cadastraram e esperam verificação para poder publicar Hackathons.
const AdminVerification = () => {
  const { user } = useContext(AuthContext);
  const [companies, setCompanies] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPending() {
      try {
        const response = await fetch(`${API}/pending-verification`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!response.ok) {
          setError(response.status === 403 ? "Sua conta não tem permissão de Admin. Entre de novo depois de ser promovida." : "Não foi possível carregar as empresas.");
          setCompanies([]);
          return;
        }
        setCompanies(await response.json());
      } catch (error) {
        console.error(error);
        setError("Não foi possível conectar com o servidor.");
        setCompanies([]);
      }
    }

    loadPending();
  }, [user?.token]);

  async function decide(company, status) {
    if (status === "Rejected" && !window.confirm(`Recusar a verificação de ${company.name}? A empresa não poderá publicar Hackathons.`)) return;
    setError("");
    setMessage("");
    setBusyId(company.id);
    try {
      const response = await fetch(`${API}/${encodeURIComponent(company.id)}/verification`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.detail || "Não foi possível salvar a decisão.");
        return;
      }
      setCompanies((current) => current.filter((item) => item.id !== company.id));
      setMessage(status === "Verified" ? `${company.name} foi verificada e já pode publicar.` : `${company.name} foi recusada.`);
    } catch (error) {
      console.error(error);
      setError("Não foi possível conectar com o servidor.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:py-12">
        <div>
          <Title text1={"Verificação"} text2={"de empresas"} />
          <p className="max-w-2xl text-content-secondary">
            Empresas novas só publicam Hackathons depois de verificadas. Confira o CNPJ antes de aprovar.
          </p>
        </div>

        {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-success/40 bg-success/10 px-5 py-3 text-success">{message}</p>}

        {companies === null ? (
          <p className="text-content-secondary">Carregando as empresas…</p>
        ) : companies.length === 0 ? (
          !error && (
            <div className="rounded-2xl border border-white/10 bg-surface-light p-8">
              <h2 className="text-xl font-semibold">Nenhuma empresa esperando verificação</h2>
              <p className="mt-2 text-content-secondary">Quando uma empresa se cadastrar, ela aparece aqui.</p>
            </div>
          )
        ) : (
          <ul className="flex flex-col gap-4">
            {companies.map((company) => (
              <li
                key={company.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface-light p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{company.name}</h2>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-content-secondary">CNPJ</dt>
                    <dd className="font-medium tabular-nums">{formatCnpj(company.cnpj)}</dd>
                    {company.area && (
                      <>
                        <dt className="text-content-secondary">Área</dt>
                        <dd>{company.area}</dd>
                      </>
                    )}
                    {company.createdAt && (
                      <>
                        <dt className="text-content-secondary">Cadastro</dt>
                        <dd>{new Date(company.createdAt).toLocaleDateString("pt-BR")}</dd>
                      </>
                    )}
                  </dl>
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => decide(company, "Verified")}
                    disabled={busyId === company.id}
                    className="flex-1 rounded-xl bg-success/20 px-5 py-2.5 font-semibold text-success transition hover:bg-success hover:text-surface disabled:opacity-60 sm:flex-none"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => decide(company, "Rejected")}
                    disabled={busyId === company.id}
                    className="flex-1 rounded-xl bg-danger/20 px-5 py-2.5 font-semibold text-danger transition hover:bg-danger hover:text-white disabled:opacity-60 sm:flex-none"
                  >
                    Recusar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminVerification;
