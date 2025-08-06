import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// Temporarily using SimpleRSVPForm instead of RSVPFormComponent
import { SimpleRSVPForm } from './components/SimpleRSVPForm';

const WeddingWebsite = () => {
  const params = useParams();
  const guestToken = params.token;
  return (
    <div style={{ 
      fontFamily: "'Playfair Display', 'Georgia', serif",
      color: '#8B7355',
      lineHeight: '1.6'
    }}>
      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(139, 115, 85, 0.1)', 
        zIndex: 1000,
        padding: window.innerWidth <= 768 ? '1rem 0' : '1.5rem 0',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: window.innerWidth <= 768 ? '0 1rem' : '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: window.innerWidth <= 768 ? '1.4rem' : '1.8rem', 
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic',
            letterSpacing: window.innerWidth <= 768 ? '1px' : '2px'
          }}>Kirsten & Dale</h1>
          
          {/* Desktop Navigation */}
          <div className="nav-links" style={{ 
            display: window.innerWidth <= 768 ? 'none' : 'flex', 
            gap: '3rem' 
          }}>
            <a href="#story" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '300',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}>Our Story</a>
            <a href="#rsvp" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '300',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}>RSVP</a>
            <a href="#venue" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '300',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}>Venue</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: `
          linear-gradient(rgba(201, 169, 110, 0.05), rgba(139, 115, 85, 0.08)),
          url('/hero-image.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          padding: window.innerWidth <= 768 ? '2.5rem 2rem' : '4rem 3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textShadow: '1px 1px 3px rgba(0,0,0,0.4), 0 0 10px rgba(255,255,255,0.8)',
          maxWidth: '90vw',
          width: '100%'
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#2C1810',
            marginBottom: '1rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(255,255,255,0.95), 1px 1px 2px rgba(0,0,0,0.8)'
          }}>Save the Date</div>
          
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? '2.8rem' : '4.5rem', 
            margin: '0 0 1rem 0', 
            color: '#1A0F08',
            fontWeight: '800',
            fontStyle: 'italic',
            letterSpacing: window.innerWidth <= 768 ? '2px' : '3px',
            textShadow: '3px 3px 6px rgba(255,255,255,0.95), 2px 2px 4px rgba(0,0,0,0.7)',
            lineHeight: '1.2'
          }}>Kirsten & Dale</h1>
          
          <p style={{ 
            fontSize: '1.8rem', 
            margin: '0 0 2rem 0', 
            color: '#3D2A1F',
            fontWeight: '500',
            fontStyle: 'italic',
            textShadow: '2px 2px 4px rgba(255,255,255,0.9), 1px 1px 2px rgba(0,0,0,0.7)'
          }}>are getting married</p>
          
          <div style={{
            fontSize: '2.5rem',
            color: '#8B4513',
            fontWeight: '800',
            letterSpacing: '2px',
            marginBottom: '0.5rem',
            textShadow: '3px 3px 6px rgba(255,255,255,0.9), 2px 2px 4px rgba(0,0,0,0.6)'
          }}>October 31st</div>
          
          <div style={{ 
            fontSize: '1.5rem', 
            color: '#3D2A1F',
            fontWeight: '500',
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(255,255,255,0.9), 1px 1px 2px rgba(0,0,0,0.6)'
          }}>2025</div>
          
          <div style={{
            marginTop: '3rem',
            fontSize: '1.1rem',
            color: '#2C1810',
            fontStyle: 'italic',
            fontWeight: '500',
            opacity: '1',
            textShadow: '2px 2px 4px rgba(255,255,255,0.95), 1px 1px 2px rgba(0,0,0,0.7)'
          }}>Cape Point Vineyards, Cape Town</div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" style={{ 
        padding: window.innerWidth <= 768 ? '4rem 1rem' : '8rem 2rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 768 ? '3rem' : '5rem' }}>
            <h2 style={{ 
              fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: window.innerWidth <= 768 ? '1px' : '2px'
            }}>RSVP</h2>
            <p style={{
              fontSize: '1.3rem',
              color: '#8B7355',
              fontStyle: 'italic',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We would be honored to have you celebrate with us on our special day
            </p>
          </div>
          
          <SimpleRSVPForm guestToken={guestToken} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #8B7355 0%, #6B5B47 100%)', 
        color: '#F8F6F0', 
        padding: '4rem 2rem 2rem 2rem', 
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '2rem',
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic',
            marginBottom: '1rem',
            letterSpacing: '2px'
          }}>Kirsten & Dale</h3>
          <p style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            opacity: '0.9',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Thank you for being part of our love story
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingWebsite />} />
        <Route path="/guest/:token" element={<WeddingWebsite />} />
      </Routes>
    </Router>
  );
}

export default App;