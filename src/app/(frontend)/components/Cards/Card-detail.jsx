import Link from "next/link";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { MdImage } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

const CardDetail = ({ product, toggleFavorite, favorites }) => {
  const { t, dir } = useLanguage();

  return (
    <div>
      <div
        key={product._id}
        className="relative w-full h-96 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col mt-5"
      >
        <div className="relative h-44 bg-gray-100 rounded-t-lg overflow-hidden">
          <Link className="cursor-pointer" href={`/product-detail/${product._id}`}>
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title || "Product Image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-110 transition-transform duration-300"
                priority={false}
                quality={75}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <MdImage className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </Link>

          <button
            onClick={() => toggleFavorite(product?._id)}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none transition-all duration-300 hover:text-gray-500 z-10"
          >
            {favorites.includes(product._id) ? (
              <IoIosHeart className="text-secondary text-xl" />
            ) : (
              <IoIosHeartEmpty className="text-black text-xl" />
            )}
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-base font-bold text-gray-800">${product.price?.toLocaleString()}</span>
          <Link href={`/product-detail/${product._id}`}>
            <button className="px-3 py-1 text-xs font-medium text-white bg-secondary rounded hover:bg-secondary_hover transition-colors duration-300">
              {t("common.view")}
            </button>
          </Link>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h5 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h5>
          <p className="mt-2 text-sm text-gray-500 flex-grow line-clamp-2">{product.description}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              📍 {product.location}
            </span>
            {/* {product.category?.main?.name && (
              <span className="text-xs text-gray-500">
                📁 {product.category.main.name}
                {product.category?.sub?.name &&
                  ` › ${product.category.sub.name}`}
              </span>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
