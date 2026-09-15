import React from 'react'

const HomeBanner = ({text1, text2 }) => {
  return (
    <section className='w-full md:flex items-end justify-center h-full xl:h-1/4 gap-y-5 md:gap-x-5 py-4'>
        <div className='md:w-3/5 h-full flex flex-col items-center md:items-start justify-center text-lg lg:text-xl px-5'>
            <img className='w-2/4 md:w-2/4 xl:w-1/4' src="/src/assets/DAMPCode.svg" alt="" />
            <h2 className='text-brand text-2xl'><b>{text1}</b></h2>
            <p className='text-content'>{text2}</p>
        </div>
        <div className='1/3 h-1/2 flex items-center justify-center py-5'>
            <a className='bg-highlight text-surface text-lg font-bold py-3 px-5 rounded-full' 
            href="">
                NÃO PERCA OPORTUNIDADES
            </a>
        </div>
    </section>
  )
}

export default HomeBanner