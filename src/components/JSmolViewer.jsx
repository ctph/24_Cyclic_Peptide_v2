// import { useState, useEffect } from "react";

// const JSmolViewer = ({ pdbFile }) => {
//   const [dimensions, setDimensions] = useState({
//     width: '100%',
//     height: '70vh' // Default to 70% of viewport height
//   });

//   // Toggle between different sizes
//   const toggleSize = () => {
//     setDimensions(prev => ({
//       width: '100%',
//       height: prev.height === '70vh' ? '90vh' : '70vh'
//     }));
//   };

//   useEffect(() => {
//     if (!pdbFile) return;

//     const initializeViewer = () => {
//       const Info = {
//         width: '100%',
//         height: '100%',
//         j2sPath: "/jsmol/j2s",
//         use: "HTML5",
//         script: `load ${pdbFile}; zoom 100; spin on;`,
//         disableInitialConsole: true,
//         serverURL: "/jsmol/php/jsmol.php",
//         canvasAttributes: { willReadFrequently: true }
//       };

//       const container = document.getElementById("jsmol-container");
//       if (container) {
//         container.innerHTML = window.Jmol.getAppletHtml("jmolApplet0", Info);
//       }
//     };

//     if (window.Jmol) {
//       initializeViewer();
//     } else {
//       const script = document.createElement('script');
//       script.src = '/jsmol/JSmol.min.nojq.js';
//       script.onload = initializeViewer;
//       document.head.appendChild(script);
//     }
//   }, [pdbFile]);

//   return (
//     <div style={{
//       width: '100%',
//       height: dimensions.height,
//       minHeight: '600px',
//       border: '2px solid #3a7bd5',
//       borderRadius: '8px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//       position: 'relative',
//       margin: '20px 0',
//       transition: 'height 0.3s ease'
//     }}>
//       <div id="jsmol-container" style={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#f5f7fa'
//       }} />
      
//       <button 
//         onClick={toggleSize}
//         style={{
//           position: 'absolute',
//           bottom: '10px',
//           right: '10px',
//           padding: '8px 12px',
//           backgroundColor: '#3a7bd5',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           zIndex: 100
//         }}
//       >
//         {dimensions.height === '70vh' ? 'Enlarge' : 'Reduce'}
//       </button>
//     </div>
//   );
// };

// export default JSmolViewer;

import React, { useState, useEffect, useId } from 'react';
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

  useEffect(() => {
    if (!pdbFile) return;
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
        setPdbContent('Error loading PDB file.');
        setLoading(false);
      });
  }, [pdbFile]);

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
      <Card 
        title="3D Structure" 
        bordered={false}
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <JSmolViewer pdbFile={pdbFile} />
      </Card>

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

const JSmolViewer = ({ pdbFile }) => {
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '70vh'
  });

  const toggleSize = () => {
    setDimensions(prev => ({
      width: '100%',
      height: prev.height === '70vh' ? '90vh' : '70vh'
    }));
  };

  useEffect(() => {
    if (!pdbFile) return;

    const initializeViewer = () => {
      const Info = {
        width: '100%',
        height: '100%',
        j2sPath: "/jsmol/j2s",
        use: "HTML5",
        script: `load ${pdbFile}; zoom 100; spin on;`,
        disableInitialConsole: true,
        serverURL: "/jsmol/php/jsmol.php",
        canvasAttributes: { willReadFrequently: true }
      };

      const container = document.getElementById("jsmol-container");
      if (container) {
        container.innerHTML = window.Jmol.getAppletHtml("jmolApplet0", Info);
      }
    };

    if (window.Jmol) {
      initializeViewer();
    } else {
      const script = document.createElement('script');
      script.src = '/jsmol/JSmol.min.nojq.js';
      script.onload = initializeViewer;
      document.head.appendChild(script);
    }
  }, [pdbFile]);

  return (
    <div style={{
      width: '100%',
      height: dimensions.height,
      minHeight: '600px',
      border: '2px solid #3a7bd5',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'relative',
      margin: '20px 0',
      transition: 'height 0.3s ease'
    }}>
      <div id="jsmol-container" style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f7fa'
      }} />

      <button 
        onClick={toggleSize}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: '#3a7bd5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        {dimensions.height === '70vh' ? 'Enlarge' : 'Reduce'}
      </button>
    </div>
  );
};

export default PDBViewer;