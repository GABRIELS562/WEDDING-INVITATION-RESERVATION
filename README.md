# Wedding Invitation & Reservation System

A beautiful, modern wedding website with individual guest authentication and RSVP functionality, built exactly like WithJoy.com. Perfect for managing wedding invitations and guest reservations with a professional, elegant interface.

## ✨ Features

- 🔐 **Individual Guest Authentication** - Each guest gets a unique token/URL for secure access
- 📝 **Complete RSVP System** - Guest attendance, meal preferences, dietary restrictions, and special requests
- 🗄️ **Supabase Backend** - All RSVP data automatically stored in a secure, scalable database
- 💬 **WhatsApp Integration** - Bulk invitation campaigns with personalized messages
- 📧 **Email Confirmations** - Automatic email confirmations and updates via EmailJS
- 🎨 **Beautiful Design** - Modern, elegant design with smooth animations and transitions
- 📱 **Mobile Responsive** - Perfect experience on all devices (phone, tablet, desktop)
- 🚀 **Production Ready** - Deploy for free on Vercel/Netlify with custom domain support
- 📊 **Analytics & Reporting** - Real-time RSVP tracking, engagement metrics, and guest management
- 🛡️ **Enterprise Security** - Advanced security features, rate limiting, and fraud protection
- 💾 **Backup & Recovery** - Automated backup system with encryption and disaster recovery

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Email**: EmailJS
- **WhatsApp**: Custom campaign management system
- **Security**: Crypto-secure token generation, rate limiting, fraud protection
- **Analytics**: Real-time tracking and engagement metrics
- **Deployment**: Vercel (recommended)

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/WEDDING-INVITATION-RESERVATION.git
cd WEDDING-INVITATION-RESERVATION
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Fill in your API keys:
- Supabase URL and keys
- EmailJS credentials
- WhatsApp campaign settings

### 3. Configure Guest Tokens

Edit `src/data/guestTokens.ts` with your guest list:

```typescript
export const guestTokens: GuestToken[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    token: 'sarah-johnson-a8b9c1d2',
    maxGuests: 2,
    isUsed: false
  },
  // Add more guests...
];
```

### 4. Wedding Information

Update `src/data/weddingInfo.ts` with your wedding details:
- Bride & Groom names
- Date & time
- Venue information
- Timeline
- Registry items

### 5. Menu Items

Customize `src/data/menuItems.ts` with your menu options:
- Appetizers
- Main courses  
- Desserts
- Dietary information

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your wedding website!

## Setup Guide

### Supabase Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the provided SQL schema to create your tables
3. Get your project URL and API keys from Settings → API
4. Configure Row Level Security policies for data protection

See `RSVP_SETUP_GUIDE.md` for complete setup instructions.

### EmailJS Setup

1. Create account at [EmailJS](https://emailjs.com)
2. Create email service (Gmail, Outlook, etc.)
3. Create email templates for:
   - RSVP confirmation
   - RSVP updates
4. Get your Service ID, Template ID, and Public Key

### Guest Token Generation

Guest tokens should be:
- Unique for each guest
- URL-friendly (lowercase, hyphens)
- Secure (random string at end)

Example format: `firstname-lastname-abc123d4`

## URL Structure

- Main website: `https://yourwedding.vercel.app/`
- Individual guest: `https://yourwedding.vercel.app/sarah-johnson-a8b9c1d2`

Each guest receives their personal URL for RSVP access.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard
4. Configure custom domain (optional)

### Netlify

1. Build project: `npm run build`
2. Deploy `dist` folder to Netlify
3. Add environment variables in Netlify dashboard
4. Configure redirects for SPA routing

## Project Structure

```
src/
├── components/
│   ├── sections/          # Page sections (Hero, Details, etc.)
│   ├── forms/            # RSVP forms and components
│   ├── ui/               # Reusable UI components
│   ├── Navigation.tsx    # Main navigation
│   └── Footer.tsx        # Footer component
├── hooks/                # Custom React hooks
├── utils/                # Utilities (API, validation, etc.)
├── data/                 # Static data (guests, wedding info)
├── types/                # TypeScript type definitions
└── App.tsx              # Main app component
```

## Customization

### Colors & Branding

Edit `tailwind.config.js` to change colors:

```javascript
colors: {
  rose: {
    // Your wedding colors
  },
}
```

### Fonts

Update in `src/App.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont');
```

### Content

- Wedding info: `src/data/weddingInfo.ts`
- Menu items: `src/data/menuItems.ts` 
- Guest list: `src/data/guestTokens.ts`

## Features Overview

### RSVP Flow

1. Guest visits their unique URL
2. Authentication via token validation
3. Multi-step RSVP form:
   - Attendance confirmation
   - Guest count & names
   - Meal selections
   - Contact info & special requests
4. Data saved to Supabase database
5. Email confirmation sent

### Admin Features

- View all RSVPs in Supabase dashboard
- Export data for planning
- Update guest information
- Track RSVP completion rates

## Support

For setup help or customization:
1. Check the documentation
2. Review example configurations
3. Test with sample data first

## License

MIT License - feel free to use for your wedding!

---

**Made with 💕 for your special day**
// Force redeploy Tue Aug 12 09:56:07 SAST 2025
