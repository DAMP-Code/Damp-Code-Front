import WeeklyHighlights from '@/app-components/explore/WeeklyHighlights'
import Levels from '@/app-components/explore/Levels'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'


const ParticipantDashboard = () => {
  const [hackathons, setHackathons] = useState([])

  async function fetchHackathons() {
  try {
    const response = await fetch(
      "https://localhost:7092/api/Hackathons"
    )

    const data = await response.json()

    console.log("Dados vindos da API:")
    console.log(data)

    setHackathons(data)

  } catch (error) {
    console.error(error)
  }
}

useEffect(() => {
  fetchHackathons()
}, [])

useEffect(() => {
  console.log("Estado hackathons:")
  console.log(hackathons)
}, [hackathons])

  return (
    <div className='bg-surface w-full min-h-screen'>
        <Header />
        <div className='mx-auto flex w-full max-w-[1600px]'>
          <Sidebar />
          <div className='flex flex-col w-full'>
            <Search />
            <WeeklyHighlights hackathons={hackathons} />
            <Levels />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default ParticipantDashboard
