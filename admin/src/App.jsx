import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route,Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/DashBoard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';

const App = () => {
  const {aToken} = useContext(AdminContext)
  return aToken ?(
    <div className='bg-[#dfe4f8]'>
          <ToastContainer/>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar/>
            <Routes>
              <Route path='/' element ={<></>}></Route>
              <Route path='/admin-dashboard' element ={<DashBoard/>}></Route>
              <Route path='/all-appointments' element ={<AllApointments/>}></Route>
              <Route path='/add-doctor' element ={<AddDoctor/>}></Route>
              <Route path='/doctor-list' element ={<DoctorList/>}></Route>
            </Routes>
          </div>
    </div>
  ) : (
    <>
    <Login/>
    <ToastContainer/>
    
    </>
  )
}

export default App
