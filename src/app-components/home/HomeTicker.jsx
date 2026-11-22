import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faFire, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { formatMoney, totalPrize } from '@/app-components/utilities/prizes'

const API = 'https://localhost:7092/api/Hackathons'

// velocidade constante da faixa, em pixels por segundo (mais itens não deixam a faixa mais rápida)
const SPEED = 45

// Faixa que rola sem parar logo abaixo do topo: desafios abertos, vencedores e tecnologias pedidas.
// Para quando o mouse passa por cima; com "menos animação" no sistema ela fica parada e rola na mão.
const HomeTicker = () => {
  const [items, setItems] = useState([])
  // quantas vezes a lista se repete em cada metade: a metade precisa ser mais larga que a tela, senão sobra um buraco
  const [repeats, setRepeats] = useState(1)
  const [duration, setDuration] = useState(40)
  const trackRef = useRef(null)
  const groupRef = useRef(null)

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

  // mede a largura de uma volta da lista e repete até cobrir a tela com folga; recalcula ao redimensionar
  useLayoutEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group || items.length === 0) return

    function measure() {
      const setWidth = group.scrollWidth / repeats
      if (!setWidth) return
      const needed = Math.max(1, Math.ceil(track.clientWidth / setWidth) + 1)
      if (needed !== repeats) {
        setRepeats(needed)
        return
      }
      setDuration(group.scrollWidth / SPEED)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [items, repeats])

  if (items.length === 0) return null

  const copies = Array.from({ length: repeats }, (_, index) => index)

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
      <Link key={`${copy}-${item.key}`} to={item.to} tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined} className={`${className} transition hover:border-highlight/50`}>
        {content}
      </Link>
    ) : (
      <span key={`${copy}-${item.key}`} aria-hidden={copy ? true : undefined} className={className}>
        {content}
      </span>
    )
  }

  return (
    <section ref={trackRef} aria-label='Acontecendo agora' className='damp-marquee-track relative w-full overflow-hidden border-b border-white/5 py-4 motion-reduce:overflow-x-auto'>
      {/* bordas se apagando nas laterais */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent sm:w-32' />
      <div aria-hidden='true' className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent sm:w-32' />
      <div className='damp-marquee flex w-max' style={{ '--marquee-duration': `${duration}s` }}>
        {/* metade A: a lista repetida até passar da largura da tela (só a primeira volta é lida por leitores de tela) */}
        <div ref={groupRef} className='flex gap-3 pr-3'>
          {copies.map((copy) => items.map((item) => renderItem(item, copy === 0 ? '' : `r${copy}`)))}
        </div>
        {/* metade B: cópia idêntica da A; a animação anda exatamente uma metade e emenda sem tranco */}
        <div aria-hidden='true' className='flex gap-3 pr-3 motion-reduce:hidden'>
          {copies.map((copy) => items.map((item) => renderItem(item, `b${copy}`)))}
        </div>
      </div>
    </section>
  )
}

export default HomeTicker
