"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Heart, Filter } from "lucide-react";
import Image from "next/image";
import Dropdown from "./Dropdown";

// Category-specific configurations
const categoryConfigs = {
  cars: {
    keySpecs: ["year", "mileage", "fuel", "gearbox"],
    priceRanges: [
      "0-10000",
      "10000-30000",
      "30000-50000",
      "50000-100000",
      "100000+",
    ],
    defaultImage: "/api/placeholder/300/300",
  },
  clothing: {
    keySpecs: ["size", "brand", "condition", "material"],
    priceRanges: ["0-50", "50-100", "100-200", "200-500", "500+"],
    defaultImage: "/api/placeholder/300/300",
  },
  electronics: {
    keySpecs: ["brand", "condition", "warranty", "color", "model"],
    priceRanges: ["0-500", "500-1000", "1000-2000", "2000-5000", "5000+"],
    defaultImage: "/api/placeholder/300/300",
  },
  furniture: {
    keySpecs: ["material", "condition", "dimensions", "style"],
    priceRanges: ["0-200", "200-500", "500-1000", "1000-2000", "2000+"],
    defaultImage: "/api/placeholder/300/300",
  },
};

// Clothing Listings
const clothingListings = [
  {
    id: 1,
    title: "Nike Air Max T-Shirt",
    price: 45,
    size: "L",
    brand: "Nike",
    condition: "New",
    material: "Cotton",
    location: "Paris",
    image: "/api/placeholder/300/300",
    seller: "SportStyle Store",
    securePayment: true,
    spotlight: true,
  },
  {
    id: 2,
    title: "Levi's 501 Jeans",
    price: 89,
    size: "32",
    brand: "Levi's",
    condition: "New",
    material: "Denim",
    location: "Lyon",
    image: "/api/placeholder/300/300",
    seller: "JeanHub",
    securePayment: true,
    spotlight: false,
  },
  {
    id: 3,
    title: "Zara Summer Dress",
    price: 65,
    size: "M",
    brand: "Zara",
    condition: "Like New",
    material: "Polyester",
    location: "Marseille",
    image: "/api/placeholder/300/300",
    seller: "FashionPoint",
    securePayment: true,
    spotlight: true,
  },
];

// Electronics Listings
const electronicsListings = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    price: 899,
    brand: "Apple",
    condition: "Like New",
    warranty: "6 months",
    model: "13 Pro 256GB",
    location: "Paris",
    image:
      "https://img.leboncoin.fr/api/v1/lbcpb1/images/74/39/15/7439156aa5b643a3823234e31cabd91fba546194.jpg?rule=classified-1200x800-webp",
    color: "Blue",
    seller: "TechStore",
    securePayment: true,
    spotlight: true,
  },
  {
    id: 2,
    title: "Samsung 4K Smart TV",
    price: 1299,
    brand: "Samsung",
    condition: "New",
    warranty: "2 years",
    model: "QN55Q80B",
    location: "Nice",
    image:
      "https://img.leboncoin.fr/api/v1/lbcpb1/images/74/39/15/7439156aa5b643a3823234e31cabd91fba546194.jpg?rule=classified-1200x800-webp",
    seller: "ElectroHub",
    securePayment: true,
    spotlight: false,
  },
  {
    id: 3,
    title: "Sony PlayStation 5",
    price: 499,
    brand: "Sony",
    condition: "New",
    warranty: "1 year",
    model: "Digital Edition",
    location: "Lyon",
    image:
      "https://img.leboncoin.fr/api/v1/lbcpb1/images/74/39/15/7439156aa5b643a3823234e31cabd91fba546194.jpg?rule=classified-1200x800-webp",
    seller: "GameStation",
    securePayment: true,
    spotlight: true,
  },
];

