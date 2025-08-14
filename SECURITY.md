# Security & Privacy Guidelines

## 🔒 Sensitive Data Protection

This project contains sensitive personal data that must NOT be committed to version control:

### Protected Files (in .gitignore)
- `.env` - Contains API keys and credentials
- `populate-guests.js` - Contains real guest names and phone numbers
- `import-csv-guests.js` - Guest import script with credentials
- `guests.csv` - Guest data in CSV format
- `guest-tokens-data.csv` - Generated guest tokens
- `*.sql` - Database files with guest data

### Template Files (safe for GitHub)
- `.env.example` - Template for environment variables
- `populate-guests.example.js` - Template for guest population script

## 🚀 Setup Instructions

1. **Clone the repository**
2. **Copy template files:**
   ```bash
   cp .env.example .env
   cp populate-guests.example.js populate-guests.js
   ```
3. **Fill in your credentials** in the copied files
4. **Add your guest list** to `populate-guests.js`
5. **Never commit the real files** (they're in .gitignore)

## 🛡️ Best Practices

- ✅ Use environment variables for all sensitive data
- ✅ Keep guest information in .gitignore files
- ✅ Use template files for sharing setup instructions
- ❌ Never commit real guest names/phone numbers
- ❌ Never commit API keys or database credentials
- ❌ Never share .env files in messages or emails

## 🔑 Admin Access

- Admin dashboard: `/admin`
- Password: Change the default password in `SimpleAdmin.tsx`
- Access: Only for bride and groom

## 📱 Guest Privacy

- Each guest gets a unique token for privacy
- Guest data is encrypted in transit to Supabase
- Phone numbers are formatted for South African numbers (+27)
- No guest data is logged in production

## 🆘 If Data is Accidentally Committed

1. **Immediately** rotate all API keys and passwords
2. **Change** Supabase project credentials
3. **Update** EmailJS service keys
4. **Remove** sensitive data from Git history:
   ```bash
   git filter-branch --tree-filter 'rm -f populate-guests.js .env' HEAD
   git push --force
   ```

Remember: **Security first, wedding second!** 🎉