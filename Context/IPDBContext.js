"use client"
import React, { createContext, useContext } from 'react';
import { useIPDBSync } from './../../nft-marketplace/src/lib/hook';

const IPDBContext = createContext(null);

export function IPDBProvider({ children }) {
  const { db, isLoading, error, syncStatus, forceSync } = useIPDBSync();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {syncStatus === 'initializing' ? 'Initializing database...' : 'Syncing with IPFS...'}
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
    <IPDBContext.Provider value={{ db, syncStatus, forceSync }}>
      {children}
    </IPDBContext.Provider>
  );
}


// Hook để sử dụng DB trong components
export function useDB() {
  const context = useContext(IPDBContext);
  if (!context) {
    throw new Error('useDB must be used within a DBProvider');
  }
  return context;
}