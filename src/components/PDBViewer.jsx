import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

function PDBViewer({ pdbFile, width = "600px", height = "400px" }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current && pdbFile) {
      const config = { backgroundColor: 'white' };
      const viewer = $3Dmol.createViewer(viewerRef.current, config);
      const pdbUri = pdbFile.startsWith("http") ? pdbFile : `${window.location.origin}${pdbFile}`;

      fetch(pdbUri)
        .then(res => res.text())
        .then(data => {
          viewer.addModel(data, "pdb");
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          viewer.zoomTo();
          viewer.render();
        })
        .catch(err => console.error("Error loading PDB file:", err));
    }
  }, [pdbFile]);

  return <div ref={viewerRef} style={{ width, height }} />;
}

export default PDBViewer;
