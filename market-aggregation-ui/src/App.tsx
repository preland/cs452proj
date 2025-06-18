import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import { Product } from './types';
const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<{ cost?: number; website?: string }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedProducts: Product[] = await fetchProducts(searchTerm);
            setProducts(fetchedProducts);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const API_URL = 'https://ec2-3-14-129-24.us-east-2.compute.amazonaws.com:3001/api/products';

    const fetchProducts = async (term: string): Promise<Product[]> => {
        console.log(`Fetching products for term: ${term}`);
        if (!term) return [];
        const response = await axios.get(API_URL, {
            params: { q: term }
        });
        // Map backend data to Product type if needed
        return response.data;
    };

    const handleFilterChange = (newFilters: { cost?: number; website?: string }) => {
        setFilters(newFilters);
    };

    const filteredProducts = products.filter(product => {
        let pass = true;
        if (filters.cost !== undefined) {
            pass = pass && product.cost <= filters.cost;
        }
        if (filters.website) {
            pass = pass && product.website.toLowerCase() === filters.website.toLowerCase();
        }
        return pass;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => a.cost - b.cost);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-blue-600 py-6 shadow">
                <h1 className="text-3xl font-bold text-center text-white">Market Aggregation</h1>
            </header>
            <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSearch={handleSearch}
                    />
                    <Filters onFilterChange={handleFilterChange} />
                </div>
                {loading && <div className="text-center text-blue-600">Loading...</div>}
                {error && <div className="text-center text-red-600">{error}</div>}
                <ProductList products={sortedProducts} searchMade={products.length > 0 || loading || error !== null } />
            </main>
        </div>
    );
};

export default App;