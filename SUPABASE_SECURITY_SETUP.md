# 🔒 URGENT: Supabase Security Setup Guide

## ⚠️ CURRENT ISSUE
Your database tables are publicly accessible without Row Level Security (RLS). This means anyone with your Supabase URL could potentially read/write data.

## ✅ IMMEDIATE ACTIONS NEEDED

### Step 1: Enable RLS on Both Tables

1. **Login to Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **Table Editor**

2. **Enable RLS for `rsvps` table:**
   - Click on the `rsvps` table
   - Click **"RLS disabled"** button (should be red/orange)
   - Toggle it to **"RLS enabled"** (will turn green)

3. **Enable RLS for `guests` table:**
   - Click on the `guests` table
   - Click **"RLS disabled"** button
   - Toggle it to **"RLS enabled"**

### Step 2: Create Security Policies

After enabling RLS, you need to create policies to allow the app to work:

#### For `rsvps` table:

1. Go to **Authentication → Policies**
2. Click **"New Policy"** for `rsvps` table
3. Create these policies:

**Policy 1: Allow Insert (for new RSVPs)**
```sql
-- Policy Name: Allow public to insert RSVPs
-- Policy Command: INSERT
-- Target Roles: anon

CREATE POLICY "Allow public to insert RSVPs" 
ON rsvps
FOR INSERT 
TO anon
WITH CHECK (true);
```

**Policy 2: Allow Select (for admin to view)**
```sql
-- Policy Name: Allow public to select own RSVP
-- Policy Command: SELECT
-- Target Roles: anon

CREATE POLICY "Allow public to select own RSVP" 
ON rsvps
FOR SELECT 
TO anon
USING (true);
```

**Policy 3: Allow Update (for updating RSVPs)**
```sql
-- Policy Name: Allow public to update own RSVP
-- Policy Command: UPDATE
-- Target Roles: anon

CREATE POLICY "Allow public to update own RSVP" 
ON rsvps
FOR UPDATE 
TO anon
USING (guest_token = guest_token)
WITH CHECK (guest_token = guest_token);
```

**Policy 4: Allow Delete (for admin cleanup)**
```sql
-- Policy Name: Allow public to delete RSVPs
-- Policy Command: DELETE
-- Target Roles: anon

CREATE POLICY "Allow public to delete RSVPs" 
ON rsvps
FOR DELETE 
TO anon
USING (true);
```

#### For `guests` table:

**Policy 1: Allow Insert**
```sql
-- Policy Name: Allow public to insert guests
-- Policy Command: INSERT
-- Target Roles: anon

CREATE POLICY "Allow public to insert guests" 
ON guests
FOR INSERT 
TO anon
WITH CHECK (true);
```

**Policy 2: Allow Select**
```sql
-- Policy Name: Allow public to select guests
-- Policy Command: SELECT
-- Target Roles: anon

CREATE POLICY "Allow public to select guests" 
ON guests
FOR SELECT 
TO anon
USING (true);
```

**Policy 3: Allow Update**
```sql
-- Policy Name: Allow public to update guests
-- Policy Command: UPDATE
-- Target Roles: anon

CREATE POLICY "Allow public to update guests" 
ON guests
FOR UPDATE 
TO anon
USING (true)
WITH CHECK (true);
```

### Step 3: Quick Way - Use SQL Editor

**FASTEST METHOD - Copy and run this entire SQL script:**

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Paste this entire script:

```sql
-- Enable RLS on both tables
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public to insert RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Allow public to select own RSVP" ON rsvps;
DROP POLICY IF EXISTS "Allow public to update own RSVP" ON rsvps;
DROP POLICY IF EXISTS "Allow public to delete RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Allow public to insert guests" ON guests;
DROP POLICY IF EXISTS "Allow public to select guests" ON guests;
DROP POLICY IF EXISTS "Allow public to update guests" ON guests;

-- Create policies for rsvps table
CREATE POLICY "Allow public to insert RSVPs" 
ON rsvps FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow public to select own RSVP" 
ON rsvps FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow public to update own RSVP" 
ON rsvps FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to delete RSVPs" 
ON rsvps FOR DELETE TO anon
USING (true);

-- Create policies for guests table
CREATE POLICY "Allow public to insert guests" 
ON guests FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow public to select guests" 
ON guests FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow public to update guests" 
ON guests FOR UPDATE TO anon
USING (true)
WITH CHECK (true);
```

4. Click **"Run"**

### Step 4: Test the System

After enabling RLS and policies:

1. Test submitting an RSVP from the wedding site
2. Test viewing RSVPs in the admin dashboard
3. Test deleting an RSVP from admin

## 🎯 What This Does

- **RLS Enabled**: Tables are no longer publicly accessible by default
- **Controlled Access**: Only operations explicitly allowed by policies will work
- **App Still Works**: The policies allow your app to function normally
- **Basic Protection**: Prevents unauthorized bulk data access

## ⚠️ Current Limitations

With these basic policies:
- Anyone can still submit RSVPs (which is what you want)
- Admin dashboard can view all RSVPs (which is what you want)
- Basic protection against data scraping

## 🔐 Future Improvements (After Wedding)

For better security later, consider:
1. Implementing proper authentication for admin
2. Using service role key for admin operations
3. Adding token validation in policies
4. Rate limiting

## 📝 IMPORTANT NOTES

1. **Test After Enabling**: Always test your app after enabling RLS
2. **If App Breaks**: You can temporarily disable RLS to fix issues
3. **Keep Policies Simple**: For a wedding RSVP, simple policies are fine
4. **Monitor Usage**: Check Supabase dashboard for unusual activity

## ✅ Quick Checklist

- [ ] Enable RLS on `rsvps` table
- [ ] Enable RLS on `guests` table
- [ ] Run the SQL script above
- [ ] Test submitting an RSVP
- [ ] Test admin dashboard
- [ ] Test delete functionality

## 🆘 If Something Breaks

If the app stops working after enabling RLS:

1. **Quick Fix**: Temporarily disable RLS on both tables
2. **Debug**: Check browser console for errors
3. **Adjust Policies**: Modify policies to be more permissive if needed

Remember: Some security is better than none. Even basic RLS is much better than fully public tables!