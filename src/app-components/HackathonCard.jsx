import React from "react";
import { useNavigate } from "react-router-dom";

function formatPrize(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "A definir";
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatDeadline(value) {
  if (!value) return "Sem prazo";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem prazo";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function isActive(status) {
  return status === true || status === "ativo" || status === "Ativo";
}

const HackathonCard = ({ hackathon }) => {
  const navigate = useNavigate();
  const accent = hackathon.corPrincipal || "#6C48C5";
  const technologies = Array.isArray(hackathon.tecnologias)
    ? hackathon.tecnologias.slice(0, 2)
    : [];
  const active = isActive(hackathon.status);

  return (
    <article className="flex w-[min(100%,21rem)] min-h-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-light text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-colors duration-200 hover:border-brand-light">
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-brand-light">
            {hackathon.empresa || "Empresa"}
          </p>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
              active
                ? "border-success/40 text-success"
                : "border-white/15 text-content-secondary"
            }`}
          >
            {active ? "Ativo" : "Encerrado"}
          </span>
        </div>

        <h2 className="text-xl font-semibold leading-snug text-content">
          {hackathon.titulo}
        </h2>

        <p className="text-sm text-content-secondary">
          Até {formatDeadline(hackathon.dataFinal)}
        </p>

        <div className="flex flex-wrap gap-2">
          {technologies.length > 0 ? (
            technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-content"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-xs text-content-secondary">Stack a definir</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-content-secondary">Prêmio</p>
            <p className="text-lg font-semibold text-content">
              {formatPrize(hackathon.premiacao)}
            </p>
          </div>
          <button
            className="rounded-xl bg-highlight px-3 py-2 text-sm font-bold text-surface transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            onClick={() => navigate(`/hackathon/${hackathon.hackathonId}`)}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
};

export default HackathonCard;
