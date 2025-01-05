// import Gun from "gun";
// import SEA from "gun/sea";

// class IPFSDataSync {
//   constructor(options = {}) {
//     // Cập nhật danh sách peers để tăng khả năng kết nối
//     this.defaultPeers = [
//       "http://localhost:8765/gun",
//       "https://gun-manhattan.herokuapp.com/gun",
//       "https://gun-us-west.herokuapp.com/gun",
//       "https://gun-eu.herokuapp.com/gun",
//     ];

//     // Khởi tạo Gun với cấu hình nâng cao
//     this.gun = Gun({
//       peers: options.peers || this.defaultPeers,
//       localStorage: true,
//       radisk: true,
//       multicast: true,
//       // Thêm cấu hình WebRTC để hỗ trợ kết nối ngang hàng
//       webrtc: {
//         iceServers: [
//           { urls: "stun:stun.l.google.com:19302" },
//           { urls: "stun:global.stun.twilio.com:3478" },
//         ],
//       },
//     });
//   }

//   // Pin JSON to IPFS using Pinata
//   async pinJSONToIPFS(dbjson) {
//     try {
//       const options = {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           pinataMetadata: {
//             name: "IPDB Content",
//             keyvalues: {
//               timestamp: new Date().toISOString(),
//             },
//           },
//           pinataContent: dbjson,
//         }),
//       };

//       const response = await fetch(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         options
//       );

//       if (!response.ok) {
//         throw new Error(`IPFS pinning failed: ${response.statusText}`);
//       }

//       const result = await response.json();
//       return result.IpfsHash;
//     } catch (error) {
//       console.error("IPFS Pinning Error:", error);
//       throw error;
//     }
//   }

//   // Store CID in Gun with additional metadata
//   async storeCIDInGun(userId, cid, additionalMetadata = {}) {
//     return new Promise((resolve, reject) => {
//       const timestamp = Date.now();
//       const syncData = {
//         metadataCid: cid,
//         timestamp,
//         ...additionalMetadata,
//       };

//       this.gun.get(`users/${userId}/sync`).put(syncData, (ack) => {
//         if (ack.err) {
//           reject(ack.err);
//         } else {
//           resolve(syncData);
//         }
//       });
//     });
//   }

//   // Fetch latest CID from Gun with version control
//   async fetchLatestCIDFromGun(userId) {
//     return new Promise((resolve, reject) => {
//       this.gun.get(`users/${userId}/sync`).once((data) => {
//         if (data && data.metadataCid) {
//           resolve(data.metadataCid);
//         } else {
//           reject("No CID found in Gun", data);
//         }
//       });
//     });
//   }

//   // Retrieve file from IPFS with enhanced error handling
//   async getFileFromIPFS(url) {
//     try {
//       const options = {
//         method: "GET",
//       };

//       const response = await fetch(url, options);

//       if (!response.ok) {
//         throw new Error(`IPFS retrieval failed: ${response.statusText}`);
//       }

//       // Giả sử dữ liệu trả về là JSON
//       const result = await response.json();
//       return result; // Trả về dữ liệu JSON đầy đủ
//     } catch (error) {
//       console.error("IPFS Retrieval Error:", error);
//       throw error;
//     }
//   }

//   // Phương thức đồng bộ hóa nâng cao với version control
//   async syncWithGun(userId, dbJson, additionalMetadata = {}) {
//     try {
//       // Kiểm tra và tạo version cho dữ liệu
//       const version = additionalMetadata.version || Date.now();

//       // Pin JSON to IPFS
//       const cid = await this.pinJSONToIPFS(dbJson);

//       // Lưu trữ CID trong Gun với thông tin version
//       await this.storeCIDInGun(userId, cid, {
//         ...additionalMetadata,
//         version,
//         syncTimestamp: Date.now(),
//       });

//       return { cid, version };
//     } catch (error) {
//       console.error("Advanced Sync Error:", error);
//       throw new Error(`Comprehensive sync failed: ${error.message}`);
//     }
//   }

//   // Phương thức đồng bộ từ Gun với kiểm tra version
//   async syncFromGun(userId, options = {}) {
//     try {
//       // Lấy CID mới nhất từ Gun
//       const latestSync = await this.fetchLatestCIDFromGun(userId);

//       // Kiểm tra version nếu cần
//       if (options.minVersion && latestSync.version < options.minVersion) {
//         throw new Error("Local version is too old");
//       }

//       console.log("Latest CID:", latestSync.metadataCid);

//       // Sử dụng URL IPFS để lấy JSON
//       const dbJson = await this.getFileFromIPFS(
//         `https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/${latestSync.metadataCid}`
//       );

//       return {
//         data: dbJson,
//         version: latestSync.version,
//       };
//     } catch (error) {
//       console.error("Sync from Gun Failed:", error);
//       throw error;
//     }
//   }

//   // Phương thức đăng ký theo dõi thay đổi với quản lý version
//   subscribeToVersionedChanges(userId, callback) {
//     let lastVersion = 0;

//     const subscription = this.gun
//       .get(`users/${userId}/sync`)
//       .on(async (data, key) => {
//         // Chỉ xử lý khi version mới
//         if (data && data.version && data.version > lastVersion) {
//           try {
//             // Lấy dữ liệu chi tiết qua URL IPFS
//             const fullData = await this.getFileFromIPFS(
//               `https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/${data.metadataCid}`
//             );

//             // Gọi callback với dữ liệu đầy đủ
//             callback({
//               version: data.version,
//               data: fullData,
//               metadata: data,
//             });

//             // Cập nhật version cuối cùng
//             lastVersion = data.version;
//           } catch (error) {
//             console.error("Error processing versioned data:", error);
//           }
//         }
//       });

//     // Trả về hàm hủy đăng ký
//     return () => {
//       subscription.off();
//     };
//   }

//   // Phương thức hòa giải xung đột (merge conflict)
//   async mergeData(localData, remoteData, mergeStrategy = "latest") {
//     switch (mergeStrategy) {
//       case "latest":
//         // Chọn dữ liệu mới nhất
//         return localData.version > remoteData.version ? localData : remoteData;

//       case "combine":
//         return {
//           ...localData.data,
//           ...remoteData.data,
//           version: Math.max(localData.version, remoteData.version),
//         };

//       default:
//         throw new Error("Unsupported merge strategy");
//     }
//   }
// }

// export default IPFSDataSync;
