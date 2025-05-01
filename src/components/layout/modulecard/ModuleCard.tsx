import React, { useState, useEffect } from 'react';
import { mockModules } from '../../../api/mockup/mockData';

interface CardProps {
  moduleId: number;
  onClick: (id: number) => void;
}

const fetchModuleData = async (moduleId: number) => {
  const module = mockModules.find(module => module.id === moduleId);
  
  if (!module) {
    throw new Error(`Module with ID ${moduleId} not found`);
  }
  
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    lessonCount: module.lessonCount
  };
};

const ModuleCard: React.FC<CardProps> = ({
  moduleId,
  onClick,
}) => {
  const [moduleData, setModuleData] = useState<{
    id: number;
    title: string;
    description: string;
    lessonCount: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModuleData = async () => {
      try {
        setLoading(true);
        const data = await fetchModuleData(moduleId);
        setModuleData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading module data:', err);
        setError('Failed to load module data');
      } finally {
        setLoading(false);
      }
    };
    
    loadModuleData();
  }, [moduleId]);

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="h-full border rounded-lg shadow-sm bg-white p-4 flex items-center justify-center">
        <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="h-full border rounded-lg shadow-sm bg-white p-4 flex items-center justify-center text-red-500">
        {error || 'Module not found'}
      </div>
    );
  }

  return (
    <div className="h-full">
      <div 
        className="border rounded-lg shadow-sm hover:shadow-md bg-white h-full flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1"
        onClick={() => onClick(moduleData.id)}
      >
        <div className="p-4 flex-grow">
          <div className="flex mb-3">
            <svg 
              className="w-6 h-6 text-bfgreen-base" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-bfbase-black mb-2">
            {moduleData.title}
          </h2>
          <p className="text-sm text-bfbase-grey mb-2">
            {truncateDescription(moduleData.description, 40)}
          </p>
          <div className="mt-4 flex justify-between text-sm text-bfgreen-base">
            <span>
              {moduleData.lessonCount} {moduleData.lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;