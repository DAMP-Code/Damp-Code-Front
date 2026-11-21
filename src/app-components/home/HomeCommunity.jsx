import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../Title'

const HomeCommunity = () => {
  return (
    <section className='flex w-full flex-col items-center justify-center px-5 py-16 lg:px-8 lg:py-20'>
        <div className='w-full max-w-7xl text-start'>
            <Title text1={"Comunidade"} text2={"ativa"} />
        </div>
        <div className='grid w-full max-w-7xl grid-cols-1 gap-5 text-left text-content md:grid-cols-2'>
            <div className='flex min-h-44 flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl font-semibold'>Comunidades por tecnologia</h1>
                <p className="leading-relaxed text-content-secondary">Comunidades divididas por tecnologias para interagir, tirar duvidas e fazer networking, também são divididas por hackathons.</p>
            </div>
            <div className='flex min-h-44 flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl font-semibold'>Lives exclusivas</h1>
                <p className="leading-relaxed text-content-secondary">Lives exclusivas pro nível, comunidade ou hackathon, trazendo muito conteúdo, conversa e networking.</p>
            </div>
            <div className='flex min-h-44 flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl font-semibold'>Tutoriais integrados</h1>
                <p className="leading-relaxed text-content-secondary">Tutorias integrados juntos de pontos específicos dos hackathons, para guiar os candidatos a trazerem exatamento o que a empresa pede.</p>
            </div>
            <div className='flex min-h-44 flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl font-semibold'>Movimentação de pessoas</h1>
                <p className="leading-relaxed text-content-secondary">1200+ Desenvolvedores, 35 Hackathons ativos, mais de R$ 85.000 em prêmios e totais 18 Empresas parceiras.</p>
            </div>
        </div>
        {/* chamada final */}
        <div className='mt-20 flex w-full max-w-4xl flex-col items-center gap-6 text-center'>
            <h2 className='text-4xl font-bold leading-tight text-content sm:text-5xl'>
                O próximo desafio já está aberto.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-content-secondary">Crie sua conta, escolha um Hackathon e entregue seu código.</p>
            <div className='flex flex-wrap justify-center gap-3'>
                <Link to='/escolha' className='rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition hover:-translate-y-0.5 hover:brightness-110'>
                    Criar conta
                </Link>
                <Link to='/explore' className='rounded-xl border border-white/15 px-7 py-4 text-lg font-semibold text-content transition hover:border-white/30 hover:bg-white/5'>
                    Ver desafios
                </Link>
            </div>
        </div>
    </section>
  )
}

export default HomeCommunity
