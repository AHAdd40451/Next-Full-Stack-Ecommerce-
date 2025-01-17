"use client";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ChevronRight, Share2, Heart, Clock, Phone, MapPin, Flag, Info, MoveRight, Loader } from "lucide-react";
import Link from "next/link";

const ProductDetail = ({ product }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } catch (err) {
      toast.error("Couldn't share the product");
    }
  };

  return (
    <div className="w-[90%] mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-4 text-gray-600 overflow-x-auto">
        <span>Welcome</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>{product.category?.name || "Category"}</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>{product.location}</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          {/* Main content */}
          <div className="flex flex-col gap-8">
            {/* Images Div*/}
            <div className="relative">
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={handleShare} className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                {product.images?.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      width={400}
                      height={300}
                      className={`w-full h-48 object-cover rounded-lg ${index === 1 ? "brightness-50" : ""}`}
                    />
                    {index === 1 && product.images.length > 3 && (
                      <button className="absolute inset-0 text-white font-medium">
                        See all {product.images.length} photos
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="mt-6">
            <h1 className="text-2xl text-gray-900 font-medium font-heading1 mb-4">{product.title}</h1>
            <div className="flex items-center gap-2 text-lg font-decs text-gray-600 mb-2">
              <span>{product.location}</span>
              <span>•</span>
              <span className="capitalize">{product.condition}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg text-gray-900 font-medium">€{product.price?.toLocaleString()}</span>
              <span className="text-sm bg-blue-100 px-2 rounded-full text-blue-900">Secure payment available</span>
            </div>
            <p className="text-sm text-gray-600 mt-6">Posted {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>

          <hr className="my-10" />

          {/* Description */}
          <div>
            <h2 className="text-lg text-gray-900 font-medium mb-4">Description</h2>
            <p className="text-base font-decs text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          <hr className="my-10" />

          {/* Location */}
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5" />
              <p className="text-lg font-gray-900 font-medium">{product.location}</p>
            </div>
          </div>

          <hr className="my-10" />

          {/* Footer actions */}
          <div className="flex gap-8">
            <div className="flex gap-2">
              <Flag className="w-4" />
              <p className="font-medium underline cursor-pointer">Report the ad</p>
            </div>
            <div className="flex gap-2">
              <Info className="w-4" />
              <p className="font-medium underline cursor-pointer">Your rights and obligations</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg p-6 border border-gray-300 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/userprofile/${product.seller._id}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
                    {product.seller?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-medium">{product.seller?.name || "User"}</h3>
                    <p className="text-sm text-gray-500">Member</p>
                  </div>
                </div>
              </Link>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button className="w-full bg-secondary hover:bg-secondary_hover text-white py-3 rounded-lg font-medium transition-colors">
                Book Now
              </button>
              <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors">
                Send Message
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors">
                Show Phone Number
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
