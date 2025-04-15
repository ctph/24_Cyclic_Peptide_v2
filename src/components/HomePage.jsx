import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

const HomePage = () => {
  const [pdbs, setPdbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your existing pdb_list.json
    fetch('/pdb_list.json')
      .then(res => res.json())
      .then(files => {
        setPdbs(files.map(file => ({
          id: file.replace('.pdb', ''),
          filepath: `/clean_pdbs/${file}`
        })));
        setLoading(false);
      });
  }, []);

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

  return (
    <div style={{ padding: 24 }}>
      <h1>24_Cyclic_Peptide Structures</h1>
      <Search 
        placeholder="Search PDBs" 
        style={{ width: 400, marginBottom: 24 }}
        onSearch={val => console.log(val)} // Implement search
      />
      <Table 
        columns={columns} 
        dataSource={pdbs} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default HomePage;