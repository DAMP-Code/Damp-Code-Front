import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '@/app-components/Header'
import Footer from '@/app-components/Footer'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import { homeByRole } from '@/app-components/utilities/roles'
import { useReducedMotion } from '@/app-components/utilities/useReducedMotion'

// Página para qualquer endereço que não existe: um terminal tenta abrir a URL e devolve o erro.
const NotFound = () => {
  const { pathname } = useLocation()
  const { user } = useContext(AuthContext)
  const reducedMotion = useReducedMotion()
  const command = `damp abrir ${pathname}`
  const [typed, setTyped] = useState(0)
  const done = reducedMotion || typed >= command.length

  // digita o comando letra por letra
  useEffect(() => {
    if (done) return
    const timer = setTimeout(() => setTyped((value) => value + 1), 45)
    return () => clearTimeout(timer)
  }, [typed, done])

  const home = user ? homeByRole[user.role] || '/' : '/'
  // o prompt usa o primeiro nome de quem está logado
  const prompt = `${(user?.name || 'visitante').split(' ')[0].toLowerCase()}@damp`
  const shortcuts = [
    { to: home, label: user ? 'Ir para o meu painel' : 'Voltar para o início' },
    { to: '/explore', label: 'Ver desafios abertos' },
    { to: '/ranking', label: 'Ver o ranking' },
  ]

  return (
    <div className='min-h-screen bg-surface text-content'>
      <Header />
      <main className='relative flex flex-1 items-center overflow-hidden px-4 py-16 sm:px-6'>
        {/* "404" gigante ao fundo */}
        <p
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[38vw] font-black leading-none tracking-tighter text-white/[0.04] lg:text-[22rem]'
        >
          404
        </p>

        <div className='relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2'>
          <div className='flex flex-col items-start gap-5'>
            <p className='rounded-full border border-highlight/40 bg-highlight/10 px-3 py-1 text-sm font-semibold text-highlight'>Erro 404</p>
            <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>Essa página não existe.</h1>
            <p className='max-w-md text-lg text-content-secondary'>
              O endereço pode ter sido digitado errado, ou a página mudou de lugar. Estes caminhos levam a algum lugar:
            </p>
            <div className='flex flex-wrap gap-3'>
              {shortcuts.map((item, index) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className={
                    index === 0
                      ? 'rounded-xl bg-highlight px-5 py-3 font-bold text-surface transition hover:-translate-y-0.5 hover:brightness-110'
                      : 'rounded-xl border border-white/15 px-5 py-3 font-semibold text-content transition hover:border-white/30 hover:bg-white/5'
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* TERMINAL */}
          <div aria-hidden='true' className='overflow-hidden rounded-2xl border border-white/10 bg-[#0e0624] shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
            <div className='flex items-center gap-2 border-b border-white/10 px-4 py-3'>
              <span className='size-3 rounded-full bg-danger/80' />
              <span className='size-3 rounded-full bg-warning/80' />
              <span className='size-3 rounded-full bg-success/80' />
              <span className='ml-3 font-mono text-xs text-content-secondary'>terminal</span>
            </div>
            <pre className='overflow-hidden whitespace-pre-wrap break-all px-5 py-5 font-mono text-sm leading-7'>
              <span className='text-success'>{prompt}</span>
              <span className='text-content-secondary'>:~$ </span>
              <span className='text-content'>{reducedMotion ? command : command.slice(0, typed)}</span>
              {!done && <span className='ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-highlight' />}
              {done && (
                <>
                  {'\n'}
                  <span className='text-danger'>erro 404:</span>
                  <span className='text-content'> rota não encontrada</span>
                  {'\n'}
                  <span className='text-content-secondary'>{'// talvez você quis dizer:'}</span>
                  {'\n'}
                  <span className='text-brand-light'>  /explore</span>
                  <span className='text-content-secondary'>   desafios abertos</span>
                  {'\n'}
                  <span className='text-brand-light'>  /ranking</span>
                  <span className='text-content-secondary'>   classificação dos Hackathons</span>
                  {'\n'}
                  <span className='text-success'>{prompt}</span>
                  <span className='text-content-secondary'>:~$ </span>
                  <span className='inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-highlight motion-reduce:animate-none' />
                </>
              )}
            </pre>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
