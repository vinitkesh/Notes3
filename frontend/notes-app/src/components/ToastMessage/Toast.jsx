import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose, showToastM }) => {
  useEffect(() => {
    if (isShown) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div className={`absolute top-20 right-6 transition-all duration-400 ${isShown ? 'flex' : 'hidden'}`}>
      <div className={`min-w-52 bg-white border shadow-2xl rounded-md relative
            ${type === 'delete' ? 'after:bg-red-500' : 'after:bg-green-500'} after:w-[5px] after:h-full
            after:absolute after:top-0 after:left-0 after:rounded-l-lg`}>
        <div className="flex items-center gap-3 py-2 px-4">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full
                ${type === 'delete' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
            {type === 'delete' ? 
                <MdDeleteOutline className='text-red-500' /> 
                : <LuCheck className='text-xl text-green-500' />}
          </div>
          <p className={`text-sm ${type === 'delete' ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Toast;
