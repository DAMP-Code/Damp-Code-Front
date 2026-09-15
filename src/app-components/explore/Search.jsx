import React from "react"

const Search = () => {
  return (
    <form className="mx-auto my-7 w-[calc(100%-2rem)] max-w-2xl">
      <label htmlFor="search" className="sr-only">
        Buscar hackathons
      </label>

      <div className="relative">
        {/* Ícone */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-content-secondary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="search"
          id="search"
          placeholder="Buscar hackathons..."
          className="
            w-full 
            min-h-13 p-3 pl-11 pr-28 
            bg-surface-light/90 
            border border-white/10 
            text-content 
            rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.16)]
            focus:outline-none 
            focus:ring-2 
            focus:ring-brand 
            placeholder:text-content-secondary
          "
        />

        {/* Botão */}
        <button
          type="submit"
          className="
            absolute right-1.5 bottom-1.5 
            bg-highlight 
            text-black 
            font-medium 
            px-4 py-1.5 
            rounded-md 
            hover:brightness-110 
            transition
          "
        >
          Buscar
        </button>
      </div>
    </form>
  )
}

export default Search
