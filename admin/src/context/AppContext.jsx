import { createContext } from "react";
export const AppContext = createContext()

const AppContextProvider = (props)=>{

    const value ={
    }

    return(
        <AppContext.Provider value={value}>
            {/* child componrnts that will use the data 
            like navbar home all
            */}
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;