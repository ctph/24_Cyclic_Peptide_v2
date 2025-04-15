// Node.js Express example (create a server.js file)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/api/pdb-files', (req, res) => {
  const pdbDir = path.join(__dirname, 'public', 'clean_pdbs');
  fs.readdir(pdbDir, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const pdbFiles = files.filter(f => f.endsWith('.pdb'));
    res.json(pdbFiles);
  });
});

app.use(express.static('public'));
app.listen(3001, () => console.log('Server running on port 3001'));