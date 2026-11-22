import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons'
import Title from '../Title'
import { useInView } from '../utilities/useInView'
import { useReducedMotion } from '../utilities/useReducedMotion'
import { formatMoney, totalPrize } from '../utilities/prizes'

const cardClass = 'flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-surface-light p-6 transition hover:border-brand-light/40'

// 1. tecnologias flutuando, cada uma no seu ritmo
const technologies = ['React', 'Python', 'Node.js', 'Kotlin', 'SQL', 'TypeScript', '.NET', 'Docker', 'Go', 'Figma']

const TechCloud = () => (
  <div className='flex flex-wrap gap-2.5'>
    {technologies.map((tech, index) => (
      <span
        key={tech}
        style={{ '--d': `${(index % 5) * 0.4}s`, '--float-duration': `${3.5 + (index % 3)}s` }}
        className='damp-float rounded-full border border-white/15 bg-surface/60 px-3.5 py-1.5 text-sm text-content transition hover:border-highlight hover:text-highlight'
      >
        {tech}
      </span>
    ))}
  </div>
)

// 2. live "ao vivo": contador de pessoas assistindo e mensagens do chat chegando
const chat = [
  { name: 'Bruno', text: 'dá pra usar cache no ranking?' },
  { name: 'Carla', text: 'o slide da arquitetura ajudou muito' },
  { name: 'Diego', text: 'vou refazer minha entrega hoje' },
  { name: 'Ana', text: 'pergunta: vale TypeScript?' },
]

