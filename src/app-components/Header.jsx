import React, { useContext, useState } from "react";
import "../style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/app-components/utilities/AuthContext";

const Header = () => {
  // usestate (é um estado, ou aberto ou false)
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 flex min-h-20 w-full items-center justify-center border-b border-white/10 bg-surface-light/95 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="flex w-11/12 max-w-7xl items-center justify-between py-3 lg:w-10/12">
        <img
          src="/src/assets/DAMPCode.svg"
          className="h-auto w-36 sm:w-44 md:max-w-3/12"
          alt="damp-code-logo"
        />
        {/* Modo large -> extra large */}
        <div className="hidden lg:flex w-4/6 items-center xl:w-4/7">
          <nav className="flex w-full items-center justify-between text-base font-medium text-content xl:text-lg [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2 [&_a:hover]:bg-white/5 [&_a:hover]:text-highlight">
            {user ? (
              <Link to="/">Explore</Link>
            ) : (
              <a href="#explore">Explore</a>
            )}
            {user ? (
              <Link to="/dashboard/ranking" className="">
                Ranking
              </Link>
            ) : (
              <a href="#ranking">Ranking</a>
            )}
            {!user && <a href="#empresas">Para Empresas</a>}
            {!user && <Link to={"/loginUser"}>Entrar</Link>}
            {!user && <Link to={"/escolha"}>Criar Conta</Link>}
            {user && <Link to={"/dashboard/Empresa"}>DashBoard</Link>}
            {user && (
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition"
              >
                Sair
              </button>
            )}
          </nav>
          <div className="flex h-8 items-center gap-x-3 border-l border-white/10 pl-5">
            <img className="h-6 w-6 rounded-full object-cover opacity-90" src="/src/assets/portuguese.svg" alt="" />
            <img className="h-6 w-6 rounded-full object-cover opacity-70 hover:opacity-100" src="/src/assets/english.svg" alt="" />
            <img className="h-6 w-6 rounded-full object-cover opacity-70 hover:opacity-100" src="/src/assets/spanish.svg" alt="" />
          </div>
        </div>

        {/* Modo mobile -> medium */}
        <div className="hidden md:flex lg:hidden">
          <nav className="w-5/6 text-lg text-content flex items-center justify-center gap-x-3">
            {user ? (
              <Link to="/" className="hover:text-brand-hover">
                Explore
              </Link>
            ) : (
              <a className="text-content hover:text-brand-hover" href="#explore">
                Explorar
              </a>
            )}

            {user ? (
              <Link
                to="/dashboard/ranking"
                className="hover:text-brand-hover"
              >
                Ranking
              </Link>
            ) : (
              <a href="#ranking" className="hover:text-brand-hover">
                Ranking
              </a>
            )}
            {!user && (
              <a className="hover:text-brand-hover" href="#empresas">
                Para Empresas
              </a>
            )}

            {/* verifica se usuario está logado */}
            {!user && (
              <Link className="hover:text-brand-hover" to={"/loginUser"}>
                Entrar
              </Link>
            )}
            {!user && (
              <Link className="hover:text-brand-hover" to={"/escolha"}>
                Criar Conta
              </Link>
            )}
          </nav>
          <div className="flex gap-x-5 w-1/4 items-center justify-center">
            <img className="h-3/4" src="/src/assets/portuguese.svg" alt="" />
            <img className="h-3/4" src="/src/assets/english.svg" alt="" />
            <img className="h-3/4" src="/src/assets/spanish.svg" alt="" />
          </div>
        </div>
      </div>

      <div className="flex md:hidden items-center justify-center">
        <FontAwesomeIcon
          icon={faBars}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-highlight text-2xl"
        />
        {/* {``} para estilizar e usar lógica simultâneamente */}
      </div>
      <div
        className={`absolute left-0 z-10 top-full md:hidden w-full border-t border-white/10 bg-surface-light/98 px-4 py-3 shadow-2xl backdrop-blur-xl flex flex-col
        items-center justify-center gap-1 text-lg font-semibold transform transition-transform
        ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
      >
        {user ? (
          <Link
            to="/"
            className="w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer"
          >
            Explore
          </Link>
        ) : (
          <a
            href="#explore"
            className="w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer"
          >
            {" "}
            Explorar{" "}
          </a>
        )}

        {user ? (
          <Link to="/dashboard/ranking" className="hover:text-brand-hover">
            Ranking
          </Link>
        ) : (
          <a
            href="#ranking"
            className="w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer"
          >
            {" "}
            Ranking{" "}
          </a>
        )}

        {!user && (
          <a
            href="#empresas"
            className="w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer"
          >
            {" "}
            Para Empresas{" "}
          </a>
        )}

        {!user && (
          <Link
            to={"/loginUser"}
            className={`w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer`}
          >
            Entrar
          </Link>
        )}
        {!user && (
          <Link
            to={"/escolha"}
            className={`w-full p-4 text-center text-content
           hover:text-brand-hover transition-all cursor-pointer`}
          >
            {" "}
            Criar Conta{" "}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
