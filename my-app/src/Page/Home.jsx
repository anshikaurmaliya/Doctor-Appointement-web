import React from 'react'
import Header from '../Components/Header'
import SpecalityMenu from '../Components/SpecalityMenu'
import Topdoctors from '../Components/Topdoctors'
import Banner from '../Components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecalityMenu/>
      <Topdoctors/>
      <Banner/>
    </div>
  )
}

export default Home
