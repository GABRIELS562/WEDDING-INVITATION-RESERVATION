import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const WeddingWebsiteEnhanced = () => {
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
          
          {/* Mobile Navigation */}
          <div className="mobile-nav" style={{ 
            display: window.innerWidth <= 768 ? 'flex' : 'none', 
            gap: '1.5rem' 
          }}>
            <a href="#story" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '0.9rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Story</a>
            <a href="#rsvp" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '0.9rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>RSVP</a>
            <a href="#venue" style={{ 
              textDecoration: 'none', 
              color: '#8B7355',
              fontSize: '0.9rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Venue</a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Screen Design */}
      <section id="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        position: 'relative'
      }}>
        {/* Photo Side - Takes up 70% on desktop */}
        <div style={{
          flex: window.innerWidth <= 768 ? '1' : '7',
          minHeight: window.innerWidth <= 768 ? '60vh' : '100vh',
          backgroundImage: `url('https://cpv.co.za/wp-content/uploads/2024/02/image-70.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          position: 'relative'
        }}>
          {/* Minimal overlay just for depth */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.05), transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          {/* Floating badge */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '0.8rem 1.2rem',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            fontSize: '0.85rem',
            color: '#8B7355',
            fontWeight: '300',
            letterSpacing: '1px'
          }}>
            📍 Cape Point Vineyards
          </div>
        </div>

        {/* Content Side - Takes up 30% on desktop */}
        <div style={{
          flex: window.innerWidth <= 768 ? '1' : '3',
          minHeight: window.innerWidth <= 768 ? '40vh' : '100vh',
          background: 'linear-gradient(135deg, #FEFCF7 0%, #F8F6F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: window.innerWidth <= 768 ? '3rem 1.5rem' : '2rem',
          position: 'relative'
        }}>
          {/* Elegant content container */}
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
              color: '#8B7355',
              marginBottom: '1.5rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: '400',
              opacity: '0.8'
            }}>Save the Date</div>
            
            <h1 style={{ 
              fontSize: window.innerWidth <= 768 ? '3rem' : '4rem', 
              margin: '0 0 1.5rem 0', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              letterSpacing: '2px',
              lineHeight: '1.1'
            }}>Kirsten<br/>&<br/>Dale</h1>
            
            <div style={{
              width: '100px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
            
            <p style={{ 
              fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.5rem', 
              margin: '0 0 2rem 0', 
              color: '#8B7355',
              fontWeight: '300',
              fontStyle: 'italic'
            }}>are getting married</p>
            
            <div style={{
              backgroundColor: 'rgba(201, 169, 110, 0.1)',
              padding: '2rem',
              borderRadius: '20px',
              border: '2px solid rgba(201, 169, 110, 0.2)',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: window.innerWidth <= 768 ? '2.2rem' : '2.8rem',
                color: '#C9A96E',
                fontWeight: '500',
                letterSpacing: '1px',
                marginBottom: '0.5rem'
              }}>October 31st</div>
              
              <div style={{ 
                fontSize: window.innerWidth <= 768 ? '1.4rem' : '1.6rem', 
                color: '#8B7355',
                fontWeight: '300'
              }}>2025</div>
            </div>
            
            <div style={{
              fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
              color: '#8B7355',
              fontStyle: 'italic',
              opacity: '0.85',
              lineHeight: '1.5'
            }}>
              With Table Mountain as our witness<br/>
              and the Atlantic as our backdrop
            </div>
          </div>

          {/* Decorative element */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A96E, #D4B574)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            opacity: '0.3'
          }}>
            💒
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same... */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#F8F6F0' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#C9A96E', marginBottom: '2rem' }}>
          Continue with the rest of your sections...
        </h2>
        <p style={{ color: '#8B7355', fontSize: '1.2rem' }}>
          This is just showing the new hero design. The rest of your sections would continue here.
        </p>
      </section>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingWebsiteEnhanced />} />
        <Route path="/guest/:token" element={<WeddingWebsiteEnhanced />} />
      </Routes>
    </Router>
  );
}

export default App;