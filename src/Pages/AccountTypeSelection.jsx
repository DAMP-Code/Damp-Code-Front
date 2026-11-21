import BackButton from '@/app-components/BackButton'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import { useReducedMotion } from '@/app-components/utilities/useReducedMotion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faCode, faTrophy } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// tempo de uma volta das prévias animadas dos cartões
const PREVIEW_LOOP = 7000

// atraso de uma peça da animação (lido pelas classes damp-* do style.css)
const delay = (seconds) => ({ '--d': `${seconds}s` })

// sem movimento reduzido a peça entra com atraso; com ele, aparece direto no estado final
const seq = (animate, className = 'damp-seq') => (animate ? className : '')

// Participante: escreve a solução, envia a entrega e sobe no ranking
const ParticipantPreview = ({ animate }) => {
  const lines = [
    [['text-brand-light', 'function '], ['text-highlight', 'melhorRota'], ['text-content', '(pedidos) {']],
    [['text-content', '  return pedidos'], ['text-content-secondary', '.sort(porDistancia)']],
    [['text-content', '}']],
  ]
  return (
    <div className='flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624]'>
      <div className='flex items-center gap-1.5 border-b border-white/10 px-3 py-2'>
        <span className='size-2 rounded-full bg-danger/80' />
        <span className='size-2 rounded-full bg-warning/80' />
        <span className='size-2 rounded-full bg-success/80' />
        <span className='ml-2 font-mono text-[11px] text-content-secondary'>solucao.js</span>
      </div>
      <div className='flex-1 px-3 py-3 font-mono text-xs leading-6'>
        {lines.map((parts, index) => (
          <div key={index} style={delay(0.2 + index * 0.45)} className={`${seq(animate)} flex whitespace-pre`}>
            <span className='mr-3 w-3 text-right text-content-secondary/50'>{index + 1}</span>
            {parts.map(([color, text]) => (
              <span key={text} className={color}>
                {text}
              </span>
            ))}
          </div>
        ))}
        <div style={delay(1.4)} className={`${seq(animate)} flex`}>
          <span className='mr-3 w-3 text-right text-content-secondary/50'>4</span>
          <span className='mt-1.5 inline-block h-3.5 w-1.5 animate-pulse bg-highlight motion-reduce:animate-none' />
        </div>
      </div>
      <div className='flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2.5 text-xs'>
        <span style={delay(1.8)} className={`${seq(animate, 'damp-in')} inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 font-semibold text-success`}>
          <FontAwesomeIcon icon={faCheck} />
          Entrega enviada
        </span>
        <span style={delay(2.5)} className={`${seq(animate, 'damp-in')} inline-flex items-center gap-1.5 rounded-full bg-highlight/15 px-2.5 py-1 font-semibold text-highlight`}>
          <FontAwesomeIcon icon={faTrophy} />
          Ranking
          {/* a posição troca de #4 para #1 */}
          <span className='relative inline-block w-5 tabular-nums'>
            {animate && (
              <span style={delay(3.3)} className='damp-out absolute inset-0'>
                #4
              </span>
            )}
            <span style={delay(3.3)} className={seq(animate, 'damp-in')}>
              #1
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}

// Empresa: publica o Hackathon, recebe inscrições e entregas para avaliar
const CompanyPreview = ({ animate }) => {
  const people = ['A', 'B', 'C', 'D']
  const bars = [35, 60, 45, 85, 70]
  return (
    <div className='flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624] p-3'>
      <div className='flex items-center gap-2.5'>
        <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-brand-light/25 text-brand-light'>
          <FontAwesomeIcon icon={faCode} />
        </span>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-content'>Rota mais rápida</p>
          <p style={delay(0.3)} className={`${seq(animate)} text-[11px] text-content-secondary`}>
            Prêmio de R$ 5.000
          </p>
        </div>
        {/* o rascunho vira publicado */}
        <span className='relative text-[11px] font-semibold'>
          {animate && (
            <span style={delay(1)} className='damp-out absolute right-0 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-content-secondary'>
              Rascunho
            </span>
          )}
          <span style={delay(1)} className={`${seq(animate, 'damp-in')} inline-block whitespace-nowrap rounded-full bg-success/15 px-2 py-0.5 text-success`}>
            Publicado
          </span>
        </span>
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex -space-x-2'>
          {people.map((letter, index) => (
            <span
              key={letter}
              style={delay(1.5 + index * 0.2)}
              className={`${seq(animate, 'damp-in')} grid size-6 place-items-center rounded-full border-2 border-[#0e0624] bg-brand-light/40 text-[10px] font-bold text-content`}
            >
              {letter}
            </span>
          ))}
        </div>
        <span style={delay(2.4)} className={`${seq(animate)} text-xs text-content-secondary`}>
          +24 inscritos
        </span>
      </div>

      <div className='flex flex-1 items-end gap-1.5'>
        {bars.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%`, ...delay(2.6 + index * 0.12) }}
            className={`${seq(animate, 'damp-grow')} flex-1 rounded-t bg-brand-light/50`}
          />
        ))}
      </div>

      <p style={delay(3.5)} className={`${seq(animate)} rounded-lg bg-highlight/10 px-2.5 py-1.5 text-xs font-semibold text-highlight`}>
        3 entregas para avaliar
      </p>
    </div>
  )
}

const choices = [
  {
    to: '/cadastroUser',
    eyebrow: 'Para participar',
    title: 'Participante',
    text: 'Entre nos hackathons, acompanhe prazo e prêmio, e monte um portfólio com o que você resolver.',
    points: ['Desafios de empresas e comunidades', 'Ranking e reconhecimento', 'Uma conta para todos os hackathons'],
    action: 'Criar conta',
    Preview: ParticipantPreview,
  },
  {
    to: '/cadastroEmpresa',
    eyebrow: 'Para publicar',
    title: 'Empresa',
    text: 'Publique o problema, defina o prêmio e encontre quem resolve.',
    points: ['Hackathon com a cara da empresa', 'Nota sugerida pela sua solução de referência', 'Painel dos seus desafios'],
    action: 'Publicar desafio',
    Preview: CompanyPreview,
  },
]

const questions = [
  {
    question: 'Posso ter as duas contas?',
    answer: 'Pode, com e-mails diferentes. Cada e-mail fica ligado a um tipo de conta só.',
  },
  {
    question: 'A empresa já pode publicar depois do cadastro?',
    answer:
      'Ela já pode montar os Hackathons como rascunho. A publicação é liberada depois que a equipe Damp Code confere o CNPJ e verifica a empresa.',
  },
  {
    question: 'Quem trabalha na empresa precisa de uma conta de empresa?',
    answer:
      'Não. A conta principal convida a pessoa pelo e-mail da conta de participante dela. Quem aceita passa a gerenciar os Hackathons da empresa e deixa de participar deles.',
  },
  {
    question: 'Como as entregas são avaliadas?',
    answer:
      'A empresa dá a nota final de cada entrega. O sistema sugere uma nota pela semelhança com a solução de referência, e a empresa escolhe os vencedores.',
  },
]

// Cartão de escolha: inclina seguindo o mouse e acende um brilho onde o cursor está
const ChoiceCard = ({ choice, cycle, reducedMotion }) => {
  const cardRef = useRef(null)
  const { Preview } = choice

  function handleMove(e) {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    cardRef.current.style.setProperty('--x', `${(x * 100).toFixed(1)}%`)
    cardRef.current.style.setProperty('--y', `${(y * 100).toFixed(1)}%`)
    cardRef.current.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 5).toFixed(2)}deg)`
  }

  function handleLeave() {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <Link
      ref={cardRef}
      to={choice.to}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className='group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-light p-6 text-left shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition-[border-color,opacity,transform] duration-200 ease-out hover:border-brand-light focus-visible:border-highlight md:group-hover/choices:[&:not(:hover)]:opacity-60 sm:p-8'
    >
      {/* brilho que acompanha o cursor */}
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(198,143,230,0.16),transparent_60%)]'
      />

      <div aria-hidden='true' className='relative h-48'>
        <Preview key={cycle} animate={!reducedMotion} />
      </div>

      <p className='relative mt-6 text-sm font-medium text-brand-light'>{choice.eyebrow}</p>
      <h2 className='relative mt-2 text-2xl font-semibold text-content'>{choice.title}</h2>
      <p className='relative mt-3 leading-relaxed text-content-secondary'>{choice.text}</p>
      <ul className='relative mt-6 flex flex-col gap-3'>
        {choice.points.map((point) => (
          <li key={point} className='flex items-start gap-3 text-content'>
            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-highlight' />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <span className='relative mt-8 inline-flex w-full items-center justify-center rounded-xl bg-highlight px-6 py-3.5 text-base font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] transition group-hover:-translate-y-0.5 group-hover:brightness-110'>
        {choice.action}
      </span>
    </Link>
  )
}

const AccountTypeSelection = () => {
  const reducedMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  // recomeça as prévias a cada volta (a troca de key remonta e reinicia as animações)
  useEffect(() => {
    if (reducedMotion) return
    const timer = setInterval(() => setCycle((value) => value + 1), PREVIEW_LOOP)
    return () => clearInterval(timer)
  }, [reducedMotion])

  return (
    <div className='flex min-h-screen flex-col bg-[radial-gradient(circle_at_20%_15%,rgba(108,72,197,0.22),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(198,143,230,0.10),transparent_35%),var(--color-surface)]'>
      <Header />
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:py-12'>
        <BackButton />

        <div className='mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 text-center sm:mt-10'>
          <h1 className='text-3xl font-semibold text-content sm:text-4xl'>Como você quer usar a Damp Code</h1>
          <p className='leading-relaxed text-content-secondary'>
            As contas são separadas. Escolha uma e crie o acesso no passo seguinte.
          </p>
        </div>

        <div className='group/choices mt-10 grid gap-5 md:grid-cols-2'>
          {choices.map((choice) => (
            <ChoiceCard key={choice.to} choice={choice} cycle={cycle} reducedMotion={reducedMotion} />
          ))}
        </div>

        {/* DÚVIDAS */}
        <section className='mt-16 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12'>
          <div>
            <h2 className='text-2xl font-semibold text-content'>Antes de escolher</h2>
            <p className='mt-3 leading-relaxed text-content-secondary'>As dúvidas mais comuns sobre os dois tipos de conta.</p>
            <p className='mt-6 text-content-secondary'>
              Já tem uma conta?{' '}
              <Link to='/loginUser' className='font-semibold text-highlight hover:underline'>
                Entrar
              </Link>
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            {questions.map((item) => (
              <details key={item.question} className='group rounded-2xl border border-white/10 bg-white/[0.03] transition-colors open:border-brand-light/50 open:bg-white/[0.05]'>
                <summary className='flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-content [&::-webkit-details-marker]:hidden'>
                  {item.question}
                  <FontAwesomeIcon icon={faChevronDown} className='shrink-0 text-sm text-brand-light transition-transform duration-200 group-open:rotate-180' />
                </summary>
                <p className='px-5 pb-5 leading-relaxed text-content-secondary animate-in fade-in slide-in-from-top-1 duration-300 motion-reduce:animate-none'>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default AccountTypeSelection
