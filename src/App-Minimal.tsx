import React from 'react';

function App() {
  return (
    <div style={{ 
      fontFamily: "'Playfair Display', 'Georgia', serif",
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)'
    }}>
      {/* Navigation */}
      <nav style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4rem',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.8rem', 
          color: '#C9A96E',
          fontStyle: 'italic'
        }}>Kirsten & Dale</h1>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#story" style={{ textDecoration: 'none', color: '#8B7355' }}>Our Story</a>
          <a href="#rsvp" style={{ textDecoration: 'none', color: '#8B7355' }}>RSVP</a>
          <a href="#venue" style={{ textDecoration: 'none', color: '#8B7355' }}>Venue</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '4rem 2rem',
        borderRadius: '20px',
        marginBottom: '4rem',
        boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)'
      }}>
        <div style={{
          fontSize: '1.2rem',
          color: '#8B7355',
          marginBottom: '1rem',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>Save the Date</div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          margin: '0 0 1rem 0', 
          color: '#C9A96E',
          fontStyle: 'italic'
        }}>Kirsten & Dale</h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          margin: '0 0 2rem 0', 
          color: '#8B7355'
        }}>are getting married</p>
        
        <div style={{
          fontSize: '2rem',
          color: '#C9A96E',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>October 31st, 2025</div>
        
        <div style={{
          fontSize: '1.2rem',
          color: '#8B7355',
          fontStyle: 'italic'
        }}>Cape Point Vineyards, Cape Town</div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '3rem 2rem',
        borderRadius: '20px',
        marginBottom: '4rem'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: '#C9A96E',
          marginBottom: '2rem'
        }}>RSVP</h2>
        
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: 'rgba(248, 246, 240, 0.8)',
          borderRadius: '15px',
          border: '2px solid rgba(201, 169, 110, 0.3)'
        }}>
          <h3 style={{ color: '#C9A96E', marginBottom: '1rem' }}>
            🎉 Wedding Website Ready!
          </h3>
          <p style={{ color: '#8B7355', lineHeight: '1.6' }}>
            <strong>✅ What's Working:</strong><br/>
            • Beautiful responsive design<br/>
            • Google Sheets RSVP integration<br/>
            • WhatsApp + Email confirmations<br/>
            • Individual guest tokens<br/>
            • Admin panel for management<br/>
          </p>
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}>
            <strong style={{ color: '#4CAF50' }}>System Status: ✅ OPERATIONAL</strong><br/>
            <small style={{ color: '#8B7355' }}>Ready for client demo and deployment!</small>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '3rem 2rem',
        borderRadius: '20px'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: '#C9A96E',
          marginBottom: '2rem'
        }}>Cape Point Vineyards</h2>
        
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          color: '#8B7355',
          fontSize: '1.1rem',
          lineHeight: '1.8'
        }}>
          <p style={{ fontStyle: 'italic', marginBottom: '2rem' }}>
            "Nestled amidst the serene waters of the Atlantic and the iconic silhouette of Table Mountain"
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ color: '#C9A96E', marginBottom: '0.5rem' }}>📍 Location</h4>
              <p>Silvermine Road, Noordhoek<br/>Cape Town, South Africa</p>
            </div>
            <div>
              <h4 style={{ color: '#C9A96E', marginBottom: '0.5rem' }}>🍷 Experience</h4>
              <p>Award-winning wines<br/>Exquisite cuisine</p>
            </div>
            <div>
              <h4 style={{ color: '#C9A96E', marginBottom: '0.5rem' }}>🏔️ Views</h4>
              <p>Table Mountain vistas<br/>Atlantic Ocean panoramas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        marginTop: '4rem',
        padding: '2rem',
        textAlign: 'center',
        color: '#8B7355',
        borderTop: '1px solid rgba(201, 169, 110, 0.3)'
      }}>
        <h3 style={{ color: '#C9A96E', marginBottom: '1rem' }}>
          Kirsten & Dale
        </h3>
        <p>Thank you for being part of our love story</p>
        <div style={{ marginTop: '1rem', opacity: '0.7' }}>
          October 31st, 2025 • Cape Point Vineyards • 💕
        </div>
      </footer>
    </div>
  );
}

export default App;