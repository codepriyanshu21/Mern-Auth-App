import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate=useNavigate();
  const {userData,backendUrl,setUserData,setIsLoggedIn}=useContext(AppContent);

  const sendVerificationOtp=async()=>{
    try {
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  }

  const logout=async()=>{
    try {
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedIn(false);
      navigate('/')
      toast.success('Logout successfully')
      data.success && setUserData(false)
    } catch (error) {
      toast.error(data.error)
    }
  }
  return (
    <div className='w-full flex justify-between items-center  p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt='' className='w-28 sm:w-32'/>
        {userData ?
          <div className='w-8 h-8 rounded-full flex items-center justify-center bg-black text-white relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none whitespace-nowrap m-0 p-3  bg-gray-100 text-sm'>
                {!userData.isAccountVerified &&
                  <li onClick={sendVerificationOtp} className='py-1 px-2  hover:bg-gray-200 cursor-pointer'>Verify email</li>
                }
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
              </ul>
            </div>
          </div>
        : <Link to='/login'>
          <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100'>Login
          <img src={assets.arrow_icon}/></button>
          </Link>
        }
        
        
    </div>
  )
}

export default Navbar