"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { exportDatabase } from "@/lib/rxDB";
import { syncWithGun, syncFromGun } from "@/lib/ipfs"; // Import hàm Gun.js
import NFTMarketplaceContext from "./NFTMarketplaceContext";

export const IPDBContext = createContext(null);

export function IPDBProvider({ children }) {
  const [db, setDb] = useState(null);
  const [syncStatus, setSyncStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentAccount } = useContext(NFTMarketplaceContext);

  const forceSync = async () => {
    try {
      const dbJson = await exportDatabase();
      setSyncStatus("uploading");
      const userId = currentAccount;
      await syncWithGun(userId, dbJson); // Đồng bộ dữ liệu với Gun.js
      setSyncStatus("sync_complete");
    } catch (err) {
      setError("Sync failed: " + err.message);
      setSyncStatus("error");
    }
  };

  const syncFromGun = async () => {
    try {
      setSyncStatus("downloading");
      const userId = currentAccount;
      const dbJson = await syncFromGun(userId); 
      setDb(dbJson);
      setSyncStatus("sync_complete");
    } catch (err) {
      setError("Sync failed: " + err.message);
      setSyncStatus("error");
    }
  };

  useEffect(() => {
    // syncFromContract().then(() => {
    //   setIsLoading(false);
    // });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {syncStatus === "initializing"
              ? "Initializing database..."
              : "Syncing with IPFS..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <IPDBContext.Provider
      value={{ db, syncStatus, forceSync, syncFromGun }}
    >
      {children}
    </IPDBContext.Provider>
  );
}

export function useDB() {
  const context = useContext(IPDBContext);
  if (!context) {
    throw new Error("useDB must be used within a DBProvider");
  }
  return context;
}
