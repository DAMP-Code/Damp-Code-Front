import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import { homeByRole } from '@/app-components/utilities/roles'
import { Link } from 'react-router-dom'
import ColorBends from '@/app-components/ColorBends'
import { formatMoney, totalPrize } from '@/app-components/utilities/prizes'
import { useReducedMotion } from '@/app-components/utilities/useReducedMotion'

// "em 12 dias", "amanhã", "hoje"
function daysLeft(value) {
  if (!value) return null
  const days = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return null
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

const keyword = 'text-brand-light'
const name = 'text-highlight'
const plain = 'text-content'
const comment = 'text-content-secondary'

// trechos de entrega que o editor "digita", um depois do outro
const snippets = [
  {
    file: 'entrega.js',
    lines: [
      [[keyword, 'export function '], [name, 'melhorRota'], [plain, '(pedidos, transito) {']],
      [[comment, '  // pesa a distância pelo trânsito de cada bairro']],
      [[keyword, '  const '], [plain, 'custo = (p) => p.distancia * transito[p.bairro];']],
      [[keyword, '  return '], [plain, 'pedidos.'], [name, 'sort'], [plain, '((a, b) => custo(a) - custo(b));']],
      [[plain, '}']],
    ],
  },
  {
    file: 'solucao.py',
    lines: [
      [[keyword, 'def '], [name, 'limite_explicado'], [plain, '(cliente):']],
      [[comment, '    # por que o limite mudou, em linguagem simples']],
      [[plain, '    motivos = [m '], [keyword, 'for '], [plain, 'm '], [keyword, 'in '], [plain, 'cliente.historico '], [keyword, 'if '], [plain, 'm.peso > 0.3]']],
      [[keyword, '    return '], [plain, '{"limite": cliente.limite, "motivos": motivos}']],
    ],
  },
  {
    file: 'consulta.sql',
    lines: [
      [[keyword, 'SELECT '], [plain, 'bairro, '], [name, 'AVG'], [plain, '(tempo_entrega) '], [keyword, 'AS '], [plain, 'media']],
      [[keyword, 'FROM '], [plain, 'pedidos']],
      [[keyword, 'WHERE '], [plain, "criado_em > NOW() - INTERVAL '7 days'"]],
      [[keyword, 'GROUP BY '], [plain, 'bairro '], [keyword, 'ORDER BY '], [plain, 'media;']],
    ],
  },
]

const lineLength = (line) => line.reduce((sum, [, text]) => sum + text.length, 0)

// quantos caracteres o trecho tem (cada quebra de linha conta como um)
const snippetLength = (snippet) => snippet.lines.reduce((sum, line) => sum + lineLength(line), 0) + snippet.lines.length - 1

// altura fixa: o editor sempre tem o número de linhas do maior trecho
const MAX_LINES = Math.max(...snippets.map((snippet) => snippet.lines.length))

// Quebra o trecho em linhas com só os primeiros `typed` caracteres visíveis; o cursor fica onde a digitação parou.
function typedLines(snippet, typed) {
  const lines = []
  let remaining = typed
  let cursorPlaced = false
  for (let index = 0; index < MAX_LINES; index++) {
    const line = snippet.lines[index] || []
    const parts = []
    let showCursor = false
    if (!cursorPlaced && remaining >= 0) {
      let left = remaining
      for (const [color, text] of line) {
        if (left <= 0) break
        const visible = text.slice(0, left)
        parts.push([color, visible])
        left -= visible.length
      }
      const length = lineLength(line)
      // a digitação está nesta linha (ou acabou de chegar no fim dela)
      if (remaining <= length) {
        showCursor = true
        cursorPlaced = true
      }
      remaining -= length + 1
    }
    lines.push({ parts, showCursor })
  }
  return lines
}

const TypedEditor = ({ snippet, typed }) => (
  <div aria-hidden='true' className='overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624]/90 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm'>
    <div className='flex items-center gap-2 border-b border-white/10 px-4 py-3'>
      <span className='size-3 rounded-full bg-danger/80' />
      <span className='size-3 rounded-full bg-warning/80' />
      <span className='size-3 rounded-full bg-success/80' />
      <span className='ml-3 font-mono text-xs text-content-secondary'>{snippet.file}</span>
    </div>
    <pre className='overflow-hidden px-5 py-5 font-mono text-[13px] leading-7 sm:text-sm'>
      {typedLines(snippet, typed).map((line, index) => (
        <div key={index} className='flex gap-4 whitespace-pre'>
          <span className='w-4 shrink-0 select-none text-right text-content-secondary/50'>{index + 1}</span>
          <span className='min-w-0 overflow-hidden text-ellipsis whitespace-pre'>
            {line.parts.map(([color, text], part) => (
              <span key={part} className={color}>{text}</span>
            ))}
            {line.showCursor && (
              <span className='ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-highlight motion-reduce:animate-none' />
            )}
          </span>
        </div>
      ))}
    </pre>
  </div>
)

const Banner = () => {
  const { user } = useContext(AuthContext)
  const reducedMotion = useReducedMotion()
  const [hackathons, setHackathons] = useState([])
  const [snippetIndex, setSnippetIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [featuredIndex, setFeaturedIndex] = useState(0)

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

  // digita o trecho; terminou, espera um pouco e passa para o próximo (e para o próximo desafio em destaque)
  const snippet = snippets[snippetIndex]
  const total = snippetLength(snippet)
  useEffect(() => {
    if (reducedMotion) return
    if (typed < total) {
      const timer = setTimeout(() => setTyped((value) => value + 1), 28)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => {
      setTyped(0)
      setSnippetIndex((value) => (value + 1) % snippets.length)
      setFeaturedIndex((value) => value + 1)
    }, 2800)
    return () => clearTimeout(timer)
  }, [typed, total, reducedMotion])

  // números de verdade da plataforma: desafios abertos, prêmios em jogo e empresas
  const open = hackathons
    .filter((h) => ['Publicado', 'Ativo'].includes(h.fase))
    .sort((a, b) => totalPrize(b) - totalPrize(a))
  const prizes = open.reduce((sum, h) => sum + totalPrize(h), 0)
  const companies = new Set(hackathons.map((h) => h.empresa).filter(Boolean)).size
  const featured = open.length ? open[featuredIndex % open.length] : null
  const deadline = featured && (featured.fase === 'Publicado' ? daysLeft(featured.dataInicio) : daysLeft(featured.dataFinal))

  const stats = [
    { value: open.length, label: open.length === 1 ? 'desafio aberto' : 'desafios abertos' },
    { value: prizes > 0 ? formatMoney(prizes).replace(/,00$/, '') : '—', label: 'em prêmios' },
    { value: companies, label: companies === 1 ? 'empresa' : 'empresas' },
  ]

  return (
    <div className='relative w-full overflow-hidden border-b border-white/5'>
      {/* FUNDO: ondas em WebGL que seguem o mouse (sem animação, fica um degradê parado) */}
      <div aria-hidden='true' className='absolute inset-0'>
        {reducedMotion ? (
          <div className='size-full bg-[radial-gradient(circle_at_80%_30%,rgba(108,72,197,0.45),transparent_55%)]' />
        ) : (
          <ColorBends
            className='opacity-70'
            colors={['#6C48C5', '#C68FE6', '#2a1466']}
            rotation={30}
            speed={0.18}
            scale={1.15}
            frequency={1.2}
            warpStrength={1.1}
            mouseInfluence={0.8}
            parallax={0.6}
            noise={0.08}
            intensity={1.2}
          />
        )}
        {/* escurece a esquerda para o texto continuar legível */}
        <div className='pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,var(--color-surface)_0%,rgba(23,10,54,0.85)_40%,rgba(23,10,54,0.25)_75%,rgba(23,10,54,0.1)_100%)]' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-surface to-transparent' />
      </div>

      {/* o conteúdo deixa o mouse passar para o fundo; só botões, links e o cartão recebem clique */}
      <div className='pointer-events-none relative z-[3] mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8 lg:py-24'>
        {/* TEXTO */}
        <div className='flex min-w-0 flex-col gap-6'>
          <h1 className='text-4xl font-bold leading-[1.05] tracking-tight text-content sm:text-5xl xl:text-6xl'>
            Onde desafios reais viram conquistas reais
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-content-secondary'>
            Empresas publicam um problema de verdade. Você entrega o código, a empresa avalia e os melhores levam o prêmio.
          </p>
          <div className='pointer-events-auto flex flex-wrap gap-3'>
            {/* quem já entrou vai para o próprio painel em vez de criar conta */}
            <Link
              to={user ? homeByRole[user.role] || '/' : '/escolha'}
              className='rounded-xl bg-highlight px-7 py-4 text-lg font-bold text-surface shadow-[0_16px_35px_rgba(255,234,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110'
            >
              {user ? 'Ir para o meu painel' : 'Comece agora'}
            </Link>
            <Link
              to='/explore'
              className='rounded-xl border border-white/15 bg-surface/40 px-7 py-4 text-lg font-semibold text-content backdrop-blur-sm transition hover:border-white/30 hover:bg-white/5'
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
        <div className='relative mx-auto w-full min-w-0 max-w-xl pb-32 sm:pb-28 lg:mx-0 lg:ml-auto'>
          <TypedEditor snippet={snippet} typed={reducedMotion ? total : typed} />

          <div className='pointer-events-auto absolute bottom-0 left-4 right-4 rounded-2xl border border-white/15 bg-surface-light/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md sm:left-auto sm:right-[-0.5rem] sm:w-80 lg:right-[-1.5rem]'>
            {featured ? (
              <>
                <div key={featured.hackathonId} className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
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
                </div>
                {open.length > 1 && (
                  <div className='mt-4 flex justify-center gap-2'>
                    {open.map((item, index) => (
                      <button
                        key={item.hackathonId}
                        type='button'
                        onClick={() => setFeaturedIndex(index)}
                        aria-label={`Mostrar ${item.titulo}`}
                        aria-current={index === featuredIndex % open.length}
                        className={`h-1.5 rounded-full transition-all ${
                          index === featuredIndex % open.length ? 'w-6 bg-highlight' : 'w-1.5 bg-white/25 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
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
