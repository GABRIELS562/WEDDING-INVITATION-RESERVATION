import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#C9A96E' }}>🎉 Wedding Website Test</h1>
      <p>If you can see this, the React app is working!</p>
      
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>✅ Server Status: Running</h2>
        <p>The development server is working correctly.</p>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Set up your Google Sheets API</li>
          <li>Configure EmailJS</li>
          <li>Test the RSVP system</li>
        </ol>
        
        <div style={{ marginTop: '2rem' }}>
          <a href="/admin" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#C9A96E',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginRight: '1rem'
          }}>
            Admin Panel
          </a>
          
          <a href="/guest/TEST123" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#8B7355',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            Test RSVP
          </a>
        </div>
      </div>
    </div>
  );
};

const AdminTest = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Panel Test</h1>
      <p>Admin functionality would go here.</p>
      <a href="/" style={{ color: '#C9A96E' }}>← Back to Home</a>
    </div>
  );
};

const GuestTest = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Guest RSVP Test</h1>
      <p>RSVP form would go here.</p>
      <a href="/" style={{ color: '#C9A96E' }}>← Back to Home</a>
    </div>
  );
};

function TestApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/admin" element={<AdminTest />} />
        <Route path="/guest/:token" element={<GuestTest />} />
      </Routes>
    </Router>
  );
}

export default TestApp;