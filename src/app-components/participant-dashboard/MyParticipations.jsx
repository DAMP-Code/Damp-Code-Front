import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utilities/AuthContext";

const API = "https://localhost:7092/api";

const acceptClass = "rounded-lg bg-success/20 px-4 py-2 text-sm font-medium text-success transition hover:bg-success hover:text-white";
const dangerClass = "rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white";

// horas que faltam para o convite expirar (convites valem 24h)
function hoursLeft(expiresAt) {
  const hours = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60));
  return Math.max(hours, 0);
}

// Uma equipe dentro de "Minhas inscrições": membros, convites, pedidos e as ações dos integrantes.
const TeamCard = ({ participation, send }) => {
  const [email, setEmail] = useState("");
  const team = participation.equipe;
  const editable = participation.fase === "Publicado";
  const teamUrl = `${API}/Teams/${encodeURIComponent(team.teamId)}`;

  async function invite(e) {
    e.preventDefault();
    if (await send(`${teamUrl}/convites`, "POST", { email })) setEmail("");
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-white/10 bg-surface/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-medium">
          Equipe {team.nome} <span className="text-content-secondary">· {team.membros.length}/5</span>
        </span>
        {editable && (
          <label className="flex items-center gap-2 text-sm text-content-secondary">
            <input
              type="checkbox"
              checked={team.aberta}
              onChange={(e) => send(teamUrl, "PATCH", { aberta: e.target.checked })}
            />
            Aceitando pedidos
          </label>
        )}
      </div>

      <p className="text-sm text-content-secondary">{team.membros.map((member) => member.nome).join(", ")}</p>

      {team.pedidosPendentes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {team.pedidosPendentes.map((request) => (
            <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
              <span>{request.nome} quer entrar</span>
              {editable && (
                <div className="flex gap-2">
                  <button onClick={() => send(`${API}/Teams/pedidos/${encodeURIComponent(request.id)}/aceitar`, "POST")} className={acceptClass}>
                    Aceitar
                  </button>
                  <button onClick={() => send(`${API}/Teams/pedidos/${encodeURIComponent(request.id)}/recusar`, "POST")} className={dangerClass}>
                    Recusar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {team.convitesPendentes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {team.convitesPendentes.map((invitation) => (
            <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-sm">
              <span>
                Convite para {invitation.email}
                <span className="text-content-secondary"> · expira em {hoursLeft(invitation.expiraEm)}h</span>
              </span>
              {editable && (
                <button onClick={() => send(`${teamUrl}/convites/${encodeURIComponent(invitation.id)}`, "DELETE")} className={dangerClass}>
                  Revogar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          {team.membros.length < 5 && (
            <form onSubmit={invite} className="flex flex-wrap gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-mail do participante"
                className="rounded-xl border border-brand bg-surface-light px-3 py-2 text-content outline-none focus:border-highlight"
              />
              <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover">
                Convidar
              </button>
            </form>
          )}
          <button
            onClick={() => window.confirm(`Sair da equipe ${team.nome}?`) && send(`${teamUrl}/membros/me`, "DELETE")}
            className={dangerClass}
          >
            Sair da equipe
          </button>
        </div>
      )}
    </div>
  );
};

const MyParticipations = () => {
  const { user } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  const token = user?.token;

  useEffect(() => {
    async function loadParticipations() {
      try {
        const response = await fetch(`${API}/Participations/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        setOverview(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadParticipations();
  }, [token, reload]);

  async function send(url, method, body) {
    setMessage("");
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        // ex.: "Esta equipe já está completa."
        const data = await response.json().catch(() => null);
        setMessage(data?.detail || "Não foi possível concluir a ação.");
        return false;
      }
      setReload((value) => value + 1);
      return true;
    } catch (error) {
      console.error(error);
      setMessage("Erro ao conectar com o servidor");
      return false;
    }
  }

  if (!overview) return null;
  const { inscricoes, convitesRecebidos, pedidosEnviados } = overview;
  if (inscricoes.length === 0 && convitesRecebidos.length === 0 && pedidosEnviados.length === 0) return null;

  return (
    <section className="mx-4 mt-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-surface-light p-6 text-content shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:mx-6">
      {convitesRecebidos.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Convites de equipe</h3>
          <ul className="flex flex-col gap-3">
            {convitesRecebidos.map((invitation) => (
              <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span>
                  <span className="font-medium">{invitation.convidadoPor}</span> chamou você para a equipe {invitation.equipe}
                  <span className="text-content-secondary"> · {invitation.hackathon} · expira em {hoursLeft(invitation.expiraEm)}h</span>
                </span>
                <div className="flex gap-2">
                  <button onClick={() => send(`${API}/Teams/convites/${encodeURIComponent(invitation.id)}/aceitar`, "POST")} className={acceptClass}>
                    Aceitar
                  </button>
                  <button onClick={() => send(`${API}/Teams/convites/${encodeURIComponent(invitation.id)}/recusar`, "POST")} className={dangerClass}>
                    Recusar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {inscricoes.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Minhas inscrições</h3>
          <ul className="flex flex-col gap-4">
            {inscricoes.map((participation) => (
              <li key={participation.hackathonId} className="border-t border-border pt-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {/* Hackathon cancelado sai do público: sem link para não cair em "não encontrado" */}
                    {participation.fase === "Cancelado" ? (
                      <span className="font-medium">{participation.titulo}</span>
                    ) : (
                      <Link to={`/hackathon/${encodeURIComponent(participation.hackathonId)}`} className="font-medium hover:underline">
                        {participation.titulo}
                      </Link>
                    )}
                    <span className="text-content-secondary">
                      {" "}· {participation.empresa} · {participation.fase}
                      {participation.dataInicio && ` · começa em ${new Date(participation.dataInicio).toLocaleDateString("pt-BR")}`}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {participation.fase !== "Cancelado" && (
                      <Link
                        to={`/hackathon/${encodeURIComponent(participation.hackathonId)}/entrega`}
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
                      >
                        Entregar código
                      </Link>
                    )}
                    {!participation.equipe && participation.fase === "Publicado" && (
                      <button
                        onClick={() =>
                          window.confirm("Cancelar sua inscrição neste Hackathon?") &&
                          send(`${API}/Hackathons/${encodeURIComponent(participation.hackathonId)}/inscricao`, "DELETE")
                        }
                        className={dangerClass}
                      >
                        Cancelar inscrição
                      </button>
                    )}
                  </div>
                </div>
                {participation.equipe && <TeamCard participation={participation} send={send} />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pedidosEnviados.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Pedidos enviados</h3>
          <ul className="flex flex-col gap-3">
            {pedidosEnviados.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span>
                  Equipe {request.equipe} <span className="text-content-secondary">· {request.hackathon}</span>
                </span>
                <button onClick={() => send(`${API}/Teams/pedidos/${encodeURIComponent(request.id)}`, "DELETE")} className={dangerClass}>
                  Cancelar pedido
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p className="text-sm text-danger">{message}</p>}
    </section>
  );
};

export default MyParticipations;
