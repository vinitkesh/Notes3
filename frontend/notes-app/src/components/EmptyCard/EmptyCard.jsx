import React from 'react'

const EmptyCard = () => {
  return (
    <div className='w-full h-full bg-transparent rounded-md flex flex-col justify-center items-center mt-20'>
        <p className='text-gray-500 text-2xl font-medium'>No notes to display</p>
        <p className='text-gray-400 text-lg mt-2'>Click on the '+' button to add a new note</p>
    </div>
  )
}

export default EmptyCard
