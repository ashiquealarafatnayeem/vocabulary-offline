
import React from 'react';
import { BookOpenIcon } from './icons';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#627ECB]"></div>
        <div className="absolute">
          <BookOpenIcon className="text-[#627ECB] h-16 w-16"/>
        </div>
      </div>
      <p className="mt-6 text-lg text-[#214C63] font-semibold">{message}</p>
    </div>
  );
};

export default Loader;