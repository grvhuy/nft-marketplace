"use client";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const UploadNFT = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    royalties: "",
    properties: "",
    collection: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const collections = [
    { id: 1, name: "Arts" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Music" },
    { id: 4, name: "Digital" },
    { id: 5, name: "Photography" },
  ];

  const [activeCollection, setActiveCollection] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreviewImage(URL.createObjectURL(file));
    setFormData({ ...formData, image: file });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCollectionChange = (e) => {
    const collectionId = e.target.value;
    const selectedCollection = collections.find(
      (collection) => collection.id === parseInt(collectionId)
    );
    setActiveCollection(selectedCollection);
    setFormData({
      ...formData,
      collection: selectedCollection ? selectedCollection.name : "",
    });
  };

  return (
    <div className="mx-20 lg:mx-60 p-5 mb-20 bg-[#484646] shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl text-white font-semibold mb-6 text-center">
        Upload NFT
      </h2>

      {/* Image Upload */}
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-gray-300 rounded-lg p-5 text-center mb-4 cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {/* {previewImage ? (
          <img
            src={previewImage}
            alt="NFT Preview"
            className="w-full h-96 object-cover rounded-lg"
          />
        ) :  */}
        <p className="text-gray-500">
          Drag & drop an image here, or click to select one
        </p>
      </div>

      {/* Dynamic View */}
      <div className="mt-8 p-4 mb-8 rounded-lg border-2 border-dashed border-gray-300">
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full aspect-square object-cover rounded-lg "
          />

          <div className="flex flex-col ml-4 justify-between">
            <p className="text-white font-bold text-lg">
              <span className=" text-white font-sans font-light">NFT Name</span> &nbsp; {formData.itemName}
            </p>
            <p className="text-white font-bold text-lg ">
              <span className=" text-white font-sans font-light">Description</span> &nbsp; {formData.description}
            </p>
            <p className="text-white font-bold text-lg ">
              <span className=" text-white font-sans font-light">Royalties</span> &nbsp; {formData.royalties}
            </p>
            <p className="text-white font-bold text-lg ">
              <span className=" text-white font-sans font-light">Properties</span> &nbsp; {formData.properties}
            </p>
            <p className="text-white font-bold text-lg ">
              <span className=" text-white font-sans font-light">Collection</span> &nbsp; {formData.collection}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <label className="block text-white text-sm font-medium ">
          Item Name
        </label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />

        <label className="block text-white text-sm font-medium  mt-4">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        ></textarea>

        <div className="flex space-x-4 mt-6">
          <label className="block text-white text-sm font-medium  mt-4">
            Royalties
          </label>
          <input
            type="number"
            name="royalties"
            value={formData.royalties}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />

          <label className="block text-white text-sm font-medium mt-4">
            Properties
          </label>
          <input
            type="text"
            name="properties"
            value={formData.properties}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <label className="block text-white text-sm font-medium  mt-6">
          Select Collection
        </label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          onChange={handleCollectionChange}
        >
          <option value="">-- Choose Collection --</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UploadNFT;
