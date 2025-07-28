import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext.jsx'
const Navbar = () => {

    const navigate = useNavigate()

    const [showMenu,setShowmenu] = useState(false)
    const {token,setToken,userData} = useContext(AppContext) || {};

    const logout = ()=>{
      setToken(false)
      localStorage.removeItem('token')
    }
  return (
    <div className=' sticky flex justify-between items-center mb-4 text-sm py-4 border-b border-b-gray-500 '>
      <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'> 
            <li className='py-1'>HOME</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-14 m-auto hidden ' />
         </NavLink>
        <NavLink to='/doctors'>
            <li className='py-1'>All-DOCTORS</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-14 m-auto hidden' />
         </NavLink>
        <NavLink to='/about'>
            <li className='py-1'>ABOUT</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-14 m-auto hidden' />
         </NavLink>
        <NavLink to='/contacts'>
            <li className='py-1'>CONTACT</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-14 m-auto hidden' />
         </NavLink>
      </ul>
      <div className='flex items-center'>
        {
            token && userData
            ? <div className='flex gap-3 cursor-pointer group relative'>
              <img className='rounded-full  w-8' src={userData.image} alt="" />
              <img  className='  w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 font-medium text-gray-400 z-20 hidden group-hover:block'>
                <div className='w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                   <p onClick={()=>navigate('my-profile')}  className='hover:text-black cursor-pointer '>My Profile</p>
                  <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor-pointer '>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer '>Logout</p>
                </div>
              </div>
            </div> 
            :<button onClick={()=>navigate('/login')} className='bg-primary text-white px-6 py-3 rounded-full font-light hidden md:block'>Create your Account</button>
 
        } 
        <img onClick={()=>setShowmenu(true)} className='w-6 ml-4 md:hidden' src={assets.menu_icon} alt="" />
        <div className={`${showMenu ? 'fixed  w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={()=>setShowmenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
 <NavLink  onClick={()=>setShowmenu(false)} to='/'> <p className='px-4 py-2 rounded inline-block ' >HOME</p></NavLink>            
 <NavLink onClick={()=>setShowmenu(false)} to='/doctors'> <p className='px-4 py-2 rounded inline-block ' >ALL DOCTORS</p></NavLink>            
 <NavLink onClick={()=>setShowmenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block ' > ABOUT</p></NavLink>            
 <NavLink  onClick={()=>setShowmenu(false)} to='/contacts'><p className='px-4 py-2 rounded inline-block ' >CONTACT</p></NavLink>            
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
