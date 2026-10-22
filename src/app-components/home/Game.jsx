import React from 'react'
import { Timeline } from './Timeline'
import { timelineData } from '@/data/timelineData'
import Title from '../Title'

const Game = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center pt-5'>
        <div className='flex w-9/10 items-start'>
            <Title text1="GAMEFICAÇÃO" />
        </div>
        <Timeline data={timelineData}/>
    </div>
  )
}

export default Game