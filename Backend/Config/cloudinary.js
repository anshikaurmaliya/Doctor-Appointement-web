import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = async () =>{
    cloudinary.config({
        cloud_name:process.env.CLOUDINRY_NAME,
        api_key:process.env.CLOUDINRY_API_KEY,
        api_secret:process.env.CLOUDINRY_API_SECRETE_KEY
    })
}

export default connectCloudinary;