import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F8F6F0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#C9A96E', textAlign: 'center', fontSize: '3rem' }}>
        🎉 Wedding Website Debug Test
      </h1>
      
      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#8B7355' }}>✅ React is Working!</h2>
        <p>If you can see this, the basic React app is functioning correctly.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          margin: '2rem 0'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#F0F8F0', borderRadius: '8px' }}>
            <h3>✅ React 18</h3>
            <p>React is loaded</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#F0F8F0', borderRadius: '8px' }}>
            <h3>✅ Vite</h3>
            <p>Dev server running</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#F0F8F0', borderRadius: '8px' }}>
            <h3>✅ TypeScript</h3>
            <p>Types working</p>
          </div>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#FFF8DC',
          borderRadius: '8px',
          border: '2px solid #C9A96E'
        }}>
          <h3>🔧 Debug Information</h3>
          <p><strong>Node Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
        </div>
        
        <button 
          onClick={() => alert('Button works! 🎉')}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            backgroundColor: '#C9A96E',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Test Interactive Elements
        </button>
      </div>
    </div>
  );
}

export default App;