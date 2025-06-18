import React, { useState } from 'react';
import { Product } from '../types';

interface ProductListProps {
    products: Product[];
    searchMade?: boolean;
    pageSize?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, searchMade = true, pageSize = 6 }) => {
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(products.length / pageSize);

    const handlePrev = () => setPage((p) => Math.max(0, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    const paginatedProducts = products.slice(page * pageSize, (page + 1) * pageSize);

    if (!searchMade) {
        return (
            <div className="text-center text-gray-400 py-12 text-lg">
                Start by searching for a product above.
            </div>
        );
    }

    if (products.length === 0) {
        return <div className="text-center text-gray-500 py-8">No products found.</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginatedProducts.map((product, idx) => (
                    <div
                        key={idx + page * pageSize}
                        className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                    >
                        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-700 mb-1">Price: <span className="font-bold">${product.cost}</span></p>
                        <p className="text-gray-500 mb-2">Website: {product.website}</p>
                        <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto text-blue-600 hover:underline"
                        >
                            View Product
                        </a>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={handlePrev}
                        disabled={page === 0}
                        className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages - 1}
                        className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${page === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;