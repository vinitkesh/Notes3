import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported from 'react-router-dom'
import ProfileInfo from '../Cards/ProfileInfo';
import SearchBar from '../SearchBar/SearchBar';
import { FaGithub } from 'react-icons/fa';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate(); // Correctly call the hook to get the navigate function

  const onLogout = () => {
    localStorage.clear(); // Delete token from local storage
    navigate("/login"); // Ensure the path is correctly set
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      return;
    }
    onSearchNote(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery(""); // Clear the search query
    handleClearSearch(); // Call the parent method to clear search results
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow-white-xl'>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
      
      <SearchBar 
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
     
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      
    </div>
  );
};

export default Navbar;
