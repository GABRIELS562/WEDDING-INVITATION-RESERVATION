import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const WeddingWebsite = () => {
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

      {/* Hero Section - Side by Side Layout */}
      <section id="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        position: 'relative'
      }}>
        {/* Photo Side - Heart-shaped hands completely visible */}
        <div style={{
          flex: window.innerWidth <= 768 ? '1' : '6',
          minHeight: window.innerWidth <= 768 ? '50vh' : '100vh',
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Minimal corner badge - doesn't interfere with hands */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
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
        </div>

        {/* Content Side - Elegant information panel */}
        <div style={{
          flex: window.innerWidth <= 768 ? '1' : '4',
          minHeight: window.innerWidth <= 768 ? '50vh' : '100vh',
          background: 'linear-gradient(135deg, #FEFCF7 0%, #F8F6F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: window.innerWidth <= 768 ? '3rem 1.5rem' : '4rem 3rem',
          position: 'relative'
        }}>
          {/* Elegant content container */}
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: window.innerWidth <= 768 ? '2.5rem 2rem' : '4rem 3rem',
            borderRadius: '25px',
            boxShadow: '0 30px 80px rgba(139, 115, 85, 0.15)',
            border: '2px solid rgba(201, 169, 110, 0.2)'
          }}>
            <div style={{
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
              color: '#8B7355',
              marginBottom: '2rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: '400',
              opacity: '0.8'
            }}>You're Invited</div>
            
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
              width: '120px',
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
              fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.6rem', 
              margin: '0 0 2.5rem 0', 
              color: '#8B7355',
              fontWeight: '300',
              fontStyle: 'italic'
            }}>are getting married</p>
            
            <div style={{
              backgroundColor: 'rgba(201, 169, 110, 0.1)',
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              border: '2px solid rgba(201, 169, 110, 0.2)',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: window.innerWidth <= 768 ? '2.5rem' : '3rem',
                color: '#C9A96E',
                fontWeight: '500',
                letterSpacing: '1px',
                marginBottom: '0.5rem'
              }}>October 31st</div>
              
              <div style={{ 
                fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.8rem', 
                color: '#8B7355',
                fontWeight: '300'
              }}>2025</div>
            </div>
            
            <div style={{
              fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
              color: '#8B7355',
              fontStyle: 'italic',
              opacity: '0.85',
              lineHeight: '1.6',
              borderTop: '1px solid rgba(201, 169, 110, 0.3)',
              paddingTop: '1.5rem'
            }}>
              Cape Point Vineyards<br/>
              <span style={{ fontSize: '0.9em', opacity: '0.7' }}>Cape Town, South Africa</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A96E, #D4B574)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            opacity: '0.2'
          }}>
            💒
          </div>

          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(201, 169, 110, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            opacity: '0.3'
          }}>
            🌿
          </div>
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
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(139, 115, 85, 0.1)',
              border: '1px solid rgba(201, 169, 110, 0.2)'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '2rem'
              }}>💒</div>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1.5rem', 
                color: '#C9A96E',
                fontWeight: '400',
                fontStyle: 'italic'
              }}>The Ceremony</h3>
              <p style={{ 
                color: '#8B7355', 
                margin: '1rem 0',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>4:00 PM</p>
              <p style={{ 
                color: '#8B7355', 
                margin: '1rem 0',
                fontSize: '1.1rem',
                fontStyle: 'italic'
              }}>Surrounded by vineyards with Table Mountain as our backdrop</p>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(139, 115, 85, 0.1)',
              border: '1px solid rgba(201, 169, 110, 0.2)'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '2rem'
              }}>🥂</div>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1.5rem', 
                color: '#C9A96E',
                fontWeight: '400',
                fontStyle: 'italic'
              }}>The Celebration</h3>
              <p style={{ 
                color: '#8B7355', 
                margin: '1rem 0',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>6:00 PM</p>
              <p style={{ 
                color: '#8B7355', 
                margin: '1rem 0',
                fontSize: '1.1rem',
                fontStyle: 'italic'
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
          
          <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{
              backgroundColor: 'rgba(248, 246, 240, 0.8)',
              padding: window.innerWidth <= 768 ? '2.5rem 1.5rem' : '4rem 3rem',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.2)'
            }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.8rem', 
                    color: '#8B7355',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Your Name *</label>
                  <input 
                    type="text" 
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1.2rem', 
                      border: '2px solid #E5D5B7', 
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      color: '#8B7355',
                      backgroundColor: '#FEFCF7',
                      transition: 'border-color 0.3s ease'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.8rem', 
                    color: '#8B7355',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Email Address *</label>
                  <input 
                    type="email" 
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1.2rem', 
                      border: '2px solid #E5D5B7', 
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      color: '#8B7355',
                      backgroundColor: '#FEFCF7',
                      transition: 'border-color 0.3s ease'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.8rem', 
                    color: '#8B7355',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Will you be joining us? *</label>
                  <select style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem', 
                    border: '2px solid #E5D5B7', 
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    color: '#8B7355',
                    backgroundColor: '#FEFCF7',
                    cursor: 'pointer'
                  }}>
                    <option>✨ Yes, I'll be there with bells on!</option>
                    <option>💔 Unfortunately, I can't make it</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.8rem', 
                    color: '#8B7355',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Menu Selection *</label>
                  <div style={{
                    backgroundColor: 'rgba(201, 169, 110, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '2px solid #E5D5B7',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      color: '#C9A96E',
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>🍷 Cape Point Vineyards Wedding Menu</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        padding: '0.8rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.2)'
                      }}>
                        <input type="radio" name="menu" value="beef" style={{ accentColor: '#C9A96E' }} />
                        <div>
                          <strong style={{ color: '#8B7355' }}>🥩 Beef Tenderloin</strong>
                          <br />
                          <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            Grilled beef tenderloin with roasted vegetables and red wine jus
                          </span>
                        </div>
                      </label>
                      
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        padding: '0.8rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.2)'
                      }}>
                        <input type="radio" name="menu" value="chicken" style={{ accentColor: '#C9A96E' }} />
                        <div>
                          <strong style={{ color: '#8B7355' }}>🐔 Free-Range Chicken</strong>
                          <br />
                          <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            Herb-crusted chicken breast with seasonal vegetables and lemon butter sauce
                          </span>
                        </div>
                      </label>
                      
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        padding: '0.8rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.2)'
                      }}>
                        <input type="radio" name="menu" value="fish" style={{ accentColor: '#C9A96E' }} />
                        <div>
                          <strong style={{ color: '#8B7355' }}>🐟 Line Fish</strong>
                          <br />
                          <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            Fresh Cape line fish with Mediterranean vegetables and white wine reduction
                          </span>
                        </div>
                      </label>
                      
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        padding: '0.8rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.2)'
                      }}>
                        <input type="radio" name="menu" value="vegetarian" style={{ accentColor: '#C9A96E' }} />
                        <div>
                          <strong style={{ color: '#8B7355' }}>🥕 Vegetarian Delight</strong>
                          <br />
                          <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            Roasted vegetable tart with goat's cheese and herb salad
                          </span>
                        </div>
                      </label>
                      
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        padding: '0.8rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.2)'
                      }}>
                        <input type="radio" name="menu" value="vegan" style={{ accentColor: '#C9A96E' }} />
                        <div>
                          <strong style={{ color: '#8B7355' }}>🌱 Vegan Option</strong>
                          <br />
                          <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            Plant-based protein with quinoa, roasted vegetables, and tahini dressing
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.8rem', 
                    color: '#8B7355',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Special Message & Dietary Requirements</label>
                  <textarea 
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1.2rem', 
                      border: '2px solid #E5D5B7', 
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      color: '#8B7355',
                      backgroundColor: '#FEFCF7',
                      minHeight: '120px',
                      resize: 'vertical'
                    }}
                    placeholder="Share your excitement, dietary requirements (allergies, special needs), song requests, or any special messages for the happy couple..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#C9A96E', 
                    color: 'white', 
                    padding: '1.2rem 2rem', 
                    border: 'none', 
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    fontWeight: '400',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(201, 169, 110, 0.3)',
                    fontFamily: "'Playfair Display', 'Georgia', serif"
                  }}
                >
                  Send Our RSVP ✨
                </button>
              </form>
              
              <div style={{
                textAlign: 'center',
                marginTop: '2.5rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(201, 169, 110, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 169, 110, 0.2)'
              }}>
                <p style={{
                  color: '#8B7355',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Please RSVP by <strong>September 30th, 2025</strong><br/>
                  We can't wait to celebrate with you! 🍾
                </p>
              </div>
            </div>
          </div>
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