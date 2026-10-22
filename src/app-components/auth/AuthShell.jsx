import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";

export const authFieldClass =
  "w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-base text-content outline-none transition-colors duration-200 placeholder:text-content-secondary/70 focus:border-highlight disabled:opacity-70";

export const authButtonClass =
  "w-full rounded-xl bg-highlight px-6 py-3.5 text-base font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";

export function AuthField({ label, ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-content">
      {label}
      <input className={authFieldClass} {...props} />
    </label>
  );
}

const AuthShell = ({ title, lede, asideTitle, asideText, points = [], wide = false, children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_20%_15%,rgba(108,72,197,0.22),transparent_32%),var(--color-surface)]">
      <div className={`mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-8 lg:py-14 ${wide ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,36rem)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]"}`}>
        <aside className="hidden max-w-xl flex-col gap-6 lg:flex">
          <img src="/src/assets/DAMPCode.svg" alt="Damp Code" className="w-40" />
          <h1 className="text-4xl font-semibold leading-tight text-content">{asideTitle}</h1>
          <p className="text-lg leading-relaxed text-content-secondary">{asideText}</p>
          <ul className="flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-content">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-highlight" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </aside>

        <section className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
          <img src="/src/assets/DAMPCode.svg" alt="Damp Code" className="mb-6 h-8 w-auto lg:hidden" />
          <div className="rounded-3xl border border-white/10 bg-surface-light p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
            <BackButton />
            <h2 className="mt-5 text-3xl font-semibold text-content">{title}</h2>
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
