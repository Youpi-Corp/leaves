import React from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="Search for a module (e.g., DNA, Arithmetic...)"
        onChange={handleInputChange}
        className="flex-grow border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

export default SearchBar;
