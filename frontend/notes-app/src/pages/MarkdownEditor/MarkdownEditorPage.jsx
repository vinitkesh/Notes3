import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const MarkdownEditorPage = ({title,content,onClose}) => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState(content);
  const [newTitle, setNewTitle] = useState(title);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the note data when the component mounts
    const fetchNote = async () => {
      try {
        const response = await axiosInstance.get(`/get-note/${noteId}`);
        if (response.data && response.data.note) {
          setTitle(response.data.note.title);
          setMarkdown(response.data.note.content);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          console.log('Unexpected error occurred while fetching note');
        }
      }
    };
    fetchNote();
  }, [noteId]);

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/update-note/${noteId}`, {
        title,
        content: markdown,
      });
      navigate('/notes'); // Redirect to the notes page after successful update
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.log('Unexpected error occurred while updating note');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Markdown Editor */}
      <div className="md:w-1/2 p-4 border-r border-gray-300">
        <input
          type="text"
          className="w-full text-xl font-bold border-b border-gray-300 mb-4 p-2"
          value={newTitle}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
        />
        <textarea
          className="w-full h-full p-2 border border-gray-300 rounded-md"
          value={markdown}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Markdown Preview */}
      <div className="md:w-1/2 p-4 overflow-auto">
      <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={darcula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
      </div>

      <div className="p-4 flex justify-between mt-4">
        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
        <button
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditorPage;
