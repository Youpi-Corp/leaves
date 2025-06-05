import React, { useState } from 'react';

interface SortDropdownProps {
  onSortChange: (sortOption: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  const [sortOption, setSortOption] = useState('');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    onSortChange(selectedOption);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        <option value="popularity">Popularity</option>
        <option value="recent">Most Recent</option>
        <option value="lessons">Most Lessons</option>
        <option value="liked">Most Liked Modules</option>
      </select>
    </div>
  );
};

export default SortDropdown;
