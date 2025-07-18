export interface Product {
    id: string;
    name: string;
    cost: number;
    website: string;
    imageUrl?: string;
    description?: string;
}

export interface FilterOptions {
    minPrice?: number;
    maxPrice?: number;
    websites?: string[];
}