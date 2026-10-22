import React from 'react'

const HomeBanner = ({text1, text2 }) => {
  return (
    <section className='w-full md:flex items-end justify-center h-full xl:h-1/4 gap-y-5 md:gap-x-5 py-4'>
        <div className='md:w-3/5 h-full flex flex-col items-center md:items-start justify-center text-lg lg:text-xl px-5'>
            <img className='w-2/4 md:w-2/4 xl:w-1/4' src="/src/assets/DAMPCode.svg" alt="Damp Code" />
            <h2 className='text-brand-light text-2xl font-semibold leading-tight'>{text1}</h2>
            <p className='leading-relaxed text-content-secondary'>{text2}</p>
        </div>
        <div className='1/3 h-1/2 flex items-center justify-center py-5'>
            <a className='rounded-xl bg-highlight px-5 py-3 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110' 
            href="/escolha">
                Comece agora
            </a>
        </div>
    </section>
  )
}

export default HomeBanner