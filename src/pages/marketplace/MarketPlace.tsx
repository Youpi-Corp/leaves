import React, { useState, useEffect } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import SearchBar from '../../components/marketplace/SearchBar';
import SortDropdown from '../../components/marketplace/SortDropdown';
import ModuleList from '../../components/marketplace/ModuleList';
import CreateModuleModal from '../../components/layout/modulecard/CreateModuleModal';
import { Module } from '../../api/module/module.queries';

const MarketPlace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string | boolean>>({});
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    let fetchedModules: Module[] = [
      { id: 1, title: 'Module 1', description: 'Description of Module 1', courses_count: 5, owner_id: 123, public: true, dtc: '2025-06-01', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },
      { id: 2, title: 'Module 2', description: 'Description of Module 2', courses_count: 3, owner_id: 456, public: false, dtc: '2025-06-02', dtm: '2025-06-05' },

    ];

    if (searchTerm) {
      fetchedModules = fetchedModules.filter((module) =>
        module.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  

    if (sortOption === 'mostCourses') {
      fetchedModules = fetchedModules.sort((a, b) => (b.courses_count || 0) - (a.courses_count || 0));
    }

    setModules(fetchedModules);
  }, [searchTerm, filters, sortOption]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleApplyFilters = (appliedFilters: Record<string, string | boolean>) => {
    setFilters(appliedFilters);
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