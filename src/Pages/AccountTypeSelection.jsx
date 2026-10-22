import BackButton from '@/app-components/BackButton'
import Footer from '@/app-components/Footer'
import React from 'react'
import { Link } from 'react-router-dom'

const choices = [
  {
    to: '/cadastroUser',
    eyebrow: 'Para participar',
    title: 'Participante',
    text: 'Entre nos hackathons, acompanhe prazo e prêmio, e monte um portfólio com o que você resolver.',
    points: ['Desafios de empresas e comunidades', 'Ranking e reconhecimento', 'Uma conta para todos os hackathons'],
    action: 'Criar conta',
  },
  {
    to: '/cadastroEmpresa',
    eyebrow: 'Para publicar',
    title: 'Empresa',
    text: 'Publique o problema, defina o prêmio e encontre quem resolve.',
    points: ['Hackathon com a cara da empresa', 'Avaliação por IA ou manual', 'Painel dos seus desafios'],
    action: 'Publicar desafio',
  },
]

const AccountTypeSelection = () => {
  return (
    <div className='flex min-h-screen flex-col bg-[radial-gradient(circle_at_20%_15%,rgba(108,72,197,0.22),transparent_32%),var(--color-surface)]'>
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:py-12'>
        <div className='flex items-center justify-between gap-4'>
          <BackButton />
          <Link to='/'>
            <img src='/src/assets/DAMPCode.svg' alt='Damp Code' className='h-8 w-auto' />
          </Link>
          <Link to='/loginUser' className='text-sm font-medium text-brand-light hover:text-highlight'>
            Entrar
          </Link>
        </div>

        <div className='mx-auto mt-12 flex w-full max-w-2xl flex-col gap-3 text-center sm:mt-16'>
          <h1 className='text-3xl font-semibold text-content sm:text-4xl'>Como você quer usar a Damp Code</h1>
          <p className='leading-relaxed text-content-secondary'>
            As contas são separadas. Escolha uma e crie o acesso no passo seguinte.
          </p>
        </div>

        <div className='mt-10 grid gap-5 md:grid-cols-2'>
          {choices.map((choice) => (
            <Link
              key={choice.to}
              to={choice.to}
              className='flex h-full flex-col rounded-3xl border border-white/10 bg-surface-light p-6 text-left shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition-colors duration-200 hover:border-brand-light sm:p-8'
            >
              <p className='text-sm font-medium text-brand-light'>{choice.eyebrow}</p>
              <h2 className='mt-3 text-2xl font-semibold text-content'>{choice.title}</h2>
              <p className='mt-3 leading-relaxed text-content-secondary'>{choice.text}</p>
              <ul className='mt-6 flex flex-col gap-3'>
                {choice.points.map((point) => (
                  <li key={point} className='flex items-start gap-3 text-content'>
                    <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-highlight' />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className='mt-8 inline-flex w-full items-center justify-center rounded-xl bg-highlight px-6 py-3.5 text-base font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)]'>
                {choice.action}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountTypeSelection
