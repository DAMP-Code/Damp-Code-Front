import React from 'react'
import { Timeline } from './Timeline'
import { timelineData } from '@/data/timelineData'
import Title from '../Title'

const Game = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center pt-5'>
        <div className='w-9/10 flex text-3xl font-bold pb-5 items-start text-start'>
            <h1 className='py-5 text-highlight border-b-2 border-highlight text-3xl font-bold'>GAMEFICAÇÃO</h1>
        </div>
        <Timeline data={timelineData}/>
    </div>
  )
}

export default Game