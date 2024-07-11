import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import Markdown from './Markdown';
import Sidebar from '../../components/Sidebar/Sidebar'; // Import the Sidebar component
import Footer from '../../components/Footer/Footer';
import SearchBar from '../../components/SearchBar/SearchBar'; // Import the SearchBar component

// Ensure that react-modal is initialized
Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [openMarkdownModal, setOpenMarkdownModal] = useState({
    isShown: false,
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: '',
    type: 'add',
  });

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add searchQuery state
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
        localStorage.clear();
        navigate('/login');
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log('Unexpected error occurred while fetching notes');
    }
  };

  // Search notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query: query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        `/update-note-pinned/${noteId}`,
        {
          isPinned: !noteData.isPinned,
        }
      );
      if (response.data && response.data.note) {
        showToastMessage('Note pinned successfully!', 'edit');
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
    setSearchQuery(''); // Clear search query
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: 'edit', data: noteDetails });
  };

  const handleMarkdown = (noteDetails) => {
    setOpenMarkdownModal({ isShown: true, data: noteDetails });
  };

  const handleCloseToast = (message, type) => {
    setShowToastMsg({ isShown: false, message: message, type: type });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message: message, type: type });
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (response.data && response.data.message) {
        showToastMessage('Note deleted successfully', 'delete');
        getAllNotes();
      }
    } catch (error) {
      console.log('Unexpected error occurred while deleting note');
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    onSearchNote(tag);
  };
  const handleClearTagSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  // Separate pinned and non-pinned notes
  const pinnedNotes = allNotes.filter((note) => note.isPinned);
  const nonPinnedNotes = allNotes.filter((note) => !note.isPinned);

  // Collect all unique tags
  const tags = [
    ...new Set(allNotes.flatMap((note) => note.tags)),
  ];

  return (
    <div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed z-10 right-5 bottom-5"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      {/* <Sidebar tags={tags} onTagClick={handleTagClick} resetTagSearch={handleClearTagSearch} /> */}

      <div className="container mx-auto relative">
        <div className="flex text-lg text-zinc-400 cursor-text bg-white p-4 rounded-md border-[2px] mt-8 mx-2 hover:bg-gray-100 transition-all ease-in-out" 
          onClick={() => {setOpenAddEditModal({isShown: true,type:'add',data:null})}}>
          Take a Note...
        </div>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <section className="mt-8 mx-2">
            <h2 className="text-xl text-yellow-300 font-bold mb-4 bg-zinc-500 rounded-full w-max px-5 py-2">Pinned Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pinnedNotes.map((item) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)} // Edit handler for the NoteCard
                  onDelete={() => handleDelete(item._id)}
                  onPinNote={() => updateIsPinned(item)}
                  onClick={() => handleMarkdown(item)} // Open the edit modal when the NoteCard is clicked
                  className="cursor-pointer overflow-hidden"
                />
              ))}
            </div>
          </section>
        )}

        {/* Non-Pinned Notes Section */}
        {nonPinnedNotes.length > 0 && (
          <section className="mt-8 mx-2">
            <h2 className="text-xl text-yellow-300 font-bold mb-4">Other Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nonPinnedNotes.map((item) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)} // Edit handler for the NoteCard
                  onDelete={() => handleDelete(item._id)}
                  onPinNote={() => updateIsPinned(item)}
                  onClick={() => handleEdit(item)} // Open the edit modal when the NoteCard is clicked
                  className="cursor-pointer overflow-hidden"
                />
              ))}
            </div>
          </section>
        )}

        {pinnedNotes.length === 0 && nonPinnedNotes.length === 0 && (
          <EmptyCard />
        )}
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel="Add Note"
        className="w-[90%] z-10 md:w-[60%] lg:w-[40%] max-h-3/4 bg-white rounded-md mt-14 p-5 overflow-scroll align-middle mx-auto"
      >
        <AddEditNotes
          onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          getAllNotes={getAllNotes}
          showToastMsg={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />

      <Modal
        isOpen={openMarkdownModal.isShown}
        onRequestClose={() => setOpenMarkdownModal({ isShown: false, data: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel="Markdown Preview"
        className="w-full z-10 bg-white rounded-md mt-14 overflow-scroll align-middle mx-auto"
      >
        <Markdown
          onClose={() => setOpenMarkdownModal({ isShown: false, data: null })}
          noteData={openMarkdownModal.data}
          getAllNotes={getAllNotes}
          showToastMsg={showToastMessage}
        />
      </Modal>

    </div>
  );
};

export default Home;
