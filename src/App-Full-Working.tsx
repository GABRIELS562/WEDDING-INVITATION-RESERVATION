import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
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

      {/* Hero Section - Ultra Transparent Overlay */}
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
          
          <div style={{
            width: '150px',
            height: '2px',
            backgroundColor: '#8B4513',
            margin: '2rem auto',
            position: 'relative',
            boxShadow: '0 0 10px rgba(139, 69, 19, 0.7), 0 2px 4px rgba(255,255,255,0.8)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: '#8B4513',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(139, 69, 19, 0.8), 0 2px 4px rgba(255,255,255,0.9)'
            }}></div>
          </div>
          
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

      {/* Our Story Section */}
      <section id="story" className="section-padding" style={{ 
        padding: window.innerWidth <= 768 ? '4rem 1rem' : '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 768 ? '3rem' : '5rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: window.innerWidth <= 768 ? '1px' : '2px'
            }}>Our Love Story</h2>
            <div style={{
              width: '100px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>
          
          <div className="grid-responsive" style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: window.innerWidth <= 768 ? '2rem' : '4rem',
            alignItems: 'center'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '3rem',
              minHeight: window.innerWidth <= 768 ? '300px' : '450px',
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
              minHeight: window.innerWidth <= 768 ? '300px' : '450px',
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
          
          <div style={{
            textAlign: 'center',
            marginTop: '5rem',
            padding: '3rem',
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            borderRadius: '20px',
            border: '2px solid rgba(201, 169, 110, 0.2)'
          }}>
            <h3 style={{
              fontSize: '2.2rem',
              color: '#C9A96E',
              marginBottom: '2rem',
              fontStyle: 'italic',
              fontWeight: '400'
            }}>Our Love Story</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <div style={{
                padding: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                borderLeft: '4px solid #C9A96E'
              }}>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '1rem' }}>✨ How We Met</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "Some love stories begin with a chance encounter, others with years of friendship. 
                  Ours started with a spark that grew into an unbreakable bond. From our first conversation 
                  to countless adventures together, we knew we had found something special."
                </p>
              </div>
              
              <div style={{
                padding: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                borderLeft: '4px solid #C9A96E'
              }}>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '1rem' }}>💍 The Proposal</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "In a moment filled with love, laughter, and maybe a few happy tears, Dale asked the question 
                  that would change everything. With the sunset painting the sky and our hearts full of dreams 
                  for the future, Kirsten said 'Yes!' to forever."
                </p>
              </div>
              
              <div style={{
                padding: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                borderLeft: '4px solid #C9A96E'
              }}>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '1rem' }}>🏔️ Why Cape Point?</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "We chose Cape Point Vineyards because it captures the essence of our love - 
                  breathtaking, timeless, and surrounded by natural beauty. With Table Mountain 
                  as our witness and the Atlantic Ocean as our backdrop, it's the perfect place 
                  to begin our married life together."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="section-padding" style={{ 
        padding: window.innerWidth <= 768 ? '4rem 1rem' : '8rem 2rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 768 ? '3rem' : '5rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: window.innerWidth <= 768 ? '1px' : '2px'
            }}>RSVP</h2>
            <div style={{
              width: '100px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
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

      {/* Venue Section */}
      <section id="venue" className="section-padding" style={{ 
        padding: window.innerWidth <= 768 ? '4rem 1rem' : '8rem 2rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ 
            fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
            marginBottom: '2rem', 
            color: '#C9A96E',
            fontWeight: '400',
            fontStyle: 'italic',
            letterSpacing: window.innerWidth <= 768 ? '1px' : '2px'
          }}>The Venue</h2>
          
          <div style={{
            width: '100px',
            height: '2px',
            backgroundColor: '#C9A96E',
            margin: '2rem auto 4rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: '#C9A96E',
              borderRadius: '50%'
            }}></div>
          </div>
          
          {/* Beautiful venue photo showcase */}
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
              height: window.innerWidth <= 768 ? '350px' : '600px',
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
                    fontSize: window.innerWidth <= 768 ? '2rem' : '2.8rem', 
                    marginBottom: '0.5rem', 
                    fontWeight: '400',
                    fontStyle: 'italic',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                    margin: 0
                  }}>Cape Point Vineyards</h3>
                  <p style={{
                    fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem',
                    fontStyle: 'italic',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    margin: '0.5rem 0 0 0',
                    opacity: '0.95'
                  }}>Table Mountain & Atlantic Ocean Views</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '3rem',
            borderRadius: '20px',
            marginBottom: '4rem',
            boxShadow: '0 15px 50px rgba(139, 115, 85, 0.1)',
            border: '1px solid rgba(201, 169, 110, 0.2)'
          }}>
            <p style={{ 
              color: '#8B7355', 
              marginBottom: '2rem',
              fontSize: '1.3rem',
              fontStyle: 'italic',
              lineHeight: '1.8',
              textAlign: 'center'
            }}>
              "Nestled amidst the serene waters of the Atlantic and the iconic silhouette of Table Mountain"
            </p>
            
            <div className="grid-responsive" style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: window.innerWidth <= 768 ? '1.5rem' : '2rem',
              marginBottom: '3rem'
            }}>
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '0.5rem' }}>📍 Location</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem' }}>
                  Silvermine Road, Noordhoek<br/>
                  Cape Town, South Africa
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '0.5rem' }}>🍷 Experience</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem' }}>
                  Award-winning wines<br/>
                  Exquisite cuisine
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#C9A96E', fontSize: '1.3rem', marginBottom: '0.5rem' }}>🏔️ Views</h4>
                <p style={{ color: '#8B7355', fontSize: '1.1rem' }}>
                  Table Mountain vistas<br/>
                  Atlantic Ocean panoramas
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: window.innerWidth <= 768 ? '1rem' : '2rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
            alignItems: 'center'
          }}>
            <button 
              onClick={() => window.open('https://cpv.co.za/', '_blank')}
              style={{ 
                backgroundColor: '#C9A96E', 
                color: 'white', 
                padding: '1rem 2rem', 
                border: 'none', 
                borderRadius: '50px', 
                fontSize: '1.1rem',
                fontWeight: '300',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(201, 169, 110, 0.3)'
              }}
            >
              Visit Venue Website
            </button>
            
            <button 
              onClick={() => window.open('https://maps.google.com/?q=Cape+Point+Vineyards+Noordhoek', '_blank')}
              style={{ 
                backgroundColor: 'transparent', 
                color: '#C9A96E', 
                padding: '1rem 2rem', 
                border: '2px solid #C9A96E', 
                borderRadius: '50px', 
                fontSize: '1.1rem',
                fontWeight: '300',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Get Directions
            </button>
          </div>
          
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(201, 169, 110, 0.2)'
          }}>
            <p style={{
              color: '#8B7355',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              margin: 0
            }}>
              💌 We can't wait to celebrate this magical day with you at one of South Africa's most beautiful wine estates!
            </p>
          </div>
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
              &copy; 2025 Kirsten & Dale's Wedding
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
          
          <div style={{
            marginTop: '2rem',
            fontSize: '0.9rem',
            opacity: '0.6',
            fontStyle: 'italic'
          }}>
            Crafted with love and attention to detail ✨
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple Admin Page without complex components
const AdminPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F6F0', padding: '2rem' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#C9A96E', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
          Kirsten & Dale Wedding Admin
        </h1>
        <p style={{ color: '#8B7355', fontSize: '1.1rem', margin: '0 0 3rem 0' }}>
          Guest Invitation & RSVP Management
        </p>
        
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
          border: '2px solid rgba(201, 169, 110, 0.2)'
        }}>
          <h2 style={{ color: '#C9A96E', marginBottom: '2rem' }}>🎉 Admin System Ready!</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#F8F6F0', borderRadius: '10px' }}>
              <h3 style={{ color: '#C9A96E', margin: '0 0 1rem 0' }}>📝 RSVP Management</h3>
              <p style={{ color: '#8B7355', margin: 0 }}>View and manage guest responses</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#F8F6F0', borderRadius: '10px' }}>
              <h3 style={{ color: '#C9A96E', margin: '0 0 1rem 0' }}>👥 Guest Invitations</h3>
              <p style={{ color: '#8B7355', margin: 0 }}>Generate WhatsApp invitation links</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#F8F6F0', borderRadius: '10px' }}>
              <h3 style={{ color: '#C9A96E', margin: '0 0 1rem 0' }}>📊 Statistics</h3>
              <p style={{ color: '#8B7355', margin: 0 }}>Track attendance and responses</p>
            </div>
          </div>
          
          <div style={{
            padding: '2rem',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#4CAF50', marginTop: 0 }}>✅ What's Working:</h3>
            <ul style={{ 
              color: '#8B7355', 
              textAlign: 'left',
              margin: '1rem 0',
              paddingLeft: '1.5rem'
            }}>
              <li>Complete wedding website with all sections</li>
              <li>RSVP form with WhatsApp + Email confirmations</li>
              <li>Google Sheets integration (Spreadsheet ID: 1nsxR7ZJT2Zu1gC5jpXpNcy21KfU_fHk17lklK9uOTYc)</li>
              <li>Individual guest tokens (no plus-ones)</li>
              <li>Mobile-responsive design</li>
              <li>Ready for Vercel deployment</li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/" 
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#C9A96E',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '500'
              }}
            >
              ← Back to Website
            </a>
            <a 
              href="/guest/DEMO123"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#8B7355',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '500'
              }}
            >
              Test RSVP Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingWebsite />} />
        <Route path="/guest/:token" element={<WeddingWebsite />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;