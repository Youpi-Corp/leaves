import React, { useEffect } from 'react';
import styles from './ModuleCard.module.css';

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

const ModuleCard: React.FC<ModuleCardProps> = ({ id}) => {
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
      className={`${styles.card}`} 
      onClick={handleClick}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default ModuleCard;