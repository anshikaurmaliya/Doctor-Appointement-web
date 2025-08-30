import React, { useEffect } from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets'

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl mx-auto p-4'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto'>
        {/* Header for larger screens */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments.reverse().map((item, index) => (
            <div
              key={index}
              className='flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-3 sm:gap-1 items-start sm:items-center text-gray-500 py-3 px-4 sm:px-6 border-b hover:bg-gray-50 text-sm sm:text-base'
            >
              <p className='hidden sm:block'>{index + 1}</p>

              <div className='flex items-center gap-2'>
                <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>

              <div>
                <p className='text-xs border border-blue-300 px-2 rounded-full inline-block'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>

              <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>

              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>${item.amount}</p>

              {
                item.cancelled ? (
                  <p className='text-red-500 text-sm font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-sm font-medium'>Completed</p>
                ) : (
                  <div className='flex gap-2'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-6 sm:w-8 cursor-pointer' src={assets.cancel_icon} alt="Cancel" />
                    <img onClick={() => completeAppointment(item._id)} className='w-6 sm:w-8 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorAppointment
