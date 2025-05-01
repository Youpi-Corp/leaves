import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/feedback/Spinner';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import ModuleCard from '../../components/layout/modulecard/ModuleCard';
import { mockModules } from '../../api/mockup/mockData';

interface Module {
  id: number;
  title: string;
  description: string;
  lessonCount: number;
  lastEdited: string;
}

const fetchModules = async (): Promise<Module[]> => {
  return mockModules;
}

const EditorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [moduleIds, setModuleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getModules = async () => {
      try {
        setLoading(true);
        
        const data = await fetchModules();
        
        const ids = data.map(module => module.id);
        setModuleIds(ids);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getModules();
  }, []);

  const handleModuleClick = (moduleId: number) => {
    navigate(`/edition/dashboard/${moduleId}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bfbase-black">
            My Modules
          </h1>
          <button 
            className="bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={() => {}}
          >
            Create New Module
          </button>
        </div>

        <div className="border-b border-bfbase-lightgrey mb-6"></div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="border-l-bfgreen-base" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-bfred-light rounded-lg text-bfred-dark">
            <h2 className="text-xl">{error}</h2>
            <button 
              className="mt-4 bg-bfred-dark hover:bg-bfred-base text-white font-medium py-2 px-4 rounded transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : moduleIds.length === 0 ? (
          <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
            <h2 className="text-xl text-bfbase-darkgrey">
              You haven&apos;t created any modules yet.
            </h2>
            <button 
              className="mt-4 bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors"
              onClick={() => navigate('/course/editor/new')}
            >
              Create Your First Module
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleIds.map((moduleId) => (
              <ModuleCard
                key={moduleId}
                moduleId={moduleId}
                onClick={handleModuleClick}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditorDashboard;