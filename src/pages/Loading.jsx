import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarfieldBackground from '../components/background/Starfeildbackground'
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
    <>
      <StarfieldBackground />
      
      <div className="flex text-white items-center justify-center min-h-screen flex-col relative z-10">
        <div className='top-8 absolute left-8'>
          <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />  {/* Fixed: w-16 h-16 instead of w-17 h-17 */}
        </div>
        <div className="text-7xl font-marcellus font-bold">One prayer</div>
        <div className="text-7xl font-marcellus font-bold">One world</div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center"> 
          <div className="w-96 h-96 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] xl:w-[800px] xl:h-[800px] rounded-full opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(248, 217, 140, 0.9) 0%, rgba(249, 115, 22, 0.3) 40%, transparent 70%)'
            }}
          ></div>
        </div>
        
        <LoadingBar />
      </div>
    </>
  )
}

export default Loading