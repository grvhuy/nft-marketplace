"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { exportDatabase, importDatabase } from "../src/lib/rxDB";
import IPFSDataSync from "../src/lib/ipfs";
import NFTMarketplaceContext from "./NFTMarketplaceContext";

export const IPDBContext = createContext(null);

export function IPDBProvider({ children }) {
  const [ipfsSync] = useState(() => new IPFSDataSync());

  const [db, setDb] = useState(null);
  const [syncStatus, setSyncStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncVersion, setSyncVersion] = useState(null);

  const { currentAccount } = useContext(NFTMarketplaceContext);

  // Nâng cấp forceSync với version control
  const forceSync = useCallback(async () => {
    if (!currentAccount) {
      setError("No active account found");
      setSyncStatus("error");
      return;
    }

    try {
      // Xuất database hiện tại
      const dbJson = await exportDatabase();
      
      setSyncStatus("uploading");
      
      // Sync với metadata và version
      const syncResult = await ipfsSync.syncWithGun(currentAccount, dbJson, {
        syncType: 'manual',
        version: Date.now(), // Tạo version duy nhất
        timestamp: new Date().toISOString()
      });

      // Cập nhật version và trạng thái
      setSyncVersion(syncResult.version);
      setSyncStatus("sync_complete");
      
      return syncResult;
    } catch (err) {
      console.error("Advanced Sync Error:", err);
      setError(`Force sync failed: ${err.message}`);
      setSyncStatus("error");
    }
  }, [currentAccount, ipfsSync]);

  // Nâng cấp syncFromGun với kiểm tra version
  const syncFromGun = useCallback(async () => {
    if (!currentAccount) {
      setError("No active account found");
      setSyncStatus("error");
      return;
    }

    try {
      setSyncStatus("downloading");
      
      // Sync từ Gun với kiểm tra version (nếu có)
      const syncResult = await ipfsSync.syncFromGun(currentAccount, {
        minVersion: syncVersion // Đảm bảo version mới hơn
      });
      
      // Import database từ IPFS
      if (syncResult.data) {
        await importDatabase(syncResult.data);
        
        // Cập nhật state
        setDb(syncResult.data);
        setSyncVersion(syncResult.version);
        setSyncStatus("sync_complete");
      }
    } catch (err) {
      console.error("Advanced Sync from Gun Error:", err);
      setError(`Sync from Gun failed: ${err.message}`);
      setSyncStatus("error");
    }
  }, [currentAccount, ipfsSync, syncVersion]);

  // Đăng ký theo dõi thay đổi
  const subscribeToChanges = useCallback(() => {
    if (!currentAccount) return;

    // Hủy đăng ký khi component unmount
    const unsubscribe = ipfsSync.subscribeToVersionedChanges(
      currentAccount, 
      async (changeData) => {
        try {
          // Kiểm tra và merge dữ liệu nếu cần
          const mergedData = await ipfsSync.mergeData(
            { data: db, version: syncVersion }, 
            changeData, 
            'latest' // Chiến lược merge
          );

          // Cập nhật database
          await importDatabase(mergedData.data);
          setDb(mergedData.data);
          setSyncVersion(mergedData.version);
        } catch (error) {
          console.error('Change subscription error:', error);
        }
      }
    );

    // Trả về hàm hủy đăng ký
    return unsubscribe;
  }, [currentAccount, ipfsSync, db, syncVersion]);

  // Quản lý đăng ký thay đổi
  useEffect(() => {
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe && unsubscribe();
  }, [subscribeToChanges]);

  // Phần còn lại của context giữ nguyên như cũ
  // ... (loading state, error state, provider)

  return (
    <IPDBContext.Provider
      value={{ 
        db, 
        syncStatus, 
        error, 
        forceSync, 
        syncFromGun, 
        isLoading,
        syncVersion 
      }}
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