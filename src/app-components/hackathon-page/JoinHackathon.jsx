import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utilities/AuthContext";

const API = "https://localhost:7092/api";

const buttonClass = `
  px-8
  py-3
  rounded-xl
  font-semibold
  text-lg
  shadow-lg
  hover:-translate-y-1 hover:brightness-110
  transition-all
  disabled:cursor-not-allowed disabled:opacity-60
`;

// Bloco de inscrição da página do Hackathon: individual (Participar) ou equipe (criar / pedir para entrar).
const JoinHackathon = ({ hackathon, onChanged }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [participation, setParticipation] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [acceptRequests, setAcceptRequests] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const token = user?.token;
  const isParticipant = user?.role === "participante";
  const isTeam = hackathon.formato === "Equipe";
  const isOpen = hackathon.fase === "Publicado";
  const hackathonId = encodeURIComponent(hackathon.hackathonId);

  useEffect(() => {
    async function load() {
      try {
        if (isParticipant) {
          const response = await fetch(`${API}/Participations/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setParticipation(
              data.inscricoes.find((item) => String(item.hackathonId) === String(hackathon.hackathonId)) || null,
            );
            setSentRequests(data.pedidosEnviados.map((item) => item.teamId));
          }
        }
        if (isTeam && isOpen) {
          const response = await fetch(`${API}/Hackathons/${hackathonId}/equipes`);
          if (response.ok) setTeams(await response.json());
        }
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, [token, isParticipant, isTeam, isOpen, hackathon.hackathonId, hackathonId, reload]);

  async function send(url, method, body) {
    setMessage("");
    setLoading(true);
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
        const data = await response.json().catch(() => null);
        setMessage(data?.detail || "Não foi possível concluir a ação.");
        return false;
      }
      setReload((value) => value + 1);
      onChanged?.();
      return true;
    } catch (error) {
      console.error(error);
      setMessage("Erro ao conectar com o servidor");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function createTeam(e) {
    e.preventDefault();
    const created = await send(`${API}/Hackathons/${hackathonId}/equipes`, "POST", {
      nome: teamName,
      aberta: acceptRequests,
    });
    if (created) setTeamName("");
  }

  // empresa não participa
  if (user && !isParticipant) return null;

  const style = { backgroundColor: hackathon.corPrincipal };

  if (!user) {
    return isOpen ? (
      <button style={style} className={buttonClass} onClick={() => navigate("/loginUser")}>
        Participar
      </button>
    ) : (
      <p className="font-semibold text-content-secondary">Inscrições encerradas</p>
    );
  }

  if (participation) {
    return (
      <div className="flex flex-col items-start gap-3 lg:items-end">
        <p className="rounded-xl border border-success/40 bg-success/10 px-5 py-3 font-semibold text-success">
          {participation.equipe ? `Sua equipe: ${participation.equipe.nome}` : "Inscrito ✓"}
        </p>
        {participation.equipe && (
          <Link to="/dashboard/participante" className="text-sm underline text-content-secondary hover:text-content">
            Gerenciar no painel
          </Link>
        )}
        {!participation.equipe && isOpen && (
          <button
            disabled={loading}
            onClick={() =>
              window.confirm("Cancelar sua inscrição neste Hackathon?") &&
              send(`${API}/Hackathons/${hackathonId}/inscricao`, "DELETE")
            }
            className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white"
          >
            Cancelar inscrição
          </button>
        )}
        {message && <p className="text-sm text-danger">{message}</p>}
      </div>
    );
  }

  if (!isOpen) {
    return <p className="font-semibold text-content-secondary">Inscrições encerradas</p>;
  }

  if (!isTeam) {
    return (
      <div className="flex flex-col items-start gap-3 lg:items-end">
        <button
          style={style}
          className={buttonClass}
          disabled={loading}
          onClick={() => send(`${API}/Hackathons/${hackathonId}/inscricao`, "POST")}
        >
          Participar
        </button>
        {message && <p className="text-sm text-danger">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:w-96">
      {/* Criar equipe */}
      <form onSubmit={createTeam} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface/40 p-4">
        <label className="font-semibold">Criar equipe</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          maxLength={100}
          placeholder="Nome da equipe"
          className="rounded-xl border border-brand bg-surface-light p-3 text-content outline-none focus:border-highlight"
        />
        <label className="flex items-center gap-2 text-sm text-content-secondary">
          <input type="checkbox" checked={acceptRequests} onChange={(e) => setAcceptRequests(e.target.checked)} />
          Aceitar pedidos para entrar
        </label>
        <button type="submit" style={style} className={buttonClass} disabled={loading}>
          Criar equipe
        </button>
      </form>

      {/* Equipes abertas */}
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-surface/40 p-4">
        <p className="font-semibold">Equipes abertas</p>
        {teams.length === 0 && <p className="text-sm text-content-secondary">Nenhuma equipe aceitando pedidos agora.</p>}
        {teams.map((team) => (
          <div key={team.teamId} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
            <span>
              {team.nome} <span className="text-sm text-content-secondary">· {team.membros}/5</span>
            </span>
            {sentRequests.includes(team.teamId) ? (
              <span className="text-sm text-content-secondary">Pedido enviado</span>
            ) : (
              <button
                disabled={loading}
                onClick={() => send(`${API}/Teams/${encodeURIComponent(team.teamId)}/pedidos`, "POST")}
                className="rounded-lg bg-brand/20 px-3 py-1 text-sm font-medium text-brand-light transition hover:bg-brand hover:text-white"
              >
                Pedir para entrar
              </button>
            )}
          </div>
        ))}
      </div>
      {message && <p className="text-sm text-danger">{message}</p>}
    </div>
  );
};

export default JoinHackathon;
