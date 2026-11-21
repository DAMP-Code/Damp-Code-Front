import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faCodeCompare, faUserCheck } from '@fortawesome/free-solid-svg-icons'

const points = [
  { icon: faBullhorn, title: 'Publique o problema', text: 'Prazo, prêmios e tecnologias.' },
  { icon: faCodeCompare, title: 'Compare as entregas', text: 'Lado a lado com a sua solução.' },
  { icon: faUserCheck, title: 'Escolha quem contratar', text: 'Nota, vencedores e resultado.' },
]

// Faixa para empresas: escura, com o amarelo da marca de destaque e uma grade de pontos ao fundo.
const CompanyBanner = () => {
  return (
    <section className='w-full px-5 py-16 lg:px-8 lg:py-20'>
      <div className='relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-surface-light p-8 sm:p-12'>
        {/* grade de pontos e brilho discreto */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(90deg,transparent,black_60%)]'
        />
        <div aria-hidden='true' className='pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand/40 blur-3xl' />
        <div aria-hidden='true' className='absolute inset-y-0 left-0 w-1.5 bg-highlight' />

        <div className='relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
          <div className='flex flex-col items-start gap-5'>
            <p className='text-sm font-semibold text-highlight'>Para empresas</p>
            <h2 className='text-3xl font-bold leading-tight text-content sm:text-4xl'>Transforme desafios em recrutamento real</h2>
            <p className='max-w-lg text-lg text-content-secondary'>
              Em vez de um teste genérico, veja como cada pessoa resolve um problema do seu dia a dia.
            </p>
            <Link
              to='/cadastroEmpresa'
              className='rounded-xl bg-highlight px-6 py-3.5 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition hover:-translate-y-0.5 hover:brightness-110'
            >
              Publicar desafio
            </Link>
          </div>

          <ol className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            {points.map((point) => (
              <li
                key={point.title}
                className='group/item flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface/60 p-5 transition hover:-translate-y-1 hover:border-highlight/40'
              >
                <span className='flex size-10 items-center justify-center rounded-xl bg-highlight/15 text-highlight transition group-hover/item:bg-highlight group-hover/item:text-surface'>
                  <FontAwesomeIcon icon={point.icon} />
                </span>
                <p className='font-semibold text-content'>{point.title}</p>
                <p className='text-sm text-content-secondary'>{point.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default CompanyBanner