// Furniture Listings
const furnitureListings = [
  {
    id: 1,
    title: "Modern Leather Sofa",
    price: 899,
    material: "Leather",
    condition: "New",
    dimensions: "220x85x75 cm",
    style: "Modern",
    location: "Paris",
    image: "/api/placeholder/300/300",
    seller: "HomeStyle",
    securePayment: true,
    spotlight: true,
  },
  {
    id: 2,
    title: "Wooden Dining Table",
    price: 459,
    material: "Oak Wood",
    condition: "Like New",
    dimensions: "160x90x75 cm",
    style: "Rustic",
    location: "Bordeaux",
    image: "/api/placeholder/300/300",
    seller: "FurniturePlus",
    securePayment: true,
    spotlight: false,
  },
  {
    id: 3,
    title: "IKEA Wardrobe",
    price: 299,
    material: "MDF",
    condition: "New",
    dimensions: "150x60x200 cm",
    style: "Contemporary",
    location: "Lyon",
    image: "/api/placeholder/300/300",
    seller: "IKEA Store",
    securePayment: true,
    spotlight: true,
  },
];

const carListings = [
  {
    id: 1,
    title: "BMW M3 Competition",
    price: 82500,
    year: 2023,
    mileage: 12000,
    fuel: "Petrol",
    gearbox: "Automatic",
    location: "Paris",
    image: "/api/placeholder/300/300",
    seller: "BMW Premium Motors",
    dealer: true,
    securePayment: true,
    spotlight: true,
    condition: "Like New",
    engineSize: "3.0L",
    power: "510 HP",
    color: "Frozen Grey",
  },
  {
    id: 2,
    title: "Mercedes-Benz E350 AMG Line",
    price: 45900,
    year: 2020,
    mileage: 45000,
    fuel: "Diesel",
    gearbox: "Automatic",
    location: "Lyon",
    image: "/api/placeholder/300/300",
    seller: "AutoElite",
    dealer: true,
    securePayment: true,
    spotlight: false,
    condition: "Excellent",
    engineSize: "2.0L",
    power: "286 HP",
    color: "Obsidian Black",
  },
  {
    id: 3,
    title: "Audi RS6 Avant",
    price: 115000,
    year: 2022,
    mileage: 28000,
    fuel: "Petrol",
    gearbox: "Automatic",
    location: "Nice",
    image: "/api/placeholder/300/300",
    seller: "Audi Exclusive",
    dealer: true,
    securePayment: true,
    spotlight: true,
    condition: "Excellent",
    engineSize: "4.0L V8",
    power: "600 HP",
    color: "Nardo Grey",
  },
];

