import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-white/10 bg-surface-light/90">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 md:flex md:items-center md:justify-between">

        {/* TEXTO */}
        <span className="text-sm text-content-secondary text-center md:text-left">
          &copy;{new Date().getFullYear()} <span className="text-content font-medium">Damp Code</span>. Todos os direitos reservados.
        </span>

        {/* LINKS */}
        <ul className="flex flex-wrap justify-center md:justify-end items-center gap-4 mt-4 md:mt-0 text-sm font-medium">
          <li>
            <Link to="/sobre" className="text-content-secondary hover:text-highlight transition">
              Sobre
            </Link>
          </li>
          <li>
            <Link to="/privacidade" className="text-content-secondary hover:text-highlight transition">
              Privacidade
            </Link>
          </li>
          <li>
            <Link to="/termos" className="text-content-secondary hover:text-highlight transition">
              Termos
            </Link>
          </li>
          <li>
            <a href="#" className="text-content-secondary hover:text-highlight transition">
              Contato
            </a>
          </li>
        </ul>

      </div>
    </footer>
  )
}

export default Footer
