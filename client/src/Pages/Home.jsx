import React from 'react'
import Navbar from '../Components/Layout/Navbar'
import ChatPage from '../Components/Chat/ChatPage'

const Home = () => {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 flex overflow-hidden'>
        <ChatPage />
      </div>
    </div>
  )
}

export default Home
