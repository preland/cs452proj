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
    const [amazonFailed, setAmazonFailed] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setAmazonFailed(false);
        try {
            const fetchedProducts: Product[] = await fetchProducts(searchTerm);
            // Check if any product has website === 'amazon' and cost === null or a special flag
            if (
                fetchedProducts.some(
                    (p) =>
                        p.website &&
                        p.website.toLowerCase() === 'amazon' &&
                        (p.cost === null || p.cost === undefined || p.name === 'Amazon unavailable')
                )
            ) {
                setAmazonFailed(true);
            }
            setProducts(fetchedProducts);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const API_URL = 'https://pre.land/api/products';

    const fetchProducts = async (term: string): Promise<Product[]> => {
        console.log(`Fetching products for term: ${term}`);
        if (!term) return [];
        try {
            const response = await axios.get(API_URL, {
                params: { q: term }
            });
            let products: Product[] = response.data;
            // Check if Amazon is present
            const hasAmazon = products.some(p => p.website && p.website.toLowerCase() === 'amazon');
            setAmazonFailed(!hasAmazon);
            return products;
        } catch (err) {
            setAmazonFailed(true);
            return [];
        }
    };

    const handleFilterChange = (newFilters: { cost?: number; website?: string }) => {
        setFilters(newFilters);
    };

    const filteredProducts = products.filter(product => {
        let pass = true;
        if (filters.cost !== undefined && product.cost !== null && product.cost !== undefined) {
            pass = pass && product.cost <= filters.cost;
        }
        if (filters.website) {
            pass = pass && product.website.toLowerCase() === filters.website.toLowerCase();
        }
        return pass;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        // Put "Amazon unavailable" at the top
        if (a.name === 'Amazon unavailable') return -1;
        if (b.name === 'Amazon unavailable') return 1;
        return (a.cost ?? Infinity) - (b.cost ?? Infinity);
    });

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
                {amazonFailed && !loading && (
                    <div className="text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded py-2 mb-4 font-semibold">
                        Amazon results are currently unavailable.
                    </div>
                )}
                <ProductList products={sortedProducts} searchMade={products.length > 0 || loading || error !== null } />
            </main>
        </div>
    );
};

export default App;