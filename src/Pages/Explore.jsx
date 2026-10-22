import WeeklyHighlights from '@/app-components/explore/WeeklyHighlights'
import Levels from '@/app-components/explore/Levels'
import Search from '@/app-components/explore/Search'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import CreateChallenge from '@/app-components/explore/CreateChallenge'
import React, { useEffect, useState } from 'react'

const Explore = () => {
  const [hackathons, setHackathons] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadHackathons() {
      try {
        const response = await fetch("https://localhost:7092/api/Hackathons")
        const data = await response.json()
        if (!cancelled) setHackathons(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setHackathons([])
      }
    }

    loadHackathons()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleHackathons = hackathons.filter((hackathon) => {
    const term = query.trim().toLowerCase()
    if (!term) return true
    const haystack = [hackathon.titulo, hackathon.empresa, ...(hackathon.tecnologias || [])]
      .join(" ")
      .toLowerCase()
    return haystack.includes(term)
  })

  return (
    <div className='bg-surface w-full min-h-screen'>
        <Header />
        <div className='mx-auto flex w-full max-w-[1600px]'>
          <Sidebar />
          <div className='flex flex-col w-full'>
            <Search onSearch={setQuery} />
            <WeeklyHighlights hackathons={visibleHackathons} />
            <Levels />
            <CreateChallenge />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default Explore
