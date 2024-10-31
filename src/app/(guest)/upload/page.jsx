"use client";
import MyButton from "@/components/custom/MyButton";
import React, { useState, useEffect, useCallback } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

const UploadNFT = () => {
  const router = useRouter();



  const { uploadFile, createNFT, currentAccount } = React.useContext(NFTMarketplaceContext);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    royalties: "",
    properties: "",
    collection: "",
    image: null,
    price: "",
  });
  // const [fileURL, setFileURL] = useState(null);

  const [previewImage, setPreviewImage] = useState(
    "https://placehold.co/600x400?text=Preview+Image"
  );

  const collections = [
    { id: 1, name: "Arts" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Music" },
    { id: 4, name: "Digital" },
    { id: 5, name: "Photography" },
  ];

  const [activeCollection, setActiveCollection] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setLoading(true);
    if (rejectedFiles.length > 0) {
      console.error("Rejected files:", rejectedFiles);
      return; // Optionally handle rejected files
    }

    const url = await uploadFile(acceptedFiles[0]);
    setFormData({ ...formData, image: url });
    setPreviewImage(url);
    setLoading(false);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Allows all image types
    },
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
        <p className="text-gray-500">
          Drag & drop an image here, or click to select one
        </p>
      </div>

      {/* Dynamic View */}

      <div className="mt-8 p-4 mb-8 rounded-lg border-2 border-dashed border-gray-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Spinner />
            <p className="text-white text-sm font-medium mt-2">
              One second and you good to go ...
            </p>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full aspect-square object-cover p-10"
            />

            <div className="flex flex-col ml-4 justify-evenly">
              <p className="text-white font-bold text-lg">
                <span className=" text-white font-sans font-light">
                  NFT Name
                </span>{" "}
                &nbsp; {formData.itemName}
              </p>
              <p className="text-white font-bold text-lg ">
                <span className=" text-white font-sans font-light">
                  Description
                </span>{" "}
                &nbsp; {formData.description}
              </p>
              <p className="text-white font-bold text-lg ">
                <span className=" text-white font-sans font-light">
                  Royalties
                </span>{" "}
                &nbsp; {formData.royalties}
              </p>
              <p className="text-white font-bold text-lg ">
                <span className=" text-white font-sans font-light">Price</span>{" "}
                &nbsp; {formData.price}
              </p>
              <p className="text-white font-bold text-lg ">
                <span className=" text-white font-sans font-light">
                  Properties
                </span>{" "}
                &nbsp; {formData.properties}
              </p>
              <p className="text-white font-bold text-lg ">
                <span className=" text-white font-sans font-light">
                  Collection
                </span>{" "}
                &nbsp; {formData.collection}
              </p>
            </div>
          </div>
        )}
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

          <label className="block text-white text-sm font-medium  mt-4">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
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
      <div className="flex justify-between">
        <div></div>
        <MyButton
          onClick={() => {
            console.log(formData);
            createNFT(
              formData.itemName,
              formData.description,
              formData.price,
              formData.image
            )
          }}
          title="Upload"
        />
      </div>
    </div>
  );
};

export default UploadNFT;
