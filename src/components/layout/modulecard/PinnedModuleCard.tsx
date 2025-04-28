import React from "react";

const fetchPinnedModuleInfos = (id: number) => {
  console.log(`Fetching info for pinned module with ID: ${id}`);
  return {/* call api quand on a*/};
};

interface PinnedModuleCardProps {
  id: number;
  className?: string;
}

const PinnedModuleCard: React.FC<PinnedModuleCardProps> = ({ id, className = '' }) => {
  let moduleData = {
    title: "",
    description: "",
  };

  if (id === -1) {
    moduleData = {
      title: "Lorem Ipsum",
      description: "Salut moi c'est Elfo, et je suis un elfe !",
    };
  } else if (typeof id === "number") {
    //moduleData = fetchPinnedModuleInfos(id);
  }
  
  const handleClick = () => {
    console.log(`Pinned module ${id} was clicked`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-bfbase-black">Pinned Module</h1>
      <div 
        className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 cursor-pointer w-full hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-gray-200 ${className}`} 
        onClick={handleClick}
      >
        <h2 className="text-xl font-semibold mb-3 text-bfbase-black">{moduleData.title}</h2>
        <p className="text-bfbase-darkgrey mb-6 text-base">{moduleData.description}</p>
        <button className="bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default PinnedModuleCard;