import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const WeddingWebsiteBottomBar = () => {
  return (
    <div style={{ 
      fontFamily: "'Playfair Display', 'Georgia', serif",
      color: '#8B7355',
      lineHeight: '1.6'
    }}>
      {/* Navigation - same as original */}
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

      {/* Hero Section - Bottom Bar Approach */}
      <section id="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundImage: `url('/hero-image.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        position: 'relative'
      }}>
        {/* Heart-shaped hands photo completely visible - NO overlay */}
        
        {/* Top corner badge */}
        <div style={{
          position: 'absolute',
          top: '6rem',
          right: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
          💕 Save the Date
        </div>

        {/* Sleek bottom content bar - Glass morphism effect */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 246, 240, 0.9))',
          backdropFilter: 'blur(20px)',
          padding: window.innerWidth <= 768 ? '2rem 1.5rem' : '3rem 4rem',
          borderRadius: '25px 25px 0 0',
          boxShadow: '0 -20px 60px rgba(139, 115, 85, 0.2)',
          border: '2px solid rgba(201, 169, 110, 0.2)',
          borderBottom: 'none'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: window.innerWidth <= 768 ? '2rem' : '4rem'
          }}>
            {/* Names and wedding text */}
            <div style={{
              textAlign: window.innerWidth <= 768 ? 'center' : 'left',
              flex: '2'
            }}>
              <h1 style={{ 
                fontSize: window.innerWidth <= 768 ? '3rem' : '4.5rem', 
                margin: '0 0 0.5rem 0', 
                color: '#C9A96E',
                fontWeight: '400',
                fontStyle: 'italic',
                letterSpacing: '2px',
                lineHeight: '1.1'
              }}>Kirsten & Dale</h1>
              
              <p style={{ 
                fontSize: window.innerWidth <= 768 ? '1.2rem' : '1.5rem', 
                margin: '0', 
                color: '#8B7355',
                fontWeight: '300',
                fontStyle: 'italic'
              }}>are getting married</p>
            </div>

            {/* Date and location */}
            <div style={{
              textAlign: 'center',
              flex: '1'
            }}>
              <div style={{
                backgroundColor: 'rgba(201, 169, 110, 0.15)',
                padding: '2rem',
                borderRadius: '20px',
                border: '2px solid rgba(201, 169, 110, 0.25)'
              }}>
                <div style={{
                  fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
                  color: '#C9A96E',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  marginBottom: '0.5rem'
                }}>October 31st</div>
                
                <div style={{ 
                  fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.5rem', 
                  color: '#8B7355',
                  fontWeight: '300',
                  marginBottom: '1rem'
                }}>2025</div>

                <div style={{
                  fontSize: '0.95rem',
                  color: '#8B7355',
                  fontStyle: 'italic',
                  opacity: '0.8',
                  borderTop: '1px solid rgba(201, 169, 110, 0.3)',
                  paddingTop: '1rem'
                }}>
                  Cape Point Vineyards<br/>
                  Cape Town
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of sections would continue here... */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#F8F6F0' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#C9A96E', marginBottom: '2rem' }}>
          Alternative Bottom Bar Design
        </h2>
        <p style={{ color: '#8B7355', fontSize: '1.2rem' }}>
          This approach preserves 95% of the photo with a sleek bottom content bar.
        </p>
      </section>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingWebsiteBottomBar />} />
        <Route path="/guest/:token" element={<WeddingWebsiteBottomBar />} />
      </Routes>
    </Router>
  );
}

export default App;