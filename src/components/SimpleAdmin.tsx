import React from 'react';

export const SimpleAdmin: React.FC = () => {
  return (
    <div style={{
      maxWidth: '800px',
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
        🎉 Wedding Admin Panel
      </h2>

      <div style={{
        backgroundColor: 'rgba(201, 169, 110, 0.1)',
        border: '2px solid rgba(201, 169, 110, 0.3)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
        <h3 style={{ color: '#C9A96E', marginBottom: '1rem' }}>
          Admin Panel Coming Soon!
        </h3>
        <p style={{ color: '#8B7355', fontSize: '1.1rem', lineHeight: '1.6' }}>
          The full admin functionality will be available once you set up your:
        </p>
        <ul style={{ 
          color: '#8B7355', 
          textAlign: 'left', 
          maxWidth: '400px', 
          margin: '1rem auto',
          fontSize: '1rem'
        }}>
          <li>Google Sheets API credentials</li>
          <li>EmailJS service configuration</li>
          <li>Environment variables in .env file</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          border: '1px solid #E5D5B7',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#FEFCF7'
        }}>
          <h4 style={{ color: '#C9A96E', marginBottom: '1rem' }}>📝 RSVP Management</h4>
          <p style={{ color: '#8B7355', fontSize: '0.9rem', marginBottom: '1rem' }}>
            View and manage all guest RSVPs, meal selections, and special requests.
          </p>
          <button disabled style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'not-allowed'
          }}>
            Coming Soon
          </button>
        </div>

        <div style={{
          border: '1px solid #E5D5B7',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#FEFCF7'
        }}>
          <h4 style={{ color: '#C9A96E', marginBottom: '1rem' }}>👥 Guest Invitations</h4>
          <p style={{ color: '#8B7355', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Generate unique RSVP links and WhatsApp invitations for your guests.
          </p>
          <button disabled style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'not-allowed'
          }}>
            Coming Soon
          </button>
        </div>

        <div style={{
          border: '1px solid #E5D5B7',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#FEFCF7'
        }}>
          <h4 style={{ color: '#C9A96E', marginBottom: '1rem' }}>📊 Statistics</h4>
          <p style={{ color: '#8B7355', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Track attendance numbers, meal choices, and response rates.
          </p>
          <button disabled style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'not-allowed'
          }}>
            Coming Soon
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        border: '2px solid rgba(76, 175, 80, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#4CAF50', marginBottom: '1rem', marginTop: 0 }}>
          ✅ What's Working Now:
        </h4>
        <ul style={{ 
          color: '#8B7355', 
          margin: 0,
          paddingLeft: '1.5rem'
        }}>
          <li>Beautiful wedding website with ceremony/celebration sections</li>
          <li>Functional RSVP form (demo mode - logs to console)</li>
          <li>Guest token system for personalized links</li>
          <li>Mobile-responsive design</li>
          <li>Professional styling and layout</li>
        </ul>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'rgba(201, 169, 110, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(201, 169, 110, 0.2)'
      }}>
        <h4 style={{ color: '#C9A96E', marginTop: 0 }}>Next Steps:</h4>
        <ol style={{ 
          color: '#8B7355', 
          textAlign: 'left',
          maxWidth: '500px',
          margin: '1rem auto'
        }}>
          <li>Set up your Google Sheets API (follow RSVP_SETUP_GUIDE.md)</li>
          <li>Configure EmailJS for email confirmations</li>
          <li>Update your .env file with credentials</li>
          <li>Test the full RSVP workflow</li>
          <li>Generate guest invitations</li>
          <li>Send WhatsApp invitations to your guests!</li>
        </ol>
        
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#C9A96E',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              marginRight: '1rem'
            }}
          >
            ← Back to Website
          </a>
          
          <a 
            href="/guest/DEMO123"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8B7355',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}
          >
            Test RSVP Form
          </a>
        </div>
      </div>
    </div>
  );
};