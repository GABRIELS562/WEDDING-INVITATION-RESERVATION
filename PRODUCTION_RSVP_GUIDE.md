# 💍 Dale & Kirsten's Wedding RSVP System

A world-class, production-ready wedding RSVP system built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## ✨ Features

### 🎯 Core Functionality
- **Token-based Access** - Secure, personalized RSVP links via URL parameters
- **Real-time Validation** - Comprehensive form validation with Zod
- **Duplicate Prevention** - Handles existing RSVPs gracefully with update functionality
- **Email Integration** - EmailJS confirmations with delivery tracking
- **WhatsApp Support** - Automatic invitation link generation

### 🚀 Performance & Accessibility
- **Core Web Vitals Optimized** - Built for exceptional loading performance
- **WCAG 2.1 Compliant** - Full accessibility with screen reader support
- **Mobile-First Design** - Responsive across all devices
- **Progressive Enhancement** - Works without JavaScript (basic functionality)
- **SEO Optimized** - Dynamic metadata with Open Graph support

### 🛡️ Production-Grade Security
- **Rate Limiting** - Client-side protection against abuse
- **Input Sanitization** - XSS and injection attack prevention
- **Token Validation** - Secure guest verification system
- **Error Boundaries** - Comprehensive error handling with user-friendly fallbacks
- **Data Privacy** - No tracking without consent

### 🎨 User Experience
- **Wedding Theme** - Romantic rose and gold color palette
- **Smooth Animations** - Framer Motion transitions and micro-interactions
- **Loading States** - Elegant skeletons and progress indicators
- **Success States** - Celebratory confirmation with confetti effects
- **Error Recovery** - Clear error messages with actionable solutions

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Utility-first styling with custom wedding theme
- **Framer Motion** - Smooth animations and transitions
- **Heroicons** - Consistent icon system
- **Zod** - Runtime type validation

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security** - Database-level security policies
- **Edge Functions** - Server-side validation and processing
- **Real-time Subscriptions** - Live admin dashboard updates

### Development Tools
- **TypeScript** - End-to-end type safety
- **ESLint + Prettier** - Code quality and formatting
- **Jest + Testing Library** - Comprehensive testing suite
- **Husky + Lint-staged** - Git hooks for code quality

## 📂 Project Structure

```
src/
├── app/                          # Next.js 14 App Router
│   ├── rsvp/                    # RSVP page with token handling
│   │   ├── page.tsx             # Server component with metadata
│   │   └── RSVPPageClient.tsx   # Client component with interactivity
│   ├── layout.tsx               # Root layout with providers
│   └── globals.css              # Global styles and CSS variables
├── components/                   # Reusable UI components
│   ├── RSVPForm.tsx             # Main RSVP form component
│   ├── TokenGuard.tsx           # Token validation wrapper
│   └── ui/                      # Base UI components
│       ├── ErrorBoundary.tsx    # Error handling components
│       └── LoadingSkeleton.tsx  # Loading state components
├── lib/                         # Core utilities and services
│   ├── supabase.ts              # Database client and operations
│   ├── validation.ts            # Zod schemas and validation
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript definitions
│   └── rsvp.ts                  # Core type definitions
└── styles/                      # Additional styling
    └── globals.css              # Tailwind imports and custom styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dale-kirsten/wedding-rsvp.git
   cd wedding-rsvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Wedding Configuration
   NEXT_PUBLIC_WEDDING_DATE=2025-10-31
   NEXT_PUBLIC_VENUE_NAME=Cape Point Vineyards
   NEXT_PUBLIC_COUPLE_NAMES=Dale & Kirsten
   
   # EmailJS (Optional)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Set up Supabase database**
   ```bash
   # Run the schema creation script in Supabase SQL Editor
   # File: supabase-schema.sql
   
   # Insert your guest list
   # File: guest-list-template.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Setup

### Schema Creation
Run the provided SQL schema in your Supabase SQL Editor:

```sql
-- See supabase-schema.sql for complete schema
-- Includes tables, functions, indexes, and security policies
```

### Guest List Import
Use the guest list template to populate your database:

```sql
-- See guest-list-template.sql for import instructions
-- Automatically generates tokens and WhatsApp links
```

## 📱 Usage

### Guest Experience
1. **Invitation Links** - Each guest receives a unique URL: `https://kirstendale.com/rsvp?token=ABC123XYZ789`
2. **Token Validation** - System verifies guest identity and loads existing RSVP data
3. **Form Completion** - Real-time validation guides users through the RSVP process
4. **Confirmation** - Success page with email confirmation and next steps

### Admin Features
- **Real-time Dashboard** - Monitor RSVPs as they come in
- **Guest Management** - Add, edit, or remove guests
- **WhatsApp Integration** - Generate invitation messages
- **Data Export** - Download RSVP data for wedding planning

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Wedding Details
Update wedding-specific information in:
- `src/types/rsvp.ts` - Meal choices and form options
- `src/app/rsvp/RSVPPageClient.tsx` - Display information
- Environment variables for dates and venues

### Styling
Customize the wedding theme in:
- `tailwind.config.js` - Color palette and spacing
- `src/app/globals.css` - CSS custom properties
- Component files - Individual styling adjustments

### Email Templates
Configure EmailJS templates for:
- Guest confirmations
- Admin notifications
- Error reports

## 🐛 Troubleshooting

### Common Issues

**Token validation fails:**
```typescript
// Check token format and database entries
const isValidToken = /^[A-Z0-9]{8,}$/.test(token);
```

**Form submission errors:**
```typescript
// Check Supabase connection and RLS policies
const { data, error } = await supabase.from('rsvps').select('*');
```

**Email delivery issues:**
```javascript
// Verify EmailJS configuration and template IDs
```

### Debug Mode
Enable debug logging:
```bash
NODE_ENV=development npm run dev
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Form completion rates
- Error tracking
- Performance metrics
- User journey analysis

### Integration Options
- Google Analytics 4
- Vercel Analytics
- Custom monitoring solutions

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Contact

**Dale & Kirsten**
- Email: kirstendale583@gmail.com
- Website: [kirstendale.com](https://kirstendale.com)

---

**Built with 💕 for Dale & Kirsten's special day - October 31st, 2025**

*"Love is patient, love is kind..." - 1 Corinthians 13:4*