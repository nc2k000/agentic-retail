# Production Deployment - Decision Intelligence

**Goal:** Deploy Phase 1 hardcoded decision trees to production
**Timeline:** Today
**Status:** Ready to deploy

---

## Pre-Deployment Checklist

### 1. Code Cleanup (Optional - 15 mins)

**Reduce Verbose Logging** (keeps critical logs, removes debug noise)

The system currently logs a lot to console. For production, we want to keep critical logs but remove verbose debugging.

**Keep these logs:**
- ✅ Tree detection results
- ✅ Mission creation/resumption
- ✅ Product caching confirmations
- ✅ Errors and warnings

**Remove these logs:**
- ❌ "🗺️ Mapping database mission"
- ❌ "🔄 loadActiveMission completed"
- ❌ Detailed mission state dumps
- ❌ Step-by-step execution logs

**Where to clean:**
- `src/lib/missions.ts` - Lines with detailed state logging
- `src/components/chat/ChatInterface.tsx` - Debug logs in sendMessage
- `src/app/api/chat/route.ts` - Step-by-step execution logs

**Quick command to find verbose logs:**
```bash
grep -r "console.log" src/ | grep -E "(🗺️|🔄|Step)" | wc -l
```

**Decision:** Do you want to clean these up now or deploy as-is?
- If deploying as-is: Logs won't hurt, just noisy in browser console
- If cleaning up: I can help remove verbose logs (15 mins)

---

### 2. Environment Variables

Verify these are set in production (Vercel):

```bash
# Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Optional
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

**Check in Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Verify all variables are set for "Production"

---

### 3. Database Migrations

Ensure all tables exist in production:

**Required Tables:**
- ✅ `missions` - Decision tree missions
- ✅ `household_facts` - User preferences/discoveries
- ✅ `users` - User accounts
- ✅ `products` - Product catalog

**Quick check:**
```sql
-- Run in production Supabase SQL editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('missions', 'household_facts', 'users', 'products');
```

Should return 4 rows.

---

### 4. Test Locally One More Time

**Quick smoke test:**

1. **Coffee Machine Tree**
   - Query: "I need a coffee machine"
   - Complete tree
   - Verify products cached
   - Hard refresh
   - Query: "coffee machine"
   - Verify same products returned

2. **Paint Tree**
   - Query: "I need paint"
   - Complete tree
   - Verify products cached (check colors)
   - Hard refresh
   - Query: "paint"
   - Verify same colors returned

3. **Tree Switching**
   - Query: "I need paint"
   - Complete tree
   - Query: "I need a coffee machine" (switch trees)
   - Verify coffee tree starts
   - Verify no errors in console

**If all 3 tests pass:** ✅ Ready to deploy

---

### 5. Deployment

**Via Vercel CLI:**

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Build locally first to catch errors
npm run build

# Deploy to production
vercel --prod
```

**Via GitHub (if connected to Vercel):**

```bash
# Commit changes
git add .
git commit -m "Deploy Phase 1 Decision Intelligence to production"

# Push to main
git push origin main

# Vercel auto-deploys
```

**Deployment time:** ~2-3 minutes

---

### 6. Post-Deployment Verification

Once deployed, test on production:

**URL:** `https://your-domain.vercel.app`

**Quick test:**
1. Sign in
2. Test coffee machine tree (Run 1 → Run 2)
3. Test paint tree (Run 1 → Run 2)
4. Check browser console for errors
5. Check Vercel logs for server errors

**If everything works:** ✅ Production deployment complete!

---

## What's Live in Production

After deployment, these features are live:

- ✅ **4 Decision Trees:**
  - Coffee Machines
  - Paint
  - Mattresses
  - Power Tools

- ✅ **Product Caching:**
  - Run 1: Products cached to database
  - Run 2: Exact same products returned

- ✅ **Mission Management:**
  - Tree resumption after refresh
  - Tree switching (pause/resume)
  - Product precision (color matching)

- ✅ **Restock Blocking:**
  - No restock notifications during tree queries

---

## What to Test on Production

**Your testing checklist:**

1. **End-to-End Flows**
   - [ ] Complete all 4 trees (coffee, paint, mattress, power tools)
   - [ ] Verify caching works on each
   - [ ] Test resumption on each
   - [ ] Test tree switching

2. **Edge Cases**
   - [ ] Abandon tree mid-way, return later
   - [ ] Switch trees multiple times
   - [ ] Hard refresh during tree
   - [ ] Multiple browser sessions

3. **Performance**
   - [ ] Tree loads quickly (< 2 seconds)
   - [ ] Products cache quickly (< 1 second)
   - [ ] Resumption is instant
   - [ ] No lag or freezing

4. **User Experience**
   - [ ] Questions are clear
   - [ ] Options make sense
   - [ ] Products are relevant
   - [ ] Carousel displays correctly
   - [ ] No confusing UI states

---

## Known Limitations (Pre-AI)

Things users can't do yet (coming in AI tree phase):

- ❌ Decision trees for categories beyond the 4 hardcoded ones
- ❌ Dynamic questions based on catalog changes
- ❌ Personalized questions based on household profile
- ❌ Mission home screen (you decided to skip this)
- ❌ Checkout flow (wasn't priority for testing)

---

## Development Branch Strategy

While production runs with hardcoded trees, develop AI trees on a branch:

```bash
# Create AI tree development branch
git checkout -b feature/ai-decision-trees

# Work on AI tree implementation
# (catalog analysis, question generation, etc.)

# Test on staging
vercel --preview

# When ready, merge to main
git checkout main
git merge feature/ai-decision-trees
git push origin main
```

**This lets you:**
- ✅ Test hardcoded trees in production
- ✅ Build AI trees without risk
- ✅ Deploy AI trees when ready
- ✅ Keep both systems if needed

---

## Rollback Plan (Just in Case)

If something breaks in production:

**Option 1: Revert Deploy (Vercel)**
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Instant rollback (< 1 minute)

**Option 2: Git Revert**
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys reverted version
```

**Option 3: Emergency Fix**
```bash
# Fix the issue
git add .
git commit -m "Hotfix: [description]"
git push origin main
# Vercel auto-deploys fix
```

---

## Success Metrics (For Your Testing)

After deploying and testing, you should see:

**Database:**
- Missions created for each tree
- Products cached in `recommended_products` column
- No orphaned or corrupted missions

**User Experience:**
- Trees complete in < 2 minutes
- Products load instantly on resumption
- No errors or broken UI
- Smooth tree switching

**Technical:**
- No errors in Vercel logs
- No errors in browser console (except verbose logs if not cleaned)
- Database queries fast (< 100ms)
- API responses fast (< 2s)

---

## Next Steps After Deployment

1. **Test Everything** (30 mins)
   - Run through all test scenarios
   - Document any issues
   - Verify everything works as expected

2. **Create AI Branch** (5 mins)
   ```bash
   git checkout -b feature/ai-decision-trees
   ```

3. **Start AI Development** (Week 1)
   - Build catalog analysis engine
   - Test on staging
   - Keep production stable

---

## Quick Deploy Now?

If you're ready, you can deploy right now with:

```bash
# Make sure you're on main branch
git checkout main

# Build to catch any errors
npm run build

# If build succeeds, deploy
vercel --prod
```

**Deployment takes ~3 minutes.**

After it's live, I'll help you:
1. Test the production deployment
2. Set up the AI development branch
3. Start building the catalog analysis engine

**Ready to deploy?**
