import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png'
import { LoadingBar } from '../components/Loading/loadingbar'  

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to globe page after 3.5 seconds
    const timer = setTimeout(() => {
      navigate('/globe');
    }, 4000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex text-white items-center justify-center min-h-screen flex-col relative z-10 px-4">
      <div className='top-4 sm:top-8 absolute left-4 sm:left-8'>
        <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
      </div>
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-marcellus font-bold text-center">One prayer</div>
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-marcellus font-bold text-center">One world</div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center"> 
        <div className="w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] 2xl:w-[800px] 2xl:h-[800px] rounded-full opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(248, 217, 140, 0.9) 0%, rgba(249, 115, 22, 0.3) 40%, transparent 70%)'
          }}
        ></div>
      </div>
      
      <LoadingBar />
    </div>
  )
}

export default Loading