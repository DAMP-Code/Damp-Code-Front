import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faArrowUpRightFromSquare, faBookOpen, faCheck, faGraduationCap, faPlay } from '@fortawesome/free-solid-svg-icons'
import Title from '../Title'
import { useReducedMotion } from '@/app-components/utilities/useReducedMotion'

const STEP_DURATION = 5500

// atraso de uma peça da animação (lido pelas classes damp-* do style.css)
const delay = (seconds) => ({ '--d': `${seconds}s` })

// cursor que entra, clica e some (fica por cima do botão que ele "aperta")
const ClickCursor = ({ at, className = '' }) => (
  <span aria-hidden='true' style={delay(at)} className={`damp-cursor pointer-events-none absolute z-10 text-xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${className}`}>
    <FontAwesomeIcon icon={faArrowPointer} />
  </span>
)

// 1. o cursor clica em "Participar" e o botão vira "Inscrito"
const ChoosePreview = () => (
  <div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5'>
    <div className='flex items-center justify-between'>
      <span className='text-sm font-semibold text-brand-light'>Nubank</span>
      <span className='rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success'>Inscrições abertas</span>
    </div>
    <p className='text-xl font-bold text-content'>App que cabe no bolso</p>
    <div className='flex gap-2'>
      {['React', 'Kotlin'].map((item, index) => (
        <span key={item} style={delay(0.15 + index * 0.15)} className='damp-seq rounded-full border border-white/15 px-3 py-1 text-xs text-content'>
          {item}
        </span>
      ))}
    </div>
    <div className='flex items-end justify-between border-t border-white/10 pt-4'>
      <div>
        <p className='text-xs text-content-secondary'>Em prêmios</p>
        <p className='text-2xl font-bold text-highlight'>R$ 18.000</p>
      </div>
      <div className='relative'>
        <span style={delay(1.4)} className='damp-out block rounded-xl bg-brand px-5 py-2.5 font-semibold text-white'>Participar</span>
        <span style={delay(1.55)} className='damp-in absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl border border-success/40 bg-success/15 font-semibold text-success'>
          Inscrito <FontAwesomeIcon icon={faCheck} />
        </span>
        <ClickCursor at={0.2} className='bottom-0 right-4' />
      </div>
    </div>
  </div>
)

// 2. os cursos que a empresa cadastrou no módulo aparecem um a um
const courses = [
  { icon: faGraduationCap, title: 'Curso de React Native', site: 'reactnative.dev' },
  { icon: faBookOpen, title: 'Guia de acessibilidade no Android', site: 'developer.android.com' },
]

