import React, { useState } from 'react';

interface SimpleRSVPFormProps {
  guestToken?: string;
}

export const SimpleRSVPForm: React.FC<SimpleRSVPFormProps> = ({ guestToken }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    isAttending: null as boolean | null,
    mealChoice: '',
    dietaryRestrictions: '',
    specialRequests: '',
    wantsEmailConfirmation: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Simulate form submission
    try {
      // Basic validation
      if (!formData.guestName.trim()) {
        throw new Error('Guest name is required');
      }
      
      if (formData.isAttending === null) {
        throw new Error('Please select whether you will be attending');
      }
      
      if (formData.isAttending && !formData.mealChoice) {
        throw new Error('Meal selection is required for attending guests');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just log the data (replace with actual API call later)
      console.log('RSVP Submission:', {
        ...formData,
        guestToken,
        submittedAt: new Date().toISOString()
      });
      
      setSubmitSuccess(true);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitSuccess) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <div style={{
          backgroundColor: 'rgba(248, 246, 240, 0.8)',
          padding: window.innerWidth <= 768 ? '2.5rem 1.5rem' : '4rem 3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <div style={{ fontSize: '1.5rem', color: '#4CAF50', marginBottom: '0.5rem' }}>
              RSVP Submitted Successfully!
            </div>
            <div style={{ fontSize: '1rem', color: '#8B7355' }}>
              Thank you {formData.guestName}! We're {formData.isAttending ? 'excited' : 'sorry'} {formData.isAttending ? 'to celebrate with you' : 'you can\'t make it'}.
            </div>
            {formData.isAttending && formData.mealChoice && (
              <div style={{ fontSize: '0.9rem', color: '#8B7355', marginTop: '1rem' }}>
                Your meal choice: <strong>{formData.mealChoice}</strong>
              </div>
            )}
          </div>
          
          <div style={{
            fontSize: '0.9rem',
            color: '#8B7355',
            fontStyle: 'italic'
          }}>
            <strong>Note:</strong> This is a demo version. To enable full functionality, please set up your Google Sheets and EmailJS credentials in the .env file.
          </div>
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
        {guestToken && (
          <div style={{
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#C9A96E' }}>
              🎫 Guest Token: <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{guestToken}</code>
            </div>
          </div>
        )}

        {submitError && (
          <div style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.1rem', color: '#F44336' }}>
              ❌ Error: {submitError}
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
                border: '2px solid #E5D5B7', 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Enter your full name"
              required
            />
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
                border: '2px solid #E5D5B7', 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="your.email@example.com"
              required
            />
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
                border: '2px solid #E5D5B7', 
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', 'Georgia', serif",
                color: '#8B7355',
                backgroundColor: '#FEFCF7',
                cursor: 'pointer'
              }}
              required
            >
              <option value="">Please select...</option>
              <option value="yes">✨ Yes, I'll be there with bells on!</option>
              <option value="no">💔 Unfortunately, I can't make it</option>
            </select>
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
              <select 
                value={formData.mealChoice}
                onChange={(e) => updateField('mealChoice', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem 1.2rem', 
                  border: '2px solid #E5D5B7', 
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  color: '#8B7355',
                  backgroundColor: '#FEFCF7',
                  cursor: 'pointer'
                }}
                required
              >
                <option value="">Select your meal...</option>
                <option value="beef">🥩 Beef Tenderloin</option>
                <option value="chicken">🐔 Free-Range Chicken</option>
                <option value="fish">🐟 Line Fish</option>
                <option value="vegetarian">🥕 Vegetarian Delight</option>
                <option value="vegan">🌱 Vegan Option</option>
              </select>
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
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              backgroundColor: isSubmitting ? '#ccc' : '#C9A96E', 
              color: 'white', 
              padding: '1.2rem 2rem', 
              border: 'none', 
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '400',
              letterSpacing: '1px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSubmitting ? 'none' : '0 8px 25px rgba(201, 169, 110, 0.3)',
              fontFamily: "'Playfair Display', 'Georgia', serif"
            }}
          >
            {isSubmitting ? '⏳ Submitting RSVP...' : 'Send Our RSVP ✨'}
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