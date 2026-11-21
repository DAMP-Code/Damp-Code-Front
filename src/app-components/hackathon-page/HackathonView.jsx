import React from "react";
import PhaseTimeline from "./PhaseTimeline";
import ModuleList from "./ModuleList";
import { formatMoney, prizeLabel, totalPrize } from "@/app-components/utilities/prizes";
import { readableTextColor } from "@/app-components/utilities/color";

function getMethodDescription(method) {
  switch (method) {
    case "Autodata":
      return "O desempenho dos participantes será avaliado automaticamente com base em métricas de atividade, entregas e engajamento na plataforma.";

    case "Avaliação IA":
      return "Uma inteligência artificial analisará os projetos enviados, considerando qualidade, inovação e aderência ao desafio.";

    case "Avaliação Manual":
      return "Os projetos serão avaliados manualmente por uma equipe especializada da empresa.";

    default:
      return method || "A empresa ainda não definiu o método de avaliação.";
  }
}

const phaseBadge = {
  Rascunho: "Rascunho",
  Publicado: "Inscrições abertas",
  Ativo: "Em andamento",
  "Em avaliação": "Em avaliação",
  Encerrado: "Encerrado",
  Cancelado: "Cancelado",
};

// Página de um Hackathon. A mesma tela serve para a página pública e para a prévia do formulário,
// por isso usa container queries (@...) em vez dos breakpoints da janela.
const HackathonView = ({ hackathon, action, modules }) => {
  const color = hackathon.corPrincipal || "#6C48C5";
  const accent = hackathon.corSecundaria || "#C68FE6";
  const prizes = [...(hackathon.premios || [])].sort((a, b) => a.posicao - b.posicao);
  const prizeTotal = totalPrize(hackathon);

  const facts = [
    { label: "Em prêmios", value: prizeTotal > 0 ? formatMoney(prizeTotal) : prizes.length > 0 ? "Entrevistas" : "A definir" },
    { label: "Inscritos", value: hackathon.participantes || "Ninguém ainda" },
    {
      label: "Entregas até",
      value: hackathon.dataFinal ? new Date(hackathon.dataFinal).toLocaleDateString("pt-BR") : "A definir",
    },
  ];

  return (
    <div className="@container flex w-full flex-col gap-6 text-content">
      {/* TOPO */}
      <header
        style={{ borderTopColor: color }}
        className="flex flex-col gap-6 rounded-3xl border border-t-4 border-white/10 bg-surface/50 p-5 shadow-2xl backdrop-blur-sm @lg:p-8"
      >
        <div className="flex flex-col gap-5 @lg:flex-row @lg:items-center">
          <img
            className="size-20 shrink-0 rounded-2xl bg-surface/60 object-contain p-2 @lg:size-24"
            src={hackathon.logo || "/src/assets/DAMPCode.svg"}
            alt=""
          />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-content-secondary">
              <span style={{ color: accent }} className="font-semibold">{hackathon.empresa}</span>
              {hackathon.area && <span>{hackathon.area}</span>}
              {hackathon.formato && <span>{hackathon.formato === "Equipe" ? "Em equipe" : "Individual"}</span>}
              {hackathon.fase && (
                <span className="rounded-full border border-white/15 px-3 py-0.5 text-xs font-semibold text-content">
                  {phaseBadge[hackathon.fase] || hackathon.fase}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white wrap-anywhere @lg:text-4xl @3xl:text-5xl">
              {hackathon.titulo}
            </h1>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 border-t border-white/10 pt-5 @md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="text-sm text-content-secondary">{fact.label}</dt>
              <dd className="text-lg font-semibold text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <PhaseTimeline hackathon={hackathon} color={color} accent={accent} />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-3">
        {/* CONTEÚDO */}
        <div className="flex flex-col gap-6 @4xl:col-span-2">
          <section className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Sobre o desafio</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-content-secondary wrap-break-word">
              {hackathon.descricao || "A empresa ainda não escreveu a descrição."}
            </p>
          </section>

          {modules?.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white">Conteúdos</h2>
              <p className="mt-1 text-sm text-content-secondary">Material de apoio da empresa, em ordem.</p>
              <ModuleList modules={modules} accent={accent} />
            </section>
          )}

          <section className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Como as entregas são avaliadas</h2>
            <p className="mt-3 leading-relaxed text-content-secondary">{getMethodDescription(hackathon.metodo)}</p>
          </section>
        </div>

        {/* LATERAL: em tela estreita o aside some (contents) e o cartão de ação sobe para logo depois da linha do tempo */}
        <aside className="contents @4xl:flex @4xl:flex-col @4xl:gap-6">
          {action && (
            <section className="order-first rounded-2xl border border-white/10 bg-surface/70 p-6 backdrop-blur-sm @4xl:order-none">
              {action}
            </section>
          )}

          <section className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Prêmios</h2>
            {prizes.length === 0 ? (
              <p className="mt-3 text-content-secondary">
                {Number(hackathon.premiacao) > 0 ? `1º lugar: ${formatMoney(hackathon.premiacao)}` : "A empresa ainda não definiu os prêmios."}
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-3">
                {prizes.map((prize) => (
                  <li key={prize.posicao} className="flex items-start gap-3">
                    <span
                      style={prize.posicao === 1 ? { backgroundColor: color, color: readableTextColor(color) } : undefined}
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                        prize.posicao === 1 ? "" : "bg-white/10 text-content"
                      }`}
                    >
                      {prize.posicao}º
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{prize.tipo ? prizeLabel(prize) : "A definir"}</p>
                      {prize.descricao && <p className="text-sm text-content-secondary">{prize.descricao}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {hackathon.tecnologias?.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white">Tecnologias</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {hackathon.tecnologias.map((technology) => (
                  <li
                    key={technology}
                    style={{ borderColor: accent }}
                    className="rounded-full border bg-surface/40 px-3 py-1 text-sm"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default HackathonView;
