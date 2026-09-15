import React from 'react'

const Title = ({text1, text2 }) => {
  return (
    <div className='flex items-start pb-5 text-left text-2xl font-bold tracking-tight sm:text-3xl'>
            <h1 className='border-b-2 border-highlight py-4 text-highlight'>
            {text1}
        </h1>
        <h1 className='border-b-2 border-brand-light py-4 pl-1 text-brand-light'>
            {text2}
        </h1>
        </div>
  )
}

export default Title
