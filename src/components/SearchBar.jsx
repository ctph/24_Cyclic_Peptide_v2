import React from "react";

function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search sequence..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
