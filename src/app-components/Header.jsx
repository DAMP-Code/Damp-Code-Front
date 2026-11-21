import React, { useContext, useState } from "react";
import "../style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "@/app-components/utilities/AuthContext";

const accountButtonClass =
  "rounded-xl bg-highlight px-4 py-2 text-sm font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110";

// links de cada tipo de visita: âncoras da home para quem não entrou, páginas próprias para quem entrou
const visitorLinks = [
  { href: "#explore", label: "Explorar" },
  { href: "#ranking", label: "Ranking" },
  { href: "#empresas", label: "Para empresas" },
  { to: "/loginUser", label: "Entrar" },
];

const linksByRole = {
  empresa: [
    { to: "/", label: "Explorar", end: true },
    { to: "/dashboard/ranking", label: "Ranking" },
    { to: "/dashboard/Empresa", label: "Dashboard" },
  ],
  participante: [
    { to: "/", label: "Explorar", end: true },
    { to: "/dashboard/participante", label: "Meu painel" },
    { to: "/perfil", label: "Perfil" },
  ],
  admin: [
    { to: "/", label: "Explorar", end: true },
    { to: "/admin", label: "Verificações" },
  ],
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = user ? linksByRole[user.role] || [] : visitorLinks;

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function renderLink(link, className) {
    if (link.href) {
      return (
        <a key={link.label} href={link.href} onClick={closeMenu} className={className}>
          {link.label}
        </a>
      );
    }
    return (
      <NavLink
        key={link.label}
        to={link.to}
        end={link.end}
        onClick={closeMenu}
        className={({ isActive }) => `${className} ${isActive ? "text-highlight" : ""}`}
      >
        {link.label}
      </NavLink>
    );
  }

  const desktopLinkClass = "rounded-lg px-3 py-2 hover:bg-white/5 hover:text-highlight";
  const mobileLinkClass = "w-full rounded-lg p-4 text-center text-content hover:text-highlight";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-light/95 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" onClick={closeMenu}>
          <img
            src="/src/assets/DAMPCode.svg"
            className="h-auto w-36 sm:w-44"
            alt="Damp Code"
          />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-content md:flex lg:text-base">
          {links.map((link) => renderLink(link, desktopLinkClass))}
          {!user && (
            <Link to="/escolha" className={`ml-2 shrink-0 ${accountButtonClass}`}>
              Criar conta
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} className="rounded-lg px-3 py-2 hover:text-red-400">
              Sair
            </button>
          )}
        </nav>

        <button
          type="button"
          className="flex items-center justify-center text-highlight md:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="text-2xl" />
        </button>
      </div>

      <div
        className={`absolute left-0 top-full z-10 w-full border-t border-white/10 bg-surface-light/98 px-4 py-3 shadow-2xl backdrop-blur-xl md:hidden ${
          isMenuOpen ? "flex flex-col gap-1" : "hidden"
        }`}
      >
        {links.map((link) => renderLink(link, mobileLinkClass))}
        {!user && (
          <Link to="/escolha" onClick={closeMenu} className={`mx-4 mb-2 text-center ${accountButtonClass}`}>
            Criar conta
          </Link>
        )}
        {user && (
          <button onClick={handleLogout} className="w-full rounded-lg p-4 text-center text-content hover:text-red-400">
            Sair
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
