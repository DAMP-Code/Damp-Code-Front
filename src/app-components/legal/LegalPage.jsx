import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/app-components/Header'
import Footer from '@/app-components/Footer'

// Trechos entre **asteriscos** viram negrito, como no texto original dos documentos.
const Inline = ({ text }) =>
  text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className='font-semibold text-content'>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )

// Parágrafo que começa pelo número da cláusula ("2.4. ...") mostra o número destacado.
const Paragraph = ({ text }) => {
  const clause = text.match(/^(\d+\.\d+\.)\s(.*)$/s)
  if (!clause) {
    return (
      <p>
        <Inline text={text} />
      </p>
    )
  }
  return (
    <p>
      <span className='mr-1.5 font-semibold text-brand-light tabular-nums'>{clause[1]}</span>
      <Inline text={clause[2]} />
    </p>
  )
}

// Cada bloco da seção é um parágrafo (texto), uma lista ({ list }) ou um subtítulo ({ subtitle }).
const Block = ({ block }) => {
  if (typeof block === 'string') return <Paragraph text={block} />
  if (block.subtitle) return <h3 className='mt-2 text-lg font-semibold text-content'>{block.subtitle}</h3>
  return (
    <ul className='flex flex-col gap-2 pl-1'>
      {block.list.map((item, i) => (
        <li key={i} className='flex gap-3'>
          <span aria-hidden='true' className='mt-2.5 size-1.5 shrink-0 rounded-full bg-highlight' />
          <span>
            <Inline text={item} />
          </span>
        </li>
      ))}
    </ul>
  )
}

// Página de texto legal (Termos, Privacidade): índice fixo ao lado que acompanha a leitura e seções numeradas.
// sections: [{ id, title, summary, blocks }], summary é a versão resumida da seção.
const LegalPage = ({ title, intro, updatedAt, sections, closing, other }) => {
  const [current, setCurrent] = useState(sections[0]?.id)

  // marca no índice a seção que está na tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setCurrent(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -60% 0px' },
    )
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [sections])

  // rola até a seção pelo próprio índice (o pulo nativo da âncora não acontece com a rolagem suave do site)
  function goTo(e, id) {
    e.preventDefault()
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
    setCurrent(id)
  }

  return (
    <div className='min-h-screen bg-surface text-content'>
      <Header />
      <main className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16'>
        <header className='max-w-3xl'>
          <p className='text-sm font-semibold text-brand-light'>Damp Code · atualizado em {updatedAt}</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>{title}</h1>
          <div className='mt-4 flex flex-col gap-3 text-lg leading-relaxed text-content-secondary'>
            {intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </header>

        <div className='mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]'>
          {/* ÍNDICE */}
          <nav aria-label='Nesta página' className='lg:sticky lg:top-28 lg:h-fit'>
            <p className='mb-3 text-sm font-semibold text-content'>Nesta página</p>
            <ol className='flex flex-col gap-1 border-l border-white/10'>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => goTo(e, section.id)}
                    aria-current={current === section.id ? 'location' : undefined}
                    className={`-ml-px flex gap-2 border-l-2 py-1.5 pl-4 text-sm transition ${
                      current === section.id ? 'border-highlight text-highlight' : 'border-transparent text-content-secondary hover:text-content'
                    }`}
                  >
                    <span className='tabular-nums'>{index + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            {other && (
              <Link to={other.to} className='mt-6 inline-block text-sm font-semibold text-brand-light hover:text-highlight'>
                {other.label}
              </Link>
            )}
          </nav>

          {/* SEÇÕES */}
          <div className='flex max-w-3xl flex-col gap-14'>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className='scroll-mt-28'>
                <h2 className='flex items-baseline gap-3 text-2xl font-bold'>
                  <span className='text-highlight tabular-nums'>{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                {section.summary && (
                  <div className='mt-4 rounded-xl border-l-2 border-highlight bg-white/[0.04] px-4 py-3'>
                    <p className='text-sm font-semibold text-highlight'>Em resumo</p>
                    <div className='mt-1 flex flex-col gap-2 text-sm leading-relaxed text-content'>
                      {section.summary.map((block, i) => (
                        <Block key={i} block={block} />
                      ))}
                    </div>
                  </div>
                )}
                <div className='mt-5 flex flex-col gap-4 leading-relaxed text-content-secondary'>
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
            {closing && <p className='border-t border-white/10 pt-8 text-content-secondary'>{closing}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LegalPage
