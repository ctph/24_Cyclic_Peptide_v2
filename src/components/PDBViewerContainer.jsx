import { useState, useEffect } from "react";
import JSmolViewer from "./JSmolViewer";

const PDBViewerContainer = () => {
  const [pdbFiles, setPdbFiles] = useState([]);
  const [selectedPdb, setSelectedPdb] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/pdb-files')
      .then(res => res.json())
      .then(files => {
        setPdbFiles(files.map(f => `clean_pdbs/${f}`));
        if (files.length > 0) setSelectedPdb(`clean_pdbs/${files[0]}`);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading PDB files...</div>;

  return (
    <div className="pdb-viewer-container">
      <div className="file-selector">
        <label htmlFor="pdb-select">Select PDB File: </label>
        <select
          id="pdb-select"
          value={selectedPdb}
          onChange={(e) => setSelectedPdb(e.target.value)}
        >
          {pdbFiles.map((file) => (
            <option key={file} value={file}>
              {file.split('/').pop()}  {/* Show just the filename */}
            </option>
          ))}
        </select>
      </div>
      
      {selectedPdb && (
        <div className="viewer-wrapper">
          <JSmolViewer pdbFilePath={selectedPdb} />
          <div className="pdb-info">
            <h4>Currently viewing: {selectedPdb.split('/').pop()}</h4>
            {/* Add additional file info here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDBViewerContainer;