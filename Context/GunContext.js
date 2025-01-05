"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Gun from "gun";
import "gun/sea";
// import 'gun/axe';
import NFTMarketplaceContext from "./NFTMarketplaceContext";

const gunInstance = Gun({
  peers: [
    "http://localhost:8765/gun",
    "https://gun-manhattan.herokuapp.com/gun",
  ],
  localStorage: true,
  radisk: true,
});

export const GunDBContext = createContext(null);

export function GunDBProvider({ children }) {
  const [db] = useState(() => gunInstance);
  const [syncStatus, setSyncStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  const { currentAccount } = useContext(NFTMarketplaceContext);

  // Initialize database references
  const usersRef = db.get("users");
  const albumsRef = db.get("albums");

  // Force sync - In Gun.js, sync is automatic but we can force a state refresh
  const forceSync = useCallback(async () => {
    if (!currentAccount) {
      setError("No active account found");
      setSyncStatus("error");
      return;
    }

    try {
      setSyncStatus("syncing");

      // Force a re-fetch of user data
      const timestamp = Date.now();
      await new Promise((resolve) => {
        usersRef.get(currentAccount.toLowerCase()).once((data) => {
          resolve(data);
        });
      });

      setLastSync(timestamp);
      setSyncStatus("sync_complete");

      return { timestamp };
    } catch (err) {
      console.error("Sync Error:", err);
      setError(`Force sync failed: ${err.message}`);
      setSyncStatus("error");
    }
  }, [currentAccount, usersRef]);

  const addUser = useCallback(
    async (walletAddress, initialData = {}) => {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }

      try {
        const user = {
          walletAddress: walletAddress.toLowerCase(),
          name: initialData.name || walletAddress,
          email: initialData.email || "",
          bio: initialData.bio || "",
          image: initialData.image || "",
          facebook: initialData.facebook || "",
          insta: initialData.insta || "",
          twitter: initialData.twitter || "",
          followers: [],
          following: [],
          createdAt: Date.now(),
        };

        return new Promise((resolve, reject) => {
          usersRef.get(walletAddress.toLowerCase()).once((existingUser) => {
            if (existingUser && existingUser.walletAddress) {
              resolve({ message: "User already exists", user: existingUser });
              return;
            }

            usersRef.get(walletAddress.toLowerCase()).put(user, (ack) => {
              if (ack.err) {
                reject(new Error(ack.err));
              } else {
                resolve(user);
              }
            });
          });
        });
      } catch (error) {
        setError(`Failed to add user: ${error.message}`);
        throw error;
      }
    },
    [usersRef]
  );

  // Get user data
  const getUser = useCallback(
    async (walletAddress) => {
      try {
        return new Promise((resolve) => {
          usersRef.get(walletAddress.toLowerCase()).once((user) => {
            resolve(user || null);
          });
        });
      } catch (error) {
        setError(`Failed to get user: ${error.message}`);
        throw error;
      }
    },
    [usersRef]
  );

  // Update user data
  const updateUser = useCallback(
    async (walletAddress, data) => {
      try {
        return new Promise((resolve, reject) => {
          usersRef.get(walletAddress.toLowerCase()).once((existingUser) => {
            if (!existingUser) {
              reject(new Error("User not found"));
              return;
            }

            const updatedUser = { ...existingUser, ...data };
            usersRef
              .get(walletAddress.toLowerCase())
              .put(updatedUser, (ack) => {
                if (ack.err) {
                  reject(new Error(ack.err));
                } else {
                  resolve(updatedUser);
                }
              });
          });
        });
      } catch (error) {
        setError(`Failed to update user: ${error.message}`);
        throw error;
      }
    },
    [usersRef]
  );

  // Album Management Methods
  const addAlbum = useCallback(
    async (walletAddress, albumname, descript, image) => {
      try {
        const album = {
          owner: walletAddress.toLowerCase(),
          albumname,
          descript: descript || "",
          image: image || "",
          nfts: [],
          createdAt: Date.now(),
        };

        return new Promise((resolve, reject) => {
          albumsRef.get(albumname).once((existingAlbum) => {
            if (existingAlbum && existingAlbum.albumname) {
              reject(new Error("Album already exists"));
              return;
            }

            albumsRef.get(albumname).put(album, (ack) => {
              if (ack.err) {
                reject(new Error(ack.err));
              } else {
                resolve(album);
              }
            });
          });
        });
      } catch (error) {
        setError(`Failed to add album: ${error.message}`);
        throw error;
      }
    },
    [albumsRef]
  );

  // Subscribe to user changes
  useEffect(() => {
    if (!currentAccount) return;

    const unsubscribe = usersRef
      .get(currentAccount.toLowerCase())
      .on((data) => {
        if (data) {
          setSyncStatus("updated");
          setLastSync(Date.now());
        }
      });

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentAccount, usersRef]);

  // Set initial loading state
  useEffect(() => {
    if (currentAccount) {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const contextValue = {
    db,
    syncStatus,
    error,
    isLoading,
    lastSync,
    forceSync,
    // User methods
    addUser,
    getUser,
    updateUser,
    // Album methods
    addAlbum,
    // Raw references for advanced usage
    usersRef,
    albumsRef,
  };

  return (
    <GunDBContext.Provider value={contextValue}>
      {children}
    </GunDBContext.Provider>
  );
}

// Custom hook for using the database context
export function useGunDB() {
  const context = useContext(GunDBContext);
  if (!context) {
    throw new Error("useGunDB must be used within a GunDBProvider");
  }
  return context;
}
