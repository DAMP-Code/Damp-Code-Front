import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";

// D-A-M-P: uma letra do nome da plataforma para cada pessoa da equipe.
// Textos provisórios (lorem ipsum) até a equipe mandar as informações de verdade.
const team = [
  {
    letter: "D",
    name: "Diego",
    role: "Lorem ipsum dolor",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    focus: ["Lorem", "Ipsum", "Dolor"],
    github: "#",
    linkedin: "#",
  },
  {
    letter: "A",
    name: "Altair",
    role: "Lorem ipsum dolor",
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    focus: ["Lorem", "Ipsum", "Dolor"],
    github: "#",
    linkedin: "#",
  },
  {
    letter: "M",
    name: "Miguel",
    role: "Lorem ipsum dolor",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    focus: ["Lorem", "Ipsum", "Dolor"],
    github: "#",
    linkedin: "#",
  },
  {
    letter: "P",
    name: "Pietro",
    role: "Lorem ipsum dolor",
    bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    focus: ["Lorem", "Ipsum", "Dolor"],
    github: "#",
    linkedin: "#",
  },
];

// atraso da entrada de cada letra (uma depois da outra)
const letterDelay = ["delay-0", "delay-150", "delay-300", "delay-500"];

const About = () => {
  return (
    <div className="min-h-screen bg-surface text-content">
      <Header />

      <main>
        {/* TOPO: as quatro letras do nome */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(108,72,197,0.35),transparent_60%)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 lg:py-24">
            <p className="text-sm font-semibold text-brand-light">Sobre nós</p>

            <ol aria-label="Equipe Damp Code" className="grid w-full grid-cols-4 gap-2 sm:gap-6">
              {team.map((person, index) => (
                <li key={person.letter}>
                  <a
                    href={`#${person.name.toLowerCase()}`}
                    className="group flex flex-col items-center gap-2 rounded-2xl py-2 focus-visible:outline-offset-4"
                  >
                    {/* fora: sobe no hover; dentro: entrada em sequência ao abrir a página */}
                    <span aria-hidden="true" className="block transition-transform duration-300 group-hover:-translate-y-2 motion-reduce:transition-none">
                      <span
                        className={`block text-[22vw] font-black leading-none tracking-tighter text-highlight drop-shadow-[0_10px_40px_rgba(255,234,0,0.18)] sm:text-8xl lg:text-[10rem] animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-700 ${letterDelay[index]} motion-reduce:animate-none`}
                      >
                        {person.letter}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-brand-light transition-colors group-hover:text-content sm:text-lg">
                      {person.name}
                    </span>
                  </a>
                </li>
              ))}
            </ol>

            <div className="flex max-w-2xl flex-col gap-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Quatro pessoas, uma letra cada.
              </h1>
              <p className="text-lg leading-relaxed text-content-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus,
                posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.
              </p>
            </div>
          </div>
        </section>

        {/* EQUIPE */}
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 className="text-2xl font-bold sm:text-3xl">Quem faz o Damp Code</h2>
            <p className="text-content-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <li
                key={person.name}
                id={person.name.toLowerCase()}
                className="group relative flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] transition-colors target:border-highlight/60 hover:border-brand-light/40"
              >
                {/* letra gigante de fundo, cortada pelo cartão */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-10 select-none text-[11rem] font-black leading-none text-white/[0.04] transition-colors group-hover:text-highlight/[0.08]"
                >
                  {person.letter}
                </span>

                <span className="relative flex size-14 items-center justify-center rounded-2xl bg-highlight text-2xl font-black text-surface">
                  {person.letter}
                </span>

                <div className="relative mt-5 flex flex-col gap-1">
                  <h3 className="text-xl font-bold">{person.name}</h3>
                  <p className="text-sm font-medium text-brand-light">{person.role}</p>
                </div>

                <p className="relative mt-4 flex-1 leading-relaxed text-content-secondary">{person.bio}</p>

                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {person.focus.map((item) => (
                    <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-content">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-6 flex gap-2 border-t border-white/10 pt-5">
                  <a
                    href={person.github}
                    aria-label={`GitHub de ${person.name}`}
                    className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-lg text-content-secondary transition hover:bg-white/10 hover:text-content"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href={person.linkedin}
                    aria-label={`LinkedIn de ${person.name}`}
                    className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-lg text-content-secondary transition hover:bg-white/10 hover:text-content"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CHAMADA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-[linear-gradient(120deg,rgba(108,72,197,0.35),rgba(23,10,54,0.2))] p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="text-2xl font-bold">Lorem ipsum dolor sit amet</h2>
              <p className="text-content-secondary">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/escolha"
                className="rounded-xl bg-highlight px-6 py-3 font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Criar conta
              </Link>
              <Link to="/explore" className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5">
                Ver Hackathons
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
