"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Eye, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "../../store/useAuthStore";

const MyAdsPage = ({ product }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  const { user } = useAuthStore();

  const filteredProducts = product?.filter((ad) => ad.seller._id == user.uid);

  const handlePostAd = () => {
    router.push("/post-add");
  };

  const handleEditAd = (id) => {
    router.push(`/edit-ad/${id}`);
  };

  const handleViewAd = (id) => {
    router.push(`/product-detail/${id}`);
  };

  const handleDeleteAd = (id) => {
    setSelectedAdId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setMyAds((prev) => prev.filter((ad) => ad.id !== selectedAdId));
    setShowDeleteDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-[90%] max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Ads</h1>
          <p className="text-gray-600">Manage your posted advertisements</p>
        </div>
        <button
          onClick={handlePostAd}
          className="bg-secondary hover:bg-secondary_hover text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus size={17} />
          Post New Ad
        </button>
      </div>

      <div className="grid gap-4">
        {filteredProducts?.map((ad, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full  sm:w-72 h-48 border">
                <Image
                  src={ad?.images[0]}
                  alt={ad?.title}
                  //   width={300}
                  //   height={300}
                  fill
                  //   className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{ad?.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {ad?.category.main.name}
                    </p>
                  </div>
                  <span className="font-bold">{ad?.price} €</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      ad.status
                    )} capitalize`}
                  >
                    {ad?.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Posted: {ad?.created}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewAd(ad?.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditAd(ad?.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad?.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-800 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12 bg-primary rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Ads Posted</h3>
            <p className="mt-2 text-gray-600">
              Start selling by posting your first ad
            </p>
            <button
              onClick={handlePostAd}
              className="mt-4 bg-secondary hover:bg-secondary_hover text-white px-4 py-2 rounded-lg flex items-center gap-1 mx-auto"
            >
              <Plus size={17} />
              Post New Ad
            </button>
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p className="text-gray-600 mt-2">
              This action cannot be undone. This will permanently delete your
              ad.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAdsPage;
