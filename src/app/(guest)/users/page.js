"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../../../lib/rxDB";
import UserCard from "@/components/UserCard";

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((res) => {
      console.log("users", res);
      setUsers(res);
    });
  }, []);

  return (
    <div className="mx-20 min-h-screen">
      <h1 className="text-5xl text-white font-bold mt-8">Recent Users</h1>
      {users.length > 0 && (
        <div className="grid grid-cols-5 gap-4 space-x-4 mt-10">
          {users.map((user) => {
            return (
              <UserCard
                key={user._data.walletAddress}
                profileImage={user._data.profileImage}
                name={user._data.name}
                walletAddress={user._data.walletAddress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserListPage;
