import React from 'react'
import Title from '../Title'
import HackathonCard from '../HackathonCard'

const WeeklyHighlights = ({ hackathons }) => {
  return (
    <section className='flex h-auto w-full flex-col items-center justify-center py-6'>
      <div className='flex w-9/10 max-w-7xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
        <Title text1={"MELHORES"} text2={"DA SEMANA"} />
        <a className='rounded-lg px-3 py-2 text-sm font-semibold text-brand-light hover:bg-white/5 hover:text-highlight'>ver os outros</a>
      </div>

      <div className='flex w-9/10 max-w-7xl flex-col flex-wrap items-center justify-center gap-6 md:flex-row'>

        {hackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.HackathonId}
            hackathon={hackathon}
          />
        ))}

      </div>
    </section>
  )
}

export default WeeklyHighlights
