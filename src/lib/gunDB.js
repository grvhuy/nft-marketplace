// import Gun from 'gun';
// import 'gun/sea';
// import 'gun/axe';

// class GunDatabase {
//   constructor(options = {}) {
//     // Initialize Gun with optimal configuration
//     this.gun = Gun({
//       peers: options.peers || [
//         'http://localhost:8765/gun',
//         'https://gun-manhattan.herokuapp.com/gun',
//       ],
//       localStorage: true,
//       radisk: true,
//       multicast: true,
//       WebSocket: false // Use WebSocket when available
//     });

//     // Initialize main data nodes
//     this.users = this.gun.get('users');
//     this.albums = this.gun.get('albums');
//   }

//   // User Management Methods
//   async addUser(walletAddress, initialData = {}) {
//     if (!walletAddress) {
//       throw new Error('Wallet address is required');
//     }

//     const user = {
//       walletAddress: walletAddress.toLowerCase(),
//       name: initialData.name || walletAddress,
//       email: initialData.email || '',
//       bio: initialData.bio || '',
//       image: initialData.image || '',
//       facebook: initialData.facebook || '',
//       insta: initialData.insta || '',
//       twitter: initialData.twitter || '',
//       followers: [],
//       following: [],
//       createdAt: Date.now()
//     };

//     return new Promise((resolve, reject) => {
//       this.users.get(walletAddress.toLowerCase()).once((existingUser) => {
//         if (existingUser && existingUser.walletAddress) {
//           resolve({ message: 'User already exists', user: existingUser });
//           return;
//         }

//         this.users.get(walletAddress.toLowerCase()).put(user, (ack) => {
//           if (ack.err) {
//             reject(new Error(ack.err));
//           } else {
//             resolve(user);
//           }
//         });
//       });
//     });
//   }

//   async getUsers() {
//     return new Promise((resolve) => {
//       const users = [];
//       this.users.map().once((user, id) => {
//         if (user) {
//           users.push({ ...user, id });
//         }
//       });
      
//       // Give time for data to be collected
//       setTimeout(() => resolve(users), 100);
//     });
//   }

//   async getUserByWalletAddress(walletAddress) {
//     return new Promise((resolve) => {
//       this.users.get(walletAddress.toLowerCase()).once((user) => {
//         resolve(user || null);
//       });
//     });
//   }

//   async updateUser(walletAddress, data) {
//     return new Promise((resolve, reject) => {
//       this.users.get(walletAddress.toLowerCase()).once((existingUser) => {
//         if (!existingUser) {
//           reject(new Error('User not found'));
//           return;
//         }

//         const updatedUser = { ...existingUser, ...data };
//         this.users.get(walletAddress.toLowerCase()).put(updatedUser, (ack) => {
//           if (ack.err) {
//             reject(new Error(ack.err));
//           } else {
//             resolve(updatedUser);
//           }
//         });
//       });
//     });
//   }

//   // Follow System Methods
//   async followUser(walletAddress, followAddress) {
//     if (!walletAddress || !followAddress || walletAddress === followAddress) {
//       throw new Error('Invalid follow operation');
//     }

//     return new Promise((resolve, reject) => {
//       // Update follower's following list
//       this.users.get(walletAddress.toLowerCase()).once((user) => {
//         if (!user) {
//           reject(new Error('User not found'));
//           return;
//         }

//         const following = Array.isArray(user.following) ? user.following : [];
//         if (!following.includes(followAddress)) {
//           following.push(followAddress);
//           this.users.get(walletAddress.toLowerCase()).get('following').put(following);
//         }
//       });

//       // Update followed user's followers list
//       this.users.get(followAddress.toLowerCase()).once((user) => {
//         if (!user) {
//           reject(new Error('Target user not found'));
//           return;
//         }

//         const followers = Array.isArray(user.followers) ? user.followers : [];
//         if (!followers.includes(walletAddress)) {
//           followers.push(walletAddress);
//           this.users.get(followAddress.toLowerCase()).get('followers').put(followers);
//         }
//       });

//       resolve({ success: true });
//     });
//   }

//   async unfollowUser(walletAddress, unfollowAddress) {
//     if (!walletAddress || !unfollowAddress || walletAddress === unfollowAddress) {
//       throw new Error('Invalid unfollow operation');
//     }

//     return new Promise((resolve, reject) => {
//       // Update follower's following list
//       this.users.get(walletAddress.toLowerCase()).once((user) => {
//         if (!user) {
//           reject(new Error('User not found'));
//           return;
//         }

//         const following = Array.isArray(user.following) ? 
//           user.following.filter(addr => addr !== unfollowAddress) : [];
//         this.users.get(walletAddress.toLowerCase()).get('following').put(following);
//       });

//       // Update unfollowed user's followers list
//       this.users.get(unfollowAddress.toLowerCase()).once((user) => {
//         if (!user) {
//           reject(new Error('Target user not found'));
//           return;
//         }

