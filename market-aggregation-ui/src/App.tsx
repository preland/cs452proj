import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import { Product } from './types';

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<{ cost?: number; website?: string }>({});

    const handleSearch = async () => {
        const fetchedProducts: Product[] = await fetchProducts(searchTerm);
        setProducts(fetchedProducts);
    };

    const fetchProducts = async (term: string): Promise<Product[]> => {
        return [];
    };

    const handleFilterChange = (newFilters: { cost?: number; website?: string }) => {
        setFilters(newFilters);
    };

    const filteredProducts = products.filter(product => {
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-blue-600 py-6 shadow">
                <h1 className="text-3xl font-bold text-center text-white">Market Aggregation</h1>
            </header>
            <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <SearchBar onSearch={handleSearch} setSearchTerm={setSearchTerm} />
                    <Filters onFilterChange={handleFilterChange} />
                </div>
                <ProductList products={filteredProducts} />
            </main>
        </div>
    );
};

export default App;