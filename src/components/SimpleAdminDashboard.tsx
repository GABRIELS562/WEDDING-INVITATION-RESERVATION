import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { individualGuests } from '../data/individualGuests';

interface RSVP {
  id: string;
  guest_name: string;
  attending: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_address?: string;
  whatsapp_number?: string;
  special_requests?: string;
  created_at: string;
}

const SimpleAdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWhatsAppLinks, setShowWhatsAppLinks] = useState(false);
  const [showAllGuests, setShowAllGuests] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    meals: {
      fish: 0,
      lamb: 0,
      chicken: 0,
      prawns: 0,
      vegetarian: 0
    }
  });

  const handleLogin = () => {
    if (password === 'dalekirsten2025') {
      setIsAuthenticated(true);
      loadRSVPs();
    } else {
      alert('Incorrect password');
    }
  };

  const loadRSVPs = async () => {
    setLoading(true);
    try {
      // This is a simplified version - in a real app you'd have proper admin endpoints
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rsvps?select=*`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRsvps(data);
        
        // Calculate stats
        const total = data.length;
        const attending = data.filter((rsvp: RSVP) => rsvp.attending).length;
        const notAttending = total - attending;
        
        const meals = {
          fish: data.filter((rsvp: RSVP) => rsvp.meal_choice === 'fish').length,
          lamb: data.filter((rsvp: RSVP) => rsvp.meal_choice === 'lamb').length,
          chicken: data.filter((rsvp: RSVP) => rsvp.meal_choice === 'chicken').length,
          prawns: data.filter((rsvp: RSVP) => rsvp.meal_choice === 'prawns').length,
          vegetarian: data.filter((rsvp: RSVP) => rsvp.meal_choice === 'vegetarian').length,
        };
        
        setStats({ total, attending, notAttending, meals });
      }
    } catch (error) {
      console.error('Error loading RSVPs:', error);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f6f0'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: '#8B7355',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem'
          }}>
            Wedding Admin 💍
          </h1>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#8B7355',
              fontWeight: 'bold'
            }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #E5D5B7',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: "'Playfair Display', serif"
              }}
              placeholder="Enter admin password"
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#C9A96E',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f6f0',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            color: '#8B7355',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem'
          }}>
            Dale & Kirsten's Wedding Admin 💍
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => loadRSVPs()}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#C9A96E',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={() => setShowWhatsAppLinks(!showWhatsAppLinks)}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              💬 WhatsApp Links
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>Total RSVPs</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A96E' }}>
              {stats.total}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>Attending</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.attending}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>Not Attending</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#F44336' }}>
              {stats.notAttending}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>Attendance Rate</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A96E' }}>
              {stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Meal Breakdown */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ color: '#8B7355', marginBottom: '1.5rem' }}>Meal Preferences</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(stats.meals).map(([meal, count]) => (
              <div key={meal} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold', 
                  color: '#C9A96E',
                  marginBottom: '0.5rem'
                }}>
                  {count}
                </div>
                <div style={{ 
                  color: '#8B7355', 
                  textTransform: 'capitalize',
                  fontSize: '0.9rem'
                }}>
                  {meal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Links Section */}
        {showWhatsAppLinks && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
            marginBottom: '3rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#8B7355', margin: 0 }}>WhatsApp Guest Links 💬</h2>
              <div style={{ fontSize: '1rem', color: '#666' }}>
                Total Guests: {individualGuests.length} | Showing: {showAllGuests ? individualGuests.length : Math.min(10, individualGuests.length)}
              </div>
            </div>
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {/* Actual Wedding Guest Links */}
              {(showAllGuests ? individualGuests : individualGuests.slice(0, 10)).map((guest, index) => {
                const guestLink = `${window.location.origin}?token=${guest.token}`;
                const whatsappMessage = `Hi ${guest.fullName}! 💍 Dale & Kirsten are getting married and would love for you to be there! Please RSVP here: ${guestLink}`;
                const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
                
                return (
                  <div key={index} style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8f6f0',
                    borderRadius: '10px',
                    border: '1px solid #E5D5B7'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: '#8B7355',
                          marginBottom: '0.5rem'
                        }}>
                          {guest.fullName}
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: '#666',
                          wordBreak: 'break-all'
                        }}>
                          {guestLink}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(guestLink);
                            alert(`Link copied for ${guest.fullName}!`);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#C9A96E',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          📋 Copy Link
                        </button>
                        <button
                          onClick={() => window.open(whatsappLink, '_blank')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#25D366',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          💬 WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Show All/Show Less Button */}
            {individualGuests.length > 10 && (
              <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                <button
                  onClick={() => setShowAllGuests(!showAllGuests)}
                  style={{
                    padding: '0.8rem 2rem',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {showAllGuests ? `📄 Show Less (${individualGuests.length - 10} hidden)` : `📋 Show All ${individualGuests.length} Guests`}
                </button>
              </div>
            )}
            
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#1976d2'
            }}>
              <strong>💡 How to use:</strong><br/>
              1. Click "Copy Link" to copy the personalized RSVP link<br/>
              2. Click "WhatsApp" to open WhatsApp with pre-filled message<br/>
              3. Send the message to your guest<br/>
              4. Each guest can only submit their RSVP once
            </div>
          </div>
        )}

        {/* RSVP List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(139, 115, 85, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '2rem',
            borderBottom: '1px solid #E5D5B7'
          }}>
            <h2 style={{ color: '#8B7355', margin: 0 }}>
              All RSVPs ({rsvps.length})
            </h2>
          </div>
          
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#8B7355' }}>
                Loading RSVPs...
              </div>
            ) : rsvps.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#8B7355' }}>
                No RSVPs yet
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8f6f0' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8B7355' }}>Guest</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8B7355' }}>Attending</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8B7355' }}>Meal</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8B7355' }}>Email/Phone</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8B7355' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp, index) => (
                    <tr key={rsvp.id} style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 'bold', color: '#8B7355' }}>
                          {rsvp.guest_name}
                        </div>
                        {rsvp.special_requests && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                            {rsvp.special_requests}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: rsvp.attending ? '#4CAF50' : '#F44336',
                          fontWeight: 'bold'
                        }}>
                          {rsvp.attending ? '✅ Yes' : '❌ No'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                        {rsvp.meal_choice || '-'}
                        {rsvp.dietary_restrictions && (
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {rsvp.dietary_restrictions}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                        {rsvp.email_address && (
                          <div>{rsvp.email_address}</div>
                        )}
                        {rsvp.whatsapp_number && (
                          <div>{rsvp.whatsapp_number}</div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        {rsvp.created_at ? new Date(rsvp.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No date'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;