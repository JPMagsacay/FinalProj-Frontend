import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('coordinator'); // Remove the entire coordinator data
    navigate('/Coordinator/Login');
  };
  
  return (
    <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
      <h3>Coordinator Panel</h3>
      <button onClick={() => navigate('/dashboard')} style={{ display: 'block', marginBottom: '10px' }}>
        Dashboard
      </button>
      <button onClick={() => navigate('/track')} style={{ display: 'block', marginBottom: '10px' }}>
        Track
      </button>
      <button onClick={() => navigate('/students')} style={{ display: 'block', marginBottom: '10px' }}>
        Students
      </button>

      <button onClick={handleLogout} style={{ display: 'block', marginTop: '30px', color: 'red' }}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
