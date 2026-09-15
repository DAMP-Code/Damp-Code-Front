import WeeklyHighlights from '@/app-components/explore/WeeklyHighlights'
import Levels from '@/app-components/explore/Levels'
import Search from '@/app-components/explore/Search'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import CreateChallenge from '@/app-components/explore/CreateChallenge'
import React from 'react'

const Explore = () => {
  return (
    <div className='bg-surface w-full min-h-screen'>
        <Header />
        <div className='mx-auto flex w-full max-w-[1600px]'>
          <Sidebar />
          <div className='flex flex-col w-full'>
            <Search />
            <WeeklyHighlights />
            <Levels />
            <CreateChallenge />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default Explore
