import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '../Title'
import ResultBoard from '../hackathon-page/ResultBoard'
import { AuthContext } from '../utilities/AuthContext'

const API = 'https://localhost:7092/api/Hackathons'

// Ranking ao vivo: o pódio do resultado publicado mais recente, direto da API.
const HomeRanking = () => {
  const { user } = useContext(AuthContext)
  const [latest, setLatest] = useState(null)
  const [result, setResult] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(API)
        const hackathons = response.ok ? await response.json() : []
        const published = (Array.isArray(hackathons) ? hackathons : [])
          .filter((item) => item.resultadoPublicado)
          .sort((a, b) => new Date(b.dataFimAvaliacao || 0) - new Date(a.dataFimAvaliacao || 0))
        const first = published[0]
        if (first) {
          const resultResponse = await fetch(
            `${API}/${encodeURIComponent(first.hackathonId)}/resultado`,
            user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined,
          )
          if (resultResponse.ok) {
            setLatest(first)
            setResult(await resultResponse.json())
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoaded(true)
      }
    }

    load()
  }, [user?.token])

  return (
    <section className='w-full border-y border-white/5 bg-surface-light/25 py-16 lg:py-20'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 lg:px-8'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <Title text1={'Ranking ao'} text2={'vivo'} />
            {latest && (
              <p className='text-content-secondary'>
                Último resultado: <b className='text-content'>{latest.titulo}</b> · {latest.empresa}
              </p>
            )}
          </div>
          <Link to='/ranking' className='mb-1 shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-brand-light hover:bg-white/5 hover:text-highlight'>
            Ver ranking completo
          </Link>
        </div>

        {result ? (
          <ResultBoard result={result} limit={3} />
        ) : (
          loaded && (
            <p className='rounded-2xl border border-white/10 bg-surface-light p-6 text-content-secondary'>
              Quando uma empresa publicar o resultado de um Hackathon, o pódio aparece aqui.
            </p>
          )
        )}
      </div>
    </section>
  )
}

export default HomeRanking
