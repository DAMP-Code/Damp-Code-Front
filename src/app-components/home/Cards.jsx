import React from 'react'
import Title from '../Title'

const Cards = () => {
  return (
    <section className='flex h-auto w-full flex-col items-center justify-center py-12 text-content md:flex lg:py-16'>
        <div className='w-9/10 max-w-7xl items-start justify-center'>
            <Title text1={"COMEÇE A"} text2={"CRESCER"} />
        </div>
        <div className='grid w-9/10 max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='flex min-h-64 flex-col justify-center rounded-2xl border border-white/10 bg-[url(/src/assets/cards-start.svg)] bg-cover bg-center bg-no-repeat p-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/50 xl:min-h-72'>
            <h1 className='text-xl'><b>COMEÇE</b></h1>
            <h2 className='p-3'>Escolha um hackathon, entre na 
                competição e desenvolva sua solução
            </h2>
            <h2 className='px-3 flex md:hidden xl:flex'>Participe de desafios reais, colabore com outros devs e transforme aprendizado em prática.</h2>
        </div>
        <div className='flex min-h-64 flex-col justify-center rounded-2xl border border-white/10 bg-[url(/src/assets/cards-ranking.svg)] bg-cover bg-center bg-no-repeat p-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/50 xl:min-h-72'>
            <h1 className='text-xl'><b>Suba no Ranking</b></h1>
            <h2 className='p-3'>Ganhe pontos, níveis e reconhecimento público</h2>
            <h2 className='px-3 flex md:hidden xl:flex'>Acompanhe sua evolução, compare seu desempenho e conquiste destaque na comunidade.</h2>
        </div>
        <div className='flex min-h-64 flex-col justify-center rounded-2xl border border-white/10 bg-[url(/src/assets/cards-prizes.svg)] bg-cover bg-center bg-no-repeat p-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/50 xl:min-h-72'>
            <h1 className='text-xl'><b>Conquiste Prêmios</b></h1>
            <h2 className='p-3'>Dinheiro, oportunidades, contratação e visibilidade.</h2>
            <h2 className='px-3 flex md:hidden xl:flex'>Se destaque nas competições e tenha acesso a recompensas, visibilidade e oportunidades reais.</h2>
        </div>
        <div className='flex min-h-64 flex-col justify-center rounded-2xl border border-white/10 bg-[url(/src/assets/cards-reputation.svg)] bg-cover bg-center bg-no-repeat p-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/50 xl:min-h-72'>
            <h1 className='text-xl'><b>Construa sua Reputação</b></h1>
            <h2 className='p-3'>Seu perfil vira um portfólio competitivo.</h2>
            <h2 className='px-3 flex md:hidden xl:flex'>Crie um histórico sólido com seus projetos e aumente suas chances no mercado.</h2>
        </div>
        </div>
    </section>
  )
}

export default Cards
