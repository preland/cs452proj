import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import { Product } from './types';

const WEBSITES = ['amazon', 'walmart', 'aliexpress'];

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<{ cost?: number; website?: string }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [failedWebsites, setFailedWebsites] = useState<string[]>([]);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setFailedWebsites([]);
        try {
            const fetchedProducts: Product[] = await fetchProducts(searchTerm);
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

            // Check for missing websites
            const failed: string[] = [];
            for (const site of WEBSITES) {
                const hasSite = products.some(
                    (p) => p.website && p.website.toLowerCase() === site
                );
                if (!hasSite) failed.push(site);
            }
            setFailedWebsites(failed);

            return products;
        } catch (err) {
            setFailedWebsites([...WEBSITES]);
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
                {failedWebsites.length > 0 && !loading && (
                    <div className="text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded py-2 mb-4 font-semibold">
                        {failedWebsites.map(site =>
                            <span key={site} className="mx-2">
                                {site.charAt(0).toUpperCase() + site.slice(1)} results are currently unavailable.
                            </span>
                        )}
                    </div>
                )}
                <ProductList products={sortedProducts} searchMade={products.length > 0 || loading || error !== null } />
            </main>
        </div>
    );
};

export default App;