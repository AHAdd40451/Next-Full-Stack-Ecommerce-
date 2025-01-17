"use client";

import React from "react";
import { Heart } from "lucide-react";
import CardDetail from "../Cards/Card-detail";
import useStore from "@/app/(frontend)/store/useStore";

const WishlistPage = ({ MyAd, params }) => {

  const favroute = JSON.parse(localStorage.getItem("user-preferences"));

  let Wishlist = [];

  for (let i = 0; i < favroute.state.favorites.length; i++) {
    const filter = MyAd?.find(
      (item) => item._id === favroute.state.favorites[i]
    );
    Wishlist.push(filter);
  }

  const { favorites, toggleFavorite } = useStore();


  if (Wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-center py-32">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600">
            Start adding items to your wishlist while shopping!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist ({Wishlist.length})
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Wishlist?.map((item, index) => (
            <CardDetail
              product={item}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
