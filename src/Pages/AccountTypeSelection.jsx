import BackButton from '@/app-components/BackButton'
import React from 'react'
import { Link } from 'react-router-dom'

const choiceCardClass =
  'flex w-full flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-surface-light p-8 text-content shadow-[0_20px_55px_rgba(0,0,0,0.32)] transition-colors duration-200 hover:border-brand-light md:w-[420px] lg:w-[460px]'

const choiceLinkClass =
  'flex h-14 w-full items-center justify-center rounded-xl bg-highlight text-xl font-bold text-surface transition-all duration-200 hover:brightness-110 hover:shadow-[0_12px_30px_rgba(255,234,0,0.18)] lg:text-2xl'

const AccountTypeSelection = () => {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(108,72,197,0.24),transparent_35%),var(--color-surface)] px-5 py-12'>
      <div className='flex w-full max-w-6xl flex-col items-center gap-8'>
        <div className='flex max-w-2xl flex-col items-center gap-3 text-center'>
          <h1 className='text-3xl font-semibold text-content lg:text-4xl'>Escolha como entrar</h1>
          <p className='text-content-secondary'>Participante compete nos desafios. Empresa publica o hackathon.</p>
        </div>

        <div className='flex w-full flex-col items-stretch justify-center gap-6 md:flex-row lg:gap-10'>
          <div className={choiceCardClass}>
            <p className='text-center text-lg font-semibold leading-relaxed lg:text-xl'>
              Participe de hackathons e evolua em sua carreira de tecnologia, concorra a prêmios e oportunidades.
            </p>
            <Link to={'/cadastroUser'} className={choiceLinkClass}>
              Participante
            </Link>
          </div>

          <div className={choiceCardClass}>
            <p className='text-center text-lg font-semibold leading-relaxed lg:text-xl'>
              Crie seus próprios hackathons, firme parcerias e encontre as pessoas certas para sua empresa.
            </p>
            <Link to={'/cadastroEmpresa'} className={choiceLinkClass}>
              Empresa
            </Link>
          </div>
        </div>

        <BackButton />
      </div>
    </div>
  )
}

export default AccountTypeSelection
