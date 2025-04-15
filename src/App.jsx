import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import SearchBar from "./components/SearchBar";
import { BrowserRouter as Router, Route, Routes, useParams, Link } from "react-router-dom";
import JSmolViewer from "./components/JSmolViewer";

function Home() {
  const [csvData, setCsvData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [allOptions, setAllOptions] = useState([]);  

  useEffect(() => {
    fetch("/protein_sequence_forwebsite.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { skipEmptyLines: true }).data;
        const data = parsed.slice(1);
        const col2 = [...new Set(data.map((row) => row[1]).filter(Boolean))];

        setCsvData(data);
        setAllOptions(col2);
      });
  }, []);  

  const handleSearch = (input) => {
    const filtered = csvData.filter((row) =>
      row[1]?.toLowerCase().includes(input.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <title>24_Cyclic_Peptide</title>
      <h1>24_Cyclic_Peptide</h1>
      <h3>Search Protein Sequences</h3>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        allOptions={allOptions}
      />
      <ul>
        {results.map((row, index) => (
          <li key={index}>
            <Link to={`/pdb/${row[0]}`}>{row[1]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ViewerPage() {
  const { pdbId } = useParams();
  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ marginBottom: "20px", display: "block" }}>← Back to search</Link>
      <h2>Viewing: {pdbId}</h2>
      <JSmolViewer pdbFile={`/clean_pdbs/${pdbId}.pdb`} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdb/:pdbId" element={<ViewerPage />} />
      </Routes>
    </Router>
  );
}