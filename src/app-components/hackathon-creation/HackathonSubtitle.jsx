import React from 'react'

const HackathonSubtitle = ({text1, text2, color1, color2}) => {
  return (
    <div className="flex text-xl font-bold pb-5 items-start text-start">
      <h1
        style={{
          color: color1,
          borderColor: color1,
        }}
        className="py-5 border-b-2"
      >
        {text1}
      </h1>
      <h1
        className="py-5 pl-1 border-b-2"
        style={{
          color: color2,
          borderColor: color2,
        }}
      >
        {text2}
      </h1>
    </div>
  )
}

export default HackathonSubtitle