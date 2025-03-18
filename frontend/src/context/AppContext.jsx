import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent=createContext()

export const AppContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn]=useState(false)
    const [userData, setUserData]=useState(false)

    axios.defaults.withCredentials=true;

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            setIsLoggedIn(false);
            toast.error(error.response?.data?.message || "Error fetching auth state");
        }
    };
    
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                setIsLoggedIn(false);
                toast.error(data.message);
            }
        } catch (error) {
            setIsLoggedIn(false);
            toast.error(error.response?.data?.message || "Error fetching user data");
        }
    };
    
    
    useEffect(()=>{
        getAuthState()
    },[])
    const value={
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}