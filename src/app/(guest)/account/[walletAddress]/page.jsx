"use client";

import React, { useEffect } from "react";
import UserProfileForm from "../../../../components/UserProfileForm";
// import { getUserByWalletAddress } from "@/lib/rxDB";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";

const AccountPage = () => {
  const { currentAccount } = React.useContext(
    NFTMarketplaceContext
  );

  const pathname = window.location.pathname;
  const walletAddress = pathname.split("/").pop();
  const [userData, setUserData] = React.useState(null);

  useEffect(() => {
    console.log("wallet", walletAddress);
  }, [currentAccount]);

  if (currentAccount !== walletAddress) {
    return (
      <div className="mx-20 min-h-screen">
        <h1 className="text-2xl font-bold text-center mt-20">
          You don't have permission to access this page
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-20 min-h-screen">
      {walletAddress && currentAccount && (
        <UserProfileForm userData={userData} walletAddress={walletAddress} />
      )}
    </div>
  );
};

export default AccountPage;
