import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { RSVPFormComponent } from './components/RSVPFormComponent';
import SimpleAdminDashboard from './components/SimpleAdminDashboard';
import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2025-10-31T16:00:00');
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'clamp(0.8rem, 3vw, 1.5rem)',
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(139, 115, 85, 0.15)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease',
          width: '100%',
          height: 'clamp(90px, 20vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.5rem'
        }}>
          <div style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            color: '#8B4513',
            marginBottom: '0.25rem',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1'
          }}>{value}</div>
          <div style={{
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            color: '#8B7355',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '500',
            lineHeight: '1'
          }}>{unit}</div>
        </div>
      ))}
    </div>
  );
};

const WeddingWebsite = () => {
  const params = useParams();
  // Support both URL path parameter (/guest/token) and query parameter (?guest=token)
  const urlParams = new URLSearchParams(window.location.search);
  const guestToken = params.token || urlParams.get('guest');
  
  // URL parameter processing
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#8B7355',
      lineHeight: '1.6',
      scrollBehavior: 'smooth'
    }}>
      {/* Enhanced Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
        backdropFilter: 'blur(20px)',
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
            fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', 
            color: '#C9A96E',
            fontWeight: '500',
            fontStyle: 'normal',
            letterSpacing: '3px',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textTransform: 'uppercase'
          }}>Kirsten & Dale</h1>
          
          {/* Desktop Navigation */}
          <div className="nav-links" style={{ 
            display: 'flex', 
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a 
              onClick={(e) => handleNavClick(e, 'story')}
              href="#story" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.95rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '0.5rem 0',
                borderBottom: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#C9A96E';
                (e.target as HTMLElement).style.borderBottomColor = '#C9A96E';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#8B7355';
                (e.target as HTMLElement).style.borderBottomColor = 'transparent';
              }}
            >Our Story</a>
            <a 
              onClick={(e) => handleNavClick(e, 'venue')}
              href="#venue" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.95rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '0.5rem 0',
                borderBottom: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#C9A96E';
                (e.target as HTMLElement).style.borderBottomColor = '#C9A96E';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#8B7355';
                (e.target as HTMLElement).style.borderBottomColor = 'transparent';
              }}
            >Venue</a>
            <a 
              onClick={(e) => handleNavClick(e, 'ceremony')}
              href="#ceremony" 
              style={{ 
                textDecoration: 'none', 
                color: '#8B7355',
                fontSize: '0.95rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '0.5rem 0',
                borderBottom: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#C9A96E';
                (e.target as HTMLElement).style.borderBottomColor = '#C9A96E';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#8B7355';
                (e.target as HTMLElement).style.borderBottomColor = 'transparent';
              }}
            >The Big Day</a>
            <a 
              onClick={(e) => handleNavClick(e, 'rsvp')}
              href="#rsvp" 
              style={{ 
                backgroundColor: '#C9A96E',
                color: 'white',
                textDecoration: 'none', 
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#B8956A';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(201, 169, 110, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#C9A96E';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(201, 169, 110, 0.3)';
              }}
            >RSVP</a>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              background: 'rgba(201, 169, 110, 0.1)',
              border: '1px solid rgba(201, 169, 110, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '36px',
              padding: '8px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            className="mobile-menu-button"
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
              (e.target as HTMLElement).style.borderColor = 'rgba(201, 169, 110, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'rgba(201, 169, 110, 0.1)';
              (e.target as HTMLElement).style.borderColor = 'rgba(201, 169, 110, 0.2)';
            }}
          >
            <span style={{
              display: 'block',
              height: '2px',
              width: mobileMenuOpen ? '18px' : '20px',
              backgroundColor: '#8B7355',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none'
            }}></span>
            <span style={{
              display: 'block',
              height: '2px',
              width: mobileMenuOpen ? '18px' : '16px',
              backgroundColor: '#8B7355',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1,
              margin: '3px 0'
            }}></span>
            <span style={{
              display: 'block',
              height: '2px',
              width: mobileMenuOpen ? '18px' : '20px',
              backgroundColor: '#8B7355',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none'
            }}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(139, 115, 85, 0.15)',
            padding: '2rem 1rem',
            animation: 'slideDown 0.3s ease'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              <a onClick={(e) => handleNavClick(e, 'story')} href="#story" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem', fontWeight: '500', padding: '0.75rem', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Our Story</a>
              <a onClick={(e) => handleNavClick(e, 'venue')} href="#venue" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem', fontWeight: '500', padding: '0.75rem', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Venue</a>
              <a onClick={(e) => handleNavClick(e, 'ceremony')} href="#ceremony" style={{ textDecoration: 'none', color: '#8B7355', fontSize: '1.1rem', fontWeight: '500', padding: '0.75rem', minHeight: '44px', display: 'flex', alignItems: 'center' }}>The Big Day</a>
              <a onClick={(e) => handleNavClick(e, 'rsvp')} href="#rsvp" style={{ backgroundColor: '#C9A96E', color: 'white', textDecoration: 'none', fontSize: '1.1rem', fontWeight: '600', padding: '1rem 2rem', borderRadius: '25px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>RSVP</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Redesigned for Mobile */}
      <section id="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
          url('/hero-image.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        padding: '2rem 1rem',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <div style={{
            fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '1rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '400'
          }}>You're Invited</div>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 10vw, 5rem)', 
            margin: '0 0 1rem 0', 
            color: 'white',
            fontWeight: '300',
            fontStyle: 'italic',
            letterSpacing: '2px',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.1',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>Kirsten & Dale</h1>
          
          <div style={{
            width: '80px',
            height: '1px',
            backgroundColor: '#C9A96E',
            margin: '2rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              backgroundColor: '#C9A96E',
              borderRadius: '50%'
            }}></div>
          </div>
          
          <div style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
            color: 'white',
            fontWeight: '400',
            marginBottom: '0.5rem',
            fontFamily: "'Playfair Display', serif"
          }}>October 31st, 2025</div>
          
          <div style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '300',
            marginBottom: '3rem'
          }}>Cape Point Vineyards, Cape Town</div>

          {/* Countdown Timer */}
          <CountdownTimer />

          {/* CTA Button */}
          <a 
            onClick={(e) => handleNavClick(e, 'rsvp')}
            href="#rsvp"
            style={{
              backgroundColor: '#C9A96E',
              color: 'white',
              textDecoration: 'none',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontWeight: '600',
              padding: '1rem 2.5rem',
              borderRadius: '30px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(201, 169, 110, 0.4)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'fit-content',
              margin: '2rem auto 0'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#B8956A';
              (e.target as HTMLElement).style.transform = 'translateY(-3px)';
              (e.target as HTMLElement).style.boxShadow = '0 12px 35px rgba(201, 169, 110, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#C9A96E';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(201, 169, 110, 0.4)';
            }}
          >
            RSVP Now
          </a>
        </div>
      </section>

      {/* Our Story Section - Enhanced */}
      <section id="story" className="section-padding" style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        background: 'linear-gradient(135deg, #FEFCF9 0%, #F8F6F0 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Bible Verses Section - Enhanced */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(4rem, 8vw, 6rem)',
            padding: 'clamp(3rem, 6vw, 4rem) clamp(2rem, 5vw, 3rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '24px',
            border: '1px solid rgba(201, 169, 110, 0.15)',
            boxShadow: '0 10px 40px rgba(139, 115, 85, 0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* First Bible Verse */}
              <blockquote style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: '#8B7355',
                fontStyle: 'italic',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '400'
              }}>
                "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres."
              </blockquote>
              <cite style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                color: '#C9A96E',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                marginBottom: '3rem',
                display: 'block'
              }}>
                - 1 Corinthians 13:4-7
              </cite>

              {/* Elegant separator */}
              <div style={{
                width: '40px',
                height: '1px',
                backgroundColor: '#C9A96E',
                margin: '3rem auto',
                opacity: '0.5'
              }}></div>

              {/* Second Bible Verse */}
              <blockquote style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: '#8B7355',
                fontStyle: 'italic',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
                marginTop: '3rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '400'
              }}>
                "Therefore what God has joined together, let no one separate. Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."
              </blockquote>
              <cite style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                color: '#C9A96E',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif"
              }}>
                - Mark 10:9 & Ecclesiastes 4:9-10
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section - Enhanced */}
      <section id="venue" className="section-padding" style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ padding: '0 1rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              marginBottom: '2rem', 
              color: '#8B4513',
              fontWeight: '300',
              fontStyle: 'italic',
              letterSpacing: '1px',
              fontFamily: "'Playfair Display', serif"
            }}>The Venue</h2>
          
            <div style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto 4rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Full-Width Venue Section */}
      <section style={{ 
        minHeight: 'clamp(50vh, 70vw, 80vh)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('/images/cape-point-vista.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'scroll',
        textAlign: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            marginBottom: '1rem', 
            color: 'white',
            fontWeight: '300',
            fontStyle: 'italic',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '1px',
            lineHeight: '1.2',
            textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
          }}>Cape Point Vineyards</h3>
          
          <div style={{
            width: '80px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            margin: '2rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '50%'
            }}></div>
          </div>
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            margin: 0,
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            fontWeight: '300',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontStyle: 'italic'
          }}>Table Mountain & Atlantic Ocean Views</p>
        </div>
      </section>

      {/* Venue Details Section */}
      <section style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

          {/* Venue details */}
          <div style={{
            backgroundColor: 'rgba(248, 246, 240, 0.6)',
            padding: 'clamp(2rem, 5vw, 3rem)',
            borderRadius: '20px',
            border: '1px solid rgba(201, 169, 110, 0.15)',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              color: '#8B7355',
              fontStyle: 'italic',
              lineHeight: '1.7',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              "Nestled amidst the serene waters of the Atlantic and the iconic silhouette of Table Mountain"
            </p>
            <div style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              color: '#8B7355',
              lineHeight: '1.6'
            }}>
              Silvermine Road, Noordhoek<br/>
              Cape Town, South Africa
            </div>
          </div>
          
          {/* Enhanced action buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '3rem'
          }}>
            <button 
              onClick={() => window.open('https://cpv.co.za/', '_blank')}
              style={{ 
                backgroundColor: '#C9A96E', 
                color: 'white', 
                padding: '1rem 2rem', 
                border: 'none', 
                borderRadius: '25px', 
                fontSize: '1.1rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(201, 169, 110, 0.3)',
                minHeight: '48px',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#B8956A';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLElement).style.boxShadow = '0 12px 30px rgba(201, 169, 110, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#C9A96E';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(201, 169, 110, 0.3)';
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
                borderRadius: '25px', 
                fontSize: '1.1rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#C9A96E';
                (e.target as HTMLElement).style.color = 'white';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                (e.target as HTMLElement).style.color = '#C9A96E';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Get Directions
            </button>
          </div>
        </div>
      </section>

      {/* Ceremony & Celebration Section - Enhanced */}
      <section id="ceremony" className="section-padding" style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        background: 'linear-gradient(135deg, #FEFCF9 0%, #F8F6F0 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)', padding: '0 1rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              color: '#8B4513',
              fontWeight: '300',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '1px',
              fontFamily: "'Playfair Display', serif"
            }}>The Big Day</h2>
            <div style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* The Ceremony - Partial Width with Elegance */}
      <section style={{ 
        padding: 'clamp(4rem, 8vw, 6rem) 1rem',
        backgroundColor: '#F8F6F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '1400px',
          minHeight: 'clamp(60vh, 70vw, 80vh)',
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45)),
            url('/images/ceremony.jpg?v=1')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.2), 0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '3px solid rgba(201, 169, 110, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(5px)',
          borderRadius: '20px',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(2px, 1vw, 4px)',
            fontWeight: '400',
            marginBottom: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>THE CEREMONY</div>
          
          <h3 style={{ 
            fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
            marginBottom: '2rem', 
            color: 'white',
            fontWeight: '700',
            fontStyle: 'normal',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: 'clamp(-1px, 0.5vw, 2px)',
            lineHeight: '1.1',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.3)',
            textTransform: 'uppercase'
          }}>4:00 PM</h3>
          
          <div style={{
            width: '120px',
            height: '2px',
            backgroundColor: 'rgba(201, 169, 110, 0.8)',
            margin: '2.5rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: 'rgba(201, 169, 110, 0.8)',
              borderRadius: '50%'
            }}></div>
          </div>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
            fontWeight: '300',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.7',
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Surrounded by vineyards with Table Mountain as our breathtaking backdrop</p>
        </div>
        </div>
      </section>

      {/* The Celebration - Partial Width with Elegance */}
      <section style={{ 
        padding: 'clamp(4rem, 8vw, 6rem) 1rem',
        backgroundColor: '#FEFCF9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '1400px',
          minHeight: 'clamp(60vh, 70vw, 80vh)',
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45)),
            url('/images/celebration.jpg?v=1')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.2), 0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '3px solid rgba(201, 169, 110, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(5px)',
          borderRadius: '20px',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(2px, 1vw, 4px)',
            fontWeight: '400',
            marginBottom: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>THE CELEBRATION</div>
          
          <h3 style={{ 
            fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
            marginBottom: '2rem', 
            color: 'white',
            fontWeight: '700',
            fontStyle: 'normal',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: 'clamp(-1px, 0.5vw, 2px)',
            lineHeight: '1.1',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.3)',
            textTransform: 'uppercase'
          }}>6:00 PM</h3>
          
          <div style={{
            width: '120px',
            height: '2px',
            backgroundColor: 'rgba(201, 169, 110, 0.8)',
            margin: '2.5rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: 'rgba(201, 169, 110, 0.8)',
              borderRadius: '50%'
            }}></div>
          </div>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
            fontWeight: '300',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.7',
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Dinner, dancing, and exquisite wines under the African stars</p>
        </div>
        </div>
      </section>

      {/* RSVP Section - Enhanced for Mobile */}
      <section id="rsvp" className="section-padding" style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        backgroundColor: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              color: '#8B4513',
              fontWeight: '300',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '1px',
              fontFamily: "'Playfair Display', serif"
            }}>RSVP</h2>
            <div style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#C9A96E',
              margin: '2rem auto',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#C9A96E',
                borderRadius: '50%'
              }}></div>
            </div>
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              color: '#8B7355',
              fontStyle: 'italic',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              We would be honored to have you celebrate with us on our special day
            </p>
          </div>
          
          <RSVPFormComponent guestToken={guestToken || undefined} />
          
          {/* Gift Message Section */}
          <div style={{
            marginTop: '4rem',
            padding: 'clamp(3rem, 6vw, 4rem) clamp(2rem, 5vw, 3rem)',
            backgroundColor: 'rgba(248, 246, 240, 0.7)',
            borderRadius: '24px',
            border: '1px solid rgba(201, 169, 110, 0.15)',
            boxShadow: '0 10px 40px rgba(139, 115, 85, 0.08)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <p style={{
                fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)',
                color: '#8B7355',
                lineHeight: '1.8',
                marginBottom: '2rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '600'
              }}>
                Your presence at our wedding is the greatest gift we could ask for. As we begin our new chapter together, we are saving for our future. If you wish to honour us with a gift, a monetary contribution to our future would be deeply appreciated.
              </p>
              
              <div style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                color: '#C9A96E',
                fontWeight: '500',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic'
              }}>
                With all our love,<br/>
                Dale & Kirsten
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #8B7355 0%, #6B5B47 100%)', 
        color: '#F8F6F0', 
        padding: 'clamp(3rem, 8vw, 5rem) 1rem clamp(2rem, 5vw, 3rem) 1rem', 
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: '#C9A96E',
              fontWeight: '300',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '2px',
              fontFamily: "'Playfair Display', serif"
            }}>Kirsten & Dale</h3>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              fontStyle: 'italic',
              opacity: '0.9',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6'
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
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              opacity: '0.8'
            }}>
              &copy; 2025 Kirsten & Dale's Wedding
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                opacity: '0.7'
              }}>October 31st, 2025</span>
              <span style={{
                fontSize: '1.5rem'
              }}>💕</span>
              <span style={{
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                opacity: '0.7'
              }}>Cape Point Vineyards</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }

        .section-padding {
          scroll-margin-top: 100px;
        }
      `}</style>
    </div>
  );
};

const AdminPage = () => {
  return <SimpleAdminDashboard />;
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