# Agentic Retail - Product Roadmap

**Last Updated:** December 2, 2024
**Version:** Production v1.0

---

## Current Sprint - Sprint 3 Features

### Missing Sprint 2 Features (~90 min total)

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Minimum Savings Threshold | P1 | 15 min | Filter out trivial savings (≥$0.50/item or ≥$2.00 total) - **Already implemented in SavingsBlock!** |
| Bulk Deal Detection | P1 | 45 min | Savings agent suggests "buy 2 for discount" based on bulkDeal catalog data |
| Replenishment Reminders | P2 | 45 min | Track purchase frequency, show "time to restock" suggestions |

---

## Future Integrations - Sprint 4+

### Phase 1: External APIs (~6-8 weeks)

#### Walmart API Integration
**Priority:** P0 - Critical for production
**Estimated Effort:** 2-3 weeks
**Dependencies:** None

**Features:**
- Real product catalog (replace mock data)
- Live pricing and availability
- Product search functionality
- Product images (real photos vs emojis)
- Store inventory lookup
- Product recommendations

**Technical Requirements:**
- Walmart Open API credentials
- Product SKU mapping
- Real-time price updates
- Image CDN integration

---

#### Weather API Integration
**Priority:** P2 - Nice to have
**Estimated Effort:** 1 week
**Dependencies:** None

**Features:**
- Weather-aware shopping suggestions
  - "It's going to rain this week - stock up on comfort foods"
  - "Heat wave coming - suggest cold beverages and ice cream"
  - "Cold front approaching - recommend soup ingredients"
- Seasonal awareness beyond just calendar dates
- Location-based recommendations

**Technical Requirements:**
- OpenWeather API or Weather.com API
- User location (with permission)
- Weather condition → product mapping logic

---

#### Sports/Events API Integration
**Priority:** P2 - Nice to have
**Estimated Effort:** 1 week
**Dependencies:** None

**Features:**
- Event-aware suggestions
  - "Big game this Sunday - suggest party snacks"
  - "Concert in town - recommend tailgate supplies"
  - "Holiday coming up - festival-specific items"
- Local event awareness
- Team preferences (suggest team snacks)

**Technical Requirements:**
- SportsData API or Ticketmaster API
- Event calendar integration
- User team preferences
- Geolocation for local events

---

### Phase 2: Content & Social (~4-6 weeks)

#### Recipe Web Scraping
**Priority:** P1 - Important for UX
**Estimated Effort:** 2 weeks
**Dependencies:** None

**Features:**
- Extract recipes from popular recipe sites
  - AllRecipes, Food Network, Bon Appétit, etc.
- Parse ingredients and generate shopping lists
- Handle URL paste in chat
- Extract images and instructions
- Ingredient quantity parsing and normalization

**Technical Requirements:**
- Web scraping service (Apify, Scrapy, or custom)
- Recipe schema.org parsing
- Ingredient NLP (ChatGPT/Claude for normalization)
- Handle various recipe formats

**Example Flow:**
```
User: "Make me a shopping list from this recipe: [URL]"
App:  Scrapes recipe, parses ingredients, maps to catalog SKUs
      Generates shop block with all ingredients
```

---

#### Social Media Import
**Priority:** P2 - Nice to have
**Estimated Effort:** 2-3 weeks
**Dependencies:** OAuth setup

**Features:**
- Import recipes from Instagram posts
- Extract ingredients from recipe videos (TikTok, Reels)
- Bookmark collections (Pinterest integration)
- Share shopping lists to social media

**Technical Requirements:**
- Instagram API (Meta for Developers)
- TikTok API
- Pinterest API
- Image OCR for ingredient lists
- Video transcription for recipe instructions

**Example Flow:**
```
User: "Make a list from this Instagram post: [link]"
App:  Fetches post, OCR on image, extracts ingredients
      Maps to products, generates shop block
```

---

### Phase 3: Commerce & Fulfillment (~3-4 weeks)

#### Payment Processing
**Priority:** P0 - Required for revenue
**Estimated Effort:** 2 weeks
**Dependencies:** Walmart API (or standalone)

**Options:**
1. **Via Walmart Integration** - Use Walmart's payment gateway
2. **Stripe Integration** - Independent payment processing
3. **Hybrid** - Stripe for standalone, Walmart for integrated orders

**Features:**
- Secure checkout flow
- Save payment methods
- Order confirmation emails
- Receipt generation
- Refund handling

**Technical Requirements:**
- PCI compliance (if handling cards)
- Stripe or Walmart payment SDK
- Backend payment processing (Supabase Edge Functions)
- Secure token storage

---

#### Order Fulfillment
**Priority:** P0 - Required for production
**Estimated Effort:** 2-3 weeks
**Dependencies:** Walmart API

**Integration Options:**
1. **Walmart+ Integration** - Direct fulfillment via Walmart
2. **Instacart API** - Multi-retailer fulfillment
3. **DoorDash API** - Local delivery
4. **Custom** - Partner with local grocers

**Features:**
- Delivery scheduling
- Pickup scheduling
- Order tracking
- Delivery notifications
- Substitution handling (out of stock items)

**Technical Requirements:**
- Fulfillment partner API
- Real-time inventory sync
- Delivery time slots
- Driver tracking (if delivery)
- Substitution approval flow

---

## Implementation Priority

### Immediate (Next 2 Sprints)
1. ✅ Fix Sprint 2 bugs (STT, TTS, width overflow) - **DONE**
2. Bulk Deal Detection (45 min)
3. Replenishment Reminders (45 min)
4. Minimum Savings Threshold - **Already Done!**

### Short Term (1-2 months)
1. Walmart API Integration (catalog + pricing)
2. Recipe Web Scraping
3. Payment Processing

### Medium Term (3-4 months)
1. Order Fulfillment (Walmart or Instacart)
2. Weather API Integration
3. Social Media Import

### Long Term (6+ months)
1. Sports/Events API
2. Advanced personalization
3. Voice assistant integration (Alexa, Google Home)
4. Mobile app (React Native)

---

## Success Metrics

### Phase 1 Success Criteria
- 90%+ catalog accuracy (real products)
- <3s recipe parsing time
- Weather suggestions increase basket size by 10%+

### Phase 2 Success Criteria
- 70%+ social import success rate
- 50%+ of users try recipe import feature
- 25%+ of lists created from external sources

### Phase 3 Success Criteria
- <5% payment failure rate
- 90%+ fulfillment success rate
- 95%+ customer satisfaction on delivery

---

## Tech Stack Considerations

### Current
- **Frontend:** Next.js 14, TypeScript, Tailwind
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI:** Anthropic Claude Sonnet 4
- **Deployment:** Vercel

### Future Additions
- **Payment:** Stripe SDK
- **Scraping:** Apify or custom service
- **APIs:** Walmart, OpenWeather, SportsData
- **Image Processing:** Cloudinary or Imgix
- **OCR:** Google Vision API or AWS Textract
- **Mobile:** React Native (Expo)

---

## Open Questions

1. **Walmart Partnership:** Can we become official Walmart API partner?
2. **Revenue Model:** Commission on orders vs subscription?
3. **Data Privacy:** How to handle recipe scraping legally?
4. **Scaling:** What's the expected user load?
5. **Geography:** US-only or expand to other markets?
6. **Inventory:** Real-time sync frequency requirements?

---

## Next Steps

1. Complete Sprint 3 missing features
2. Apply for Walmart API access
3. Prototype recipe scraper with AllRecipes
4. Design payment flow mockups
5. Research fulfillment partner options
6. Update gap analysis to reflect completed work
