import React, { useEffect } from 'react';

const fetchModuleInfos = (id: number) => {
  console.log(`Fetching info for module with ID: ${id}`);
  return {
      title: `Module ${id}`,
      description: `This is the description for module ${id}. Replace with actual data in the future.`
    };
};

interface ModuleCardProps {
  id: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ id }) => {
  let title = '';
  let description = '';

  if (id === -1) {
    title = 'lorem ipsum';
    description = "Salut moi c'est Elfo, et je suis un elfe !";
  } else if (typeof id === 'number') {
    const moduleInfo = fetchModuleInfos(id);
    title = moduleInfo.title;
    description = moduleInfo.description;
  }
  
  const handleClick = () => {
    console.log("Oof i was clicked");
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-5 flex flex-col transition-all duration-200 cursor-pointer w-full max-w-[300px] hover:shadow-lg hover:-translate-y-1"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold mb-2 text-bfbase-black">{title}</h3>
      <p className="text-sm text-bfbase-darkgrey">{description}</p>
    </div>
  );
};

export default ModuleCard;