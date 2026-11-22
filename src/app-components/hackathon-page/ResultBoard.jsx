import React from "react";
import Avatar from "@/app-components/Avatar";
import { prizeLabel } from "@/app-components/utilities/prizes";

// cor de cada lugar do pódio (ouro, prata, bronze)
const podiumColors = { 1: "#FFEA00", 2: "#C7C9D9", 3: "#E0915A" };
// altura do degrau no desktop: o 1º fica mais alto
const stepHeight = { 1: "sm:min-h-64", 2: "sm:min-h-56", 3: "sm:min-h-52" };
// ordem visual no desktop: 2º, 1º, 3º
const podiumOrder = { 1: "sm:order-2", 2: "sm:order-1", 3: "sm:order-3" };

const YouBadge = () => (
  <span className="rounded-full bg-highlight px-2 py-0.5 text-xs font-bold text-surface">Você</span>
);

function membersText(entry) {
  if (!entry.equipe) return null;
  return entry.membros.join(", ");
}

// Classificação final de um Hackathon: pódio com os 3 primeiros e a lista do resto.
// limit mostra só as primeiras posições (ex.: na página do Hackathon).
const ResultBoard = ({ result, limit }) => {
  const entries = limit ? result.classificacao.slice(0, limit) : result.classificacao;
  // posições do pódio até a última que aparece; prêmio sem vencedor deixa a posição vaga (regra da avaliação)
  const lastPosition = Math.max(0, ...result.classificacao.map((entry) => entry.posicao));
  const podium = [1, 2, 3]
    .filter((position) => position <= lastPosition)
    .map((position) => entries.find((entry) => entry.posicao === position) || { posicao: position, vazio: true });
  const rest = entries.filter((entry) => entry.posicao > 3);

  if (result.classificacao.length === 0) {
    return <p className="text-content-secondary">Ninguém foi classificado neste Hackathon.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* PÓDIO */}
      <ol className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
        {podium.map((entry) =>
          entry.vazio ? (
            <li
              key={`vazio-${entry.posicao}`}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 p-5 text-center ${stepHeight[entry.posicao]} ${podiumOrder[entry.posicao]}`}
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-content-secondary">
                {entry.posicao}º
              </span>
              <p className="text-sm text-content-secondary">Sem vencedor</p>
            </li>
          ) : (
          <li
            key={`${entry.posicao}-${entry.nome}`}
            className={`flex flex-col items-center gap-3 rounded-2xl border bg-surface/50 p-5 text-center ${stepHeight[entry.posicao]} ${podiumOrder[entry.posicao]} ${
              entry.voce ? "border-highlight/70" : "border-white/10"
            }`}
          >
            <span
              style={{ backgroundColor: podiumColors[entry.posicao] }}
              className="flex size-9 items-center justify-center rounded-full text-sm font-black text-surface"
            >
              {entry.posicao}º
            </span>
            <Avatar name={entry.nome} color={podiumColors[entry.posicao]} size="md" />
            <div className="flex min-w-0 flex-col items-center gap-1">
              <p className="flex flex-wrap items-center justify-center gap-2 font-semibold text-white">
                <span className="wrap-break-word">{entry.nome}</span>
                {entry.voce && <YouBadge />}
              </p>
              {membersText(entry) && <p className="text-xs text-content-secondary">{membersText(entry)}</p>}
            </div>
            <div className="mt-auto flex flex-col items-center gap-0.5">
              {entry.nota != null && <span className="text-2xl font-bold text-white">{entry.nota}</span>}
              {entry.premio && <span className="text-sm font-semibold text-highlight">{prizeLabel(entry.premio)}</span>}
            </div>
          </li>
          ),
        )}
      </ol>

      {/* DEMAIS POSIÇÕES */}
      {rest.length > 0 && (
        <ol className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface/40">
          {rest.map((entry) => (
            <li
              key={`${entry.posicao}-${entry.nome}`}
              className={`flex items-center gap-4 px-4 py-3 sm:px-5 ${entry.voce ? "bg-highlight/10" : ""}`}
            >
              <span className="w-8 shrink-0 text-center font-bold text-content-secondary">{entry.posicao}º</span>
              <Avatar name={entry.nome} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-medium text-white">
                  <span className="truncate">{entry.nome}</span>
                  {entry.voce && <YouBadge />}
                </p>
                {membersText(entry) && <p className="truncate text-xs text-content-secondary">{membersText(entry)}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end">
                {entry.nota != null && <span className="font-semibold text-white">{entry.nota}</span>}
                {entry.premio && <span className="text-xs font-semibold text-highlight">{prizeLabel(entry.premio)}</span>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ResultBoard;
