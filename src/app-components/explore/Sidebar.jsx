import React from 'react'

const Sidebar = () => {
  return (
    <section className='sticky top-24 m-5 hidden h-fit w-3/12 min-w-56 max-w-72 flex-col gap-5 rounded-2xl border border-white/10 bg-surface-light/90 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:flex'>
        <h1 className='text-2xl text-highlight'><b>Hackatons</b></h1>
        <nav className='flex flex-col gap-1 text-content-secondary [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2 [&_a:hover]:bg-white/5 [&_a:hover]:text-content'>
            <a href="">Front-End</a>
            <a href="">Back-End</a>
            <a href="">Banco de dados</a>
            <a href="">Desenvolvimento API</a>
            <a href="">Logica</a>
        </nav>
        <h1 className='text-2xl text-highlight'><b>Plano</b></h1>
        <nav className='flex flex-col gap-1 text-content-secondary [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2 [&_a:hover]:bg-white/5 [&_a:hover]:text-content'>
            <a href="">Plano Básico</a>
            <a href="">Plano Regular</a>
            <a href="">Plano Avançado</a>
        </nav>
        <h1 className='text-2xl text-highlight'><b>Empresa</b></h1>
        <nav className='flex flex-col gap-3'>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="opcao1" className="w-4 h-4" />
                <label htmlFor="opcao1" className="text-content">
                    Engenharia de Dados
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="opcao1" className="w-4 h-4" />
                <label htmlFor="opcao1" className="text-content">
                    Python
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="opcao1" className="w-4 h-4" />
                <label htmlFor="opcao1" className="text-content">
                    JavaScript
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="opcao1" className="w-4 h-4" />
                <label htmlFor="opcao1" className="text-content">
                    .Net C#
                </label>
            </div>
        </nav>
        <button className='mt-2 w-full rounded-xl bg-highlight px-4 py-3 text-sm font-extrabold text-surface shadow-[0_10px_25px_rgba(255,234,0,0.12)] hover:-translate-y-0.5 hover:brightness-110'><b>CRIE SEU DESAFIO</b></button>
    </section>
)
}

export default Sidebar
