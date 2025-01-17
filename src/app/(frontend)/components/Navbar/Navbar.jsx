"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { GoBell } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Plus } from "lucide-react";

import useAuthStore from "@/app/(frontend)/store/useAuthStore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const navItems = [
    { icon: <FaRegHeart className="text-2xl" />, label: "Favorites", path: "/WishList" },
    { icon: <MdOutlineMessage className="text-2xl" />, label: "Messages", path: "/messenger" },
  ];

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const { t, dir } = useLanguage();

  const pathname = usePathname();
  const authPages = ["/signin", "/signup", "/forgot-pass"];
  if (authPages.includes(pathname)) return null;

  const handleNavClick = (path) => {
    if (!isAuthenticated) {
      router.push("/signin");
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="w-[90%] m-auto flex lg:flex-row md:flex-col items-center gap-4 bg-white px-5 py-2 justify-between">
      <div className="flex gap-5 items-center">
        <Link href="/" className="flex items-center gap-1">
          <h1 className="text-2xl font-bold">Sookhur</h1>
          <Image src={"/assets/logo.jpg"} alt="Arabic Logo" width={60} height={55} />
        </Link>
        <Link
          href="/post-add"
          className="bg-secondary whitespace-pre hover:bg-secondary_hover text-white font-medium py-2 px-4 rounded-xl flex items-center"
        >
          <Plus size={17} /> Post New Ad
        </Link>
      </div>

      <div className="flex-grow">
        <div className="flex items-center border rounded-xl bg-gray-100 px-2 py-2">
          <input
            type="text"
            placeholder="Search on leboncoin"
            className="bg-transparent focus:outline-none text-gray-700 flex-grow"
          />
          <button className="bg-secondary hover:bg-secondary_hover p-[7px] rounded-lg">
            <FaSearch className="text-sm text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavClick(item.path)}
            className="whitespace-pre text-xs flex flex-col gap-1 items-center text-gray-700 hover:text-gray-900 cursor-pointer relative group"
          >
            {item.icon}
            {item.label}
            <span className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-gray-900 group-hover:w-full transition-all duration-300"></span>
          </button>
        ))}

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{user?.name}</span>
              <IoMdArrowDropdown className="text-xl" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  href="/editprofile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/my-ads"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  My Ads
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/signin"
            className="whitespace-pre text-xs flex flex-col gap-1 items-center text-gray-700 hover:text-gray-900 cursor-pointer relative group"
          >
            <BiSolidUser className="text-2xl" />
            {t("common.login")}
            <span className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-gray-900 group-hover:w-full transition-all duration-300"></span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
