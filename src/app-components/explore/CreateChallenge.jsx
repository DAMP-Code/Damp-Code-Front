import React from 'react'
import Title from '../Title'
import { Link } from 'react-router-dom'

const CreateChallenge = () => {
  return (
    <section className='flex h-full w-full flex-col items-center py-10 md:h-2/4'>
        <div className='w-9/10 max-w-7xl'>
             <Title text1={"Crie seu próprio"} text2={"desafio!"}/>
        </div>
        <div className='relative flex min-h-64 w-9/10 max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-brand-light/20 bg-surface-light bg-cover bg-center bg-no-repeat p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.24)] lg:bg-[url(/src/assets/background.png)] lg:p-10'>
          <div className='absolute inset-0 bg-surface/45'></div>
          <p className='relative hidden max-w-4xl text-lg font-bold leading-relaxed text-content lg:flex'>Crie seus próprios desafios para outros membros da comunidade, ou se junte como empresa parceira e tenha acesso a funcionalidades limitadas e encontre os melhores talentos!</p>
          <p className='relative flex max-w-md text-lg font-bold leading-relaxed text-content lg:hidden'>Crie seus próprios desafios para outros membros da comunidade</p>
            <div className='relative mt-6 flex items-center justify-center rounded-xl bg-highlight shadow-[0_12px_30px_rgba(255,234,0,0.18)] hover:-translate-y-1 hover:brightness-110'>
              <Link to={"/cadastroHackaton"} className='px-8 py-4 text-lg text-surface sm:text-xl'><b>CRIE AGORA</b></Link>
            </div>
        </div>
    </section>
  )
}

export default CreateChallenge
