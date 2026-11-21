import React from 'react'
import { Link } from 'react-router-dom'

const points = [
  { title: 'Publique o problema', text: 'Com prazo, prêmios por posição e as tecnologias da vaga.' },
  { title: 'Compare as entregas', text: 'Código de cada pessoa ao lado da sua solução de referência.' },
  { title: 'Escolha quem contratar', text: 'Você dá a nota, escolhe os vencedores e publica o resultado.' },
]

// Faixa para empresas: o que elas fazem na plataforma, em três passos, e o botão de publicar.
const CompanyBanner = () => {
  return (
    <section className='w-full px-5 py-16 lg:px-8 lg:py-20'>
      <div className='relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,#2a1466_0%,#6C48C5_55%,#9b6be0_100%)] p-8 sm:p-12'>
        <div aria-hidden='true' className='pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-highlight/20 blur-3xl' />
        <div className='relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'>
          <div className='flex flex-col items-start gap-5'>
            <p className='text-sm font-semibold text-highlight'>Para empresas</p>
            <h2 className='text-3xl font-bold leading-tight text-white sm:text-4xl'>Transforme desafios em recrutamento real</h2>
            <p className='max-w-lg text-lg text-white/80'>
              Em vez de um teste genérico, veja como cada pessoa resolve um problema do seu dia a dia.
            </p>
            <Link
              to='/cadastroEmpresa'
              className='rounded-xl bg-highlight px-6 py-3.5 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.25)] transition hover:-translate-y-0.5 hover:brightness-110'
            >
              Publicar desafio
            </Link>
          </div>

          <ol className='grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
            {points.map((point, index) => (
              <li key={point.title} className='flex flex-col gap-2 rounded-2xl border border-white/15 bg-surface/30 p-5 backdrop-blur-sm'>
                <span className='flex size-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white'>{index + 1}</span>
                <p className='font-semibold text-white'>{point.title}</p>
                <p className='text-sm text-white/75'>{point.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default CompanyBanner
