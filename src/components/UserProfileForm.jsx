"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Facebook, Instagram, TwitterIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { updateUser } from "@/lib/rxDB";

const UserProfileForm = ({ userData, walletAddress }) => {
  const [popupMessage, setPopupMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  // Set form values when userData changes or on initial load
  useEffect(() => {
    if (userData) {
      setValue("name", userData.name || "");
      setValue("email", userData.email || "");
      setValue("bio", userData.bio || "");
      setValue("facebookLink", userData.facebookLink || "");
      setValue("instagramLink", userData.instagramLink || "");
      setValue("twitterLink", userData.twitterLink || "");
      setValue("walletAddress", walletAddress || "");
      // Optionally set the profile image if it's provided
      if (userData.profileImage) {
        setValue("profileImage", userData.profileImage);
      }
    }
  }, [userData, setValue]);

  const onSubmit = async (data) => {
    try {
      await updateUser(walletAddress, {
        name: data.name,
        email: data.email,
        bio: data.bio,
        facebookLink: data.facebookLink,
        instagramLink: data.instagramLink,
        twitterLink: data.twitterLink,
        profileImage: data.profileImage,
      }).then((res) => {
        console.log("updateUser", res);
        setPopupMessage("Updated successfully!");
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      setPopupMessage("Failed to update profile. Please try again.");
      setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
    }

    // Add more functionality here (e.g., API call)
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // Set the file directly in the form
    setValue(
      "profileImage",
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
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
  });

  return (
    <div>
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
          User Profile
        </h2>

        <label
          className="block text-sm font-medium text-gray-700 mt-4"
          htmlFor="walletAddress"
        >
          Wallet Address:
        </label>
        <input
          disabled
          type="text"
          id="walletAddress"
          {...register("walletAddress", {
            required: "Wallet Address is required",
          })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.walletAddress && (
          <p className="text-red-500 text-sm">{errors.walletAddress.message}</p>
        )}

        <label
          className="block text-sm font-medium text-gray-700 mt-4"
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
          {/* Preview the selected image */}
          <input
            type="file"
            id="profileImage"
            {...register("profileImage")}
            className="hidden"
          />
          {errors.profileImage && (
            <p className="text-red-500 text-sm">Profile image is required</p>
          )}
          <div>
            {getValues("profileImage") ? (
              <img
                src={getValues("profileImage")?.preview}
                alt="Profile"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">
                Drag & drop a profile image here, or click to select one
              </p>
            )}
          </div>
        </div>

        <label
          className="block text-sm font-medium text-gray-700 mt-4"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <label
          className="block text-sm font-medium text-gray-700 mt-4"
          htmlFor="email"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <label
          className="block text-sm font-medium text-gray-700 mt-4"
          htmlFor="bio"
        >
          Bio:
        </label>
        <textarea
          id="bio"
          {...register("bio", { required: "Bio is required" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}

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
              {...register("facebookLink")}
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
              {...register("instagramLink")}
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
              {...register("twitterLink")}
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
    </div>
  );
};

export default UserProfileForm;
