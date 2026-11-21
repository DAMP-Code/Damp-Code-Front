import WeeklyHighlights from '@/app-components/explore/WeeklyHighlights'
import Levels from '@/app-components/explore/Levels'
import Search from '@/app-components/explore/Search'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import ReceivedInvitations from '@/app-components/participant-dashboard/ReceivedInvitations'
import MyParticipations from '@/app-components/participant-dashboard/MyParticipations'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import { applyHackathonFilters, emptyFilters, hasActiveFilters } from '@/app-components/utilities/hackathonFilters'
import { useNavigate } from 'react-router-dom'


const ParticipantDashboard = () => {
  const [hackathons, setHackathons] = useState([])
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState(emptyFilters)
  const [companyAccess, setCompanyAccess] = useState(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  async function fetchHackathons() {
  try {
    const response = await fetch(
      "https://localhost:7092/api/Hackathons"
    )

    const data = await response.json()
    setHackathons(Array.isArray(data) ? data : [])

  } catch (error) {
    console.error(error)
  }
}

useEffect(() => {
  fetchHackathons()
}, [])

// funcionário de alguma empresa ganha o atalho para o painel dela
useEffect(() => {
  async function loadCompany() {
    try {
      const response = await fetch("https://localhost:7092/api/Companies/me", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      if (!response.ok) return
      setCompanyAccess(await response.json())
    } catch (error) {
      console.error(error)
    }
  }

  loadCompany()
}, [user?.token])

  const visibleHackathons = applyHackathonFilters(hackathons, filters, query)
  const filtered = hasActiveFilters(filters) || query.trim() !== ""

  return (
    <div className='bg-surface w-full min-h-screen'>
        <Header />
        <div className='mx-auto flex w-full max-w-[1600px]'>
          <Sidebar hackathons={hackathons} filters={filters} onChange={setFilters} />
          <div className='flex flex-col w-full'>
            {companyAccess && (
              <button
                onClick={() => navigate("/dashboard/Empresa")}
                className='mx-4 mt-8 self-start rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover sm:mx-6'
              >
                Painel da empresa · {companyAccess.name}
              </button>
            )}
            <ReceivedInvitations onAccepted={setCompanyAccess} />
            <MyParticipations />
            <Search onSearch={setQuery} />
            <WeeklyHighlights hackathons={visibleHackathons} filtered={filtered} onClear={() => setFilters(emptyFilters)} />
            <Levels />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default ParticipantDashboard
