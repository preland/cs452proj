import React from 'react';

interface ProductCardProps {
    name: string;
    price: number;
    website: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, website }) => {
    return (
        <div className="product-card">
            <h3>{name}</h3>
            <p>Price: ${price.toFixed(2)}</p>
            <p>Website: {website}</p>
        </div>
    );
};

export default ProductCard;