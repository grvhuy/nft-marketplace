"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Facebook, InfoIcon, Instagram, TwitterIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";
import Spinner from "./Spinner";
import { shortenAddress } from "../../utils/convert";

const UserProfileForm = ({ userData, walletAddress }) => {
  const { currentAccount, setUserIPFSHash, getUserIPFSHash, uploadFile } =
    React.useContext(NFTMarketplaceContext);
  const [popupMessage, setPopupMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://placehold.co/100x400?text=Preview+Image"
  );
  const [isRestricted, setIsRestricted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      const hash = await getUserIPFSHash(currentAccount);
      if (!hash) {
        console.warn("No IPFS hash found for this account.");
      } else {
        try {
          setIpfsHash(hash);
          const link = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${hash}`;
          const response = await fetch(link);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          // Populate form fields with fetched user data
          setValue("name", data.name || "");
          setValue("email", data.email || "");
          setValue("bio", data.bio || "");
          setValue("facebookLink", data.facebookLink || "");
          setValue("instagramLink", data.instagramLink || "");
          setValue("twitterLink", data.twitterLink || "");
          setValue("profileImage", data.profileImage || "");
          if (data.restricted) {
            setIsRestricted(true);
          }
          // Update the preview image
          setPreviewImage(data.profileImage || null);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (currentAccount) {
      fetchUserData();
    }
  }, [currentAccount, getUserIPFSHash, setValue]);

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      const userData = {
        name: data.name,
        email: data.email,
        bio: data.bio,
        facebookLink: data.facebookLink,
        instagramLink: data.instagramLink,
        twitterLink: data.twitterLink,
        profileImage: data.profileImage,
      };

      const dataToPIN = {
        pinataMetadata: {
          name: `${walletAddress}.json`,
          timestamp: new Date().toISOString(),
        },
        pinataContent: userData,
      };

      const newhash = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPIN),
        }
      );

      if (newhash.status === 200) {
        const response = await newhash.json();
        await setUserIPFSHash(walletAddress, response.IpfsHash);
        setPopupMessage("Profile updated successfully.");
      } else {
        alert("Failed to create IPFS Hash.");
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
      setPopupMessage("Failed to update profile. Please try again.");
    }

    // Add more functionality here (e.g., API call)
  };

  // const onDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   // Set the file directly in the form
  //   setValue(
  //     "profileImage",
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     })
  //   );
  // };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setLoading(true);
    if (rejectedFiles.length > 0) {
      console.error("Rejected files:", rejectedFiles);
      return;
    }
    const url = await uploadFile(acceptedFiles[0]);
    setValue("profileImage", url);
    setPreviewImage(url);
    setLoading(false);
  });

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
    <div className="mb-12">
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
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
        {!isRestricted && (
          <h3 className="flex italic text-blue-700 text-sm items-center pb-4">
            <InfoIcon size={16} color="blue" />
            You can pay a small gas fee to update your profile.
          </h3>
        )}
        {/* restricted warning */}
        {isRestricted && (
          <div className=" text-red-500 text-center p-2 flex items-center">
            <InfoIcon className="w-8 h-8 mr-2" />
            Your account has been restricted due to a violation of our terms.
            You can not update your profile or selling NFTs for now.
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Profile
          <br />
          <span
            onClick={() => window.navigator.clipboard.writeText(walletAddress)}
            className="text-sm cursor-pointer text-purple-600 italic"
          >
            &nbsp; {walletAddress}
            {/* {shortenAddress(walletAddress)} */}
          </span>
        </h2>

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
                  alt="Preview Image"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              )
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
          disabled={isRestricted}
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
          disabled={isRestricted}
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
          disabled={isRestricted}
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
              disabled={isRestricted}
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
              disabled={isRestricted}
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
              disabled={isRestricted}
              type="url"
              {...register("twitterLink")}
              placeholder="Twitter"
              className="pl-10 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          disabled={isRestricted}
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
