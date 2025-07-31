import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
export const DoctorContext = createContext()

const DoctorContextProvider = (props)=>{
      
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const [appointments,setAppointments] = useState([])
    const getAppointments = async()=>{
        try {
            const {data} = await axios.get(backendURL + '/api/doctor/appointments',{headers:{dToken}})
            if(data.success){
                setAppointments(data.appointments.reverse())
                console.log(data.appointments.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const value ={
        dToken,setDToken,backendURL,getAppointments,setAppointments,appointments
    }

    return(
        <DoctorContext.Provider value={value}>
            {/* child componrnts that will use the data 
            like navbar home all
            */}
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;