import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { RSVPFormComponent } from './components/RSVPFormComponent';
import { GuestInvitationManager } from './components/GuestInvitationManager';

const WeddingWebsite = () => {
  const params = useParams();
  const guestToken = params.token;
  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#8B7355',
      lineHeight: '1.6',
      scrollBehavior: 'smooth'
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
        padding: '1rem 0',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem', 
            color: '#C9A96E',
            fontWeight: '500',
            fontStyle: 'normal',
            letterSpacing: '3px',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textTransform: 'uppercase'
          }}>Kirsten & Dale</h1>
          
          {/* Navigation Links */}
          <div className="nav-links" style={{ 
            display: 'flex', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <a 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('story');
                if (element) {
                  const navHeight = 80; // Navigation bar height
                  const elementPosition = element.offsetTop - navHeight;
                  window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                }
              }}
              href="#story" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.9rem',
                fontWeight: '400',
                letterSpacing: '1px',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}>Our Story</a>
            <a 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('venue');
                if (element) {
                  const navHeight = 80; // Navigation bar height
                  const elementPosition = element.offsetTop - navHeight;
                  window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                }
              }}
              href="#venue" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.9rem',
                fontWeight: '400',
                letterSpacing: '1px',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}>Venue</a>
            <a 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('ceremony');
                if (element) {
                  const navHeight = 80; // Navigation bar height
                  const elementPosition = element.offsetTop - navHeight;
                  window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                }
              }}
              href="#ceremony" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.9rem',
                fontWeight: '400',
                letterSpacing: '1px',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}>The Big Day</a>
            <a 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('rsvp');
                if (element) {
                  const navHeight = 80; // Navigation bar height
                  const elementPosition = element.offsetTop - navHeight;
                  window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                }
              }}
              href="#rsvp" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.9rem',
                fontWeight: '400',
                letterSpacing: '1px',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}>RSVP</a>
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
          padding: '3rem 2rem',
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
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
            margin: '0 0 1rem 0', 
            color: '#1A0F08',
            fontWeight: '800',
            fontStyle: 'italic',
            letterSpacing: '3px',
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
        padding: '6rem 1rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px'
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
          
          {/* Bible Verses Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '5rem',
            padding: '4rem 3rem',
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            borderRadius: '20px',
            border: '2px solid rgba(201, 169, 110, 0.2)'
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* First Bible Verse */}
              <blockquote style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: '#8B7355',
                fontStyle: 'italic',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                fontFamily: "'Inter', -apple-system, sans-serif"
              }}>
                "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres."
              </blockquote>
              <cite style={{
                fontSize: '1.1rem',
                color: '#C9A96E',
                fontWeight: '600',
                fontFamily: "'Inter', -apple-system, sans-serif",
                marginBottom: '3rem',
                display: 'block'
              }}>
                - 1 Corinthians 13:4-7
              </cite>

              {/* Second Bible Verse */}
              <blockquote style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: '#8B7355',
                fontStyle: 'italic',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                marginTop: '3rem',
                fontFamily: "'Inter', -apple-system, sans-serif"
              }}>
                "Therefore what God has joined together, let no one separate. Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."
              </blockquote>
              <cite style={{
                fontSize: '1.1rem',
                color: '#C9A96E',
                fontWeight: '600',
                fontFamily: "'Inter', -apple-system, sans-serif"
              }}>
                - Mark 10:9 & Ecclesiastes 4:9-10
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="section-padding" style={{ 
        padding: '6rem 1rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ padding: '0 1rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
              marginBottom: '2rem', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              letterSpacing: '2px'
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
          
          </div>
          
          {/* Beautiful venue photo showcase */}
          <div style={{
            marginBottom: '4rem',
            maxWidth: '1200px',
            margin: '0 auto 4rem auto',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(139, 115, 85, 0.2)',
            border: '3px solid rgba(201, 169, 110, 0.3)'
          }}>
            <div style={{
              backgroundImage: `url('/images/cape-point-vista.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              height: 'clamp(400px, 60vw, 700px)',
              position: 'relative',
              imageRendering: 'crisp-edges',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.7) 0%, transparent 50%)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '3rem 2rem 0 2rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <h3 style={{ 
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', 
                    marginBottom: '0.5rem', 
                    fontWeight: '700',
                    fontStyle: 'normal',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    letterSpacing: '1px',
                    margin: '0 0 0.5rem 0',
                    color: 'white',
                    lineHeight: '1.2',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}>Cape Point Vineyards</h3>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    letterSpacing: '0.5px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                    lineHeight: '1.5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
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
                  Exquisite wines<br/>
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
            gap: '1.5rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
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

      {/* Ceremony & Celebration Section */}
      <section id="ceremony" className="section-padding" style={{ 
        padding: '6rem 1rem', 
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FEFCF7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px'
            }}>The Big Day</h2>
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
          
          {/* Ceremony Image */}
          <div style={{ 
            textAlign: 'center',
            minHeight: '450px',
            backgroundImage: `url('/images/ceremony.jpg?v=1')`,
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
            justifyContent: 'flex-end',
            marginBottom: '2rem',
            maxWidth: '1000px',
            margin: '0 auto 2rem auto'
          }}>
          <div style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            padding: '3rem 2rem 2rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: '700',
              fontStyle: 'normal',
              fontFamily: "'Inter', -apple-system, sans-serif",
              letterSpacing: '0.5px',
              lineHeight: '1.2',
              margin: '0 0 0.5rem 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>The Ceremony</h3>
            <p style={{ 
              color: '#FFD700', 
              margin: '0 0 0.5rem 0',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: '700',
              fontFamily: "'Inter', -apple-system, sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>4:00 PM</p>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
              fontStyle: 'normal',
              fontWeight: '400',
              fontFamily: "'Inter', -apple-system, sans-serif",
              lineHeight: '1.4',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>Surrounded by vineyards with Table Mountain as our backdrop</p>
          </div>
          </div>

          {/* Celebration Image */}
          <div style={{ 
            textAlign: 'center',
            minHeight: '450px',
            backgroundImage: `url('/images/celebration.jpg?v=1')`,
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
            justifyContent: 'flex-end',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
          <div style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            padding: '3rem 2rem 2rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: '700',
              fontStyle: 'normal',
              fontFamily: "'Inter', -apple-system, sans-serif",
              letterSpacing: '0.5px',
              lineHeight: '1.2',
              margin: '0 0 0.5rem 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>The Celebration</h3>
            <p style={{ 
              color: '#FFD700', 
              margin: '0 0 0.5rem 0',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: '700',
              fontFamily: "'Inter', -apple-system, sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>6:00 PM</p>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
              fontStyle: 'normal',
              fontWeight: '400',
              fontFamily: "'Inter', -apple-system, sans-serif",
              lineHeight: '1.4',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>Dinner, dancing, and exquisite wines under the stars</p>
          </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="section-padding" style={{ 
        padding: '6rem 2rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
              color: '#C9A96E',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px'
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
          
          <RSVPFormComponent guestToken={guestToken} />
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

const AdminPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F6F0' }}>
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5D5B7'
      }}>
        <h1 style={{ color: '#C9A96E', fontSize: '2.5rem', margin: 0 }}>
          Kirsten & Dale Wedding Admin
        </h1>
        <p style={{ color: '#8B7355', fontSize: '1.1rem', margin: '0.5rem 0 0 0' }}>
          Guest Invitation & RSVP Management
        </p>
      </div>
      <GuestInvitationManager baseUrl={window.location.origin} />
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