//         const followers = Array.isArray(user.followers) ?
//           user.followers.filter(addr => addr !== walletAddress) : [];
//         this.users.get(unfollowAddress.toLowerCase()).get('followers').put(followers);
//       });

//       resolve({ success: true });
//     });
//   }

//   async checkFollow(walletAddress, followAddress) {
//     if (!walletAddress || !followAddress || walletAddress === followAddress) {
//       return false;
//     }

//     return new Promise((resolve) => {
//       this.users.get(walletAddress.toLowerCase()).once((user) => {
//         if (!user || !Array.isArray(user.following)) {
//           resolve(false);
//           return;
//         }
//         resolve(user.following.includes(followAddress));
//       });
//     });
//   }

//   // Album Management Methods
//   async addAlbum(walletAddress, albumname, descript, image) {
//     if (!walletAddress || !albumname) {
//       throw new Error('Wallet address and album name are required');
//     }

//     const album = {
//       owner: walletAddress.toLowerCase(),
//       albumname,
//       descript: descript || '',
//       image: image || '',
//       nfts: [],
//       createdAt: Date.now()
//     };

//     return new Promise((resolve, reject) => {
//       this.albums.get(albumname).once((existingAlbum) => {
//         if (existingAlbum && existingAlbum.albumname) {
//           reject(new Error('Album already exists'));
//           return;
//         }

//         this.albums.get(albumname).put(album, (ack) => {
//           if (ack.err) {
//             reject(new Error(ack.err));
//           } else {
//             resolve(album);
//           }
//         });
//       });
//     });
//   }

//   async getAlbums() {
//     return new Promise((resolve) => {
//       const albums = [];
//       this.albums.map().once((album, id) => {
//         if (album) {
//           albums.push({ ...album, id });
//         }
//       });
      
//       setTimeout(() => resolve(albums), 100);
//     });
//   }

//   async getAlbumByName(albumname) {
//     return new Promise((resolve) => {
//       this.albums.get(albumname).once((album) => {
//         resolve(album || null);
//       });
//     });
//   }

//   async getAlbumsByOwnerAddress(walletAddress) {
//     return new Promise((resolve) => {
//       const albums = [];
//       this.albums.map().once((album) => {
//         if (album && album.owner === walletAddress.toLowerCase()) {
//           albums.push(album);
//         }
//       });
      
//       setTimeout(() => resolve(albums), 100);
//     });
//   }

//   async updateAlbum(albumname, data) {
//     return new Promise((resolve, reject) => {
//       this.albums.get(albumname).once((existingAlbum) => {
//         if (!existingAlbum) {
//           reject(new Error('Album not found'));
//           return;
//         }

//         const updatedAlbum = { ...existingAlbum, ...data };
//         this.albums.get(albumname).put(updatedAlbum, (ack) => {
//           if (ack.err) {
//             reject(new Error(ack.err));
//           } else {
//             resolve(updatedAlbum);
//           }
//         });
//       });
//     });
//   }

//   async addNFTToAlbum(albumname, nftId) {
//     return new Promise((resolve, reject) => {
//       this.albums.get(albumname).once((album) => {
//         if (!album) {
//           reject(new Error('Album not found'));
//           return;
//         }

//         const nfts = Array.isArray(album.nfts) ? album.nfts : [];
//         if (!nfts.includes(nftId)) {
//           nfts.push(nftId);
//           this.albums.get(albumname).get('nfts').put(nfts, (ack) => {
//             if (ack.err) {
//               reject(new Error(ack.err));
//             } else {
//               resolve({ ...album, nfts });
//             }
//           });
//         } else {
//           resolve(album);
//         }
//       });
//     });
//   }

//   async removeNFTFromAlbum(albumname, nftId) {
//     return new Promise((resolve, reject) => {
//       this.albums.get(albumname).once((album) => {
//         if (!album) {
//           reject(new Error('Album not found'));
//           return;
//         }

//         const nfts = Array.isArray(album.nfts) ? 
//           album.nfts.filter(id => id !== nftId) : [];
//         this.albums.get(albumname).get('nfts').put(nfts, (ack) => {
//           if (ack.err) {
//             reject(new Error(ack.err));
//           } else {
//             resolve({ ...album, nfts });
//           }
//         });
//       });
//     });
//   }

//   // Subscription Methods
//   subscribeToUser(walletAddress, callback) {
//     return this.users.get(walletAddress.toLowerCase()).on((data) => {
//       callback(data);
//     });
//   }

//   subscribeToAlbum(albumname, callback) {
//     return this.albums.get(albumname).on((data) => {
//       callback(data);
//     });
//   }

//   // Utility Methods
//   async exportData() {
//     return new Promise((resolve) => {
//       const data = {
//         users: [],
//         albums: []
//       };

//       this.users.map().once((user) => {
//         if (user) data.users.push(user);
//       });

//       this.albums.map().once((album) => {
//         if (album) data.albums.push(album);
//       });

//       setTimeout(() => resolve(data), 100);
//     });
//   }
// }

// // Export singleton instance
// const gunDB = new GunDatabase();
// export default gunDB;