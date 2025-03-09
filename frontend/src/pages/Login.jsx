import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            let response;
            
            if (state === 'Sign Up') {
                response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
            } else {
                response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
            }

            const { data } = response;
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
                navigate('/');
                toast.success(state === 'Sign Up' ? 'Account created successfully' : 'Logged in successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400'>
            <Link to='/'>
                <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            </Link>
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} />
                            <input 
                                onChange={e => setName(e.target.value)}
                                value={name}
                                className='px-1 bg-transparent text-white outline-none' 
                                type="text" 
                                placeholder="Full Name" 
                                required 
                            />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} />
                        <input 
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            className='px-1 bg-transparent text-white outline-none' 
                            type="email" 
                            placeholder="Email Address" 
                            required 
                        />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} />
                        <input 
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className='px-1 bg-transparent text-white outline-none' 
                            type="password" 
                            placeholder="Password" 
                            required 
                        />
                    </div>

                    <Link to='/reset-password'>
                        <p className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p>
                    </Link>

                    <button className='w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
                        {state}
                    </button>
                </form>

                <p className='text-gray-400 text-center text-xs mt-4'>
                    {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} className='text-blue-500 cursor-pointer underline'>
                        {state === 'Sign Up' ? 'Login here' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
