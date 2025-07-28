import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../Components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointement = () => {
  const { docId } = useParams();
  const { currencySmbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // ✅ Fetch latest doctor data from backend
  const fetchDocInfo = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/${docId}`);
      if (data.success) {
        setDocInfo(data.doctor);
      } else {
        toast.error('Failed to fetch doctor details');
      }
    } catch (error) {
      console.error("fetchDocInfo error", error.message);
      toast.error('Server error while fetching doctor');
    }
  };

  // ✅ Generate available slots (skip booked)
  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const startTime = new Date(currentDate);
      startTime.setHours(10, 0, 0, 0); // 10:00 AM

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9:00 PM

      // For today: skip past time
      if (i === 0) {
        const now = new Date();
        if (now > startTime) {
          startTime.setHours(now.getHours());
          startTime.setMinutes(now.getMinutes() > 30 ? 0 : 30);
          if (now.getMinutes() > 30) startTime.setHours(startTime.getHours() + 1);
        }
      }

      let timeSlots = [];
      let loopTime = new Date(startTime);

      while (loopTime < endTime) {
        const formattedTime = loopTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = loopTime.getDate();
        const month = loopTime.getMonth() + 1;
        const year = loopTime.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotBooked = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime);

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(loopTime),
            time: formattedTime,
          });
        }

        loopTime.setMinutes(loopTime.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  const bookAppointement = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    try {
      const date = docSlot[slotIndex][0]?.datetime;
      if (!date || !slotTime) {
        return toast.error("Please select a valid time slot");
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(`${backendUrl}/api/user/book-appointement`, {
        docId,
        slotDate,
        slotTime,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); // refresh global state
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return (
    <div>
      {docInfo ? (
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="verified" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border border-gray-500 text-xs rounded-full'>{docInfo.experience}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="info" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>{currencySmbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading doctor info...</p>
      )}

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p className='font-bold text-xl'>Booking Slots</p>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              key={index}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-gray-600"}`}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot[slotIndex]?.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 border py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"}`}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointement}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      {docInfo && <RelatedDoctors docId={docId} speciality={docInfo.speciality} />}
    </div>
  );
};

export default Appointement;
