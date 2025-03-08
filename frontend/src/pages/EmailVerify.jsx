import React, { useState, useRef, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials=true
  const navigate=useNavigate()
  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const inputRefs = useRef([]);
  const {backendUrl,isLoggedIn,userData}=useContext(AppContent)

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


  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value)
      const otp=otpArray.join('')
      const {data}=await axios.post(backendUrl + '/api/auth/verify-account', {otp})

      if(data.success){
        toast.success(data.message);
        navigate('/')
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  }

  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn,userData])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={onSubmitHandler} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify Your Email</h2>
        <p className="text-sm text-gray-500 text-center mt-2">Enter the OTP sent to your email</p>

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
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-lg font-semibold text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
