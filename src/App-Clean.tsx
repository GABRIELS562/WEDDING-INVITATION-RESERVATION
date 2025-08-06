import React from 'react';
import { SimpleRSVPForm } from './components/SimpleRSVPForm';

// Simple working wedding website with integrated RSVP form
function App() {

  return (
    <div style={{ 
      fontFamily: "'Playfair Display', Georgia, serif",
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
        padding: '1.5rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem', 
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic',
            letterSpacing: '2px'
          }}>Kirsten & Dale</h1>
          
          <div style={{ display: 'flex', gap: '3rem' }}>
            <a href="#story" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem' }}>Our Story</a>
            <a href="#rsvp" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem' }}>RSVP</a>
            <a href="#venue" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem' }}>Venue</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: 'linear-gradient(rgba(201, 169, 110, 0.1), rgba(139, 115, 85, 0.1)), url("/hero-image.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '4rem 3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.2)',
          maxWidth: '600px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#8B7355',
            marginBottom: '1rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>Save the Date</div>
          
          <h1 style={{ 
            fontSize: '4rem', 
            margin: '0 0 1rem 0', 
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic'
          }}>Kirsten & Dale</h1>
          
          <p style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 2rem 0', 
            color: '#8B7355',
            fontStyle: 'italic'
          }}>are getting married</p>
          
          <div style={{
            fontSize: '2rem',
            color: '#C9A96E',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>October 31st, 2025</div>
          
          <div style={{
            fontSize: '1.1rem',
            color: '#8B7355',
            fontStyle: 'italic'
          }}>Cape Point Vineyards, Cape Town</div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            color: '#C9A96E',
            marginBottom: '3rem',
            fontStyle: 'italic'
          }}>Our Love Story</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            <div style={{ 
              padding: '3rem',
              minHeight: '400px',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), url("/images/ceremony.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '2rem', color: '#8B7355', marginBottom: '1rem' }}>The Ceremony</h3>
              <p style={{ fontSize: '1.2rem', color: '#8B7355', fontWeight: '600' }}>4:00 PM</p>
              <p style={{ color: '#8B7355' }}>Surrounded by vineyards with Table Mountain as our backdrop</p>
            </div>
            
            <div style={{ 
              padding: '3rem',
              minHeight: '400px',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), url("/images/celebration.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '2rem', color: '#8B7355', marginBottom: '1rem' }}>The Celebration</h3>
              <p style={{ fontSize: '1.2rem', color: '#8B7355', fontWeight: '600' }}>6:00 PM</p>
              <p style={{ color: '#8B7355' }}>Dinner, dancing, and award-winning wines under the stars</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" style={{ 
        padding: '8rem 2rem', 
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            color: '#C9A96E',
            marginBottom: '2rem',
            fontStyle: 'italic'
          }}>RSVP</h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#8B7355',
            marginBottom: '3rem',
            fontStyle: 'italic'
          }}>
            We would be honored to have you celebrate with us on our special day
          </p>

          <SimpleRSVPForm />
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            color: '#C9A96E',
            marginBottom: '3rem',
            fontStyle: 'italic'
          }}>Cape Point Vineyards</h2>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 15px 50px rgba(139, 115, 85, 0.1)',
            marginBottom: '3rem'
          }}>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#8B7355',
              fontStyle: 'italic',
              marginBottom: '2rem'
            }}>
              "Nestled amidst the serene waters of the Atlantic and the iconic silhouette of Table Mountain"
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.2rem', marginBottom: '0.5rem' }}>📍 Location</h4>
                <p style={{ color: '#8B7355' }}>
                  Silvermine Road, Noordhoek<br/>
                  Cape Town, South Africa
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.2rem', marginBottom: '0.5rem' }}>🍷 Experience</h4>
                <p style={{ color: '#8B7355' }}>
                  Award-winning wines<br/>
                  Exquisite cuisine
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.2rem', marginBottom: '0.5rem' }}>🏔️ Views</h4>
                <p style={{ color: '#8B7355' }}>
                  Table Mountain vistas<br/>
                  Atlantic Ocean panoramas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #8B7355 0%, #6B5B47 100%)', 
        color: '#F8F6F0', 
        padding: '4rem 2rem', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '2rem',
            color: '#C9A96E',
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>Kirsten & Dale</h3>
          
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9',
            marginBottom: '2rem'
          }}>
            Thank you for being part of our love story
          </p>
          
          <div style={{
            borderTop: '1px solid rgba(201, 169, 110, 0.3)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: '0.8' }}>
              © 2025 Kirsten & Dale's Wedding
            </p>
            <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>
              October 31st, 2025 💕 Cape Point Vineyards
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;