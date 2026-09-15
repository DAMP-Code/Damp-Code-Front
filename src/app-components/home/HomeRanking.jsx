import React from 'react'
import Title from '../Title'

const HomeRanking = () => {
  return (
    <section className='flex h-auto w-full flex-col items-center bg-surface-light/25 py-12'>
        <div className='flex w-9/10 max-w-7xl items-center justify-start'>
            <Title text1={"RANKING AO"} text2={"VIVO"} />
        </div>
        <div className='grid w-9/10 max-w-7xl grid-cols-1 gap-5 md:grid-cols-3'>
            <div className='flex min-h-60 w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface-light p-6 text-center text-content shadow-xl xl:min-h-72'>
                <h1 className='text-xl'><b>TOP 5 GLOBAL</b></h1>
                <p className='px-3'>Este é o top 5 de todas as competições, os mais dedicados.</p>
                <h2 className='px-3 flex md:hidden xl:flex'>Os desenvolvedores mais consistentes e ativos da plataforma no momento.</h2>
            </div>
            <div className='flex min-h-60 w-full flex-col items-center justify-center rounded-2xl border border-highlight/25 bg-[linear-gradient(145deg,var(--color-surface-light),rgba(108,72,197,0.25))] p-6 text-center text-content shadow-xl xl:min-h-72'>
                <h1 className='text-xl'><b>TOP 5 FOODLOVERS</b></h1>
                <p className='px-3'>Este é o top 5 do nosso hackaton em parceria com a ifood.</p>
                <h2 className='px-3 flex md:hidden xl:flex'>Se dedique nos hackatons em parceria com ifood e ganhe oportunidades.</h2>
            </div>
            <div className='flex min-h-60 w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface-light p-6 text-center text-content shadow-xl xl:min-h-72'>
                <h1 className='text-xl'><b>TOP 5 NATIVES</b></h1>
                <p className='px-3'>Este é o top 5 da competição da ferramenta react Native.</p>
                <h2 className='px-3 flex md:hidden xl:flex'>Se torne um talento nativo e melhores suas habilidades no framework.</h2>
            </div>
        </div>
    </section>
  )
}

export default HomeRanking
