import React, { useContext } from 'react'
import Title from '../Title'
import { Link } from 'react-router-dom'
import { AuthContext } from '../utilities/AuthContext'
import { createChallengeAction } from '../utilities/hackathonFilters'

const CreateChallenge = () => {
  const { user } = useContext(AuthContext)
  // só empresa (ou visitante, que vai para o cadastro de empresa) vê o convite para criar desafio
  const action = createChallengeAction(user)
  if (!action) return null

  return (
    <section className='flex h-full w-full flex-col items-center py-10 md:h-2/4'>
        <div className='w-9/10 max-w-7xl'>
             <Title text1={"Crie seu próprio"} text2={"desafio!"}/>
        </div>
        <div className='flex min-h-64 w-9/10 max-w-6xl flex-col items-center justify-center gap-6 rounded-3xl border border-white/10 bg-surface-light p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.24)] lg:p-10'>
          <p className='max-w-3xl text-lg font-medium leading-relaxed text-content-secondary'>
            Publique um desafio para a comunidade, ou entre como empresa parceira e encontre quem resolve o problema.
          </p>
          <Link
            to={action.to}
            className='rounded-xl bg-highlight px-8 py-4 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:text-xl'
          >
            {action.label}
          </Link>
        </div>
    </section>
  )
}

export default CreateChallenge
