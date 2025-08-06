import React, { useState, useCallback } from 'react';
import { 
  generateGuestInvitations, 
  downloadGuestListCSV, 
  type GuestInfo, 
  type GuestToken 
} from '../utils/guestTokenGenerator';

interface GuestInvitationManagerProps {
  baseUrl?: string;
}

export const GuestInvitationManager: React.FC<GuestInvitationManagerProps> = ({ 
  baseUrl = 'https://yourweddingwebsite.com' 
}) => {
  const [guestList, setGuestList] = useState<GuestInfo[]>([
    { name: '', phone: '', email: '', allowsPlusOne: false }
  ]);
  const [generatedTokens, setGeneratedTokens] = useState<GuestToken[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addGuest = useCallback(() => {
    setGuestList(prev => [...prev, { name: '', phone: '', email: '', allowsPlusOne: false }]);
  }, []);

  const removeGuest = useCallback((index: number) => {
    setGuestList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateGuest = useCallback((index: number, field: keyof GuestInfo, value: any) => {
    setGuestList(prev => prev.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    ));
  }, []);

  const generateInvitations = useCallback(() => {
    const validGuests = guestList.filter(guest => guest.name.trim() !== '');
    const tokens = generateGuestInvitations(validGuests, baseUrl);
    setGeneratedTokens(tokens);
    setShowResults(true);
  }, [guestList, baseUrl]);

  const downloadCSV = useCallback(() => {
    if (generatedTokens.length > 0) {
      downloadGuestListCSV(generatedTokens);
    }
  }, [generatedTokens]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }, []);

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        color: '#C9A96E',
        fontSize: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Wedding Guest Invitation Manager
      </h2>

      {!showResults ? (
        <div>
          <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>Add Your Guests</h3>
          
          {guestList.map((guest, index) => (
            <div key={index} style={{
              border: '1px solid #E5D5B7',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#FEFCF7'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355' }}>
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    value={guest.name}
                    onChange={(e) => updateGuest(index, 'name', e.target.value)}
                    placeholder="John Smith"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5D5B7',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guest.phone || ''}
                    onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                    placeholder="0821234567"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5D5B7',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '1rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355' }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={guest.email || ''}
                    onChange={(e) => updateGuest(index, 'email', e.target.value)}
                    placeholder="john@example.com"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5D5B7',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={`plusOne-${index}`}
                    checked={guest.allowsPlusOne || false}
                    onChange={(e) => updateGuest(index, 'allowsPlusOne', e.target.checked)}
                    style={{ accentColor: '#C9A96E' }}
                  />
                  <label htmlFor={`plusOne-${index}`} style={{ color: '#8B7355', fontSize: '0.9rem' }}>
                    Plus One
                  </label>
                </div>

                <button
                  onClick={() => removeGuest(index)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#F44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={addGuest}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#C9A96E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              + Add Guest
            </button>

            <button
              onClick={generateInvitations}
              disabled={guestList.filter(g => g.name.trim()).length === 0}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#8B7355',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                opacity: guestList.filter(g => g.name.trim()).length === 0 ? 0.5 : 1
              }}
            >
              Generate Invitations ✨
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: '#8B7355', margin: 0 }}>
              Generated Invitations ({generatedTokens.length})
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowResults(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ← Back to Edit
              </button>
              <button
                onClick={downloadCSV}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📥 Download CSV
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {generatedTokens.map((guest, index) => (
              <div key={index} style={{
                border: '1px solid #E5D5B7',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#FEFCF7'
              }}>
                <h4 style={{ color: '#C9A96E', margin: '0 0 1rem 0' }}>
                  {guest.name}
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#8B7355' }}>Token:</strong>
                  <code style={{
                    backgroundColor: '#f0f0f0',
                    padding: '0.25rem 0.5rem',
                    marginLeft: '0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {guest.token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(guest.token)}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      backgroundColor: '#C9A96E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#8B7355' }}>RSVP Link:</strong>
                  <div style={{
                    backgroundColor: '#f9f9f9',
                    padding: '0.5rem',
                    marginTop: '0.25rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    wordBreak: 'break-all'
                  }}>
                    {guest.rsvpLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(guest.rsvpLink)}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      backgroundColor: '#C9A96E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy Link
                  </button>
                </div>

                {guest.whatsappLink && (
                  <div>
                    <strong style={{ color: '#8B7355' }}>WhatsApp:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a
                        href={guest.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#25D366',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        💬 Send WhatsApp Invitation
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(201, 169, 110, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(201, 169, 110, 0.2)'
      }}>
        <h4 style={{ color: '#C9A96E', marginTop: 0 }}>Instructions:</h4>
        <ol style={{ color: '#8B7355', lineHeight: '1.6' }}>
          <li>Add all your wedding guests with their phone numbers</li>
          <li>Click "Generate Invitations" to create unique RSVP links</li>
          <li>Send WhatsApp invitations directly or copy the links</li>
          <li>Download the CSV file to keep track of all guest tokens</li>
          <li>Guests use their unique links to RSVP and select meals</li>
        </ol>
        
        <p style={{ color: '#8B7355', fontStyle: 'italic', marginBottom: 0 }}>
          <strong>Note:</strong> Make sure to update the base URL in your environment variables 
          before generating invitations for production use.
        </p>
      </div>
    </div>
  );
};