import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PDBServer = () => {
  const { filename } = useParams();
  const [pdbContent, setPdbContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/clean_pdbs/${filename}`)
      .then(res => res.text())
      .then(text => {
        setPdbContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading PDB:", err);
        setLoading(false);
      });
  }, [filename]);

  if (loading) {
    return <div>Loading PDB file...</div>;
  }

  return (
    <pre style={{
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      {pdbContent}
    </pre>
  );
};

export default PDBServer;