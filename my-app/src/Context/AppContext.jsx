import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySmbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(null);

  // Load all doctors
  useEffect(() => {
    const getDoctorsData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          toast.error(data.message || "Failed to fetch doctors");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error loading doctors list");
      }
    };

    getDoctorsData();
  }, [backendUrl]);

  // Load user profile
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user); // ✅ Expecting `user` key from backend
      } else {
        toast.error(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Profile Load Error:", error);
      toast.error("Something went wrong while fetching profile data");
    }
  };

  // Load profile if token is available
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null); // ✅ null instead of false
    }
  }, [token]);

  const value = {
    currencySmbol,
    backendUrl,
    doctors,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
