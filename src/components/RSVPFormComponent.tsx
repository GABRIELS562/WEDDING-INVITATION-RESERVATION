import React, { useState, useEffect } from 'react';
import { useRSVPForm } from '../hooks/useRSVPForm';
import type { IndividualGuest } from '../types';
import { getGuestNameFromToken, isValidToken } from '../utils/guestTokens';
import { supabaseService } from '../services/supabaseService';

interface RSVPFormComponentProps {
  guestToken?: string;
  guestInfo?: IndividualGuest;
}

export const RSVPFormComponent: React.FC<RSVPFormComponentProps> = ({ 
  guestToken, 
  guestInfo 
}) => {
  const {
    formData,
    updateField,
    errors,
    submissionState,
    emailState,
    loadingState,
    submitRSVP,
    loadExistingRSVP,
    hasExistingSubmission,
    canSubmit
  } = useRSVPForm();

  const [isInitialized, setIsInitialized] = useState(false);
  const [dbGuestInfo, setDbGuestInfo] = useState<any>(null);

  // Load guest info and existing RSVP if token is provided
  useEffect(() => {
    const loadGuestData = async () => {
      if (guestToken && !isInitialized) {
        console.log('🔄 Loading guest data for token:', guestToken);
        
        // First, try to get guest info from database
        const { data: guestData, error: guestError } = await supabaseService.getGuestInfo(guestToken);
        
        if (!guestError && guestData) {
          console.log('👤 Found guest in database:', guestData);
          setDbGuestInfo(guestData);
          
          // Pre-populate name and phone from database
          updateField('guestName', guestData.guest_name || '');
          if (guestData.phone) {
            updateField('whatsappNumber', guestData.phone);
          }
        } else {
          // Fallback to token-based name extraction
          const guestName = getGuestNameFromToken(guestToken);
          if (guestName) {
            updateField('guestName', guestName);
          }
        }
        
        // Then load existing RSVP
        await loadExistingRSVP(guestToken);
        setIsInitialized(true);
      } else if (!guestToken) {
        setIsInitialized(true);
      }
    };
    
    loadGuestData();
  }, [guestToken, isInitialized]);

  // Form state validation

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();
    
    // Allow submissions without guest token for public access
    const actualToken = guestToken || 'public-' + Date.now();
    
    const defaultGuestInfo: IndividualGuest = {
      id: actualToken,
      firstName: formData.guestName.split(' ')[0] || '',
      lastName: formData.guestName.split(' ').slice(1).join(' ') || '',
      fullName: formData.guestName,
      email: formData.email || '',
      token: actualToken,
      hasUsedToken: false,
      plusOneEligible: false,
      dietaryRestrictions: formData.dietaryRestrictions ? [formData.dietaryRestrictions] : undefined,
      specialNotes: formData.specialRequests || undefined,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    // Use the proper submitRSVP function from the hook
    await submitRSVP(actualToken, guestInfo || defaultGuestInfo);
  };

  if (loadingState.isLoadingExisting) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ 
          fontSize: '1.2rem', 
          color: '#8B7355',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #C9A96E',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div>Preparing your RSVP form...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
      <style>{`
        .force-enabled {
          pointer-events: auto !important;
          cursor: pointer !important;
          opacity: 1 !important;
          background-color: #C9A96E !important;
        }
      `}</style>
      <div style={{
        backgroundColor: 'rgba(248, 246, 240, 0.8)',
        padding: window.innerWidth <= 768 ? '2.5rem 1.5rem' : '4rem 3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15)',
        border: '1px solid rgba(201, 169, 110, 0.2)'
      }}>
        {/* Already Submitted Message */}
        {hasExistingSubmission && !submissionState.isSubmitSuccess && guestToken && (
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '2px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.3rem', color: '#FF8F00', marginBottom: '0.5rem' }}>
              ✅ RSVP Already Submitted
            </div>
            <div style={{ fontSize: '1rem', color: '#8B7355' }}>
              Thank you! Your RSVP has been received. You can view your current response below, but you cannot submit again.
            </div>
          </div>
        )}

        {/* Success Message */}
        {submissionState.isSubmitSuccess && (
          <div style={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.3rem', color: '#4CAF50', marginBottom: '0.5rem' }}>
              ✅ RSVP Submitted Successfully!
            </div>
            {emailState.isEmailSent && (
              <div style={{ fontSize: '1rem', color: '#8B7355' }}>
                📧 Confirmation email sent to {formData.email}
              </div>
            )}
            {emailState.isEmailError && (
              <div style={{ fontSize: '0.9rem', color: '#F44336', marginTop: '0.5rem' }}>
                ⚠️ RSVP saved but email failed to send: {emailState.emailError}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {submissionState.isSubmitError && (
          <div style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.1rem', color: '#F44336' }}>
              ❌ Error: {submissionState.submitError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Guest Name */}
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
              value={formData.guestName}
              onChange={(e) => updateField('guestName', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1.2rem', 
                border: `2px solid ${errors.guestName ? '#F44336' : '#E5D5B7'}`, 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Enter your full name"
            />
            {errors.guestName && (
              <div style={{ color: '#F44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {errors.guestName}
              </div>
            )}
          </div>
          
          {/* Email Address */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.8rem', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Email Address</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1.2rem', 
                border: `2px solid ${errors.email ? '#F44336' : '#E5D5B7'}`, 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="your.email@example.com (optional - if not provided, we'll contact you via WhatsApp)"
            />
            {errors.email && (
              <div style={{ color: '#F44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {errors.email}
              </div>
            )}
          </div>
          
          {/* WhatsApp Number */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.8rem', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>WhatsApp Number</label>
            <input 
              type="tel"
              value={formData.whatsappNumber || ''}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
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
              placeholder="Your WhatsApp number (optional)"
            />
            <div style={{ fontSize: '0.9rem', color: '#8B7355', marginTop: '0.5rem', fontStyle: 'italic' }}>
              We'll contact you here if needed (we'll add +27 for SA numbers automatically)
            </div>
          </div>
          
          {/* Attendance */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.8rem', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Will you be joining us? *</label>
            <select 
              value={formData.isAttending === null ? '' : formData.isAttending ? 'yes' : 'no'}
              onChange={(e) => updateField('isAttending', e.target.value ? e.target.value === 'yes' : null)}
              style={{ 
                width: '100%', 
                padding: '1.2rem 3rem 1.2rem 1.5rem', 
                border: `2px solid ${errors.attendance ? '#F44336' : '#E5D5B7'}`, 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '500',
                fontFamily: "'Inter', sans-serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C9A96E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '18px',
                lineHeight: '1.4',
                minHeight: '56px',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="">Select your attendance</option>
              <option value="yes">✅ YES - I'll be there!</option>
              <option value="no">❌ NO - Sorry, can't make it</option>
            </select>
            {errors.attendance && (
              <div style={{ color: '#F44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {errors.attendance}
              </div>
            )}
          </div>

          {/* Meal Selection - Only show if attending */}
          {formData.isAttending && (
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
                border: `2px solid ${errors.mealChoice ? '#F44336' : '#E5D5B7'}`,
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
                  {[
                    { value: 'fish', label: 'Market Fish', desc: 'Line fish (may vary depending on seasonality) - Confit potato, Sauce Vierge, wild Rocket, Kalamata olives' },
                    { value: 'prawns', label: 'Mozambican Style Prawns', desc: 'Homemade Peri-Peri or Garlic Lemon butter, citrus basmati rice' },
                    { value: 'lamb', label: 'Tasting of Karoo Lamb', desc: 'Roasted Cauliflower Pomme, Minted Peas, Thyme tossed Patty Pans, Tomato compote' },
                    { value: 'steak', label: 'Sirloin or Rump Steak', desc: 'Served with onion rings, fries and a sauce' }
                  ].map((meal) => (
                    <label key={meal.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      cursor: 'pointer',
                      padding: '0.8rem',
                      backgroundColor: formData.mealChoice === meal.value ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 169, 110, 0.2)'
                    }}>
                      <input 
                        type="radio" 
                        name="mealChoice" 
                        value={meal.value}
                        checked={formData.mealChoice === meal.value}
                        onChange={(e) => updateField('mealChoice', e.target.value)}
                        style={{ accentColor: '#C9A96E' }} 
                      />
                      <div>
                        <strong style={{ color: '#8B7355' }}>{meal.label}</strong>
                        <br />
                        <span style={{ color: '#8B7355', fontSize: '0.95rem', fontStyle: 'italic' }}>
                          {meal.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {errors.mealChoice && (
                <div style={{ color: '#F44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {errors.mealChoice}
                </div>
              )}
            </div>
          )}


          {/* Dietary Restrictions */}
          {formData.isAttending && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.8rem', 
                color: '#8B7355',
                fontSize: '1.1rem',
                fontWeight: '400',
                letterSpacing: '0.5px'
              }}>Dietary Restrictions</label>
              <input 
                type="text"
                value={formData.dietaryRestrictions}
                onChange={(e) => updateField('dietaryRestrictions', e.target.value)}
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
                placeholder="Any allergies or dietary requirements?"
              />
            </div>
          )}
          
          {/* Special Requests */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.8rem', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Special Message & Requests</label>
            <textarea 
              value={formData.specialRequests}
              onChange={(e) => updateField('specialRequests', e.target.value)}
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
                resize: 'none',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Share your excitement, song requests, or any special messages for the happy couple..."
            />
          </div>

          {/* Email Confirmation Option */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <input
                type="checkbox"
                id="emailConfirmation"
                checked={formData.wantsEmailConfirmation}
                onChange={(e) => updateField('wantsEmailConfirmation', e.target.checked)}
                style={{ accentColor: '#C9A96E' }}
              />
              <label htmlFor="emailConfirmation" style={{
                color: '#8B7355',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                📧 Send me an email confirmation
              </label>
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#8B7355', 
              marginTop: '0.5rem', 
              fontStyle: 'italic',
              marginLeft: '2rem'
            }}>
              If you don't provide an email or uncheck this, we'll send your confirmation via WhatsApp
            </div>
          </div>
          
          {/* Submit Button - With Proper Validation */}
          <div
            onClick={async () => {
              // Form submission handler
              console.log('🎯 Submit button clicked!');
              console.log('📊 Form state:', {
                guestName: formData.guestName,
                isAttending: formData.isAttending,
                canSubmit,
                hasBasicRequirements: formData.guestName.trim() !== '' && formData.isAttending !== null,
                isSubmitting: submissionState.isSubmitting,
                isLoading: loadingState.isLoading
              });
              
              // Prevent resubmission for authenticated guests (DISABLED FOR TESTING)
              if (hasExistingSubmission && guestToken && guestToken !== 'jamie-test-abc12345') {
                console.log('❌ Cannot submit - RSVP already exists for this guest');
                return;
              }

              if (!canSubmit) {
                console.log('❌ Cannot submit - validation failed');
                return;
              }
              
              console.log('✅ Validation passed, starting submission...');
              
              // Make the function async to properly handle submission
              
              // Allow submissions without guest token for public access
              if (!guestToken) {
                // Public submission without guest token
                console.log('🔓 Public submission (no guest token)');
                const publicToken = `${formData.guestName.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const publicGuestInfo: IndividualGuest = {
                  id: publicToken,
                  firstName: formData.guestName.split(' ')[0] || 'Guest',
                  lastName: formData.guestName.split(' ').slice(1).join(' ') || 'User',
                  fullName: formData.guestName,
                  email: formData.email || '',
                  token: publicToken,
                  hasUsedToken: false,
                  plusOneEligible: false,
                  dietaryRestrictions: [],
                  createdAt: new Date()
                };
                console.log('📤 Submitting with public token:', publicToken);
                await submitRSVP(publicToken, publicGuestInfo);
              } else {
                console.log('🔐 Authenticated submission with guest token:', guestToken);
                const defaultGuestInfo: IndividualGuest = {
                  id: guestToken,
                  firstName: formData.guestName.split(' ')[0] || '',
                  lastName: formData.guestName.split(' ').slice(1).join(' ') || '',
                  fullName: formData.guestName,
                  email: formData.email || '',
                  token: guestToken,
                  hasUsedToken: false,
                  plusOneEligible: false,
                  dietaryRestrictions: formData.dietaryRestrictions ? [formData.dietaryRestrictions] : undefined,
                  specialNotes: formData.specialRequests || undefined,
                  createdAt: new Date(),
                  lastAccessed: new Date()
                };
                console.log('📤 Submitting with guest info:', defaultGuestInfo);
                await submitRSVP(guestToken, guestInfo || defaultGuestInfo);
              }
            }}
            style={{ 
              width: '100%', 
              backgroundColor: (canSubmit && !(hasExistingSubmission && guestToken)) ? '#C9A96E' : '#A0A0A0', 
              color: 'white', 
              padding: '1.2rem 2rem', 
              border: 'none', 
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '400',
              letterSpacing: '1px',
              cursor: (canSubmit && !(hasExistingSubmission && guestToken)) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: (canSubmit && !(hasExistingSubmission && guestToken)) ? '0 8px 25px rgba(201, 169, 110, 0.3)' : '0 4px 15px rgba(160, 160, 160, 0.2)',
              fontFamily: "'Playfair Display', 'Georgia', serif",
              textAlign: 'center',
              userSelect: 'none',
              opacity: (canSubmit && !(hasExistingSubmission && guestToken)) ? 1 : 0.6
            }}
          >
            {submissionState.isSubmitting ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                {hasExistingSubmission ? 'Updating' : 'Submitting'} RSVP...
              </div>
            ) : emailState.isSendingEmail && !submissionState.isSubmitSuccess ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                📧 Sending confirmation email...
              </div>
            ) : hasExistingSubmission && guestToken ? (
              <>RSVP Already Submitted</>
            ) : (
              <>Send Our RSVP ✨</>
            )}
          </div>
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
  );
};