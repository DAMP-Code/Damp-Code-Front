import React from 'react'

const HomeBanner = ({ text1, text2, proof, actionHref = "/escolha", actionLabel = "Comece agora" }) => {
  return (
    <section className='flex w-full flex-col items-center gap-5 px-5 py-10 md:flex-row md:items-end md:justify-between'>
        <div className='flex h-full flex-col items-center justify-center text-lg md:w-3/5 md:items-start lg:text-xl'>
            <h2 className='text-2xl font-semibold leading-tight text-content'>{text1}</h2>
            <p className='leading-relaxed text-content-secondary'>{text2}</p>
            {proof ? <p className='mt-2 text-sm text-brand-light'>{proof}</p> : null}
        </div>
        <div className='flex items-center justify-center py-2'>
            <a className='rounded-xl bg-highlight px-5 py-3 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110'
            href={actionHref}>
                {actionLabel}
            </a>
        </div>
    </section>
  )
}

export default HomeBanner