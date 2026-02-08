import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>

        <img onClick={()=>navigate('/')} className='cursor-pointer w-28 sm:w-32
        lg:w-40' src={assets.logo} width={150}/>

        <p className='flex-1 border-l border-gray-400
        pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @Imagify | All right reserved.</p>

        <div className='flex gap-2.5'>
            <img src={assets.facebook_icon} width={35}></img>
            <img src={assets.twitter_icon} width={35}></img>
            <img src={assets.instagram_icon} width={35}></img>
        </div>

    </div>
  )
}

export default Footer