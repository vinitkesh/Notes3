const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const important = (tag) => {
  const lowerCaseTag = tag.toLowerCase();
  return lowerCaseTag.includes("important") || lowerCaseTag.includes("urgent");
};

const TagList = ({ tags }) => {
  return (
    <div className="text-xs text-slate-500 flex flex-wrap gap-1">
      {tags.map((item, index) => (
        <div
          key={index}
          className={`rounded-full px-2 py-1 ${important(item) ? "bg-red-600 text-slate-100 " : 'bg-zinc-300'} text-gray-700`}
        >
          {item.toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default TagList;
