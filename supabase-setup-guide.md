# 🎉 Dale & Kirsten's Wedding RSVP - Supabase Setup Guide

## 📋 Quick Setup Checklist

### 1. Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com) and create account
- [ ] Create new project: "dale-kirsten-wedding-rsvp"
- [ ] Choose closest region (Europe for better performance)
- [ ] Save your project URL and anon key

### 2. Run Database Schema
```sql
-- Copy and paste the entire supabase-schema.sql file into the Supabase SQL Editor
-- This creates all tables, functions, indexes, and security policies
```

### 3. Insert Your Guest List
```sql
-- Edit guest-list-template.sql with your actual guest names and WhatsApp numbers
-- Then run it in the SQL Editor to populate your guest list
```

### 4. Verify Setup
```sql
-- Run these verification queries
SELECT get_rsvp_statistics();
SELECT * FROM admin_dashboard_stats;
SELECT COUNT(*) as total_guests FROM guests;
```

## 🔐 Environment Variables (Add to your .env file)

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Your wedding website URL (for generating RSVP links)
VITE_WEDDING_WEBSITE_URL=https://kirstendale.com

# EmailJS (keep existing)
VITE_EMAILJS_SERVICE_ID=service_2s6nrem
VITE_EMAILJS_TEMPLATE_ID=template_hri11x
VITE_EMAILJS_PUBLIC_KEY=imR8Q6_Cr0gNIga6Q
```

## 🧪 Testing Your Setup

### Test Token Validation
```sql
SELECT validate_guest_token('ABC123XYZ789');
```

### Test RSVP Submission
```sql
SELECT submit_rsvp(
    'ABC123XYZ789',           -- guest_token (use a real token from your guests table)
    'John Smith',             -- guest_name
    true,                     -- attending
    'Market Fish',            -- meal_choice
    'Vegetarian',             -- dietary_restrictions
    'john@example.com',       -- email_address
    '+27821234567',           -- whatsapp_number
    true,                     -- wants_email_confirmation
    false                     -- wants_whatsapp_confirmation
);
```

### View All Data
```sql
SELECT * FROM guest_rsvp_summary ORDER BY guest_created_at;
```

## 📊 Database Functions Reference

### Core Functions
- `validate_guest_token(token)` - Validates if a token exists and is valid
- `get_guest_by_token(token)` - Retrieves guest information by token
- `submit_rsvp(...)` - Submits or updates an RSVP (handles duplicates automatically)
- `get_rsvp_statistics()` - Returns comprehensive RSVP stats as JSON
- `mark_email_confirmation_sent(token)` - Marks email as sent
- `mark_whatsapp_confirmation_sent(token)` - Marks WhatsApp confirmation as sent

### Utility Functions
- `generate_guest_token()` - Generates unique 12-character tokens
- `generate_whatsapp_rsvp_link(token, base_url)` - Creates RSVP links
- `insert_wedding_guests(json_data)` - Bulk insert guests from JSON
- `cleanup_old_data(days)` - Clean up old data (optional maintenance)

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ Public read/write access to guests and RSVPs (secured by tokens)
- ✅ Admin dashboard access for authenticated users
- ✅ Functions execute with SECURITY DEFINER for controlled access

### Data Validation
- ✅ Email format validation with regex
- ✅ Phone number format validation
- ✅ Token length and uniqueness constraints
- ✅ Required field validation
- ✅ Text length limits to prevent abuse

### Performance Optimizations
- ✅ Optimized indexes for all common queries
- ✅ Composite indexes for multi-column searches
- ✅ Efficient foreign key relationships
- ✅ Views for complex data aggregation

## 📱 WhatsApp Integration

### Auto-Generated RSVP Links
Each guest gets a unique link like:
```
https://kirstendale.com/guest/ABC123XYZ789
```

### WhatsApp Message Template
```
Hi [Guest Name]! You're invited to Dale & Kirsten's wedding on October 31st, 2025. 
Please RSVP using this link: [RSVP Link] 💕
```

### Bulk WhatsApp Export
```sql
-- Get all guests with WhatsApp messages ready to send
SELECT 
    guest_name,
    whatsapp_number,
    whatsapp_rsvp_link,
    'Hi ' || guest_name || '! You''re invited to Dale & Kirsten''s wedding on October 31st, 2025. Please RSVP using this link: ' || whatsapp_rsvp_link || ' 💕' as message
FROM guests
WHERE whatsapp_number IS NOT NULL
ORDER BY guest_name;
```

## 🚀 Production Checklist

### Before Going Live
- [ ] Schema deployed to Supabase
- [ ] All guests inserted with valid tokens
- [ ] Environment variables configured
- [ ] Email templates tested
- [ ] Sample RSVP submission tested
- [ ] Admin dashboard functional
- [ ] WhatsApp links tested
- [ ] Backup plan in place

### Monitoring & Maintenance
- [ ] Set up database backups
- [ ] Monitor RSVP statistics regularly
- [ ] Check email delivery status
- [ ] Track WhatsApp confirmation rates
- [ ] Export data before wedding day

## 🆘 Troubleshooting

### Common Issues

**"Invalid guest token" error:**
```sql
-- Check if token exists
SELECT * FROM guests WHERE unique_token = 'YOUR_TOKEN';
```

**Duplicate RSVP submissions:**
```sql
-- The submit_rsvp function handles this automatically
-- It will update existing RSVPs instead of creating duplicates
```

**Missing WhatsApp links:**
```sql
-- Regenerate WhatsApp links
UPDATE guests SET whatsapp_rsvp_link = generate_whatsapp_rsvp_link(unique_token);
```

**Performance issues:**
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM guest_rsvp_summary;
```

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Test individual functions in the SQL Editor
4. Check network connectivity to Supabase

Your database is now bulletproof and ready for production! 🎊