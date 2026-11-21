import React, { useContext, useEffect, useRef, useState } from "react";
import "../style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import Avatar from "@/app-components/Avatar";

const accountButtonClass =
  "rounded-xl bg-highlight px-4 py-2 text-sm font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110";

// links de cada tipo de visita: âncoras da home para quem não entrou, páginas próprias para quem entrou
const visitorLinks = [
  { href: "/#explore", label: "Explorar" },
  { href: "/#ranking", label: "Ranking" },
  { href: "/#empresas", label: "Para empresas" },
  { to: "/sobre", label: "Sobre" },
  { to: "/loginUser", label: "Entrar" },
];

const linksByRole = {
  empresa: [
    { to: "/", label: "Explorar", end: true },
    { to: "/dashboard/ranking", label: "Ranking" },
    { to: "/dashboard/Empresa", label: "Dashboard" },
    { to: "/sobre", label: "Sobre" },
  ],
  participante: [
    { to: "/", label: "Explorar", end: true },
    { to: "/dashboard/participante", label: "Meu painel" },
    { to: "/sobre", label: "Sobre" },
  ],
  admin: [
    { to: "/", label: "Explorar", end: true },
    { to: "/admin", label: "Verificações" },
    { to: "/sobre", label: "Sobre" },
  ],
};

// itens do menu da conta (o do avatar)
const accountLinksByRole = {
  participante: [
    { to: "/perfil", label: "Meu perfil" },
    { to: "/conta", label: "Configurações da conta" },
  ],
  empresa: [{ to: "/conta", label: "Configurações da conta" }],
  admin: [{ to: "/conta", label: "Configurações da conta" }],
};

const roleLabel = { participante: "Participante", empresa: "Empresa", admin: "Admin" };

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const links = user ? linksByRole[user.role] || [] : visitorLinks;
  const accountLinks = user ? accountLinksByRole[user.role] || [] : [];

  // fecha o menu da conta com clique fora ou Esc
  useEffect(() => {
    if (!isAccountOpen) return;
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setIsAccountOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setIsAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isAccountOpen]);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    setIsAccountOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
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
  const accountItemClass = "block w-full rounded-lg px-3 py-2.5 text-left text-sm text-content hover:bg-white/5 hover:text-highlight";

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

          {/* MENU DA CONTA */}
          {user && (
            <div ref={accountRef} className="relative ml-2">
              <button
                type="button"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
                aria-label={`Conta de ${user.name}`}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-white/5"
              >
                <Avatar name={user.name} color={user.avatarColor} />
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs text-content-secondary transition-transform ${isAccountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAccountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 bg-surface-light p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 px-3 pb-3 pt-2">
                    <Avatar name={user.name} color={user.avatarColor} size="md" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-content">{user.name}</p>
                      <p className="truncate text-sm text-content-secondary">{user.email}</p>
                      <p className="text-xs font-medium text-brand-light">{roleLabel[user.role]}</p>
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    {accountLinks.map((link) => (
                      <Link key={link.to} role="menuitem" to={link.to} onClick={closeMenu} className={accountItemClass}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <button role="menuitem" onClick={handleLogout} className={`${accountItemClass} border-t border-white/10 hover:text-red-400`}>
                    Sair
                  </button>
                </div>
              )}
            </div>
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
        className={`absolute left-0 top-full z-10 w-full border-t border-white/10 bg-surface-light px-4 py-3 shadow-2xl md:hidden ${
          isMenuOpen ? "flex flex-col gap-1" : "hidden"
        }`}
      >
        {/* conta no topo do menu do celular */}
        {user && (
          <div className="mb-1 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <Avatar name={user.name} color={user.avatarColor} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-content">{user.name}</p>
              <p className="truncate text-sm text-content-secondary">{user.email}</p>
            </div>
          </div>
        )}
        {links.map((link) => renderLink(link, mobileLinkClass))}
        {accountLinks.map((link) => renderLink(link, mobileLinkClass))}
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
