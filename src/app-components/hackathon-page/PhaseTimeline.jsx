import React from "react";
import { readableTextColor } from "@/app-components/utilities/color";

// etapa atual de cada fase da API (Rascunho e Publicado ainda estão nas inscrições)
const stepByPhase = {
  Rascunho: 0,
  Publicado: 0,
  Ativo: 1,
  "Em avaliação": 2,
  Encerrado: 3,
};

function formatDay(value) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : null;
}

// "hoje", "amanhã" ou "em 12 dias" até a data
function daysUntil(value) {
  if (!value) return null;
  const days = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}

// Linha do tempo do Hackathon: inscrições, desafio, avaliação e resultado, com a etapa atual destacada.
// color pinta os marcadores; accent é a cor do texto da contagem (a secundária costuma ser a mais clara).
const PhaseTimeline = ({ hackathon, color, accent }) => {
  if (hackathon.fase === "Cancelado") {
    return (
      <p className="rounded-2xl border border-danger/40 bg-danger/10 px-5 py-4 font-medium text-danger">
        Este Hackathon foi cancelado pela empresa.
      </p>
    );
  }

  const current = stepByPhase[hackathon.fase] ?? 0;
  const steps = [
    {
      title: "Inscrições",
      detail: hackathon.dataInicio ? `até ${formatDay(hackathon.dataInicio)}` : "datas a definir",
      countdown: daysUntil(hackathon.dataInicio) && `Começa ${daysUntil(hackathon.dataInicio)}`,
    },
    {
      title: "Desafio",
      detail: hackathon.dataFinal ? `entregas até ${formatDay(hackathon.dataFinal)}` : "datas a definir",
      countdown: daysUntil(hackathon.dataFinal) && `Entregas fecham ${daysUntil(hackathon.dataFinal)}`,
    },
    {
      title: "Avaliação",
      detail: hackathon.dataFimAvaliacao ? `até ${formatDay(hackathon.dataFimAvaliacao)}` : "datas a definir",
      countdown: daysUntil(hackathon.dataFimAvaliacao) && `Resultado previsto ${daysUntil(hackathon.dataFimAvaliacao)}`,
    },
    {
      title: "Resultado",
      detail: hackathon.resultadoPublicado ? "publicado" : "depois da avaliação",
      countdown: hackathon.resultadoPublicado ? "Resultado publicado" : "Aguardando a publicação",
    },
  ];

  return (
    <ol className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-white/10 bg-surface/50 p-5 @2xl:grid-cols-4 @2xl:gap-0 @2xl:p-0 @2xl:py-5">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.title}
            aria-current={active ? "step" : undefined}
            className="relative flex flex-col gap-1 @2xl:px-5 @2xl:[&:not(:first-child)]:border-l @2xl:[&:not(:first-child)]:border-white/10"
          >
            <span className="flex items-center gap-2">
              <span
                style={active || done ? { backgroundColor: color, borderColor: color, color: readableTextColor(color) } : undefined}
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  active || done ? "" : "border-white/20 text-content-secondary"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className={`font-semibold ${active ? "text-white" : done ? "text-content" : "text-content-secondary"}`}>
                {step.title}
              </span>
            </span>
            <span className="pl-9 text-sm text-content-secondary">{step.detail}</span>
            {active && step.countdown && (
              <span style={{ color: accent }} className="pl-9 text-sm font-semibold">
                {step.countdown}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default PhaseTimeline;
