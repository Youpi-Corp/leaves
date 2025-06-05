import React, { useState, useEffect } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import SearchBar from '../../components/marketplace/SearchBar';
import SortDropdown from '../../components/marketplace/SortDropdown';
import ModuleList from '../../components/marketplace/ModuleList';
import CreateModuleModal from '../../components/layout/modulecard/CreateModuleModal';
import { Module } from '../../api/module/module.queries';
import { getAllModulesQuery } from '../../api/module/module.queries';

const MarketPlace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getAllModulesQuery();

        let filteredModules = fetchedModules;
        if (searchTerm) {
          filteredModules = filteredModules.filter((module) =>
            module.title?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (filters.public !== undefined) {
          filteredModules = filteredModules.filter((module) => module.public === filters.public);
        }

        if (sortOption === 'mostCourses') {
          filteredModules = filteredModules.sort((a, b) => (b.courses_count || 0) - (a.courses_count || 0));
        }

        setModules(filteredModules);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      }
    };

    fetchModules();
  }, [searchTerm, filters, sortOption]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
        <p className="text-lg mb-6">Welcome to the Brainforest Marketplace!</p>
        <SearchBar onSearch={handleSearch} />
        <SortDropdown onSortChange={handleSortChange} />
        <div>
          <ModuleList modules={modules} />
        </div>
        {isModalOpen && <CreateModuleModal isOpen={isModalOpen} onClose={toggleModal} onSuccess={(newModule) => console.log('Module created:', newModule)} />}
      </div>
      <Footer />
    </>
  );
};

export default MarketPlace;