import React from 'react';
import { MdOutlinePushPin } from 'react-icons/md';
import moment from 'moment';
import { MdCreate, MdDelete } from 'react-icons/md';
import TagList from './TagList';
import './NoteCard.css';

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
    onClick // Added onClick prop
}) => {
  // Convert date to a recognized format
  function formatDate(date) {
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${daySuffix(day)} ${month} ${year}`;
  }

  return (
    <div 
      className={`NoteCard rounded-2xl p-10 ${isPinned ? 'bg-white border-zinc-200' : 'bg-zinc-300 border-white'} transition-all ease-in-out`}
      onClick={onClick} // Added onClick handler
      
    >
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <h6 className="text-2xl leading-5 font-medium">{title}</h6>
          <span className="text-m leading-10 text-slate-500">
            {formatDate(new Date(date))}
          </span>
        </div>
        <MdOutlinePushPin
        size={30}
          className={`icon-btn w-max absolute top-0 right-0 ${isPinned ? 'text-primary' : 'text-slate-400'}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click event from triggering onClick on parent
            onPinNote();
          }}
        />
      </div>
      <p className="text-lg text-slate-600 mt-2">{content?.slice(0, 60)}...</p>
      <div className="flex items-center justify-between mt-2">
        <TagList tags={tags} />
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click event from triggering onClick on parent
              onEdit();
            }}
          />
          <MdDelete
            className="icon-btn hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click event from triggering onClick on parent
              onDelete();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
