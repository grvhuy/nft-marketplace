"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { exportDatabase } from "@/lib/rxDB";
// import { createAlbum } from "@/lib/rxDB"; // Replace with actual API call

const AlbumForm = ({ albumData }) => {
  const [popupMessage, setPopupMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    exportDatabase().then((res) => {
      console.log("exportDatabase", res);
    })
  }, [])

  // Set form values when albumData changes or on initial load
  useEffect(() => {
    if (albumData) {
      setValue("title", albumData.title || "");
      setValue("description", albumData.description || "");
      setValue("marketplaceLink", albumData.marketplaceLink || "");
      setValue("nftList", albumData.nftList || []);
      if (albumData.coverImage) {
        setValue("coverImage", albumData.coverImage);
      }
    }
  }, [albumData, setValue]);

  const onSubmit = async (data) => {
    try {
      await createAlbum({
        title: data.title,
        description: data.description,
        marketplaceLink: data.marketplaceLink,
        nftList: data.nftList,
        coverImage: data.coverImage,
      }).then(() => {
        setPopupMessage("Album created successfully!");
      });
    } catch (err) {
      console.error("Error creating album:", err);
      setPopupMessage("Failed to create album. Please try again.");
    }

    setTimeout(() => setPopupMessage(null), 3000);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setValue(
      "coverImage",
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  return (
    <div className="mb-20">
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium">{popupMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Album</h2>

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Album Title:
        </label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Album Description:
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Cover Image:
        </label>
        <div
          {...getRootProps({
            className:
              "mt-1 border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <input type="file" {...register("coverImage")} className="hidden" />
          {errors.coverImage && (
            <p className="text-red-500 text-sm">Cover image is required</p>
          )}
          <div>
            {getValues("coverImage") ? (
              <img
                src={getValues("coverImage")?.preview}
                alt="Cover"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">
                Drag & drop a cover image here, or click to select one
              </p>
            )}
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Marketplace Link:
        </label>
        <input
          type="url"
          {...register("marketplaceLink")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          NFTs in Album:
        </label>
        <textarea
          {...register("nftList")}
          placeholder="Enter NFT IDs separated by commas"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        ></textarea>

        <button
          type="submit"
          className="mt-6 w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Create Album
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;
