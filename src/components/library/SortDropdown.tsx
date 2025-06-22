import React from 'react'

interface SortDropdownProps {
  onSortChange: (sortOption: string) => void
  sortOption: string
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  onSortChange,
  sortOption,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value
    onSortChange(selectedOption)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-bfbase-darkgrey mb-2">
        Sort by
      </label>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full border border-bfbase-grey rounded-lg px-4 py-3 focus:ring-2 focus:ring-bfgreen-base focus:border-bfgreen-base transition-colors duration-200 bg-white"
      >
        <option value="">Default</option>
        <option value="mostCourses">Most Courses</option>
        <option value="recent">Most Recent</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortDropdown
