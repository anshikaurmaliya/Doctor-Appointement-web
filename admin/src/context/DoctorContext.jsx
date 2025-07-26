import { createContext } from "react";
export const DoctorContext = createContext()

const DoctorContextProvider = (props)=>{

    const value ={
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