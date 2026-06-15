import React from 'react'

const WelcomeBanner = () => {
  return (
    <div className='rounded-lg bg-gradient-to-r from-orange-600 via-white-600 to-green-500 px-5 py-4 shadow-sm'>
      <h2 className='text-xl font-bold text-white md:text-2xl'>Welcome to Online Learning Platform</h2>
      <p className='mt-1 text-sm font-medium text-white/90 md:text-base'>
        Learn, Create and Explore Your favorite courses
      </p>
    </div>
  )
}

export default WelcomeBanner
