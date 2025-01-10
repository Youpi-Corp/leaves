import React from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-96">
      <input
        type="text"
        placeholder="Research anything..."
        className="p-3 w-full rounded-full bg-bfgreen-lighter text-bfgreen-darker
        placeholder:text-bfgreen-darker outline-none focus:ring-4 ring-bfgreen-light
        transition-all text-sm font-semibold pr-10"
      />
      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bfgreen-darker" />
    </div>
  )
}

export default SearchBar
