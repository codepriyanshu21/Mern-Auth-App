import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const {backendUrl}=useContext(AppContent)
  axios.defaults.withCredentials=true;

  const navigate=useNavigate()
  const [email,setEmail]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [isEmailSent,setIsEmailSent]=useState('');
  // const [otpSent,setOtpSent]=useState(0);
  const [isOtpSubmitted,setIsOtpSubmitted]=useState(false);

  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const inputRefs = useRef([]);
  

  // Handle Input Change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only numbers

    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if not the last
      if (index < otpLength - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Key Events (Backspace, Arrows)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
      } else if (index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = "";
      }

      setOtp(newOtp);
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      // Move Right
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move Left
      inputRefs.current[index - 1].focus();
    }
  };

  // copy-paste function
  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray=paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  }

  const onSubmitEmail=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(backendUrl+ '/api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP=async(e)=>{
    e.preventDefault();
    const otpArray=inputRefs.current.map(e=>e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(backendUrl+ '/api/auth/reset-password',{email,otp,newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400'>
      <Link to='/'>
      <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      </Link>

      {/* enter email id */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h2 className="text-white text-2xl font-bold text-center mb-4">Reset password</h2>
        <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt='' className='w-3 h-3'/>
          <input type='email' placeholder='Email Address' className='bg-transparent outline-none text-white'
            value={email} onChange={e=>setEmail(e.target.value)} required
          />
        </div>
        <button className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>
      }

      {/* OTP Input Fields */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h2 className="text-white text-2xl font-bold text-center mb-4">Reset password OTP</h2>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email</p>

          {/* OTP Input Fields */}
          <div onPaste={handlePaste} className="flex justify-center gap-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                required
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-lg"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      }
      

      {/* enter the new password */}
      {isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h2 className="text-white text-2xl font-bold text-center mb-4">New password</h2>
        <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
          <img src={assets.lock_icon} alt='' className='w-3 h-3'/>
          <input type='password' placeholder='Password' className='bg-transparent outline-none text-white'
            value={newPassword} onChange={e=>setNewPassword(e.target.value)} required
          />
        </div>
        <button className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword