import React, { useState, useEffect } from 'react';
import { useRSVPForm } from '../hooks/useRSVPForm';
import type { IndividualGuest } from '../types';

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

  // Load existing RSVP if token is provided
  useEffect(() => {
    if (guestToken && !isInitialized) {
      loadExistingRSVP(guestToken).then(() => {
        setIsInitialized(true);
      });
    } else if (!guestToken) {
      setIsInitialized(true);
    }
  }, [guestToken, loadExistingRSVP, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestToken) {
      alert('Guest token is required. Please use the link from your invitation.');
      return;
    }

    const defaultGuestInfo: IndividualGuest = {
      id: guestToken,
      firstName: formData.guestName.split(' ')[0] || '',
      lastName: formData.guestName.split(' ').slice(1).join(' ') || '',
      fullName: formData.guestName,
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

    const success = await submitRSVP(guestToken, guestInfo || defaultGuestInfo);
    
    if (success) {
      // Success is handled by the hook
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
            }}>Email Address *</label>
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
              placeholder="your.email@example.com"
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
              placeholder="+27722108714 (your test number for WhatsApp confirmations)"
            />
            <div style={{ fontSize: '0.9rem', color: '#8B7355', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Include country code (e.g., +27 for South Africa)
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
                padding: '1rem 1.2rem', 
                border: `2px solid ${errors.attendance ? '#F44336' : '#E5D5B7'}`, 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                cursor: 'pointer'
              }}
            >
              <option value="">Please select...</option>
              <option value="yes">✨ Yes, I'll be there with bells on!</option>
              <option value="no">💔 Unfortunately, I can't make it</option>
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
                    { value: 'beef', label: '🥩 Beef Tenderloin', desc: 'Grilled beef tenderloin with roasted vegetables and red wine jus' },
                    { value: 'chicken', label: '🐔 Free-Range Chicken', desc: 'Herb-crusted chicken breast with seasonal vegetables and lemon butter sauce' },
                    { value: 'fish', label: '🐟 Line Fish', desc: 'Fresh Cape line fish with Mediterranean vegetables and white wine reduction' },
                    { value: 'vegetarian', label: '🥕 Vegetarian Delight', desc: 'Roasted vegetable tart with goat\'s cheese and herb salad' },
                    { value: 'vegan', label: '🌱 Vegan Option', desc: 'Plant-based protein with quinoa, roasted vegetables, and tahini dressing' }
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
                resize: 'vertical'
              }}
              placeholder="Share your excitement, song requests, or any special messages for the happy couple..."
            />
          </div>

          {/* Confirmation Options */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.8rem', 
              color: '#8B7355',
              fontSize: '1.1rem',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>Confirmation Preferences</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <input
                  type="checkbox"
                  id="whatsappConfirmation"
                  checked={formData.wantsWhatsAppConfirmation || false}
                  onChange={(e) => updateField('wantsWhatsAppConfirmation', e.target.checked)}
                  style={{ accentColor: '#C9A96E' }}
                />
                <label htmlFor="whatsappConfirmation" style={{
                  color: '#8B7355',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                  📱 Send me a WhatsApp confirmation
                </label>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!canSubmit}
            style={{ 
              width: '100%', 
              backgroundColor: canSubmit ? '#C9A96E' : '#ccc', 
              color: 'white', 
              padding: '1.2rem 2rem', 
              border: 'none', 
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '400',
              letterSpacing: '1px',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: canSubmit ? '0 8px 25px rgba(201, 169, 110, 0.3)' : 'none',
              fontFamily: "'Playfair Display', 'Georgia', serif"
            }}
          >
            {submissionState.isSubmitting ? (
              <>⏳ {hasExistingSubmission ? 'Updating' : 'Submitting'} RSVP...</>
            ) : emailState.isSendingEmail ? (
              <>📧 Sending confirmation email...</>
            ) : (
              <>Send Our RSVP ✨</>
            )}
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
  );
};