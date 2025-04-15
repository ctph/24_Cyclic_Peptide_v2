// import { useState, useEffect } from "react";
// import PDBViewer from "./PDBViewer";

// const PDBFileSelector = () => {
//   const [files, setFiles] = useState([]);
//   const [selected, setSelected] = useState("");

//   useEffect(() => {
//     fetch("/pdb_list.json") // JSON array of pdb filenames
//       .then(res => res.json())
//       .then(data => {
//         setFiles(data);
//         if (data.length > 0) setSelected(`/clean_pdbs/${data[0]}`);
//       });
//   }, []);

//   // Add this to your ViewerPage component
// useEffect(() => {
//   fetch(pdbFile)
//     .then(response => {
//       if (!response.ok) throw new Error("File not found");
//       return response.text();
//     })
//     .then(text => console.log("File content (first 100 chars):", text.slice(0, 100)))
//     .catch(error => console.error("Error loading PDB file:", error));
// }, [pdbFile]);

//   return (
//     <div>
//       <select onChange={(e) => setSelected(`/clean_pdbs/${e.target.value}`)}>
//         {files.map(file => (
//           <option key={file} value={file}>
//             {file}
//           </option>
//         ))}
//       </select>

//       <PDBViewer pdbFile={selected} />
//     </div>
//   );
// };

// export default PDBFileSelector;

import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Spin } from 'antd';

const { Text } = Typography;
const { TabPane } = Tabs;

const PDBViewer = ({ pdbFile }) => {
  const [pdbContent, setPdbContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState({
    header: [],
    title: [],
    compound: [],
    atoms: [],
    heteroatoms: [],
    connections: [],
    remarks: [],
    other: []
  });

  // Load and parse PDB file
  useEffect(() => {
    setLoading(true);
    fetch(pdbFile)
      .then(res => res.text())
      .then(text => {
        setPdbContent(text);
        parsePDBContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading PDB:", err);
        setLoading(false);
      });
  }, [pdbFile]);

  // Parse PDB file into sections
  const parsePDBContent = (content) => {
    const newSections = {
      header: [],
      title: [],
      compound: [],
      atoms: [],
      heteroatoms: [],
      connections: [],
      remarks: [],
      other: []
    };

    content.split('\n').forEach(line => {
      if (line.startsWith('HEADER')) newSections.header.push(line);
      else if (line.startsWith('TITLE')) newSections.title.push(line);
      else if (line.startsWith('COMPND')) newSections.compound.push(line);
      else if (line.startsWith('ATOM')) newSections.atoms.push(line);
      else if (line.startsWith('HETATM')) newSections.heteroatoms.push(line);
      else if (line.startsWith('CONECT')) newSections.connections.push(line);
      else if (line.startsWith('REMARK')) newSections.remarks.push(line);
      else if (line.trim()) newSections.other.push(line);
    });

    setSections(newSections);
  };

  // Format PDB line with syntax highlighting
  const formatPDBLine = (line) => {
    if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
      return (
        <div style={{ fontFamily: 'monospace' }}>
          <span style={{ color: '#0074D9' }}>{line.substring(0, 6)}</span>
          <span style={{ color: '#2ECC40' }}>{line.substring(6, 11)}</span>
          <span style={{ color: '#FF851B' }}>{line.substring(12, 16)}</span>
          <span style={{ color: '#B10DC9' }}>{line.substring(17, 21)}</span>
          <span>{line.substring(21)}</span>
        </div>
      );
    }
    return <div style={{ fontFamily: 'monospace' }}>{line}</div>;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      height: '80vh',
      marginTop: '20px'
    }}>
      {/* Left Panel - 3D Viewer */}
      <Card 
        title="3D Structure" 
        bordered={false}
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <JSmolViewer pdbFile={pdbFile} />
      </Card>

      {/* Right Panel - PDB Content */}
      <Card 
        title="PDB File Content" 
        bordered={false}
        bodyStyle={{ 
          padding: 0,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin tip="Loading PDB file..." size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="atoms" style={{ flex: 1 }}>
            <TabPane tab="Atoms" key="atoms">
              <PDBSection 
                lines={sections.atoms} 
                formatLine={formatPDBLine}
                title={`ATOM Records (${sections.atoms.length})`}
              />
            </TabPane>
            <TabPane tab="Heteroatoms" key="heteroatoms">
              <PDBSection 
                lines={sections.heteroatoms} 
                formatLine={formatPDBLine}
                title={`HETATM Records (${sections.heteroatoms.length})`}
              />
            </TabPane>
            <TabPane tab="Header" key="header">
              <PDBSection 
                lines={sections.header} 
                title="HEADER Information"
              />
            </TabPane>
            <TabPane tab="Full Text" key="full">
              <pre style={{
                margin: 0,
                padding: '16px',
                height: '100%',
                overflow: 'auto',
                backgroundColor: '#f8f8f8',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {pdbContent}
              </pre>
            </TabPane>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

// Reusable section component
const PDBSection = ({ lines = [], title, formatLine = (line) => line }) => (
  <div style={{
    padding: '16px',
    height: '100%',
    overflow: 'auto'
  }}>
    {title && <h4 style={{ marginTop: 0 }}>{title}</h4>}
    {lines.length > 0 ? (
      <div style={{ 
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        padding: '8px'
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ 
            marginBottom: '2px',
            padding: '2px 4px',
            backgroundColor: i % 2 === 0 ? '#ffffff' : '#f0f0f0'
          }}>
            {formatLine(line)}
          </div>
        ))}
      </div>
    ) : (
      <Text type="secondary">No records in this section</Text>
    )}
  </div>
);

// JSmol Viewer Component (simplified)
const JSmolViewer = ({ pdbFile }) => {
  useEffect(() => {
    if (!window.Jmol) {
      const script = document.createElement('script');
      script.src = '/jsmol/JSmol.min.nojq.js';
      script.onload = () => initJSmol();
      document.head.appendChild(script);
    } else {
      initJSmol();
    }

    function initJSmol() {
      const container = document.getElementById('jsmol-container');
      if (container) {
        container.innerHTML = window.Jmol.getAppletHtml('jmolApplet0', {
          width: '100%',
          height: '100%',
          j2sPath: '/jsmol/j2s',
          use: 'HTML5',
          script: `load ${pdbFile}`,
          readyFunction: () => console.log('JSmol ready')
        });
      }
    }
  }, [pdbFile]);

  return (
    <div 
      id="jsmol-container" 
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5'
      }}
    />
  );
};

export default PDBViewer;