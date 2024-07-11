import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';


const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('# Your Markdown Content Here');

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };

  const fetchNote = async (noteId) => {
    try {
      const response = await axiosInstance.get('/get-note/' + noteId);
      if (response.data && response.data.note) {
        setTitle(response.data.note.title);
        setMarkdown(response.data.note.content);
        setTags(response.data.note.tags);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        return;
      } else console.log('Unexpected error occurred while fetching note');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Markdown Editor */}
      <div className="md:w-1/2 p-4 border-r border-gray-300">
        <textarea
          className="w-full h-full p-2 border border-gray-300 rounded-md"
          value={markdown}
          onChange={handleChange}
        />
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

    </div>
  );
};

export default MarkdownEditor;
