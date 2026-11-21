import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faFire, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { formatMoney, totalPrize } from '@/app-components/utilities/prizes'

const API = 'https://localhost:7092/api/Hackathons'

// Faixa que rola sem parar logo abaixo do topo: desafios abertos, vencedores e tecnologias pedidas.
// Para quando o mouse passa por cima; com "menos animação" no sistema ela fica parada e rola na mão.
const HomeTicker = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(API)
        if (!response.ok) return
        const hackathons = await response.json()
        if (!Array.isArray(hackathons)) return

        const open = hackathons
          .filter((h) => ['Publicado', 'Ativo'].includes(h.fase))
          .map((h) => ({
            key: `aberto-${h.hackathonId}`,
            icon: faFire,
            to: `/hackathon/${encodeURIComponent(h.hackathonId)}`,
            text: `${h.titulo} · ${h.empresa}`,
            extra: totalPrize(h) > 0 ? formatMoney(totalPrize(h)).replace(/,00$/, '') : null,
          }))

        // vencedor (1º lugar) de cada resultado publicado
        const winners = (
          await Promise.all(
            hackathons
              .filter((h) => h.resultadoPublicado)
              .map(async (h) => {
                const result = await fetch(`${API}/${encodeURIComponent(h.hackathonId)}/resultado`).then((r) => (r.ok ? r.json() : null))
                const first = result?.classificacao?.find((entry) => entry.posicao === 1)
                return first
                  ? {
                      key: `vencedor-${h.hackathonId}`,
                      icon: faTrophy,
                      to: `/ranking?hackathon=${encodeURIComponent(h.hackathonId)}`,
                      text: `${first.nome} venceu ${h.titulo}`,
                      extra: first.premio?.tipo === 'Dinheiro' ? formatMoney(first.premio.valor).replace(/,00$/, '') : null,
                    }
                  : null
              }),
          )
        ).filter(Boolean)

        const technologies = [...new Set(hackathons.flatMap((h) => h.tecnologias || []))].map((technology) => ({
          key: `tec-${technology}`,
          icon: faCode,
          text: technology,
        }))

        // intercala os tipos para a faixa não ficar com um bloco só de tecnologias
        const mixed = []
        const lists = [open, winners, technologies]
        for (let i = 0; lists.some((list) => i < list.length); i++) {
          for (const list of lists) if (list[i]) mixed.push(list[i])
        }
        setItems(mixed)
      } catch (error) {
        console.error(error)
      }
    }

    load()
  }, [])

  if (items.length === 0) return null

  const renderItem = (item, copy) => {
    const content = (
      <>
        <FontAwesomeIcon icon={item.icon} className={item.icon === faTrophy ? 'text-highlight' : item.icon === faFire ? 'text-danger' : 'text-brand-light'} />
        <span className='text-content'>{item.text}</span>
        {item.extra && <span className='font-semibold text-highlight'>{item.extra}</span>}
      </>
    )
    const className = 'flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-surface-light/70 px-4 py-2 text-sm'
    return item.to ? (
      <Link key={`${copy}-${item.key}`} to={item.to} tabIndex={copy ? -1 : undefined} className={`${className} transition hover:border-highlight/50`}>
        {content}
      </Link>
    ) : (
      <span key={`${copy}-${item.key}`} className={className}>
        {content}
      </span>
    )
  }

  return (
    <section aria-label='Acontecendo agora' className='damp-marquee-track relative w-full overflow-hidden border-b border-white/5 py-4 motion-reduce:overflow-x-auto'>
      {/* bordas se apagando nas laterais */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent sm:w-32' />
      <div aria-hidden='true' className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent sm:w-32' />
      <div className='damp-marquee flex w-max'>
        <div className='flex gap-3 pr-3'>{items.map((item) => renderItem(item, ''))}</div>
        {/* cópia do mesmo tamanho para a faixa emendar sem tranco (escondida de leitores de tela) */}
        <div aria-hidden='true' className='flex gap-3 pr-3 motion-reduce:hidden'>
          {items.map((item) => renderItem(item, 'copia'))}
        </div>
      </div>
    </section>
  )
}

export default HomeTicker
