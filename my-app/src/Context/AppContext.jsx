import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySmbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token , setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

  // ✅ Correctly placed useEffect
  useEffect(() => {
    const getDoctorsData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    getDoctorsData();
  }, [backendUrl]);

  const value = {
    doctors,
    currencySmbol,
    token,setToken,
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
