import React from 'react'

function Heading({text} :{text: string} ) {
  return (
 <>
  <h1 className='text-2xl font-bold'>{text}</h1>
  </>
  )
}

export default Heading
