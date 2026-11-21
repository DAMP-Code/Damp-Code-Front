import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/app-components/Header'
import Footer from '@/app-components/Footer'

// Página de texto legal (Termos, Privacidade): índice fixo ao lado que acompanha a leitura e seções numeradas.
// sections: [{ id, title, paragraphs: [string] }]
const LegalPage = ({ title, intro, updatedAt, sections, other }) => {
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
          <p className='mt-4 text-lg leading-relaxed text-content-secondary'>{intro}</p>
          <p className='mt-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning'>
            Texto provisório: o conteúdo definitivo será publicado em breve.
          </p>
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
          <div className='flex max-w-3xl flex-col gap-10'>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className='scroll-mt-28'>
                <h2 className='flex items-baseline gap-3 text-2xl font-bold'>
                  <span className='text-highlight tabular-nums'>{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                <div className='mt-4 flex flex-col gap-4 leading-relaxed text-content-secondary'>
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LegalPage
