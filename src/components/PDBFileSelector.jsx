import { useState, useEffect } from "react";
import PDBViewer from "./PDBViewer";

const PDBFileSelector = () => {
  const [pdbFiles, setPdbFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded list of PDB files in your clean_pdbs directory
  const PDB_FILE_LIST = [
    "1b1v.pdb",
    "1crf.pdb",
    "1a1p.pdb",
    "1d7t"
    // Add all your PDB filenames here
  ];

  useEffect(() => {
    setLoading(true);
    try {
      // Verify at least one file exists
      if (PDB_FILE_LIST.length === 0) {
        throw new Error("No PDB files specified");
      }
      
      setPdbFiles(PDB_FILE_LIST);
      setSelectedFile(`/clean_pdbs/${PDB_FILE_LIST[0]}`);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Verify file access when selection changes
  useEffect(() => {
    if (selectedFile) {
      fetch(selectedFile)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(text => {
          console.log(`Loaded: ${selectedFile}`);
          console.log("File header:", text.substring(0, 50));
        })
        .catch(err => {
          console.error(`Failed to load ${selectedFile}:`, err);
          setError(`Cannot access PDB file: ${err.message}`);
        });
    }
  }, [selectedFile]);

  if (loading) return <div>Loading PDB files...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (pdbFiles.length === 0) return <div>No PDB files available</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="pdb-select">Select PDB File: </label>
        <select
          id="pdb-select"
          value={selectedFile.split('/').pop()}
          onChange={(e) => setSelectedFile(`/clean_pdbs/${e.target.value}`)}
          style={{ padding: "8px", minWidth: "300px" }}
        >
          {pdbFiles.map(file => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>

      {selectedFile && (
        <div style={{ 
          border: "1px solid #eee", 
          padding: "20px", 
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <h3>Viewing: {selectedFile.split('/').pop()}</h3>
          <PDBViewer pdbFile={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default PDBFileSelector;