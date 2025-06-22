import React from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div className="mb-4 lg:mb-0">
      <label className="block text-sm font-medium text-bfbase-darkgrey mb-2">
        Search Modules
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a module (e.g., DNA, Arithmetic...)"
          onChange={handleInputChange}
          className="w-full border border-bfbase-grey rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-bfgreen-base focus:border-bfgreen-base transition-colors duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-bfbase-grey"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
