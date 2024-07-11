import React, { useState } from 'react';
import Modal from 'react-modal';
import { getInitials } from "../../utils/helper";
import { FaGithub } from 'react-icons/fa';

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'];

// Ensure that react-modal is initialized
Modal.setAppElement('#root');

const ProfileInfo = ({ userInfo, onLogout }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className='flex items-center justify-center w-min'>
       <a href="https://github.com/vinitkesh" className="rounded-full bg-green px-4 "><FaGithub fill='black' size={40}/></a>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-green-400 text-slate-950 font-bold text-xl cursor-pointer`}
        onClick={openProfileModal}
      >
        {getInitials(userInfo?.fullName)}
      </div>

      <Modal
        isOpen={isProfileModalOpen}
        onRequestClose={closeProfileModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
      >
        <div className="flex flex-col items-center p-4 bg-white rounded-md">
          <p className="text-m font-bold mb-4">Welcome,</p>
          <h2 className="text-2xl font-bold mb-4"> {userInfo?.fullName}</h2>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white py-2 px-4 rounded mb-4"
          >
            Logout
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={closeProfileModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;
