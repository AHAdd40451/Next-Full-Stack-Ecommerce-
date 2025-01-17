"use client";
import React from "react";
import { Share2, Flag, Ban, MapPin } from "lucide-react";
import CardDetail from "../Cards/Card-detail";
import useStore from "../../store/useStore";

const UserProfile = ({ params, MyAd }) => {
  const { favorites, toggleFavorite } = useStore();
  const filteredAds = MyAd.filter((item) => item.seller._id === params);
  const publishedAds = filteredAds.length;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-5">
        {/* Logo/Avatar */}
        <div className="w-20 h-20 rounded-lg bg-black flex items-center justify-center">
          <span className="text-xl font-bold text-yellow-500">HT</span>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{filteredAds[0].seller.name}</h1>
              <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
                Published Ad: {publishedAds}
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Share2 className="w-4 h-4" />
              Share user profile
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
              <Flag className="w-4 h-4" />
              Report user
            </button>
            <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
              <Ban className="w-4 h-4" />
              Block user
            </button>
          </div>
        </div>
      </div>

      {/* Ads Section */}
      <div>
          <hr />
        <div className="text-2xl font-bold text-black mt-2">
          {filteredAds[0].seller.name} Ads
        </div>

        {/* Grid for ad cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAds.map((item, index) => (
            <CardDetail product={item} toggleFavorite={toggleFavorite} favorites={favorites} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
