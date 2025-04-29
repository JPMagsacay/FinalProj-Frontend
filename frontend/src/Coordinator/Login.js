import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirecting

function Login() {
  const [coordinatorId, setCoordinatorId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/coordinator/login', {
        coordinator_id: coordinatorId,
        password: password,
      });

      setMessage(response.data.message);
      console.log('Coordinator data:', response.data.coordinator);

      // Store the coordinator data if needed
      localStorage.setItem('coordinator', JSON.stringify(response.data.coordinator));


      // Redirect to the dashboard on successful login
      navigate('/dashboard');  // Redirect to /dashboard

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Coordinator Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Coordinator ID"
          value={coordinatorId}
          onChange={(e) => setCoordinatorId(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>
      )}
    </div>
  );
}

export default Login;
