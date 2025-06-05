import React from 'react';
import { Product } from '../types';

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    if (products.length === 0) {
        return <div className="text-center text-gray-500 py-8">No products found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product, idx) => (
                <div
                    key={idx}
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
    );
};

export default ProductList;