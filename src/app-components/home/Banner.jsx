import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney, totalPrize } from '@/app-components/utilities/prizes'

// "em 12 dias", "amanhã", "hoje"
function daysLeft(value) {
  if (!value) return null
  const days = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return null
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

// linhas do editor de exemplo: cada pedaço tem a cor do tipo de token
const codeLines = [
  [['text-brand-light', 'export function '], ['text-highlight', 'melhorRota'], ['text-content', '(pedidos, transito) {']],
  [['text-content-secondary', '  // pesa a distância pelo trânsito de cada bairro']],
  [['text-brand-light', '  const '], ['text-content', 'custo = (p) => p.distancia * transito[p.bairro];']],
  [['text-brand-light', '  return '], ['text-content', 'pedidos.'], ['text-highlight', 'sort'], ['text-content', '((a, b) => custo(a) - custo(b));']],
  [['text-content', '}']],
]

const Banner = () => {
  const [hackathons, setHackathons] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('https://localhost:7092/api/Hackathons')
        if (!response.ok) return
        const data = await response.json()
        setHackathons(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
      }
    }

    load()
  }, [])

  // números de verdade da plataforma: desafios abertos, prêmios em jogo e empresas
  const open = hackathons.filter((h) => ['Publicado', 'Ativo'].includes(h.fase))
  const prizes = open.reduce((sum, h) => sum + totalPrize(h), 0)
  const companies = new Set(hackathons.map((h) => h.empresa).filter(Boolean)).size
  const featured = [...open].sort((a, b) => totalPrize(b) - totalPrize(a))[0]
  const deadline = featured && (featured.fase === 'Publicado' ? daysLeft(featured.dataInicio) : daysLeft(featured.dataFinal))

  const stats = [
    { value: open.length, label: open.length === 1 ? 'desafio aberto' : 'desafios abertos' },
    { value: prizes > 0 ? formatMoney(prizes).replace(/,00$/, '') : '—', label: 'em prêmios' },
    { value: companies, label: companies === 1 ? 'empresa' : 'empresas' },
  ]

  return (
    <div className='relative w-full overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_85%_20%,rgba(108,72,197,0.35),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(255,234,0,0.06),transparent_40%)]'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8 lg:py-20'>
        {/* TEXTO */}
        <div className='flex min-w-0 flex-col gap-6'>
          <h1 className='text-4xl font-bold leading-[1.05] tracking-tight text-content sm:text-5xl xl:text-6xl'>
            Onde desafios reais viram conquistas reais
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-content-secondary'>
            Empresas publicam um problema de verdade. Você entrega o código, a empresa avalia e os melhores levam o prêmio.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link
              to='/escolha'
              className='rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110'
            >
              Comece agora
            </Link>
            <Link
              to='/explore'
              className='rounded-xl border border-white/15 px-7 py-4 text-lg font-semibold text-content transition hover:border-white/30 hover:bg-white/5'
            >
              Ver desafios
            </Link>
          </div>

          <dl className='mt-2 flex max-w-xl flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6'>
            {stats.map((stat) => (
              <div key={stat.label} className='flex flex-col gap-1'>
                <dt className='order-2 text-sm text-content-secondary'>{stat.label}</dt>
                <dd className='order-1 whitespace-nowrap text-2xl font-bold text-content sm:text-3xl'>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* EDITOR + DESAFIO EM DESTAQUE */}
        <div className='relative mx-auto w-full min-w-0 max-w-xl pb-28 sm:pb-24 lg:mx-0 lg:ml-auto'>
          <div aria-hidden='true' className='overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624] shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
            <div className='flex items-center gap-2 border-b border-white/10 px-4 py-3'>
              <span className='size-3 rounded-full bg-danger/80' />
              <span className='size-3 rounded-full bg-warning/80' />
              <span className='size-3 rounded-full bg-success/80' />
              <span className='ml-3 font-mono text-xs text-content-secondary'>entrega.js</span>
            </div>
            <pre className='overflow-hidden px-5 py-5 font-mono text-[13px] leading-7 sm:text-sm'>
              {codeLines.map((line, index) => (
                <div key={index} className='flex gap-4 whitespace-pre'>
                  <span className='w-4 shrink-0 select-none text-right text-content-secondary/50'>{index + 1}</span>
                  <span className='min-w-0 overflow-hidden text-ellipsis whitespace-pre'>
                    {line.map(([color, text], part) => (
                      <span key={part} className={color}>{text}</span>
                    ))}
                    {index === codeLines.length - 1 && (
                      <span className='ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-highlight motion-reduce:animate-none' />
                    )}
                  </span>
                </div>
              ))}
            </pre>
          </div>

          {/* cartão do desafio aberto com o maior prêmio, por cima do editor */}
          <div className='absolute bottom-0 left-4 right-4 rounded-2xl border border-white/15 bg-surface-light/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md sm:left-auto sm:right-[-0.5rem] sm:w-80 lg:right-[-1.5rem]'>
            {featured ? (
              <>
                <div className='flex items-center justify-between gap-3'>
                  <span className='truncate text-sm font-semibold text-brand-light'>{featured.empresa}</span>
                  <span className='shrink-0 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success'>
                    {featured.fase === 'Publicado' ? 'Inscrições abertas' : 'Em andamento'}
                  </span>
                </div>
                <p className='mt-2 truncate text-lg font-bold text-content'>{featured.titulo}</p>
                <div className='mt-3 flex items-end justify-between gap-3'>
                  <div>
                    <p className='text-xs text-content-secondary'>
                      {featured.fase === 'Publicado' ? 'Começa' : 'Entregas fecham'} {deadline || 'em breve'}
                    </p>
                    <p className='text-xl font-bold text-highlight'>
                      {totalPrize(featured) > 0 ? formatMoney(totalPrize(featured)).replace(/,00$/, '') : 'Entrevistas'}
                    </p>
                  </div>
                  <Link
                    to={`/hackathon/${encodeURIComponent(featured.hackathonId)}`}
                    className='shrink-0 rounded-lg bg-highlight px-3 py-2 text-sm font-bold text-surface transition hover:brightness-110'
                  >
                    Ver desafio
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className='text-sm font-semibold text-brand-light'>Próximos desafios</p>
                <p className='mt-2 text-content'>Os desafios abertos aparecem aqui com prazo e prêmio.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
