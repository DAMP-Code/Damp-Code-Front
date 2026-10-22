import React from 'react'
import Title from '../Title'

const HomeCommunity = () => {
  return (
    <section className='flex w-full flex-col items-center justify-center py-12'>
        <div className='w-9/10 max-w-7xl text-start'>
            <Title text1={"Comunidade"} text2={"ativa"} />
        </div>
        <div className='grid w-9/10 max-w-6xl grid-cols-1 gap-5 text-center text-content md:grid-cols-2'>
            <div className='flex min-h-52 flex-col justify-center rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl bg-surface-light '>Comunidades por tecnologia</h1>
                <p className="leading-relaxed text-content-secondary">Comunidades divididas por tecnologias para interagir, tirar duvidas e fazer networking, também são divididas por hackathons.</p>
            </div>
            <div className='flex min-h-52 flex-col justify-center rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl '>Lives exclusivas</h1>
                <p className="leading-relaxed text-content-secondary">Lives exclusivas pro nível, comunidade ou hackathon, trazendo muito conteúdo, conversa e networking.</p>
            </div>
            <div className='flex min-h-52 flex-col justify-center rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl '>Tutoriais integrados</h1>
                <p className="leading-relaxed text-content-secondary">Tutorias integrados juntos de pontos específicos dos hackathons, para guiar os candidatos a trazerem exatamento o que a empresa pede.</p>
            </div>
            <div className='flex min-h-52 flex-col justify-center rounded-2xl border border-white/10 bg-surface-light p-7 shadow-lg hover:-translate-y-1 hover:border-brand-light/40'>
                <h1 className='text-xl '>Movimentação de pessoas</h1>
                <p className="leading-relaxed text-content-secondary">1200+ Desenvolvedores, 35 Hackathons ativos, mais de R$ 85.000 em prêmios e totais 18 Empresas parceiras.</p>
            </div>
        </div>
        <div className='flex w-9/10 flex-col items-center justify-center py-10 text-center'>
            <Title text1={"Participe"} text2={"agora"} />
            <p className="text-lg leading-relaxed text-content-secondary">Os próximos desafios já estão abertos.</p>
        </div>
    </section>
  )
}

export default HomeCommunity
