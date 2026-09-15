import React from 'react'
import HomeBanner from './HomeBanner'

const Banner = () => {
  return (
    <div className='h-auto w-full overflow-hidden border-b border-white/5'>
      <div className='w-full flex md:hidden'><HomeBanner text1={"Onde desafios reais viram conquistas reais"} text2={"Participe de hackathons criados por empresas, comunidades e especialistas, com rankings, recompensas e reconhecimento profissional. Na DAMP code, você não só aprende — você resolve problemas reais, compete e interage com outros devs e constrói um portfólio que importa."}/></div>
      <div className='hidden min-h-[32rem] w-full items-center justify-center bg-surface-light bg-[url(/src/assets/banner.svg)] bg-cover bg-center bg-no-repeat p-10 md:flex lg:p-16'>
            <div className='flex h-full max-w-3xl flex-col justify-center gap-5 text-lg md:w-3/5 md:items-start lg:text-xl'>
            <img className='w-2/4 md:w-2/4 xl:w-1/4' src="/src/assets/DAMPCode.svg" alt="" />
            <h2 className='max-w-2xl text-3xl leading-tight text-brand-light lg:text-4xl'><b>Onde desafios reais viram conquistas reais</b></h2>
            <p className='max-w-2xl leading-relaxed text-content-secondary'>Participe de hackathons criados por empresas, comunidades e especialistas, com rankings, recompensas e reconhecimento profissional. Na DAMP code, você não só aprende — você resolve problemas reais, compete e interage com outros devs e constrói um portfólio que importa.</p>
        </div>
        <div className='flex h-1/2 items-center justify-center'>
            <a className='rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] hover:-translate-y-1 hover:brightness-110' 
            href="">
                NÃO PERCA OPORTUNIDADES
            </a>
        </div>
      </div>
    </div>
  )
}

export default Banner
