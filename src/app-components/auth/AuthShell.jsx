import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BackButton from "@/app-components/BackButton";
import AuthLink from "@/app-components/auth/AuthLink";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import { formatMoney, totalPrize } from "@/app-components/utilities/prizes";
import { useReducedMotion } from "@/app-components/utilities/useReducedMotion";
import { markTransitionReady } from "@/app-components/utilities/viewTransition";
import { API_URL } from "@/app-components/utilities/apiUrl";

// ordem das telas de acesso: decide para que lado o conteúdo desliza na troca
const SCREEN_ORDER = { login: 0, participante: 1, empresa: 2, "empresa-detalhes": 3 };
let lastScreen = null;

const FEATURED_INTERVAL = 4000;

// guardados entre as telas de acesso: a pilha aparece pronta na tela nova e fica parada durante a troca
let cachedHackathons = null;
let cachedActive = 0;

// Hackathons com inscrição aberta ou em andamento, empilhados e trocando sozinhos, para a coluna da esquerda não ficar vazia
function OpenHackathons() {
  const reducedMotion = useReducedMotion();
  const [hackathons, setHackathons] = useState(cachedHackathons || []);
  const [active, setActive] = useState(cachedActive);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/api/Hackathons`);
        if (!response.ok) return;
        const data = await response.json();
        cachedHackathons = (Array.isArray(data) ? data : []).filter((h) => ["Publicado", "Ativo"].includes(h.fase)).slice(0, 3);
        setHackathons(cachedHackathons);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  useEffect(() => {
    cachedActive = active;
  }, [active]);

  // o cartão da frente vai para o fundo a cada volta (para quando o mouse está em cima)
  useEffect(() => {
    if (reducedMotion || paused || hackathons.length < 2) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % hackathons.length), FEATURED_INTERVAL);
    return () => clearInterval(timer);
  }, [reducedMotion, paused, hackathons.length]);

  if (hackathons.length === 0) return null;

  // posição de cada cartão na pilha: 0 é o da frente
  const layers = [
    "z-30 translate-y-0 scale-100 opacity-100",
    "z-20 -translate-y-4 scale-[0.95] rotate-[1.5deg] opacity-60",
    "z-10 -translate-y-8 scale-[0.9] -rotate-[1.5deg] opacity-30",
  ];

  return (
    <div className="flex flex-col gap-4" style={{ viewTransitionName: "auth-featured" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-content-secondary">Desafios abertos agora</p>
        {hackathons.length > 1 && (
          <div className="flex gap-1.5">
            {hackathons.map((hackathon, index) => (
              <button
                key={hackathon.hackathonId}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Mostrar ${hackathon.titulo}`}
                aria-pressed={active === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === index ? "w-6 bg-highlight" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      <ul className="relative h-44 pt-8">
        {hackathons.map((hackathon, index) => {
          const position = (index - active + hackathons.length) % hackathons.length;
          const front = position === 0;
          return (
            <li
              key={hackathon.hackathonId}
              aria-hidden={!front}
              className={`absolute inset-x-0 bottom-0 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${layers[position]} ${front ? "" : "pointer-events-none"}`}
            >
              <Link
                to={`/hackathon/${encodeURIComponent(hackathon.hackathonId)}`}
                tabIndex={front ? 0 : -1}
                className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-surface-light px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-colors hover:border-brand-light/60"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand-light">{hackathon.empresa}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${hackathon.fase === "Publicado" ? "bg-success/15 text-success" : "bg-highlight/15 text-highlight"}`}>
                    {hackathon.fase === "Publicado" ? "Inscrições abertas" : "Em andamento"}
                  </span>
                </span>
                <span className="truncate text-lg font-semibold text-content group-hover:text-highlight">{hackathon.titulo}</span>
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 gap-1.5 overflow-hidden">
                    {(hackathon.tecnologias || []).slice(0, 3).map((tech) => (
                      <span key={tech} className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-xs text-content-secondary">
                        {tech}
                      </span>
                    ))}
                  </span>
                  {totalPrize(hackathon) > 0 && (
                    <span className="shrink-0 text-sm font-bold text-highlight">{formatMoney(totalPrize(hackathon))}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const authFieldClass =
  "w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-base text-content outline-none transition-colors duration-200 placeholder:text-content-secondary/70 focus:border-highlight disabled:opacity-70";

export const authButtonClass =
  "w-full rounded-xl bg-highlight px-6 py-3.5 text-base font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";

// Campo das telas de acesso; o de senha ganha o botão de mostrar/ocultar
export function AuthField({ label, type = "text", children, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-content">
      {label}
      <span className="relative">
        <input className={`${authFieldClass} ${isPassword ? "pr-12" : ""}`} type={isPassword && visible ? "text" : type} {...props} />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-content-secondary transition-colors hover:text-content focus-visible:text-highlight"
          >
            <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
          </button>
        )}
      </span>
      {children}
    </label>
  );
}

// Barra que enche até o tamanho mínimo da senha
export function PasswordMeter({ value, min }) {
  const missing = Math.max(min - value.length, 0);
  const progress = Math.min(value.length / min, 1);
  if (!value) return null;

  return (
    <span className="flex items-center gap-3 text-xs font-normal">
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
        <span
          className={`block h-full rounded-full transition-all duration-300 ${missing ? "bg-brand-light" : "bg-success"}`}
          style={{ width: `${progress * 100}%` }}
        />
      </span>
      <span className={missing ? "text-content-secondary" : "text-success"}>
        {missing ? `Faltam ${missing} ${missing === 1 ? "caractere" : "caracteres"}` : (
          <>
            <FontAwesomeIcon icon={faCheck} /> Tamanho ok
          </>
        )}
      </span>
    </span>
  );
}

// Abas do topo do cartão: Entrar | Criar conta e, no cadastro, o tipo de conta.
function AuthSwitch({ mode }) {
  const signingUp = mode !== "login";
  const company = mode === "empresa" || mode === "empresa-detalhes";

  // a aba já marcada não troca de tela (o AuthLink ignora o clique na tela atual)
  const tab = (to, label, current, pillColor) => (
    <AuthLink
      to={to}
      onClick={current ? (e) => e.preventDefault() : undefined}
      aria-current={current ? "page" : undefined}
      className={`relative flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${current ? "text-surface" : "text-content-secondary hover:text-content"}`}
    >
      {current && <span aria-hidden="true" className={`absolute inset-0 rounded-lg ${pillColor}`} />}
      <span className="relative">{label}</span>
    </AuthLink>
  );

  return (
    <div className="flex flex-col gap-3">
      <nav aria-label="Acesso" className="flex gap-1 rounded-xl border border-white/10 bg-surface p-1">
        {tab("/loginUser", "Entrar", !signingUp, "bg-highlight")}
        {tab("/cadastroUser", "Criar conta", signingUp, "bg-highlight")}
      </nav>
      {signingUp && (
        <nav aria-label="Tipo de conta" className="flex items-center gap-3 text-sm">
          <span className="text-content-secondary">Conta de</span>
          <span className="flex flex-1 gap-1 rounded-xl bg-white/[0.04] p-1">
            {tab("/cadastroUser", "Participante", !company, "bg-brand-light")}
            {tab("/cadastroEmpresa", "Empresa", company, "bg-brand-light")}
          </span>
        </nav>
      )}
    </div>
  );
}

const AuthShell = ({ title, lede, asideTitle, asideText, points = [], wide = false, mode, step, children }) => {
  // grava para que lado a troca de tela vai (lido pelo CSS da transição em style.css)
  useLayoutEffect(() => {
    if (mode === undefined) return;
    const current = SCREEN_ORDER[mode];
    const previous = lastScreen;
    document.documentElement.dataset.authDirection = previous !== null && current < previous ? "back" : "forward";
    lastScreen = current;
    // a tela nova já está montada: a transição pode tirar a foto do estado final
    markTransitionReady();
  }, [mode]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-clip bg-[radial-gradient(circle_at_20%_15%,rgba(108,72,197,0.22),transparent_32%),var(--color-surface)]">
      {/* luzes de fundo que flutuam devagar */}
      <span aria-hidden="true" className="damp-float pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-brand/20 blur-3xl [--float-duration:9s]" />
      <span aria-hidden="true" className="damp-float pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-brand-light/10 blur-3xl [--d:-3s] [--float-duration:11s]" />

      <Header />
      <div className={`relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-8 lg:py-14 ${wide ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,36rem)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]"}`}>
        <aside className="hidden max-w-xl flex-col gap-6 lg:flex" style={{ viewTransitionName: "auth-aside" }}>
          <h1 className="text-4xl font-semibold leading-tight text-content xl:text-5xl">{asideTitle}</h1>
          <p className="text-lg leading-relaxed text-content-secondary">{asideText}</p>
          <ul className="flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-content">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-highlight/15 text-[10px] text-highlight">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <OpenHackathons />
          </div>
        </aside>

        <section className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
          {/* o cartão inteiro é uma peça só na troca de tela: o novo entra por cima do antigo, como num baralho */}
          <div
            className="rounded-3xl border border-white/10 bg-surface-light p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8"
            style={{ viewTransitionName: "auth-card" }}
          >
            <div className="flex items-center justify-between gap-4">
              <BackButton />
              {step ? <span className="text-xs font-semibold text-content-secondary">Passo {step} de 2</span> : null}
            </div>
            {mode ? (
              <div className="mt-5">
                <AuthSwitch mode={mode} />
              </div>
            ) : null}
            <h2 className="mt-6 text-3xl font-semibold text-content">{title}</h2>
            {lede ? <p className="mt-2 leading-relaxed text-content-secondary">{lede}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AuthShell;
