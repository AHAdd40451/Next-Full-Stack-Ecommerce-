"use client";

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  
  const pathname = usePathname();
  const authPages = ['/signin', '/signup', '/forgot-pass'];
  if (authPages.includes(pathname)) return null;

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr] gap-8">
          {/* About Section */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-heading1 mb-4">About Us</h2>
            <p className="text-sm font-decs text-gray-400">
              Your trusted platform for buying and selling. Connect with sellers
              and buyers worldwide for a seamless experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-heading1 mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm font-decs">
              <li>
                <a href="/about" className="hover:text-cyan-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-cyan-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-cyan-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-cyan-400 transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-cyan-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-heading1 mb-4">Quick Links</h2>
            <ul className="space-y-2 font-decs text-sm">
              <li>
                <a href="/about" className="hover:text-cyan-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-cyan-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-cyan-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-cyan-400 transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-cyan-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

            <div className="flex flex-col gap-8">
              {/* Newsletter Subscription */}
               <div className="flex flex-col">
              <h2 className="text-xl font-bold font-heading1 mb-4">Stay Updated</h2>
              <p className="text-sm font-decs text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and exclusive
                deals.
              </p>
              <form className="flex flex-col sm:flex-row items-stretch">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 sm:rounded-l-md text-gray-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary text-white px-6 py-3 sm:rounded-r-md transition"
                >
                  Subscribe
                </button>
              </form>
               </div>

              {/* Social Media */}
              <div className="flex flex-col">
              {/* <h2 className="text-xl font-heading1 font-bold mb-4">Follow Us</h2>
              <p className="text-sm font-decs text-gray-400 mb-4">
                Stay connected on our social media channels.
              </p> */}
              <div className="flex justify-end space-x-4">
                <a
                  href="https://facebook.com"
                  className="text-gray-400 hover:text-primary transition text-2xl"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-gray-400 hover:text-primary transition text-2xl"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-gray-400 hover:text-primary transition text-2xl"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-gray-400 hover:text-primary transition text-2xl"
                >
                  <FaLinkedin />
                </a>
              </div>
              </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center">
          <p className="text-md text-gray-400">
            © {new Date().getFullYear()} Buying and Selling Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
