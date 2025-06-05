import React, { useState } from 'react';

interface FiltersProps {
    onFilterChange: (filters: { cost?: number; website?: string }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
    const [cost, setCost] = useState<number | undefined>();
    const [website, setWebsite] = useState<string>('');

    const handleApply = () => {
        onFilterChange({ cost, website });
    };

    return (
        <div className="flex gap-2 items-center">
            <input
                type="number"
                min={0}
                value={cost ?? ''}
                onChange={e => setCost(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max Cost"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-28"
            />
            <select
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <option value="">All Websites</option>
                <option value="amazon">Amazon</option>
                <option value="ebay">eBay</option>
                <option value="walmart">Walmart</option>
            </select>
            <button
                onClick={handleApply}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
                Apply
            </button>
        </div>
    );
};

export default Filters;