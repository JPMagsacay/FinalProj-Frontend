import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Coordinator/Login';  // Login component
import Dashboard from './Coordinator/Dashboard';  // Dashboard component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/Coordinator/Login" />} />
        <Route path="/Coordinator/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </div>
  );
}

export default App;
