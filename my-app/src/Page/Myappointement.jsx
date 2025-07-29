import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Myappointement = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const navigate = useNavigate()
  const slotDateFormat = (slotDate) => {
  const dateArray = slotDate.split('_');
  const day = dateArray[0];
  const monthIndex = Number(dateArray[1]) - 1; // ✅ Fix here
  const year = dateArray[2];

  return `${day} ${months[monthIndex]} ${year}`;
};

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments)
        // console.log("Appointments:", data.appointments);
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Something went wrong while fetching appointments");
    }
  };


  const cancelAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/user/cancel-appointment',
      { appointmentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getUserAppointments(); // Refresh appointments after cancellation

    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const initpay = (order)=>{
const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay public key
    amount: order.amount,                      // Amount in paise (e.g. ₹500 => 50000)
    currency: order.currency,                  // Currency (e.g. INR)
    name: 'Appointment Payment',
    description: 'Appointment Payment',
    order_id: order.id,                        // Razorpay order_id from backend
    receipt: order.receipt,
    handler: async (response) => {
      console.log("Payment Success:", response);
    try {
      const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if(data.success){
        getUserAppointments()
        navigate('/my-appointments')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
      // You can add an API call here to verify the payment and update backend
      // Example: await axios.post('/api/user/payment-success', response)
    },
    theme: {
      color: '#3399cc',
    },
  };
 console.log("Razorpay Options:", options);

  const rzp = new window.Razorpay(options);
  rzp.open();
}

const appointmentRazorpay = async (appointmentId)=>{
  try{
    const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if(data.success){
        console.log("Razorpay Order from backend:", data.order);

        initpay(data.order)
      }
  }catch(error){

  }
}

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="p-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No appointments found.</p>
        ) : (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address?.line1 || "-"}</p>
                <p className="text-xs">{item.docData.address?.line2 || "-"}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>
                 {slotDateFormat(item.slotDate)} | {item.slotTime}

                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && item.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-100 ">Paid</button> }
               {!item.cancelled && !item.payment && <button onClick={()=>appointmentRazorpay(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>}
                {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">Cancel appointmen </button>}
                {item.cancelled && <button className="sm:min-w-48 border py-1 border-red-500 rounded text-red-500">Appointment cancelled</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Myappointement;
