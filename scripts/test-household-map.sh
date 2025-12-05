#!/bin/bash

# Household Map Testing Script
# Tests the discovery system end-to-end

echo "🧪 Testing Household Map System"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Test 1: Fetch Empty Household Map"
echo "GET $BASE_URL/api/household"
echo ""
RESPONSE=$(curl -s "$BASE_URL/api/household")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Household map endpoint working"
  echo "Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}✗ FAIL${NC} - Household map endpoint error"
  echo "Response: $RESPONSE"
fi
echo ""
echo "---"
echo ""

echo "📋 Test 2: Discover Facts from Message (Apartment + Dog)"
echo "POST $BASE_URL/api/household/discover"
echo "Message: 'I live in an apartment with my dog'"
echo ""
RESPONSE=$(curl -s -X POST "$BASE_URL/api/household/discover" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "data": {
      "message": "I live in an apartment with my dog",
      "timestamp": "2024-12-05T00:00:00Z"
    }
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Discovery endpoint working"
  DISCOVERED=$(echo "$RESPONSE" | jq -r '.discovered' 2>/dev/null)
  echo "Facts discovered: $DISCOVERED"
  echo "Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}✗ FAIL${NC} - Discovery endpoint error"
  echo "Response: $RESPONSE"
fi
echo ""
echo "---"
echo ""

echo "📋 Test 3: Discover Facts from Message (Baby)"
echo "Message: 'I need snacks for my baby'"
echo ""
RESPONSE=$(curl -s -X POST "$BASE_URL/api/household/discover" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "data": {
      "message": "I need snacks for my baby",
      "timestamp": "2024-12-05T00:10:00Z"
    }
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Baby detection working"
  DISCOVERED=$(echo "$RESPONSE" | jq -r '.discovered' 2>/dev/null)
  echo "Facts discovered: $DISCOVERED"
  echo "Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}✗ FAIL${NC} - Baby detection error"
  echo "Response: $RESPONSE"
fi
echo ""
echo "---"
echo ""

echo "📋 Test 4: Discover Facts from Purchase (Outdoor Products)"
echo "Purchase: BBQ supplies, lawn care products"
echo ""
RESPONSE=$(curl -s -X POST "$BASE_URL/api/household/discover" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "purchase",
    "data": {
      "items": [
        {"sku": "bbq-001", "name": "BBQ Charcoal", "category": "Outdoor", "quantity": 2, "price": 15.99},
        {"sku": "lawn-001", "name": "Lawn Fertilizer", "category": "Garden", "quantity": 1, "price": 24.99},
        {"sku": "garden-001", "name": "Garden Hose", "category": "Garden", "quantity": 1, "price": 29.99}
      ],
      "timestamp": "2024-12-05T00:20:00Z"
    }
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Purchase discovery working"
  DISCOVERED=$(echo "$RESPONSE" | jq -r '.discovered' 2>/dev/null)
  echo "Facts discovered: $DISCOVERED"
  echo "Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}✗ FAIL${NC} - Purchase discovery error"
  echo "Response: $RESPONSE"
fi
echo ""
echo "---"
echo ""

echo "📋 Test 5: Fetch Updated Household Map"
echo "GET $BASE_URL/api/household"
echo ""
RESPONSE=$(curl -s "$BASE_URL/api/household")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Household map updated"
  COMPLETENESS=$(echo "$RESPONSE" | jq -r '.map.completeness' 2>/dev/null)
  TOTAL_FACTS=$(echo "$RESPONSE" | jq -r '.map.facts | length' 2>/dev/null)
  echo "Map Completeness: $COMPLETENESS%"
  echo "Total Facts: $TOTAL_FACTS"
  echo ""
  echo "Discovered Facts:"
  echo "$RESPONSE" | jq -r '.map.facts[] | "  - \(.factKey): \(.factValue) (confidence: \(.confidence * 100 | round)%)"' 2>/dev/null
else
  echo -e "${RED}✗ FAIL${NC} - Household map fetch error"
  echo "Response: $RESPONSE"
fi
echo ""
echo "---"
echo ""

echo "✅ Testing Complete!"
echo ""
echo "Next Steps:"
echo "1. Check Supabase dashboard to see household_facts table"
echo "2. Test chat integration by sending messages with household mentions"
echo "3. Verify confidence scores are updating correctly"