const StudyPreview = () => (
  <div className='flex flex-col gap-3'>
    <p className='text-xs font-medium text-content-secondary'>Material que a Nubank cadastrou para o desafio</p>
    <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-surface p-4'>
      <span className='flex size-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white'>1</span>
      <div className='min-w-0 flex-1'>
        <p className='font-semibold text-content'>Comece por aqui</p>
        <p className='text-xs text-content-secondary'>Aula de abertura · 12 min</p>
      </div>
      <span className='flex size-9 animate-pulse items-center justify-center rounded-full bg-white/90 text-sm text-surface motion-reduce:animate-none'>
        <FontAwesomeIcon icon={faPlay} />
      </span>
    </div>
    <div className='rounded-2xl border border-highlight/40 bg-surface p-4'>
      <div className='flex items-center gap-3'>
        <span className='flex size-8 items-center justify-center rounded-lg bg-highlight text-sm font-bold text-surface'>2</span>
        <p className='font-semibold text-content'>Cursos recomendados</p>
      </div>
      <ul className='mt-3 flex flex-col gap-2'>
        {courses.map((course, index) => (
          <li key={course.title} style={delay(0.4 + index * 0.35)} className='damp-seq flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5'>
            <FontAwesomeIcon icon={course.icon} className='text-brand-light' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-content'>{course.title}</p>
              <p className='text-xs text-content-secondary'>{course.site}</p>
            </div>
            <span className='flex shrink-0 items-center gap-1 text-xs font-semibold text-highlight'>
              Abrir curso <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

// 3. as linhas aparecem, o cursor envia e a versão 2 passa a valer
const codeLines = [
  [['text-brand-light', 'function '], ['text-highlight', 'pagar'], ['text-content', '(valor) {']],
  [['text-content-secondary', '  // um toque, sem formulário longo']],
  [['text-brand-light', '  return '], ['text-content', 'confirmar(valor);']],
  [['text-content', '}']],
]

const SubmitPreview = () => (
  <div className='relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624]'>
    <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
      <span className='font-mono text-xs text-content-secondary'>entrega.js</span>
      <span className='relative'>
        <span style={delay(2.2)} className='damp-out block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-content-secondary'>v1</span>
        <span style={delay(2.35)} className='damp-in absolute right-0 top-0 whitespace-nowrap rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success'>
          v2 · vale esta
        </span>
      </span>
    </div>
    <pre className='px-5 py-4 font-mono text-[13px] leading-7'>
      {codeLines.map((line, index) => (
        <div key={index} style={delay(0.15 + index * 0.3)} className='damp-seq whitespace-pre'>
          {line.map(([color, text], part) => (
            <span key={part} className={color}>{text}</span>
          ))}
        </div>
      ))}
    </pre>
    <div className='flex items-center justify-between border-t border-white/10 px-4 py-3'>
      <span className='text-xs text-content-secondary'>Envie quantas versões quiser</span>
      <span className='relative'>
        <span className='block rounded-lg bg-highlight px-4 py-2 text-sm font-bold text-surface'>Enviar versão</span>
        <ClickCursor at={0.7} className='-bottom-2 right-3' />
      </span>
    </div>
    <p style={delay(2.4)} className='damp-in absolute bottom-16 left-1/2 -ml-24 flex w-48 items-center justify-center gap-2 rounded-xl bg-success px-3 py-2 text-sm font-semibold text-surface shadow-lg'>
      <FontAwesomeIcon icon={faCheck} /> Versão 2 enviada
    </p>
  </div>
)

// 4. as barras do pódio sobem e o aviso da colocação aparece
const ResultPreview = () => (
  <div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5'>
    <div className='grid grid-cols-3 items-end gap-3 text-center'>
      {[
        { place: 2, initials: 'VC', height: 'h-24', color: '#C7C9D9', you: true, at: 0.35 },
        { place: 1, initials: 'BM', height: 'h-32', color: '#FFEA00', at: 0.6 },
        { place: 3, initials: 'CD', height: 'h-20', color: '#E0915A', at: 0.15 },
      ].map((item) => (
        <div key={item.place} className='flex flex-col items-center gap-2'>
          <span style={{ ...delay(item.at + 0.5), backgroundColor: item.color }} className='damp-in flex size-10 items-center justify-center rounded-full text-sm font-black text-surface'>
            {item.initials}
          </span>
          <div
            style={delay(item.at)}
            className={`damp-grow flex w-full ${item.height} items-start justify-center rounded-t-xl border border-white/10 pt-2 text-lg font-bold ${
              item.you ? 'bg-highlight/15 text-highlight' : 'bg-surface-light text-content'
            }`}
          >
            {item.place}º
          </div>
        </div>
      ))}
    </div>
    <p style={delay(1.4)} className='damp-seq rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm text-content'>
      Você ficou em <b className='text-highlight'>2º lugar</b> de 12, com nota 88.
    </p>
  </div>
)

const steps = [
  {
    title: 'Escolha um desafio',
    text: 'Prazo, prêmio e tecnologias à vista. Entre sozinho ou em equipe.',
    preview: ChoosePreview,
  },
  {
    title: 'Estude o material',
    text: 'A empresa cadastra módulos com cursos, vídeos e textos para o desafio.',
    preview: StudyPreview,
  },
  {
    title: 'Entregue o código',
    text: 'Envie quantas versões quiser até o prazo. A última é a que vale.',
    preview: SubmitPreview,
  },
  {
    title: 'Veja o resultado',
    text: 'A empresa avalia, escolhe os vencedores e publica. Sua colocação vai para o ranking.',
    preview: ResultPreview,
  },
]

// "Como funciona": os passos avançam sozinhos com uma barra de progresso; clicar escolhe o passo.
// Cada mini tela tem sua animação e inclina acompanhando o mouse. Para com o mouse em cima e com "menos animação".
const HomeSteps = () => {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const tiltRef = useRef(null)
  const autoplay = !reducedMotion && !paused

  useEffect(() => {
    if (!autoplay) return
    const timer = setTimeout(() => setActive((value) => (value + 1) % steps.length), STEP_DURATION)
    return () => clearTimeout(timer)
  }, [active, autoplay])

  // inclina a mini tela na direção do mouse (até 8 graus)
  function handleTilt(e) {
    if (reducedMotion || !tiltRef.current) return
    const rect = tiltRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    tiltRef.current.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`
  }

  function resetTilt() {
    if (tiltRef.current) tiltRef.current.style.transform = ''
  }

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
                    className={`relative w-full overflow-hidden rounded-2xl border p-5 text-left transition focus-visible:outline-offset-0 ${
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

        <div className='relative' onMouseMove={handleTilt} onMouseLeave={resetTilt}>
          <div aria-hidden='true' className='absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(108,72,197,0.35),transparent_70%)]' />
          <div ref={tiltRef} className='relative mx-auto w-full max-w-md transition-transform duration-200 ease-out [transform-style:preserve-3d]'>
            {/* key: a mini tela remonta a cada passo e a animação recomeça */}
            <div key={active} className='animate-in fade-in zoom-in-95 duration-500 motion-reduce:animate-none'>
              <Preview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeSteps
