"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchFilter from "../../../components/SearchFilters";

const SearchPage = () => {
  return (
    <div className="mx-20 min-h-screen bg-[#2e2e2e]">
      <div className="mx-24 mt-8 flex justify-center items-center space-x-2">
        <Input
          placeholder="Search for NFTs, Collections, and more..."
          className="mt-8 text-lg w-1/2 text-white shadow-md p-4 py-6 rounded-lg"
        />
        <Search className="w-8 h-8 text-white mt-8 cursor-pointer" />
      </div>
      <SearchFilter />
    </div>
  );
};

export default SearchPage;
