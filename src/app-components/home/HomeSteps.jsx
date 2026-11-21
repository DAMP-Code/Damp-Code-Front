import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Title from '../Title'
import { useReducedMotion } from '@/app-components/utilities/useReducedMotion'

const STEP_DURATION = 5000

// mini telas do produto, uma para cada passo
const ChoosePreview = () => (
  <div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5'>
    <div className='flex items-center justify-between'>
      <span className='text-sm font-semibold text-brand-light'>Nubank</span>
      <span className='rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success'>Inscrições abertas</span>
    </div>
    <p className='text-xl font-bold text-content'>App que cabe no bolso</p>
    <div className='flex gap-2'>
      {['React', 'Kotlin'].map((item) => (
        <span key={item} className='rounded-full border border-white/15 px-3 py-1 text-xs text-content'>{item}</span>
      ))}
    </div>
    <div className='flex items-end justify-between border-t border-white/10 pt-4'>
      <div>
        <p className='text-xs text-content-secondary'>Em prêmios</p>
        <p className='text-2xl font-bold text-highlight'>R$ 18.000</p>
      </div>
      <span className='rounded-xl bg-brand px-5 py-2.5 font-semibold text-white'>Participar</span>
    </div>
  </div>
)

const StudyPreview = () => (
  <div className='flex flex-col gap-3'>
    <div className='rounded-2xl border border-white/10 bg-surface p-4'>
      <div className='flex items-center gap-3'>
        <span className='flex size-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white'>1</span>
        <div>
          <p className='font-semibold text-content'>Comece por aqui</p>
          <p className='text-xs text-content-secondary'>2 conteúdos</p>
        </div>
      </div>
      <div className='mt-4 flex aspect-video items-center justify-center rounded-xl bg-[linear-gradient(135deg,#2a1466,#6C48C5)]'>
        <span className='flex size-12 items-center justify-center rounded-full bg-white/90 text-surface'>
          <FontAwesomeIcon icon={faPlay} />
        </span>
      </div>
      <p className='mt-2 text-sm text-content-secondary'>Aula de abertura com o time de produto</p>
    </div>
    {['Cursos recomendados', 'Desafio extra'].map((title, index) => (
      <div key={title} className='flex items-center gap-3 rounded-2xl border border-white/10 bg-surface p-4'>
        <span className='flex size-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white'>{index + 2}</span>
        <p className='font-semibold text-content'>{title}</p>
      </div>
    ))}
  </div>
)

const SubmitPreview = () => (
  <div className='overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624]'>
    <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
      <span className='font-mono text-xs text-content-secondary'>entrega.js</span>
      <span className='rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success'>v2 · vale esta</span>
    </div>
    <pre className='px-5 py-4 font-mono text-[13px] leading-7'>
      <span className='text-brand-light'>function </span><span className='text-highlight'>pagar</span><span className='text-content'>(valor) {'{'}</span>{'\n'}
      <span className='text-content-secondary'>  // um toque, sem formulário longo</span>{'\n'}
      <span className='text-brand-light'>  return </span><span className='text-content'>confirmar(valor);</span>{'\n'}
      <span className='text-content'>{'}'}</span>
    </pre>
    <div className='flex items-center justify-between border-t border-white/10 px-4 py-3'>
      <span className='text-xs text-content-secondary'>179 / 102.400 caracteres</span>
      <span className='rounded-lg bg-highlight px-4 py-2 text-sm font-bold text-surface'>Enviar versão</span>
    </div>
  </div>
)

const ResultPreview = () => (
  <div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5'>
    <p className='rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm text-content'>
      Você ficou em <b className='text-highlight'>2º lugar</b> de 12, com nota 88.
    </p>
    <div className='grid grid-cols-3 items-end gap-3 text-center'>
      {[
        { place: 2, initials: 'VC', height: 'h-24', color: '#C7C9D9', you: true },
        { place: 1, initials: 'BM', height: 'h-32', color: '#FFEA00' },
        { place: 3, initials: 'CD', height: 'h-20', color: '#E0915A' },
      ].map((item) => (
        <div key={item.place} className='flex flex-col items-center gap-2'>
          <span style={{ backgroundColor: item.color }} className='flex size-10 items-center justify-center rounded-full text-sm font-black text-surface'>
            {item.initials}
          </span>
          <div className={`flex w-full ${item.height} items-start justify-center rounded-t-xl border border-white/10 bg-surface-light pt-2 text-lg font-bold ${item.you ? 'text-highlight' : 'text-content'}`}>
            {item.place}º
          </div>
        </div>
      ))}
    </div>
  </div>
)

const steps = [
  {
    title: 'Escolha um desafio',
    text: 'Empresas publicam problemas reais com prazo, prêmio e tecnologias à vista. Entre sozinho ou monte uma equipe.',
    preview: ChoosePreview,
  },
  {
    title: 'Estude o material',
    text: 'Cada Hackathon pode ter módulos com textos, cursos e vídeos que a empresa preparou para o desafio.',
    preview: StudyPreview,
  },
  {
    title: 'Entregue o código',
    text: 'Envie quantas versões quiser até o prazo. A última é a que vale, e a empresa compara com a solução dela.',
    preview: SubmitPreview,
  },
  {
    title: 'Veja o resultado',
    text: 'A empresa dá a nota, escolhe os vencedores e publica. Sua colocação aparece no perfil e no ranking.',
    preview: ResultPreview,
  },
]

// "Como funciona": os passos avançam sozinhos com uma barra de progresso; clicar escolhe o passo.
// Para com o mouse em cima (ou foco do teclado) e com "menos animação" no sistema.
const HomeSteps = () => {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const autoplay = !reducedMotion && !paused

  useEffect(() => {
    if (!autoplay) return
    const timer = setTimeout(() => setActive((value) => (value + 1) % steps.length), STEP_DURATION)
    return () => clearTimeout(timer)
  }, [active, autoplay])

  const Preview = steps[active].preview

  return (
    <section
      className='w-full overflow-hidden py-16 lg:py-24'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8'>
        <div className='flex flex-col gap-6'>
          <div>
            <Title text1={'Como'} text2={'funciona'} />
            <p className='max-w-lg text-lg text-content-secondary'>Do desafio publicado ao prêmio, em quatro passos.</p>
          </div>

          <ol className='flex flex-col gap-2'>
            {steps.map((step, index) => {
              const isActive = index === active
              return (
                <li key={step.title}>
                  <button
                    type='button'
                    onClick={() => setActive(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`relative w-full overflow-hidden rounded-2xl border p-5 text-left transition ${
                      isActive ? 'border-white/15 bg-surface-light' : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className='flex items-start gap-4'>
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                          isActive ? 'bg-highlight text-surface' : 'bg-white/10 text-content-secondary'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className={`text-lg font-semibold ${isActive ? 'text-content' : 'text-content-secondary'}`}>{step.title}</p>
                        {isActive && <p className='mt-1 leading-relaxed text-content-secondary'>{step.text}</p>}
                      </div>
                    </div>
                    {/* barra que enche enquanto o passo está na tela */}
                    {isActive && autoplay && (
                      <span
                        key={active}
                        aria-hidden='true'
                        style={{ '--step-duration': `${STEP_DURATION}ms` }}
                        className='damp-step-progress absolute inset-x-0 bottom-0 h-0.5 bg-highlight'
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className='relative'>
          <div aria-hidden='true' className='absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(108,72,197,0.35),transparent_70%)]' />
          <div key={active} className='relative mx-auto w-full max-w-md animate-in fade-in zoom-in-95 duration-500 motion-reduce:animate-none'>
            <Preview />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeSteps
