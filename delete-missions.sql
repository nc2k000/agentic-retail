-- Delete all missions for test user (nickcooke2000+2@gmail.com)
-- Run this in Supabase SQL editor or via CLI

-- First, find the user ID
SELECT id, email FROM auth.users WHERE email = 'nickcooke2000+2@gmail.com';

-- Then delete missions (replace USER_ID with actual ID from above)
-- DELETE FROM missions WHERE user_id = 'USER_ID';

-- Or delete ALL missions for ALL users (use with caution!)
-- DELETE FROM missions;

-- Or delete just TV and appliance missions
-- DELETE FROM missions WHERE tree_id IN ('tv-purchase', 'appliance-purchase', 'furniture-purchase');
