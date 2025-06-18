import React from 'react';

interface ProductCardProps {
    name: string;
    price: number;
    website: string;
}

const websiteColors: Record<string, string> = {
    amazon: 'border-yellow-400',
    ebay: 'border-blue-400',
    walmart: 'border-indigo-400',
};

const ProductCard: React.FC<ProductCardProps> = ({ name, price, website }) => {
    const borderColor = websiteColors[website.toLowerCase()] || 'border-gray-300';

    return (
        <div className={`font-sans bg-white rounded-2xl shadow-lg border-l-8 ${borderColor} border border-gray-100 p-6 m-4 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-2xl`}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
            <div className="flex items-end justify-between mt-auto">
                <span className="text-2xl font-extrabold text-blue-700">${price.toFixed(2)}</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-4 py-1 rounded-full capitalize shadow-sm ml-2">{website}</span>
            </div>
        </div>
    );
};

export default ProductCard;