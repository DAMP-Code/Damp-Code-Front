import React from 'react'
import HomeBanner from './HomeBanner'

const Banner = () => {
  return (
    <div className='h-auto w-full overflow-hidden border-b border-white/5'>
      <div className='w-full md:hidden'>
        <HomeBanner
          text1="Onde desafios reais viram conquistas reais"
          text2="Participe de hackathons de empresas e comunidades, com ranking e reconhecimento."
          proof="Prêmio, prazo e empresa aparecem no card antes de você entrar."
        />
      </div>
      <div className='mx-auto hidden min-h-[28rem] w-full max-w-7xl items-center gap-10 bg-surface px-5 py-16 md:flex lg:px-8'>
        <div className='flex max-w-2xl flex-col justify-center gap-5'>
          <h2 className='text-3xl font-semibold leading-tight text-content lg:text-5xl'>
            Onde desafios reais viram conquistas reais
          </h2>
          <p className='max-w-xl leading-relaxed text-content-secondary'>
            Participe de hackathons de empresas e comunidades, com ranking e reconhecimento.
          </p>
          <p className='text-sm text-brand-light'>
            Prêmio, prazo e empresa aparecem no card antes de você entrar.
          </p>
          <a
            className='w-fit rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110'
            href="/escolha"
          >
            Comece agora
          </a>
        </div>
      </div>
    </div>
  )
}

export default Banner