const LivePreview = ({ active }) => {
  const [viewers, setViewers] = useState(214)
  const [message, setMessage] = useState(0)

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => {
      setViewers((value) => value + Math.round(Math.random() * 6 - 2))
      setMessage((value) => value + 1)
    }, 2200)
    return () => clearInterval(timer)
  }, [active])

  const visible = [0, 1, 2].map((offset) => chat[(message + offset) % chat.length])

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative flex aspect-video items-end justify-between rounded-2xl bg-[linear-gradient(135deg,#2a1466,#6C48C5)] p-3'>
        <span className='flex items-center gap-1.5 rounded-md bg-danger px-2 py-0.5 text-xs font-bold text-white'>
          <span className='size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none' /> AO VIVO
        </span>
        <span className='flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-0.5 text-xs font-semibold text-white tabular-nums'>
          <FontAwesomeIcon icon={faEye} /> {viewers}
        </span>
      </div>
      <ul className='flex flex-col gap-1.5'>
        {visible.map((item, index) => (
          <li key={`${message}-${index}`} className={`text-sm ${index === 2 ? 'animate-in fade-in slide-in-from-bottom-1 duration-500' : ''}`}>
            <b className='text-brand-light'>{item.name}</b> <span className='text-content-secondary'>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 3. checklist do tutorial que vai se marcando sozinho
const steps = ['Ler o desafio', 'Assistir a aula de abertura', 'Configurar o projeto', 'Enviar a primeira versão']

const TutorialChecklist = ({ active }) => {
  const [done, setDone] = useState(active ? 0 : steps.length)

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setDone((value) => (value >= steps.length ? 0 : value + 1)), 1100)
    return () => clearInterval(timer)
  }, [active])

  return (
    <div className='flex flex-col gap-3'>
      <div className='h-1.5 overflow-hidden rounded-full bg-white/10'>
        <div className='h-full rounded-full bg-highlight transition-all duration-500' style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ul className='flex flex-col gap-2'>
        {steps.map((step, index) => {
          const checked = index < done
          return (
            <li key={step} className='flex items-center gap-3 text-sm'>
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition ${
                  checked ? 'border-success bg-success text-surface' : 'border-white/20 text-transparent'
                }`}
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={checked ? 'text-content-secondary line-through' : 'text-content'}>{step}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// 4. números que contam até o valor quando aparecem na tela
const CountUp = ({ value, active, reduced, format = (n) => n.toLocaleString('pt-BR') }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 1400)
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, active])

  return <span className='tabular-nums'>{format(reduced ? value : current)}</span>
}

const numbers = [
  { value: 1200, label: 'desenvolvedores', suffix: '+' },
  { value: 35, label: 'Hackathons ativos' },
  { value: 85000, label: 'em prêmios', money: true },
  { value: 18, label: 'empresas parceiras' },
]

// chamada final em forma de terminal, com números reais da API
const CtaTerminal = ({ active, reducedMotion }) => {
  const [open, setOpen] = useState(null)
  const [lines, setLines] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('https://localhost:7092/api/Hackathons')
        const data = response.ok ? await response.json() : []
        const list = (Array.isArray(data) ? data : []).filter((h) => ['Publicado', 'Ativo'].includes(h.fase))
        const top = [...list].sort((a, b) => totalPrize(b) - totalPrize(a))[0]
        setOpen({ count: list.length, top })
      } catch (error) {
        console.error(error)
        setOpen({ count: 0, top: null })
      }
    }
    load()
  }, [])

  const output = [
    { prompt: true, text: 'damp entrar' },
    { ok: true, text: open ? `${open.count} ${open.count === 1 ? 'desafio aberto encontrado' : 'desafios abertos encontrados'}` : 'procurando desafios...' },
    ...(open?.top ? [{ ok: true, text: `maior prêmio: ${formatMoney(totalPrize(open.top)).replace(/,00$/, '')} em "${open.top.titulo}"` }] : []),
    { arrow: true, text: 'crie sua conta para entrar no próximo' },
  ]

  // mostra uma linha por vez depois que o terminal aparece
  useEffect(() => {
    if (!active || reducedMotion || lines >= output.length) return
    const timer = setTimeout(() => setLines((value) => value + 1), lines === 0 ? 300 : 700)
    return () => clearTimeout(timer)
  }, [active, reducedMotion, lines, output.length])

  const shown = reducedMotion ? output : output.slice(0, lines)

  return (
    <div aria-hidden='true' className='overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624] shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
      <div className='flex items-center gap-2 border-b border-white/10 px-4 py-3'>
        <span className='size-3 rounded-full bg-danger/80' />
        <span className='size-3 rounded-full bg-warning/80' />
        <span className='size-3 rounded-full bg-success/80' />
      </div>
      <pre className='min-h-44 whitespace-pre-wrap px-5 py-5 font-mono text-sm leading-7'>
        {shown.map((line, index) => (
          <div key={index} className='animate-in fade-in duration-300'>
            {line.prompt && <span className='text-success'>você@damp:~$ </span>}
            {line.ok && <span className='text-success'>✓ </span>}
            {line.arrow && <span className='text-highlight'>→ </span>}
            <span className={line.arrow ? 'text-highlight' : 'text-content'}>{line.text}</span>
          </div>
        ))}
        <span className='inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-highlight motion-reduce:animate-none' />
      </pre>
    </div>
  )
}

const HomeCommunity = () => {
  const reducedMotion = useReducedMotion()
  const [gridRef, gridInView] = useInView({ threshold: 0.2 })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.4 })
  const animate = gridInView && !reducedMotion

  return (
    <section className='flex w-full flex-col items-center px-5 py-16 lg:px-8 lg:py-20'>
      <div className='w-full max-w-7xl'>
        <Title text1={'Comunidade'} text2={'ativa'} />
        <p className='max-w-2xl text-content-secondary'>Você não resolve o desafio sozinho.</p>
      </div>

      <div ref={gridRef} className='mt-8 grid w-full max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3'>
        <article className={`${cardClass} lg:col-span-2`}>
          <TechCloud />
          <div className='mt-auto'>
            <h3 className='text-xl font-semibold text-content'>Comunidades por tecnologia</h3>
            <p className='mt-1 text-content-secondary'>Tire dúvidas e troque ideia com quem usa a mesma stack.</p>
          </div>
        </article>

        <article className={`${cardClass} lg:row-span-2`}>
          <LivePreview active={animate} />
          <div className='mt-auto'>
            <h3 className='text-xl font-semibold text-content'>Lives exclusivas</h3>
            <p className='mt-1 text-content-secondary'>Conversas com o time da empresa durante o desafio.</p>
          </div>
        </article>

        <article className={cardClass}>
          <TutorialChecklist active={animate} />
          <div className='mt-auto'>
            <h3 className='text-xl font-semibold text-content'>Tutoriais integrados</h3>
            <p className='mt-1 text-content-secondary'>Um passo a passo do que a empresa espera.</p>
          </div>
        </article>

        <article className={cardClass}>
          <dl className='grid grid-cols-2 gap-4'>
            {numbers.map((item) => (
              <div key={item.label} className='flex flex-col'>
                <dt className='order-2 text-xs text-content-secondary'>{item.label}</dt>
                <dd className='order-1 text-2xl font-black text-content'>
                  <CountUp
                    value={item.value}
                    active={animate}
                    reduced={reducedMotion}
                    format={item.money ? (n) => formatMoney(n).replace(/,00$/, '') : (n) => `${n.toLocaleString('pt-BR')}${item.suffix || ''}`}
                  />
                </dd>
              </div>
            ))}
          </dl>
          <div className='mt-auto'>
            <h3 className='text-xl font-semibold text-content'>Movimentação de pessoas</h3>
          </div>
        </article>
      </div>

      {/* CHAMADA FINAL */}
      <div ref={ctaRef} className='mt-20 grid w-full max-w-7xl grid-cols-1 items-center gap-10 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_85%_50%,rgba(108,72,197,0.35),transparent_60%)] p-8 sm:p-12 lg:grid-cols-2'>
        <div className='flex flex-col items-start gap-5'>
          <h2 className='text-4xl font-bold leading-tight text-content sm:text-5xl'>O próximo desafio já está aberto.</h2>
          <p className='max-w-md text-lg text-content-secondary'>Crie sua conta, escolha um Hackathon e entregue seu código.</p>
          <div className='flex flex-wrap gap-3'>
            <Link to='/escolha' className='rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition hover:-translate-y-0.5 hover:brightness-110'>
              Criar conta
            </Link>
            <Link to='/explore' className='rounded-xl border border-white/15 px-7 py-4 text-lg font-semibold text-content transition hover:border-white/30 hover:bg-white/5'>
              Ver desafios
            </Link>
          </div>
        </div>
        <CtaTerminal active={ctaInView} reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}

export default HomeCommunity
