"use client";
import React, { useCallback, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/Spinner";
import { usePathname, useRouter } from "next/navigation";
import { editAlbum, getAlbumByName } from "../../../../../lib/rxDB";
import NFTMarketplaceContext from "../../../../../../Context/NFTMarketplaceContext";

const AlbumForm = ({ albumData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const collectionName = pathname.split("/").pop();
  const [popupMessage, setPopupMessage] = useState(null);
  const [owner, setOwner] = useState(null);
  const { uploadFile, currentAccount } = React.useContext(
    NFTMarketplaceContext
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    "https://placehold.co/100x400?text=Preview+Image"
  );

  useEffect(() => {
    console.log("Collection ID", decodeURIComponent(collectionName));
    if (collectionName) {
      getAlbumByName(decodeURIComponent(collectionName)).then((res) => {
        console.log("getAlbumByName", res);
        if (res._data) {
          setValue("title", res._data.albumname || "");
          setValue("description", res._data.descript || "");
          setValue("coverImage", res._data.image || "");
          setPreviewImage(res._data.image);
          setOwner(res._data.owner);
        }
      });
    }
  }, []);

  // Set form values when albumData changes or on initial load
  useEffect(() => {
    if (albumData) {
      setValue("title", albumData.title || "");
      setValue("description", albumData.description || "");
      setValue("marketplaceLink", albumData.marketplaceLink || "");
      setValue("nftList", albumData.nftList || []);
      setValue("coverImage", albumData.coverImage || "");
    }
  }, [albumData, setValue]);

  const onSubmit = async (data) => {
    try {
      await editAlbum(
        data.title,
        data.description, 
        data.coverImage
      ).then((res) => {
        console.log("addAlbum", res);
        setPopupMessage("Collection changes successfully!");
      });
    } catch (err) {
      console.error("Error creating album:", err);
      setPopupMessage("Failed to operate on collection. Please try again.");
    }

    // setTimeout(() => setPopupMessage(null), 5000);
    console.log("Album data", data);
    console.log("Cover image", data.coverImage.path);
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setLoading(true);
    if (rejectedFiles.length > 0) {
      console.error("Rejected files:", rejectedFiles);
      return; // Optionally handle rejected files
    }

    const url = await uploadFile(acceptedFiles[0]);
    setValue("coverImage", url);
    setPreviewImage(url);
    setLoading(false);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  if (!currentAccount && owner !== currentAccount) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-white">
          Access denied.
        </p>
      </div>
    );
  }

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
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Album
        </h2>
        {currentAccount && (
          <button
            type="button"
            onClick={() => router.push(`/my-collections/${currentAccount}`)}
            className="
            text-lg font-medium text-gray-700 mt-4 flex items-center hover:text-blue-500
          "
          >
            <ArrowLeft size={20} />
            &nbsp; Your albums
          </button>
        )}

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Album Name:
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
              loading ? (
                <div className="flex flex-col items-center justify-center min-h-96">
                  <Spinner />
                  <p className="text-white text-sm font-medium mt-2">
                    One second and you good to go ...
                  </p>
                </div>
              ) : (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full aspect-square object-cover p-10"
                />
              )
            ) : (
              <p className="text-gray-500">
                Drag & drop a cover image here, or click to select one
              </p>
            )}
          </div>
        </div>

        {/* <label className="block text-sm font-medium text-gray-700 mt-4">
          Marketplace Link:
        </label>
        <input
          type="text"
          {...register("marketplaceLink")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        /> */}

        {/* <label className="block text-sm font-medium text-gray-700 mt-4">
          NFTs in Album:
        </label>
        <textarea
          {...register("nftList")}
          placeholder="Enter NFT IDs separated by commas"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        ></textarea> */}

        <button
          type="submit"
          className="mt-6 w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Save Album changes 
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;
