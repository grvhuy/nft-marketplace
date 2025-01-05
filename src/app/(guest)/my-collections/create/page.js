"use client";
import React, { useCallback, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { addAlbum } from "../../../../lib/rxDB";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

const AlbumForm = ({ albumData }) => {
  const router = useRouter();
  const [popupMessage, setPopupMessage] = useState(null);
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
    // exportDatabase().then((res) => {
    //   console.log("exportDatabase", res);
    // })
  }, []);


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
      await addAlbum(
        currentAccount,
        data.title,
        data.description,
        data.coverImage
      ).then((res) => {
        console.log("addAlbum", res);
        setPopupMessage("Album created successfully!");
      });
    } catch (err) {
      console.error("Error creating album:", err);
      setPopupMessage("Failed to create album. Please try again.");
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
            onClick={() => router.replace(`${currentAccount}`)}
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
          Create Album
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;

// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import gunDB from "../../../../lib/gunDB"; // Update path as needed
// import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
// import { ArrowLeft } from "lucide-react";
// import Spinner from "@/components/Spinner";
// import { useRouter } from "next/navigation";

// const AlbumForm = ({ albumData }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     coverImage: ""
//   });
//   const [popupMessage, setPopupMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [previewImage, setPreviewImage] = useState(
//     "https://placehold.co/100x400?text=Preview+Image"
//   );

//   const { uploadFile, currentAccount } = React.useContext(
//     NFTMarketplaceContext
//   );

//   // Load existing album data if provided
//   useEffect(() => {
//     if (albumData) {
//       setFormData({
//         title: albumData.title || "",
//         description: albumData.description || "",
//         coverImage: albumData.coverImage || ""
//       });
//       if (albumData.coverImage) {
//         setPreviewImage(albumData.coverImage);
//       }
//     }
//   }, [albumData]);

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//     }
    
//     if (!formData.description.trim()) {
//       newErrors.description = "Description is required";
//     }
    
//     if (!formData.coverImage) {
//       newErrors.coverImage = "Cover image is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: null
//       }));
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await gunDB.addAlbum(
//         currentAccount,
//         formData.title,
//         formData.description,
//         formData.coverImage
//       );

//       setPopupMessage({
//         type: "success",
//         message: "Album created successfully!"
//       });

//       // Subscribe to the new album to get real-time updates
//       gunDB.subscribeToAlbum(formData.title, (updatedAlbum) => {
//         console.log("Album updated:", updatedAlbum);
//       });

//     } catch (err) {
//       console.error("Error creating album:", err);
//       setPopupMessage({
//         type: "error",
//         message: "Failed to create album. Please try again."
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
//     setLoading(true);
//     if (rejectedFiles.length > 0) {
//       setErrors(prev => ({
//         ...prev,
//         coverImage: "Invalid file type. Please use JPEG or PNG images only."
//       }));
//       setLoading(false);
//       return;
//     }

//     try {
//       const url = await uploadFile(acceptedFiles[0]);
//       setFormData(prev => ({
//         ...prev,
//         coverImage: url
//       }));
//       setPreviewImage(url);
      
//       // Clear any previous cover image errors
//       setErrors(prev => ({
//         ...prev,
//         coverImage: null
//       }));
//     } catch (err) {
//       setErrors(prev => ({
//         ...prev,
//         coverImage: "Failed to upload image. Please try again."
//       }));
//     } finally {
//       setLoading(false);
//     }
//   }, [uploadFile]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "image/jpeg": [".jpeg", ".jpg"],
//       "image/png": [".png"],
//     },
//     maxSize: 5242880 // 5MB
//   });

//   return (
//     <div className="mb-20">
//       {popupMessage && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className={`bg-white p-5 rounded-lg shadow-lg text-center ${
//             popupMessage.type === 'error' ? 'border-red-500' : 'border-green-500'
//           }`}>
//             <p className={`text-lg font-medium ${
//               popupMessage.type === 'error' ? 'text-red-600' : 'text-green-600'
//             }`}>
//               {popupMessage.message}
//             </p>
//             <button
//               onClick={() => {
//                 setPopupMessage(null);
//                 if (popupMessage.type === 'success') {
//                   router.replace(`/${currentAccount}`);
//                 }
//               }}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               {popupMessage.type === 'success' ? 'Go to Albums' : 'Try Again'}
//             </button>
//           </div>
//         </div>
//       )}

//       <form
//         onSubmit={onSubmit}
//         className="max-w-xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-10"
//       >
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Create Album
//         </h2>

//         {currentAccount && (
//           <button
//             type="button"
//             onClick={() => router.replace(`/${currentAccount}`)}
//             className="text-lg font-medium text-gray-700 mt-4 flex items-center hover:text-blue-500"
//           >
//             <ArrowLeft size={20} />
//             &nbsp; Your albums
//           </button>
//         )}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Album Name:
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.title ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.title && (
//               <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Album Description:
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.description ? 'border-red-500' : 'border-gray-300'
//               }`}
//               rows="4"
//             />
//             {errors.description && (
//               <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Cover Image:
//             </label>
//             <div
//               {...getRootProps()}
//               className={`mt-1 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer ${
//                 errors.coverImage ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <input {...getInputProps()} />
              
//               {loading ? (
//                 <div className="flex flex-col items-center justify-center min-h-48">
//                   <Spinner />
//                   <p className="text-gray-600 text-sm font-medium mt-2">
//                     Uploading image...
//                   </p>
//                 </div>
//               ) : formData.coverImage ? (
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="w-full h-48 object-cover rounded"
//                 />
//               ) : (
//                 <div className="space-y-2">
//                   <p className="text-gray-500">
//                     Drag & drop a cover image here, or click to select one
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     (JPEG or PNG, max 5MB)
//                   </p>
//                 </div>
//               )}
//             </div>
//             {errors.coverImage && (
//               <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`mt-6 w-full p-2 bg-blue-600 text-white font-semibold rounded-lg 
//             ${loading 
//               ? 'opacity-50 cursor-not-allowed' 
//               : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
//             }`}
//         >
//           {loading ? 'Creating Album...' : 'Create Album'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AlbumForm;
