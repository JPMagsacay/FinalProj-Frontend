import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Coordinator/components/sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const coordinatorData = localStorage.getItem('coordinator');
    
    if (!coordinatorData) {
      // No coordinator stored, kick back to login
      navigate('/Coordinator/Login');
    } else {
      const coordinator = JSON.parse(coordinatorData);
      console.log('Logged in as:', coordinator.name); // You can show the name if you want
    }
  }, [navigate]);
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Welcome Coordinator!</h1>
      </div>
    </div>
  );
};

export default Dashboard;
