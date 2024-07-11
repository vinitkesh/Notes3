import React from 'react';
import { useState } from 'react';

const Sidebar = ({ tags, onTagClick,resetTagSearch }) => {
    const[isSearch, setIsSearch] = useState(false);
    const handleClick = () => {
        if(isSearch) {
        setIsSearch(!isSearch);
        resetTagSearch();
        }
        else {
            setIsSearch(!isSearch);
        }
    }
  return (
    <div className="relative group z-[1] w-min">
      <div className="fixed left-0 top-15 bg-primary p-2 rounded-r cursor-pointer">
        Tags
      </div>
      <div className="fixed w-min left-0 top-15 bg-primary p-2 rounded hidden group-hover:block">
        <div
            className="text-white bg-yellow-400 rounded cursor-pointer hover:bg-blue-600 p-2"
            onClick={() => handleClick() }
          >
            {isSearch ? 'Reset' : 'Search'}
        </div>
        {tags.map((tag, index) => (
          <div
            key={index}
            className="text-white cursor-pointer hover:bg-blue-600 p-2"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
