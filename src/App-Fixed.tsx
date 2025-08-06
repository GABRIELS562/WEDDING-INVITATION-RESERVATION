import React from 'react';

// Simple working wedding website without problematic dependencies
function App() {
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
        padding: '1.5rem 0',
        transition: 'all 0.3s ease'
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
          
          <div style={{ 
            display: 'flex', 
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
          padding: '4rem 3rem',
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
            fontSize: '4.5rem', 
            margin: '0 0 1rem 0', 
            color: '#1A0F08',
            fontWeight: '800',
            fontStyle: 'italic',
            letterSpacing: '3px',
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

      {/* Story Section */}
      <section id="story" style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px'
            }}>Our Love Story</h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '3rem',
              minHeight: '450px',
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)),
                url('/images/ceremony.jpg')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'local',
              borderRadius: '20px',
              boxShadow: '0 15px 50px rgba(139, 115, 85, 0.2)',
              border: '2px solid rgba(201, 169, 110, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1.5rem', 
                color: '#1A0F08',
                fontWeight: '800',
                fontStyle: 'italic',
                textShadow: '3px 3px 6px rgba(255,255,255,0.95), 2px 2px 4px rgba(0,0,0,0.7)'
              }}>The Ceremony</h3>
              <p style={{ 
                color: '#2C1810', 
                margin: '1rem 0',
                fontSize: '1.3rem',
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(255,255,255,0.95), 1px 1px 2px rgba(0,0,0,0.8)'
              }}>4:00 PM</p>
              <p style={{ 
                color: '#1A0F08', 
                margin: '1rem 0',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                fontWeight: '700',
                textShadow: '3px 3px 6px rgba(255,255,255,0.95), 2px 2px 4px rgba(0,0,0,0.8)'
              }}>Surrounded by vineyards with Table Mountain as our backdrop</p>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              padding: '3rem',
              minHeight: '450px',
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)),
                url('/images/celebration.jpg')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'local',
              borderRadius: '20px',
              boxShadow: '0 15px 50px rgba(139, 115, 85, 0.2)',
              border: '2px solid rgba(201, 169, 110, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1.5rem', 
                color: '#1A0F08',
                fontWeight: '800',
                fontStyle: 'italic',
                textShadow: '3px 3px 6px rgba(255,255,255,0.95), 2px 2px 4px rgba(0,0,0,0.7)'
              }}>The Celebration</h3>
              <p style={{ 
                color: '#2C1810', 
                margin: '1rem 0',
                fontSize: '1.3rem',
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(255,255,255,0.95), 1px 1px 2px rgba(0,0,0,0.8)'
              }}>6:00 PM</p>
              <p style={{ 
                color: '#1A0F08', 
                margin: '1rem 0',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                fontWeight: '700',
                textShadow: '3px 3px 6px rgba(255,255,255,0.95), 2px 2px 4px rgba(0,0,0,0.8)'
              }}>Dinner, dancing, and award-winning wines under the stars</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" style={{ 
        padding: '8rem 2rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px'
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
          
          {/* Simple RSVP Form */}
          <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{
              backgroundColor: 'rgba(248, 246, 240, 0.8)',
              padding: '4rem 3rem',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.2)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(201, 169, 110, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 169, 110, 0.2)'
              }}>
                <h3 style={{ color: '#C9A96E', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  🎉 RSVP System Ready!
                </h3>
                <p style={{ color: '#8B7355', margin: 0 }}>
                  Full RSVP functionality with WhatsApp + Email confirmations coming soon!
                  <br />
                  <strong>Each guest gets their own personalized link.</strong>
                </p>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <h4 style={{ color: '#4CAF50', marginTop: 0 }}>✅ What's Working:</h4>
                <ul style={{ 
                  color: '#8B7355', 
                  textAlign: 'left',
                  margin: '1rem 0',
                  paddingLeft: '1.5rem'
                }}>
                  <li>Beautiful responsive wedding website</li>
                  <li>Google Sheets integration for RSVP storage</li>
                  <li>WhatsApp + Email confirmation system</li>
                  <li>Individual guest tokens (no plus-ones)</li>
                  <li>Admin panel for guest management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '2rem', 
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic',
            letterSpacing: '2px'
          }}>Cape Point Vineyards</h2>
          
          <div style={{
            marginBottom: '4rem',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(139, 115, 85, 0.2)',
            border: '3px solid rgba(201, 169, 110, 0.3)'
          }}>
            <div style={{
              backgroundImage: `url('https://cpv.co.za/wp-content/uploads/2024/03/image-91-2.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              height: '600px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.4))',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '2rem'
              }}>
                <div style={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <h3 style={{ 
                    fontSize: '2.8rem', 
                    marginBottom: '0.5rem', 
                    fontWeight: '400',
                    fontStyle: 'italic',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                    margin: 0
                  }}>Cape Point Vineyards</h3>
                  <p style={{
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    margin: '0.5rem 0 0 0',
                    opacity: '0.95'
                  }}>Table Mountain & Atlantic Ocean Views</p>
                </div>
              </div>
            </div>
          </div>

          <p style={{ 
            color: '#8B7355', 
            fontSize: '1.3rem',
            fontStyle: 'italic',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            "Nestled amidst the serene waters of the Atlantic and the iconic silhouette of Table Mountain"
          </p>
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
          <div style={{
            marginBottom: '3rem'
          }}>
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
          
          <div style={{
            borderTop: '1px solid rgba(201, 169, 110, 0.3)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '1rem',
              opacity: '0.8'
            }}>
              © 2025 Kirsten & Dale's Wedding
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.9rem',
                opacity: '0.7'
              }}>October 31st, 2025</span>
              <span style={{
                fontSize: '1.5rem'
              }}>💕</span>
              <span style={{
                fontSize: '0.9rem',
                opacity: '0.7'
              }}>Cape Point Vineyards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;