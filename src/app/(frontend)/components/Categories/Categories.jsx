"use client";
import React, { useState } from "react";

const Categories = ({ categories: categoriesData }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const categories = categoriesData?.data || [];

    return (
        <div className="relative">
            <div className='flex flex-wrap items-center gap-8 justify-center mt-4 w-full'>
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="group relative"
                        onMouseEnter={() => setHoveredCategory(category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <button className='text-sm font-medium text-gray-700 group-hover:text-secondary transition-colors duration-200'>
                            {category.name}
                        </button>
                        <span className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-[2px] bg-secondary transition-all duration-300 w-0 group-hover:w-full"></span>
                    </div>
                ))}
            </div>

            {hoveredCategory && (
                <div
                    className="absolute left-0 w-full z-10"
                    onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <div className="h-4"></div>

                    <div className="bg-white shadow-lg rounded-lg border border-gray-100">
                        <div className="flex">
                            <div className="w-1/4 border-r border-gray-100 p-4 bg-gray-50">
                                <div className="font-medium text-gray-900 mb-4 px-2">
                                    {hoveredCategory.name}
                                </div>
                                {hoveredCategory.subCategories.map((subcategory) => (
                                    <div
                                        key={subcategory._id}
                                        className="p-2 cursor-pointer rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        {subcategory.name}
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    {hoveredCategory.subCategories.map((subcategory) => (
                                        <div key={subcategory._id} className="space-y-3">
                                            <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">
                                                {subcategory.name}
                                            </h3>
                                            <ul className="space-y-2">
                                                {subcategory.products?.slice(0, 6).map((product) => (
                                                    <li
                                                        key={product._id}
                                                        className="text-[13px] text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                                                    >
                                                        {product.title}
                                                    </li>
                                                ))}
                                                {subcategory.productCount > 6 && (
                                                    <li className="text-[13px] text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200">
                                                        View All ({subcategory.productCount})
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;