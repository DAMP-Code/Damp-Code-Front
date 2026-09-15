import React from 'react'
import Title from '../Title'

const Levels = () => {
  return (
    <section className='flex h-auto w-full flex-col items-center py-10'>
        <div className='flex w-9/10 max-w-7xl items-center'>
            <Title text1={"Desafios de niveis"} text2={"diferentes"}/>
        </div>
        <div className='hidden w-9/10 max-w-7xl items-center justify-center gap-5 lg:flex'>
           <div className='flex flex-1 items-center justify-center text-center'>
               <h1 className='w-full rounded-2xl border border-brand-light/40 bg-surface-light p-10 text-2xl text-brand-light shadow-[0_14px_35px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:border-highlight/60'><b>Iniciante</b></h1>
           </div>
           <div className='flex flex-1 items-center justify-center text-center'>
               <h1 className='w-full rounded-2xl border border-brand-light/40 bg-surface-light p-10 text-2xl text-brand-light shadow-[0_14px_35px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:border-highlight/60'><b>Intermediário</b></h1>
           </div>
           <div className='flex flex-1 items-center justify-center text-center'>
               <h1 className='w-full rounded-2xl border border-brand-light/40 bg-surface-light p-10 text-2xl text-brand-light shadow-[0_14px_35px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:border-highlight/60'><b>Avançado</b></h1>
           </div>
        </div>
        <div className='flex w-9/10 flex-col items-center justify-center gap-4 lg:hidden'>
            <div href="" className='flex min-h-18 w-full max-w-md items-center justify-center rounded-xl border border-highlight/30 bg-highlight text-center text-xl text-surface shadow-lg'><a href=""><b>Iniciante</b></a></div>
            <div href="" className='flex min-h-18 w-full max-w-md items-center justify-center rounded-xl border border-highlight/30 bg-highlight text-center text-xl text-surface shadow-lg'><a href=""><b>Intermediário</b></a></div>
            <div href="" className='flex min-h-18 w-full max-w-md items-center justify-center rounded-xl border border-highlight/30 bg-highlight text-center text-xl text-surface shadow-lg'><a href=""><b>Avançado</b></a></div>
        </div>
    </section>
  )
}

export default Levels
