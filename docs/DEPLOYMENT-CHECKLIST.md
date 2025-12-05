# Phase 1 Deployment Checklist

**Last Updated:** December 4, 2024
**Phase:** Personalization System - Phase 1

---

## ✅ Pre-Deployment Verification

### Code Quality
- [x] All TypeScript errors resolved
- [x] No console errors in browser
- [x] All components render correctly
- [x] Responsive design works on mobile/tablet/desktop

### Feature Completeness
- [x] Product carousel displays ranked products
- [x] Top pick badge shows on first item
- [x] Smart scroll arrows show/hide correctly
- [x] "Add to Cart" button works
- [x] "Start a List" button works
- [x] Suggestion chips render on all blocks
- [x] Behavioral preference learning prompt works

### Data & Database
- [x] User maturity scoring function works
- [x] CSV ingestion creates orders correctly
- [x] Preferences auto-generated from purchases
- [x] Ranking algorithm produces correct scores
- [x] Database schema includes all required tables:
  - [ ] `profiles` table
  - [ ] `orders` table
  - [ ] `customer_preferences` table
  - [ ] `shopping_lists` table

### Performance
- [ ] Carousel scroll is smooth (60fps)
- [ ] No layout shifts when loading
- [ ] Images/emojis load quickly
- [ ] Ranking calculation <100ms

---

## 🚀 Deployment Steps

### 1. Environment Variables
Verify all required env vars are set in production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

### 2. Database Migrations
Run all pending migrations:

```bash
# Check current migration status
npm run supabase:status

# Apply any pending migrations
npm run supabase:migrate

# Verify tables exist
npm run supabase:check
```

### 3. Build & Test
```bash
# Clean build
rm -rf .next
npm run build

# Test production build locally
npm run start

# Run smoke tests
npm run test:smoke
```

### 4. Deploy to Vercel
```bash
# Deploy to preview
vercel

# Deploy to production (after preview testing)
vercel --prod
```

### 5. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test user login/signup
- [ ] Upload sample-orders.csv via `/admin/ingest`
- [ ] Verify preferences created
- [ ] Send test message: "I need milk"
- [ ] Verify carousel appears with ranked products
- [ ] Test "Add to Cart" and "Start a List" buttons
- [ ] Check suggestion chips work
- [ ] Test on mobile device

---

## 🔍 Testing Scenarios

### Scenario 1: New User (Cold Start)
```
1. Create new account
2. Ask: "Show me milk options"
3. Expected: Carousel with popular milk products
4. Top pick: Most popular item (no personal data yet)
5. Strategy: 80% relevancy, 20% accuracy
```

### Scenario 2: Returning User (With History)
```
1. Login as existing user
2. Upload sample-orders.csv
3. Ask: "I need milk"
4. Expected: Carousel with Organic Valley 2% as top pick
5. Badge: "favorite, usual_choice, brand_match, organic"
6. Strategy: 70% accuracy (assuming EMERGING maturity)
```

### Scenario 3: Preference Learning
```
1. Ask: "I prefer Dave's Killer Bread"
2. Expected: AI explains behavioral learning
3. Add Dave's Killer Bread to cart
4. Ask: "Show me bread"
5. Expected: Dave's Killer Bread as top pick
```

### Scenario 4: Carousel → List Flow
```
1. Ask: "I need milk"
2. Click "Start a List" on carousel item
3. Expected: AI creates essentials list with selected milk
4. List includes complementary items
5. Suggestion chips appear below list
```

---

## 🐛 Known Issues / Limitations

### Phase 1 Limitations:
- Ranking algorithm not yet connected to AI (manual examples only)
- Mission detection not implemented (all responses same format)
- Real-time preference updates not hooked up
- Using mock product data, not real catalog

**Note:** These are planned for Phase 2 and don't block Phase 1 deployment.

---

## 📊 Monitoring & Metrics

### Key Metrics to Watch:
1. **User Maturity Distribution**
   - Track: COLD_START, ONBOARDING, EMERGING, ESTABLISHED, POWER_USER
   - Goal: Users progress to EMERGING within 3 orders

2. **Carousel Engagement**
   - Track: Click-through rate on carousel items
   - Goal: 40%+ click rate on top pick

3. **Preference Generation**
   - Track: Preferences per user over time
   - Goal: 3+ preferences after CSV ingestion

4. **Performance**
   - Track: Carousel render time
   - Goal: <100ms from AI response to display

### Analytics Events to Log:
- User maturity level calculated
- Preferences auto-generated
- Carousel rendered
- Product clicked in carousel
- "Start a List" clicked
- Suggestion chip clicked

---

## 🚨 Rollback Plan

If critical issues arise:

### Immediate Rollback:
```bash
# Revert to previous deployment
vercel rollback
```

### Feature Flag Disable:
```typescript
// In ChatInterface.tsx
const ENABLE_PERSONALIZATION = false  // Set to false to disable
```

### Database Rollback:
```bash
# Revert last migration
npm run supabase:rollback
```

---

## 📞 Post-Deployment Support

### If users report issues:
1. Check Vercel logs for errors
2. Verify database connectivity
3. Check Supabase logs for query errors
4. Test locally with same data

### Common Issues:
- **Carousel not showing:** Check browser console for React errors
- **Top pick wrong:** Verify user preferences in database
- **Slow performance:** Check Supabase query performance
- **Missing chips:** Verify AI prompt includes suggestions

---

## ✅ Sign-Off

### Pre-Deployment Checklist:
- [ ] All code reviewed and tested
- [ ] Database migrations ready
- [ ] Environment variables set
- [ ] Build succeeds locally
- [ ] Documentation updated
- [ ] Team notified of deployment

### Deployment Approval:
- [ ] Product Owner approval
- [ ] Engineering Lead approval
- [ ] QA sign-off

**Deployment Window:** [TBD]
**Deployed By:** [Name]
**Deployment Time:** [Timestamp]

---

## 🎉 Phase 1 Complete!

Once deployed, Phase 1 delivers:
- User maturity scoring
- Automatic preference generation
- Product ranking algorithm
- Beautiful carousel UI
- Contextual suggestion chips
- Behavioral learning flow

**Next:** Begin Phase 2 (AI Integration & Real-World Connection)
