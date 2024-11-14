// hooks/useIPDBSync.js
import { ethers } from 'ethers';
import { IPDB } from './database';
import { useEffect, useState } from 'react';

export function useIPDBSync() {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('initializing'); // 'initializing' | 'syncing' | 'ready' | 'error'

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      setSyncStatus('initializing');
      setIsLoading(true);

      // Kiểm tra xem có MetaMask không
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Khởi tạo provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Kiểm tra trong localStorage xem đã có DB version được lưu chưa
      const lastSyncedCid = localStorage.getItem('lastSyncedCid');
      const lastSyncTime = localStorage.getItem('lastSyncTime');
      
      // Khởi tạo IPDB instance
      const ipdb = new IPDB(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, provider);
      await ipdb.initialize();

      // Lấy CID mới nhất từ smart contract
      const currentCid = await ipdb.contract.getState();
      
      // Nếu không có CID trong contract (lần đầu deploy), không cần sync
      if (!currentCid) {
        setDb(ipdb);
        setSyncStatus('ready');
        setIsLoading(false);
        return;
      }

      // ... (phần code còn lại giữ nguyên)
    } catch (err) {
      console.error('Error initializing database:', err);
      setError(err.message);
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    db,
    isLoading,
    error,
    syncStatus,
    // forceSync
  };
}