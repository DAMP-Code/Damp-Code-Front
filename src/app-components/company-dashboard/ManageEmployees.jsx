import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utilities/AuthContext";
import Title from "../Title";
import { theadClass, tbodyClass, rowClass, cellClass, blockCellClass } from "../utilities/responsiveTable";
import { API_URL } from "@/app-components/utilities/apiUrl";

const API = `${API_URL}/api/Companies`;

// horas que faltam para o convite expirar (convites valem 24h)
function hoursLeft(expiresAt) {
  const hours = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60));
  return Math.max(hours, 0);
}

const ManageEmployees = ({ companyAccess }) => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [message, setMessage] = useState("");
  // incrementa para recarregar as listas depois de convidar, revogar ou remover
  const [reload, setReload] = useState(0);

  const token = user?.token;
  const isPrimaryAccount = companyAccess?.isPrimaryAccount;

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    if (!companyAccess) return;
    const headers = { Authorization: `Bearer ${token}` };

    async function loadEmployees() {
      try {
        const response = await fetch(`${API}/me/employees`, { headers });
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    async function loadInvitations() {
      // só a conta principal enxerga os convites enviados
      if (!companyAccess.isPrimaryAccount) return;
      try {
        const response = await fetch(`${API}/me/invitations`, { headers });
        const data = await response.json();
        setInvitations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    loadEmployees();
    loadInvitations();
  }, [companyAccess, token, reload]);

  async function handleInvite(e) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Informe o e-mail da pessoa");
      return;
    }

    try {
      const response = await fetch(`${API}/me/invitations`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email, jobTitle: jobTitle || null }),
      });

      if (!response.ok) {
        // a API devolve o motivo no campo detail
        const data = await response.json().catch(() => null);
        setMessage(data?.detail || "Não foi possível enviar o convite");
        return;
      }

      setEmail("");
      setJobTitle("");
      setMessage("Convite enviado! Ele vale por 24 horas.");
      setReload((value) => value + 1);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao conectar com o servidor");
    }
  }

  async function handleRevoke(id) {
    try {
      await fetch(`${API}/me/invitations/${id}`, { method: "DELETE", headers: authHeaders() });
      setReload((value) => value + 1);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRemove(employee) {
    if (!window.confirm(`Remover ${employee.name} da empresa?`)) return;
    try {
      await fetch(`${API}/me/employees/${employee.accountId}`, { method: "DELETE", headers: authHeaders() });
      setReload((value) => value + 1);
    } catch (error) {
      console.error(error);
    }
  }

  if (!companyAccess) return null;

  return (
    <section className="w-full max-w-7xl px-4 py-8 text-content sm:px-6 lg:p-8">
      <Title text1={"Sua"} text2={"equipe"} />

      {isPrimaryAccount && (
        <form
          onSubmit={handleInvite}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] md:flex-row md:items-end"
        >
          <label className="flex flex-1 flex-col gap-2 text-sm text-content-secondary">
            E-mail do participante
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pessoa@exemplo.com"
              className="rounded-xl border border-border bg-surface px-4 py-3 text-content outline-none focus:border-brand"
            />
          </label>
          <label className="flex flex-1 flex-col gap-2 text-sm text-content-secondary">
            Cargo (opcional)
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Desenvolvedor(a)"
              className="rounded-xl border border-border bg-surface px-4 py-3 text-content outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover"
          >
            Convidar
          </button>
        </form>
      )}

      {message && <p className="mb-6 text-sm text-content-secondary">{message}</p>}

      {isPrimaryAccount && invitations.length > 0 && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-surface-light p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Convites pendentes</h3>
          <ul className="flex flex-col gap-3">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span>
                  {invitation.email}
                  {invitation.jobTitle && <span className="text-content-secondary"> · {invitation.jobTitle}</span>}
                  <span className="text-content-secondary"> · expira em {hoursLeft(invitation.expiresAt)}h</span>
                </span>
                <button
                  onClick={() => handleRevoke(invitation.id)}
                  className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white"
                >
                  Revogar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-light shadow-[0_20px_55px_rgba(0,0,0,0.24)]">
        <table className="w-full border-collapse lg:min-w-[640px]">
          <thead className={`${theadClass} bg-surface text-content`}>
            <tr className="text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4">Cargo</th>
              <th className="px-6 py-4">Desde</th>
              {isPrimaryAccount && <th className="px-6 py-4">Ações</th>}
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {employees.length === 0 && (
              <tr className={`${rowClass} p-4 lg:p-0`}>
                <td colSpan={5} className={`${blockCellClass} text-content-secondary lg:px-6 lg:py-5`}>
                  Nenhum funcionário ainda.
                </td>
              </tr>
            )}
            {employees.map((employee) => (
              <tr key={employee.accountId} className={`${rowClass} p-4 transition hover:bg-white/5 lg:p-0`}>
                <td className={`${blockCellClass} pb-2 text-lg font-medium lg:px-6 lg:py-5 lg:text-base`}>{employee.name}</td>
                <td data-label="E-mail" className={`${cellClass} break-all text-content-secondary lg:px-6 lg:py-5`}>{employee.email}</td>
                <td data-label="Cargo" className={`${cellClass} text-content-secondary lg:px-6 lg:py-5`}>{employee.jobTitle || "-"}</td>
                <td data-label="Desde" className={`${cellClass} text-content-secondary lg:px-6 lg:py-5`}>
                  {new Date(employee.startedAt).toLocaleDateString("pt-BR")}
                </td>
                {isPrimaryAccount && (
                  <td className={`${blockCellClass} pt-3 lg:px-6 lg:py-5`}>
                    <button
                      onClick={() => handleRemove(employee)}
                      className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white"
                    >
                      Remover
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageEmployees;
