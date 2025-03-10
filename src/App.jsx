import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PDBViewer from "./components/PDBViewer";

function Home() {
  const [pdbFiles, setPdbFiles] = useState([]);
  const [selectedPdb, setSelectedPdb] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("/pdb_files/list.json")
      .then((res) => res.json())
      .then(setPdbFiles);
  }, []);

  const handleSearch = () => {
    fetch("/pdb_sequences.json")
      .then((res) => res.json())
      .then((data) => {
        const results = data.filter((item) =>
          item.sequence.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
      });
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ position: "absolute", top: "10px", left: "10px", margin: 0 }}>24 Cyclic Peptide</h1>

      <input
        type="text"
        placeholder="Search sequence..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: "10px", marginTop: "50px", fontSize: "18px", padding: "10px", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ fontSize: "18px", padding: "10px 20px" }}>Search</button>

      <select
        onChange={(e) => setSelectedPdb(e.target.value)}
        value={selectedPdb}
        style={{ margin: "10px 0", fontSize: "18px", padding: "10px", width: "320px" }}
      >
        <option disabled value="">
          Select a PDB file
        </option>
        {pdbFiles.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>

      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => setSelectedPdb(`${result.pdbId}.pdb`)}
              style={{ cursor: "pointer", color: "blue", fontSize: "18px", padding: "5px" }}
            >
              {result.sequence} ({result.pdbId}) - {result.cyclisation}
            </li>
          ))}
        </ul>
      )}

      {selectedPdb && <PDBViewer pdbFile={`/pdb_files/${selectedPdb}`} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
