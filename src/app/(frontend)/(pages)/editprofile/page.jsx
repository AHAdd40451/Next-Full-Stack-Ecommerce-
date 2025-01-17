"use client";

import React, { useState } from "react";
import { Camera, Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// User data structure
const initialUserData  = {
  profile: {
    firstName: "Ahad",
    lastName: "Khan",
    memberSince: "2024",
    avatar: "https://scontent.fkhi17-2.fna.fbcdn.net/v/t39.30808-6/460922865_2221006928276860_7976993178852489003_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFXmHku9VmsWHEzp-Tq-JTa--K8wBdNiTX74rzAF02JNUz6afQl7qz6hmhTSexQMG4h41r4-pYS3olNrKkrGL2R&_nc_ohc=SNzFxy9seX4Q7kNvgGp_efc&_nc_oc=AdgrG9krygDTySeJzp4UTBBV9Dri2CGIzMWzThaXnEFofSdXMJdQa-V7q3GTeGn9FEU&_nc_zt=23&_nc_ht=scontent.fkhi17-2.fna&_nc_gid=AoIiCNVbSOkxDHjCzCQEWcx&oh=00_AYDPweJWGvbcLGlwsp6sodD7kEWxR8w5RO76dVHtiLZhgQ&oe=6784AB9B",
    gender: "male",
    about: "Jo dalle ko dalla na smjhy wo bhi dalla hay",
  },
  contact: {
    primaryEmail: "ahad.doe@hutiya.com",
    isEmailVerified: true,
    phone: "",
  }
};

const tabs = [
  { id: "basic", label: "Basic Information" },
  { id: "contact", label: "Contact information" },
  { id: "security", label: "Security" },
];

const genderOptions = ["Male", "Female", "Other"];

const EditProfile = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [userData, setUserData] = useState(initialUserData);

  const handleInputChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="h-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-8 py-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Your Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information and manage your account</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <Image
                    src={userData.profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800">{`${userData.profile.firstName} ${userData.profile.lastName}`}</h3>
                <p className="text-sm text-gray-500">Member since {userData.profile.memberSince}</p>
              </div>
            </div>

            <div className="mt-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
                    activeTab === tab.id ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 bg-white rounded-xl shadow-lg">
            <div className="min-h-[400px] p-6">
              <div className="h-full">
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={userData.profile.firstName}
                          onChange={(e) => handleInputChange("profile", "firstName", e.target.value)}
                          placeholder="Enter first name"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={userData.profile.lastName}
                          onChange={(e) => handleInputChange("profile", "lastName", e.target.value)}
                          placeholder="Enter last name"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex flex-wrap gap-4">
                        {genderOptions.map((gender) => (
                          <label
                            key={gender}
                            className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={gender.toLowerCase()}
                              checked={userData.profile.gender === gender.toLowerCase()}
                              onChange={(e) => handleInputChange("profile", "gender", e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>{gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                      <textarea
                        placeholder="Tell us about yourself..."
                        value={userData.profile.about}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            handleInputChange("profile", "about", e.target.value);
                          }
                        }}
                        className="resize-none w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24"
                      />
                      <div className="flex flex-row-reverse mt-1">
                        <span className="text-sm text-gray-500">{userData.profile.about.length}/200 words</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Verified Email</h3>
                        <p className="text-sm text-blue-600">{userData.contact.primaryEmail}</p>
                      </div>
                      {userData.contact.isEmailVerified && <CheckCircle2 className="ml-auto w-5 h-5 text-blue-600" />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Add New Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Enter new email address"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={userData.contact.phone}
                          onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Password & Security</h3>
                      <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                        Change Password
                        <span className="text-gray-400">●●●●●●●●</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                      {showDeleteConfirm ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-red-800">This action cannot be undone. Please confirm.</span>
                            <div className="space-x-2">
                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                onClick={() => console.log("Delete account")}
                              >
                                Delete
                              </button>
                              <button
                                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDeleteConfirm(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex justify-between items-center"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Delete Account
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;