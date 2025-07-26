import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Page/Home'
import Doctors from './Page/Doctors'
import Contact from './Page/Contact'
import Login from './Page/Login'
import About from './Page/About'
import Myappointement from './Page/Myappointement'
import Myprofile from './Page/Myprofile'
import Appointement from './Page/Appointement'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

  import { ToastContainer, toast } from 'react-toastify';
const App = () => {
  return (
    <div className='mx-3 sm:mx-[8%] '>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/'element={<Home/>} />
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/contacts'element={<Contact/>} />
        <Route path='/login'element={<Login/>} />
        <Route path='/about'element={<About/>} />
        <Route path='/my-appointments'element={<Myappointement/>}/>
        <Route path='/appointement'element={<Appointement/>}/>
        <Route path='/appointement/:docId'element={<Appointement/>}/>
        <Route path='/my-profile'element={<Myprofile/>}/>
 
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;