const ListingPage = ({ listings = electronicsListings, category = "electronics" }) => {
  const [activeListings, setActiveListings] = useState(listings);
  const [filters, setFilters] = useState({});
  const [liked, setLiked] = useState({});

  // Initialize filters based on category
  useEffect(() => {
    const categoryConfig = categoryConfigs[category] || {};
    const initialFilters = {
      location: "",
      price: "",
      ...categoryConfig.keySpecs.reduce(
        (acc, spec) => ({
          ...acc,
          [spec]: "",
        }),
        {}
      ),
    };
    setFilters(initialFilters);
  }, [category]);

  // Dynamically generate filter options based on category and current listings
  const filterOptions = useMemo(() => {
    const options = {
      locations: [...new Set(listings.map((item) => item.location))],
      prices: categoryConfigs[category]?.priceRanges || [],
    };

    // Add category-specific filter options
    const categoryConfig = categoryConfigs[category] || {};
    categoryConfig.keySpecs?.forEach((spec) => {
      options[spec] = [...new Set(listings.map((item) => item[spec]))].filter(
        Boolean
      );
    });

    return options;
  }, [listings, category]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Apply filters
  useEffect(() => {
    let filteredListings = [...listings];

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      if (key === "price") {
        const [min, max] = value.split("-").map(Number);
        filteredListings = filteredListings.filter((item) => {
          if (value.endsWith("+")) return item.price >= min;
          return item.price >= min && item.price <= max;
        });
      } else {
        filteredListings = filteredListings.filter((item) => {
          const itemValue = item[key];
          const filterValue = value;

          // If both values are numbers, do a direct comparison
          if (
            typeof itemValue === "number" &&
            typeof filterValue === "number"
          ) {
            return itemValue === filterValue;
          }

          // Convert both to strings for string comparison
          const itemString = String(itemValue || "").toLowerCase();
          const filterString = String(filterValue || "").toLowerCase();

          return itemString.includes(filterString);
        });
      }
    });

    setActiveListings(filteredListings);
  }, [filters, listings]);

  const resetFilters = () => {
    const categoryConfig = categoryConfigs[category] || {};
    const initialFilters = {
      location: "",
      price: "",
      ...categoryConfig.keySpecs.reduce(
        (acc, spec) => ({
          ...acc,
          [spec]: "",
        }),
        {}
      ),
    };
    setFilters(initialFilters);
    setActiveListings(listings);
  };

  const toggleHeart = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format number with thousands separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get category configuration
  const categoryConfig = categoryConfigs[category] || {};

  return (
    <div className="w-[90%] mx-auto p-4">
      {/* Dynamic Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        {filterOptions.locations?.length > 0 && (
          <Dropdown
            label="Location"
            options={filterOptions.locations}
            value={filters.location}
            onChange={(value) => handleFilterChange("location", value)}
          />
        )}

        <Dropdown
          label="Price Range"
          options={filterOptions.prices}
          value={filters.price}
          onChange={(value) => handleFilterChange("price", value)}
        />

        {/* Dynamic Category-Specific Filters */}
        {categoryConfig.keySpecs?.map(
          (spec) =>
            filterOptions[spec]?.length > 0 && (
              <Dropdown
                key={spec}
                label={spec.charAt(0).toUpperCase() + spec.slice(1)}
                options={filterOptions[spec]}
                value={filters[spec]}
                onChange={(value) => handleFilterChange(spec, value)}
              />
            )
        )}

        {/* Reset Filters Button */}
        <button
          className="flex items-center border rounded-xl px-3 py-2 space-x-2 hover:bg-gray-50"
          onClick={resetFilters}
        >
          <Filter className="text-gray-600" size={20} />
          <span className="text-gray-600">Reset Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-orange-500 text-white text-sm font-medium rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Listings Header */}
      <div className="my-6">
        <h1 className="text-xl font-semibold mb-2">
          {category.charAt(0).toUpperCase() + category.slice(1)} Ads
        </h1>
        <p className="text-gray-600">{activeListings.length} Ads available</p>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        {activeListings.length > 0 ? (
          activeListings.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image Section */}
                <div className="relative w-full sm:w-72 h-48">
                  <Image
                    src={item.image || categoryConfig.defaultImage}
                    alt={item.title}
                    fill
                    // className="object-cover"
                  />
                  <button
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                      liked[item.id] ? "bg-orange-600" : "bg-white"
                    }`}
                    onClick={() => toggleHeart(item.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        liked[item.id] ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </button>
                  {item.spotlight && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
                      Featured
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">{item.title}</h2>
                      {item.seller && (
                        <p className="text-sm text-gray-600">{item.seller}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">
                        {formatNumber(item.price)} €
                      </span>
                      {item.securePayment && (
                        <p className="text-sm text-green-600">
                          Secure Payment Available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Specifications */}
                  <div className="grid gap-4 my-4">
                    <div className="flex flex-wrap gap-4">
                      {categoryConfig.keySpecs?.map(
                        (spec) =>
                          item[spec] && (
                            <div key={spec}>
                              <p className="text-gray-600 text-sm">
                                {spec.charAt(0).toUpperCase() + spec.slice(1)}
                              </p>
                              <p>{item[spec]}</p>
                            </div>
                          )
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-auto">
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No listings found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPage;
