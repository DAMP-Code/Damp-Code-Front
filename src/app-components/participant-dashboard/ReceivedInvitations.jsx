import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utilities/AuthContext";

const API = "https://localhost:7092/api/Companies";

// horas que faltam para o convite expirar (convites valem 24h)
function hoursLeft(expiresAt) {
  const hours = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60));
  return Math.max(hours, 0);
}

const ReceivedInvitations = ({ onAccepted }) => {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  const token = user?.token;

  useEffect(() => {
    async function loadInvitations() {
      try {
        const response = await fetch(`${API}/invitations/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setInvitations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    loadInvitations();
  }, [token, reload]);

  async function answer(invitation, action) {
    setMessage("");
    try {
      const response = await fetch(`${API}/invitations/${invitation.id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // ex.: "Você já está vinculado a uma empresa."
        const data = await response.json().catch(() => null);
        setMessage(data?.detail || "Não foi possível responder o convite");
        return;
      }

      if (action === "accept") onAccepted?.(await response.json());
      setReload((value) => value + 1);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao conectar com o servidor");
    }
  }

  if (invitations.length === 0) return null;

  return (
    <section className="mx-4 mt-8 rounded-2xl border border-white/10 bg-surface-light p-6 text-content shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:mx-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Convites</h3>
      <ul className="flex flex-col gap-3">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <span>
              <span className="font-medium">{invitation.companyName}</span> quer você na equipe
              {invitation.jobTitle && <span className="text-content-secondary"> · {invitation.jobTitle}</span>}
              <span className="text-content-secondary"> · expira em {hoursLeft(invitation.expiresAt)}h</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => answer(invitation, "accept")}
                className="rounded-lg bg-success/20 px-4 py-2 text-sm font-medium text-success transition hover:bg-success hover:text-white"
              >
                Aceitar
              </button>
              <button
                onClick={() => answer(invitation, "decline")}
                className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white"
              >
                Recusar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {message && <p className="mt-4 text-sm text-danger">{message}</p>}
    </section>
  );
};

export default ReceivedInvitations;
