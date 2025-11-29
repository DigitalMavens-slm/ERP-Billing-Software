import React from 'react'
import { createContext ,useContext} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'



const LocationContext=createContext(null)
export const LocationProvider = ({children}) => {

    const location = useLocation();
    const navigate=useNavigate()

    const Goback=()=>{
      navigate("/setting")
    }
  return (
    <LocationContext.Provider value={{location,Goback}}>
        {children}
    </LocationContext.Provider>
  )
}

export const useAppLocation=()=>useContext(LocationContext)