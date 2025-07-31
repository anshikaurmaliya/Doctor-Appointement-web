import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets'
const AllApointments = () => {
  const {aToken,appointments,getAllAppointments,cancelAppointment} = useContext(AdminContext)
  const {calculateAge,slotDateFormat} = useContext(AppContext)
  useEffect(()=>{
    if(aToken){
      getAllAppointments()
    }
  },[aToken])
 return (
  <div className='w-full max-w-6xl m-5'>
    <p className='mb-3 text-lg font-medium'>All Appointments</p>

    <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
      
      {/* Header Row */}
      <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300'>
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Actions</p>
      </div>

      {/* Appointment Rows */}
      {appointments?.length > 0 ? appointments.map((item, index) => (
  <div
    key={item._id || index}
    className='flex flex-wrap justify-between items-center max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-200'
  >
    <p className='max-sm:hidden'>{index + 1}</p>

    <div className='flex text-center items-center gap-2'>
      <img
        src={item?.userData?.image || '/default-avatar.png'}
        alt='Patient'
        className='w-9 h-9 rounded-full object-cover'
      />
      <p>{item?.userData?.name || 'N/A'}</p>
    </div>

    <p>{calculateAge(item.userData.dob)}</p>
    <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>

     <div className='flex items-center gap-2'>
      <img
        src={item?.docData?.image || '/default-avatar.png'}
        alt='Patient'
        className=' bg-gray-200 w-9 h-9 rounded-full object-cover'
      />
      <p>{item?.docData?.name || 'N/A'}</p>
    </div>
    <p>${item?.amount || 0}</p>
{
  item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
    :<img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
}
  </div>
)) : <p className="p-4 text-gray-500">No appointments found.</p>}

    </div>
  </div>
);

}

export default AllApointments
