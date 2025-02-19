'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  name: string;
  image: string;
  isHighlighted: boolean;
}

const ProductDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { name: 'Pumpkin Spice Iced Doughnut', image: '/images/products/pumpkin-iced.svg', isHighlighted: false },
    { name: 'Pumpkin Spice Cake Doughnut', image: '/images/products/pumpkin-cake.svg', isHighlighted: false },
    { name: 'Old Fashioned Doughnut', image: '/images/products/old-fashioned.svg', isHighlighted: false },
    { name: 'Chocolate Iced Doughnut', image: '/images/products/chocolate.svg', isHighlighted: false },
    { name: 'Chocolate Iced Doughnut with Sprinkles', image: '/images/products/chocolate-sprinkles.svg', isHighlighted: false },
    { name: 'Raspberry Filled Doughnut', image: '/images/products/raspberry.svg', isHighlighted: false },
    { name: 'Blueberry Cake Doughnut', image: '/images/products/blueberry.svg', isHighlighted: false },
    { name: 'Strawberry Iced Doughnut with Sprinkles', image: '/images/products/strawberry.svg', isHighlighted: false },
    { name: 'Lemon Filled Doughnut', image: '/images/products/lemon.svg', isHighlighted: false },
    { name: 'Doughnut Holes', image: '/images/products/holes.svg', isHighlighted: false }
  ]);

  useEffect(() => {
    const handleProductHighlight = (event: CustomEvent<{ productName: string; action: 'show' | 'hide' }>) => {
      const { productName, action } = event.detail;
      console.log('Highlighting product:', productName, action);
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          isHighlighted: product.name.toLowerCase() === productName.toLowerCase() ? action === 'show' : false
        }))
      );
    };

    window.addEventListener('productHighlight', handleProductHighlight as EventListener);
    return () => {
      window.removeEventListener('productHighlight', handleProductHighlight as EventListener);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-white">
      {products.map((product, index) => (
        <div 
          key={index}
          className={`relative transition-all duration-500 transform ${
            product.isHighlighted ? 'scale-110 z-10 ring-4 ring-yellow-400 shadow-lg' : 'scale-100'
          }`}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2"
                priority={index < 5}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="text-sm font-medium text-gray-800">
                {product.name}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductDisplay;
