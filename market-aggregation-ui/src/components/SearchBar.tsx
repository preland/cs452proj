import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm);
            setSearchTerm('');
        }
    };

    return (
        <div className="flex gap-2 w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a product..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={handleSearch}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;