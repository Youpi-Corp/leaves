import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  // Update search term if we're on the library page with a search param
  useEffect(() => {
    if (location.pathname === '/library') {
      const params = new URLSearchParams(location.search)
      const query = params.get('search')
      if (query) {
        setSearchTerm(query)
      } else {
        setSearchTerm('')
      }
    }
  }, [location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to library page with search query
      navigate(`/library?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      // If empty, just go to library page
      navigate('/library')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-96">
      <input
        type="text"
        placeholder="Search modules, courses..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="p-3 w-full rounded-xl bg-bfgreen-lighter text-bfgreen-darker
        placeholder:text-bfgreen-darker outline-hidden focus:ring-4 ring-bfgreen-light
        transition-all text-sm font-semibold pr-10"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bfgreen-darker hover:text-bfgreen-base transition-colors"
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </form>
  )
}

export default SearchBar
