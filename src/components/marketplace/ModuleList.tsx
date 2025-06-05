import React from 'react';
import ModuleCard from '../layout/modulecard/ModuleCard';
import { Module } from '../../api/module/module.queries';

interface ModuleListProps {
  modules: Module[];
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {modules.map((module) => (
        <div key={module.id} className="w-full max-w-xs mx-auto">
          <ModuleCard
            module={module}
            onClick={(id) => console.log(`Module ${id} clicked`)}
          />
        </div>
      ))}
    </div>
  );
};

export default ModuleList;
