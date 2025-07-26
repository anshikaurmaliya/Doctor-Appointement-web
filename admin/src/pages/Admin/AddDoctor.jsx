import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import {toast} from 'react-toastify';
import axios from "axios";
// import { data } from "react-router-dom";

const AddDoctor = () => {

  const[DocImg,setDocImg] = useState(false)
  const[name,setName] = useState('')
  const[email,setemail] = useState('')
  const[password,setpassword] = useState('')
  const[experience,setexperience] = useState(1)
  const[fees,setFees] = useState('')
  const[about,setAbout] = useState('')
  const[speciallity,setSpeciallity] = useState('physician')
  const[degree,setDegree] = useState('')
  const[address1,setAddress1] = useState('')
  const[address2,setAddress2] = useState('')

const {backendUrl,aToken} = useContext(AdminContext)
  const onSubmitHandler = async (event) =>{
      event.preventDefault()

      try{
        if(!DocImg)
        {
          return toast.error('Image not selected')
        }
        const formData = new FormData()
        formData.append('image',DocImg)
        formData.append('name',name)
        formData.append('email',email)
        formData.append('password',password)
        formData.append('experience',experience)
        formData.append('fees',Number(fees))
        formData.append('about',about)
        formData.append('speciality',speciallity)
        formData.append('degree',degree)
        formData.append('address',JSON.stringify({line1:address1,line2:address2}))
       //console log

      //  formData.forEach((value,key)=>{
      //   console.log(`${key}:${value}`);
        
      //  })
const { data } = await axios.post(
  backendUrl + '/api/admin/add-doctor',
  formData,
  {
   headers: {
  'Authorization': `Bearer ${aToken}`, // ✅ CORRECT
  "Content-Type": "multipart/form-data"

}

  }
);
         if(data.success)
         {
console.log("Token being sent:", aToken);
          toast.success(data.message)
          setDocImg(false)
          setName('')
          setpassword('')
          setemail('')
          setAddress1('')
          setAddress2('')
          setDegree('')
          setAbout('')
          setFees('')
         }else{
          toast.error(data.message)
         }
      }catch(error){
        toast.error("Already regiseter")
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-600 ">
          <label htmlFor="doc-img">
            <img className="w-16 bg-gray-300 rounded-full cursor-pointer" src={DocImg ?URL.createObjectURL(DocImg): assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1 ">
              <p>Doctor name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="Name" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input onChange={(e)=>setemail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="Email" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor password</p>
              <input onChange={(e)=>setpassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder="Password" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select onChange={(e)=>setexperience(Number(e.target.value))} value={experience} className="border rounded px-3 py-2" name="" id="">
                <option value={1}>1 Year</option>
               <option value={2}>2 Year</option>
  <option value={3}>3 Year</option>
  <option value={4}>4 Year</option>
  <option value={5}>5 Year</option>
  <option value={6}>6 Year</option>
  <option value={7}>7 Year</option>
  <option value={8}>8 Year</option>
  <option value={9}>9 Year</option>
               <option value={10}>10 Year</option>

              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="number" placeholder="Fees" required />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciallity</p>
              <select onChange={(e)=>setSpeciallity(e.target.value)} value={speciallity} className="border rounded px-3 py-2" name="" id="">
                <option value="physician">  physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist" >Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className="border rounded px-3 py-2" type="text" placeholder="Education" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="Address 1" required />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder="Address 2" required />
            </div>
          </div>
        </div>
        <div>
              <p className="mt-4 mb-2"> About Doctor </p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded"  placeholder=" write about Doctor.." row={5} required />
            </div>
            <button type='submit' className="bg-blue-600 px-10 py-3 mt-4 text-white rounded-full">Add doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
