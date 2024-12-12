"use client"
import React, { useState } from "react";

const AuthorFilters = (props) => {
  const [activeFilter, setActiveFilter] = useState("Collectibles");
  const [sortOption, setSortOption] = useState("Most Recent");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  
  return (
    <div className="flex items-center justify-between p-4 space-x-4">
      <div className="flex space-x-2">
        {["Collectibles", "Created", "Liked", "Following", "Followers"].map((filter) => (
          <button
            key={filter}
            // onClick={() => handleFilterClick(filter)}
            onClick={() => {
              props.onClick(filter);
              handleFilterClick(filter);
            }}
            className={`px-4 py-2 rounded-full shadow-sm transition duration-500 ${
              activeFilter === filter
                ? "bg-[#a259ff] text-white font-semibold"
                : "bg-white"
            } `}
          >
            {filter}
          </button>
        ))}
      </div>
      <div>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm"
        >
          <option>Most Recent</option>
          <option>Oldest</option>
          <option>Most Popular</option>
        </select>
      </div>
    </div>
  );
};

export default AuthorFilters;