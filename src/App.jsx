import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import SearchBar from "./components/SearchBar";
import { BrowserRouter as Router, Route, Routes, useParams, Link } from "react-router-dom";
import JSmolViewer from "./components/JSmolViewer";
import { Table, Tag } from 'antd';

function Home() {
  const [csvData, setCsvData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [allOptions, setAllOptions] = useState([]);

  const [pdbs, setPdbs] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch PDB list
    fetch("/pdb_sequences.json")
      .then(res => res.json())
      .then(files => {
        setPdbs(files.map(file => ({
          id: file.pdbId,
          sequence: file.sequence,
          cyclisation: file.cyclisation,
          filepath: file.pdbFile
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch PDB data:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (input) => {
    const filtered = csvData.filter((row) =>
      row[1]?.toLowerCase().includes(input.toLowerCase())
    );
    setResults(filtered);
  };

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Link to={`/pdb/${id}`}><Tag color="blue">{id.toUpperCase()}</Tag></Link>
    },
    {
      title: 'Cyclisation',
      dataIndex: 'cyclisation',
      key: 'cyclisation',
      render: (cyc) => <Tag color="purple">{cyc}</Tag>
    },
    {
      title: 'Sequence',
      dataIndex: 'sequence',
      key: 'sequence',
      ellipsis: true
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/pdb/${record.id}`} style={{ marginRight: 8 }}>View 3D</Link>
          <a href={record.filepath} download>Download</a>
        </>
      )
    }
  ];

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

      <h3 style={{ marginTop: "40px" }}>Available PDB Structures</h3>
      <Table 
        columns={columns}
        dataSource={pdbs}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

  const handleSearch = (input) => {
    const filtered = csvData.filter((row) =>
      row[1]?.toLowerCase().includes(input.toLowerCase())
    );
    setResults(filtered);
  };

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Link to={`/pdb/${id}`}><Tag color="blue">{id.toUpperCase()}</Tag></Link>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/pdb/${record.id}`} style={{ marginRight: 8 }}>View 3D</Link>
          <a href={record.filepath} download>Download</a>
        </>
      )
    }
  ];

function ViewerPage() {
  const { pdbId } = useParams();
  const pdbFile = `/clean_pdbs/${pdbId.toLowerCase()}.pdb`;
  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ marginBottom: "20px", display: "block" }}>← Back to search</Link>
      <h2>Viewing: {pdbId}</h2>
      <JSmolViewer pdbFile={pdbFile} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home key={window.location.pathname} />} />
        <Route path="/pdb/:pdbId" element={<ViewerPage />} />
      </Routes>
    </Router>
  );
}