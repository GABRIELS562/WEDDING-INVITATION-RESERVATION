import React, { useState, useEffect } from 'react';
import { useRSVPForm } from '../hooks/useRSVPForm';
import type { IndividualGuest } from '../types';
import { getGuestNameFromToken } from '../utils/guestMapping';
import { linkNameToGuest } from '../data/guestDatabase';

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

  // Load existing RSVP if token is provided and auto-populate name
  useEffect(() => {
    console.log('RSVPFormComponent useEffect triggered', {
      guestToken,
      isInitialized,
      currentGuestName: formData.guestName
    });
    
    if (guestToken && !isInitialized) {
      console.log('Processing guest token:', guestToken);
      
      // Auto-populate guest name from token
      const guestName = getGuestNameFromToken(guestToken);
      console.log('Guest name from token:', guestName);
      
      if (guestName) {
        console.log('Setting guest name:', guestName);
        updateField('guestName', guestName);
      }
      
      loadExistingRSVP(guestToken).then(() => {
        console.log('Finished loading existing RSVP');
        setIsInitialized(true);
        
        // Double-check name setting after load
        if (!formData.guestName && guestName) {
          console.log('Setting guest name after RSVP load:', guestName);
          updateField('guestName', guestName);
        }
      });
    } else if (!guestToken) {
      console.log('No guest token, setting initialized');
      setIsInitialized(true);
    }
  }, [guestToken, isInitialized]);

  // Debug button state
  useEffect(() => {
    console.log('🔍 BUTTON DEBUG:', {
      canSubmit,
      guestName: formData.guestName,
      isAttending: formData.isAttending,
      isSubmitting: submissionState.isSubmitting,
      hasBasicRequirements: formData.guestName.trim() !== '' && formData.isAttending !== null
    });
  }, [canSubmit, formData.guestName, formData.isAttending, submissionState.isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();
    console.log('🚀 RSVP Submit started');
    console.log('Form data at submission:', formData);
    console.log('Guest token at submission:', guestToken);
    
    // Simple validation
    if (!formData.guestName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (formData.isAttending === null) {
      alert('Please select whether you will be attending');
      return;
    }
    
    if (formData.isAttending && !formData.mealChoice) {
      alert('Please select your meal choice');
      return;
    }
    
    if (!guestToken) {
      alert('Guest token is required. Please use the link from your invitation.');
      return;
    }

    // Link the entered name to guest record for tracking
    const nameLink = linkNameToGuest(formData.guestName, guestToken);

    const defaultGuestInfo: IndividualGuest = {
      id: guestToken,
      firstName: nameLink.primaryName.split(' ')[0] || '',
      lastName: nameLink.primaryName.split(' ').slice(1).join(' ') || '',
      fullName: nameLink.primaryName,
      email: formData.email || '',
      token: guestToken,
      hasUsedToken: false,
      plusOneEligible: true,
      plusOneName: formData.plusOneName || undefined,
      plusOneEmail: undefined,
      dietaryRestrictions: formData.dietaryRestrictions ? [formData.dietaryRestrictions] : undefined,
      specialNotes: formData.specialRequests || undefined,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    try {
      console.log('📤 Starting actual RSVP submission...');
      const success = await submitRSVP(guestToken, guestInfo || defaultGuestInfo);
      
      if (success) {
        console.log('🎉 RSVP submitted successfully!');
        alert('🎉 RSVP submitted successfully! Thank you for confirming your attendance.');
      } else {
        console.error('❌ RSVP submission failed');
        alert('❌ Failed to submit RSVP. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('❌ RSVP submission error:', error);
      alert('❌ Error submitting RSVP: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loadingState.isLoadingExisting) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#8B7355' }}>
          Loading your RSVP information...
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
              ✅ RSVP {hasExistingSubmission ? 'Updated' : 'Submitted'} Successfully!
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
              placeholder="0722108714 (for contact if email not provided)"
            />
            <div style={{ fontSize: '0.9rem', color: '#8B7355', marginTop: '0.5rem', fontStyle: 'italic' }}>
              South African format: 0722108714 (we'll add +27 automatically)
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
              <option value="">👆 Tap to select your attendance</option>
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
                    { value: 'steak', label: 'Steak', desc: 'Premium steak prepared to your preference (details to be confirmed)' }
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
          
          {/* Submit Button - Simple Direct Approach */}
          <div
            onClick={() => {
              console.log('🚀 Direct click handler triggered');
              console.log('Form data:', formData);
              if (!guestToken) {
                alert('No guest token found!');
                return;
              }
              handleSubmit(new Event('submit') as any);
            }}
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
              fontFamily: "'Playfair Display', 'Georgia', serif",
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            {submissionState.isSubmitting ? (
              <>⏳ {hasExistingSubmission ? 'Updating' : 'Submitting'} RSVP...</>
            ) : emailState.isSendingEmail ? (
              <>📧 Sending confirmation email...</>
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