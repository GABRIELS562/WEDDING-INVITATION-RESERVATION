# 📧 Email + Database Integration Flow

## How EmailJS Works with Supabase

```
Guest Submits RSVP
        ↓
┌─────────────────┐    ┌──────────────────┐
│   SUPABASE      │    │    EMAILJS       │
│   DATABASE      │    │    EMAIL         │
└─────────────────┘    └──────────────────┘
        ↑                       ↑
        │                       │
        ├── Saves RSVP data ────┤
        │   (Primary storage)    │
        │                       │
        └─── Triggers email ────┘
           (Confirmation sent)
```

## Step-by-Step Process:

### 1. User Submits RSVP Form
- Guest fills out name, email, attendance, meal choice, etc.
- Clicks "Send Our RSVP ✨" button

### 2. Supabase Database (Primary Storage)
```javascript
// Data saved to your database
{
  guest_token: "JAMIE-HUL04J83",
  guest_name: "Jamie Smith", 
  email: "jamie@example.com",
  attending: true,
  meal_choice: "fish",
  dietary_restrictions: "vegetarian",
  timestamp: "2025-01-14T10:30:00Z"
}
```

### 3. EmailJS Email Service (Confirmation)
```javascript
// Email template variables populated
{
  guest_name: "Jamie Smith",
  attending: "YES",
  meal_choice: "Market Fish", 
  dietary_restrictions: "vegetarian",
  email: "jamie@example.com" // Where email is sent
}
```

### 4. Beautiful Email Sent
- Uses your wedding colors (gold/brown)
- Shows RSVP details
- Includes wedding day schedule  
- Venue information with maps link
- Mobile-friendly design

## Key Benefits:

✅ **Data Security**: RSVP always saved to database first
✅ **Email Backup**: If email fails, RSVP is still recorded
✅ **Beautiful Design**: Professional wedding-themed emails
✅ **Guest Experience**: Instant confirmation for guests
✅ **Admin Access**: All data viewable in Supabase dashboard

## Error Handling:

- If **Supabase fails**: User sees error, can retry
- If **EmailJS fails**: RSVP still saved, email shows warning
- If **Both fail**: User gets clear error message

The systems work independently for maximum reliability!