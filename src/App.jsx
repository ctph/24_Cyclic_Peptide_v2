import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Home() {
  return (
    <div style={{ 
      position: "absolute", 
      top: "10px", 
      left: "10px" 
      }}>
      <h1 style={{ margin: 0 }}>24 Cyclic Peptide</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{
        position:"absolute", 
        top: 0, 
        left: 0, 
        padding: "10px"}}>
        <h1 style={{margin: 0}}>24 Cyclic Peptide</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
