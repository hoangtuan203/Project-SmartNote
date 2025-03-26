import { File, Table, CheckSquare, Quote } from 'lucide-react';

// Xuất functionsList để sử dụng ở file khác
export const functionsList = [
  { category: 'Suggested', items: [
    { name: 'File', icon: <File size={16} /> },
    { name: 'Table', icon: <Table size={16} /> },
    { name: 'To-do list', icon: <CheckSquare size={16} /> },
    { name: 'Callout', icon: <Quote size={16} /> },
  ] },
  { category: 'Basic blocks', items: [
    { name: 'Text', icon: <span className="font-bold">T</span> },
    { name: 'Heading 1', icon: <span className="font-bold">H1</span> },
    { name: 'Heading 2', icon: <span className="font-bold">H2</span> },
    { name: 'Heading 3', icon: <span className="font-bold">H3</span> },
  ] },
];

const SlashCommand = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chức năng của Smart Note</h1>
      <div className="relative">
        <div className="absolute bg-white rounded-xl shadow-lg p-4 w-72 mt-2 z-50">
          <input
            type="text"
            placeholder="Filter..."
            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          />
          {functionsList.map((group, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-sm font-semibold text-gray-500">{group.category}</h3>
              {group.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                  {item.icon}
                  <span className="text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlashCommand;