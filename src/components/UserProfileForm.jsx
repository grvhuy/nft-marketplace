"use client";
import React, { useState } from "react";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import {
  Facebook,
  FacebookIcon,
  Instagram,
  Twitter,
  TwitterIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    walletAddress: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Add more functionality here (e.g., API call)
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // Assuming you want to set the file directly
    setFormData({
      ...formData,
      profileImage: Object.assign(file, {
        preview: URL.createObjectURL(file), // Create a preview for the image
      }),
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg mt-10"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">User Profile</h2>

      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor="profileImage"
      >
        Profile Image:
      </label>
      <div
        {...getRootProps({
          className:
            "mt-1 border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {formData.profileImage ? (
          <img
            src={formData.profileImage.preview}
            alt="Profile"
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <p className="text-gray-500">
            Drag & drop a profile image here, or click to select one
          </p>
        )}
      </div>

      <label className="block text-sm font-medium text-gray-700" htmlFor="name">
        Name:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
      />

      <label
        className="block text-sm font-medium text-gray-700 mt-4"
        htmlFor="email"
      >
        Email:
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
      />

      <label
        className="block text-sm font-medium text-gray-700 mt-4"
        htmlFor="bio"
      >
        Bio:
      </label>
      <textarea
        id="bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
      ></textarea>

      <label
        className="block text-sm font-medium text-gray-700 mt-4"
        htmlFor="walletAddress"
      >
        Wallet Address:
      </label>
      <input
        type="text"
        id="walletAddress"
        name="walletAddress"
        value={formData.walletAddress}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Social Media Links:
      </label>
      <div className="flex justify-between mt-2">
        {/* Facebook Link */}
        <div className="relative w-full mr-2">
          <span className="absolute left-3 top-2 text-gray-500">
            <Facebook color="#1362bf" />
          </span>
          <input
            type="url"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={handleChange}
            placeholder="Facebook"
            className="pl-10 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Instagram Link */}
        <div className="relative w-full mr-2">
          <span className="absolute left-3 top-2 text-gray-500">
            <Instagram color="#fe6000" />
          </span>
          <input
            type="url"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={handleChange}
            placeholder="Instagram"
            className="pl-10 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Twitter Link */}
        <div className="relative w-full">
          <span className="absolute left-3 top-2 text-gray-500">
            <TwitterIcon color="#35b1f7" />
          </span>
          <input
            type="url"
            name="twitterLink"
            value={formData.twitterLink}
            onChange={handleChange}
            placeholder="Twitter"
            className="pl-10 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Submit
      </button>
    </form>
  );
};

export default UserProfileForm;
