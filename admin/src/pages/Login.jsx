import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
const Login = () => {
    const [state, setState] = useState("Admin"); // 👈 default is Admin
    const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const { setAtoken, backendUrl } = useContext(AdminContext);
  const{setDToken} = useContext(DoctorContext)
  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
  
        if (data.success) {  // ✅ correct spelling
          console.log(data.token);
            localStorage.setItem('aToken',data.token)
          setAtoken(data.token);
        } else {
            toast.error(data.message)
        }
      } else {
        // Doctor login (you can add it later)

        const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
        if (data.success) {  // ✅ correct spelling
          console.log(data.token);
            localStorage.setItem('dToken',data.token)
          setDToken(data.token);
          console.log(data.token)
        } else {
            toast.error(data.message)
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
    return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto ">
            <span className="text-blue-600"> {state} </span>
            Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>
          <button className="bg-blue-600 text-white w-full py-2 rounded-md text-base">
            Login
          </button>
          <p>
            {state === "Admin" ? "Doctor" : "Admin"} Login?
            <span
              className="cursor-pointer text-blue-600 underline ml-1"
              onClick={() => setState(state === "Admin" ? "Doctor" : "Admin")}
            >
              Click here
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
