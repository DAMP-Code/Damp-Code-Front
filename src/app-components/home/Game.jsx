import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { timelineData } from '@/data/timelineData'
import Title from '../Title'

// pequenas animações de cada cartão; são decorativas e reagem ao passar o mouse
const LevelVisual = () => (
  <div className='flex flex-col gap-2'>
    <div className='flex justify-between text-xs font-semibold'>
      <span className='text-content'>Nível 4</span>
      <span className='text-content-secondary'>Nível 5</span>
    </div>
    <div className='h-2.5 overflow-hidden rounded-full bg-white/10'>
      <div className='h-full w-3/5 rounded-full bg-[linear-gradient(90deg,#6C48C5,#C68FE6)] transition-all duration-700 group-hover:w-[92%]' />
    </div>
  </div>
)

const BadgesVisual = () => (
  <div className='flex gap-3'>
    {[
      { icon: faTrophy, color: 'bg-highlight text-surface', delay: 'delay-0' },
      { icon: faMedal, color: 'bg-brand-light text-surface', delay: 'delay-75' },
      { icon: faFire, color: 'bg-danger text-white', delay: 'delay-150' },
    ].map((badge) => (
      <span
        key={badge.delay}
        className={`flex size-11 items-center justify-center rounded-xl ${badge.color} transition-transform duration-500 ${badge.delay} group-hover:-translate-y-1.5 group-hover:rotate-12`}
      >
        <FontAwesomeIcon icon={badge.icon} />
      </span>
    ))}
  </div>
)

// no hover o 3º sobe para o topo: as linhas trocam de lugar com translate
const RankingVisual = () => (
  <div className='relative h-[7.5rem]'>
    {[
      { name: 'Bruno', points: 920, top: 'top-0 group-hover:top-10', place: '1º' },
      { name: 'Carla', points: 870, top: 'top-10 group-hover:top-20', place: '2º' },
      { name: 'Você', points: 940, top: 'top-20 group-hover:top-0', place: '3º', you: true },
    ].map((row) => (
      <div
        key={row.name}
        className={`absolute inset-x-0 flex h-9 items-center justify-between rounded-lg px-3 text-sm transition-all duration-700 ${row.top} ${
          row.you ? 'bg-highlight/15 font-semibold text-highlight' : 'bg-white/5 text-content'
        }`}
      >
        <span>{row.name}</span>
        <span>{row.points}</span>
      </div>
    ))}
  </div>
)

const XpVisual = () => (
  <div className='relative flex items-end gap-2'>
    <span className='text-4xl font-black text-content'>2.480</span>
    <span className='pb-1 text-sm font-semibold text-content-secondary'>XP</span>
    <span className='absolute -top-2 left-28 rounded-full bg-success/20 px-2 py-0.5 text-xs font-bold text-success opacity-0 transition-all duration-500 group-hover:-translate-y-3 group-hover:opacity-100'>
      +120 XP
    </span>
  </div>
)

const visuals = [LevelVisual, BadgesVisual, RankingVisual, XpVisual]

// uma frase por cartão (o texto completo continua em timelineData)
const summaries = [
  'Cada desafio entregue sobe seu nível.',
  'Conquistas por vencer, ajudar e manter sequência.',
  'Os mais ativos do mês ganham destaque.',
  'Pontos por participar, entregar e interagir.',
]

const Game = () => {
  return (
    <section className='w-full py-16 lg:py-20'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 lg:px-8'>
        <div>
          <Title text1='Gamificação' />
          <p className='max-w-2xl text-content-secondary'>Cada desafio entregue conta. Passe o mouse nos cartões.</p>
        </div>

        <ul className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {timelineData.map((item, index) => {
            const Visual = visuals[index]
            return (
              <li
                key={item.title}
                className='group flex flex-col gap-6 rounded-3xl border border-white/10 bg-surface-light p-6 transition hover:-translate-y-1 hover:border-brand-light/40'
              >
                {Visual && <Visual />}
                <div className='mt-auto flex flex-col gap-2'>
                  <h3 className='text-xl font-bold text-content'>{item.title}</h3>
                  <p className='text-content-secondary'>{summaries[index] || item.content}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Game
