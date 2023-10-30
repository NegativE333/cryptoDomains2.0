"use client";

import { ImSpinner9 } from 'react-icons/im';

const Loading = () => {
    return(
        <div className="w-full h-[100vh] bg-[url('/images/layer4.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row">
          <div className='h-full w-full flex items-center justify-center'>
            <ImSpinner9 className='text-4xl text-white animate-spin transition duration-1000'/>
          </div>
        </div>
      )
}
 
export default Loading;