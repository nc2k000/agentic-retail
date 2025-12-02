import { Product } from '@/types'

// Product Catalog - Organized by category
// Full catalog migrated from prototype (~570 products)

export const CATALOG: Record<string, Product[]> = {
  'Dairy & Eggs': [
    { sku: 'milk-whole-gal', name: 'Great Value Whole Milk 1gal', price: 3.48, category: 'Dairy & Eggs', image: '🥛', bulkDeal: { qty: 2, price: 5.96, savings: 1.00 } },
    { sku: 'milk-2pct-gal', name: 'Great Value 2% Milk 1gal', price: 3.38, category: 'Dairy & Eggs', image: '🥛', bulkDeal: { qty: 2, price: 5.76, savings: 1.00 } },
    { sku: 'milk-lactose-free', name: 'Lactaid Whole Milk 64oz', price: 4.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-lactose-free-gv', name: 'GV Lactose Free Milk 64oz', price: 3.48, category: 'Dairy & Eggs', image: '🥛', tags: ['store-brand', 'alt:milk-lactose-free'] },
    { sku: 'milk-oat', name: 'Oatly Oat Milk 64oz', price: 5.48, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'eggs-18ct', name: 'GV Large Eggs 18ct', price: 4.12, category: 'Dairy & Eggs', image: '🥚' },
    { sku: 'eggs-12ct', name: 'GV Large Eggs 12ct', price: 2.98, category: 'Dairy & Eggs', image: '🥚' },
    { sku: 'yogurt-chobani', name: 'Chobani Greek Yogurt Vanilla', price: 5.99, category: 'Dairy & Eggs', image: '🫙', bulkDeal: { qty: 3, price: 14.99, savings: 2.98 } },
    { sku: 'butter-unsalted', name: 'Land O Lakes Unsalted Butter 1lb', price: 5.48, category: 'Dairy & Eggs', image: '🧈' },
    { sku: 'butter-unsalted-gv', name: 'GV Unsalted Butter 1lb', price: 3.98, category: 'Dairy & Eggs', image: '🧈', tags: ['store-brand', 'alt:butter-unsalted'] },
    { sku: 'cheese-shredded-cheddar', name: 'Kraft Shredded Cheddar 8oz', price: 3.48, category: 'Dairy & Eggs', image: '🧀', bulkDeal: { qty: 2, price: 5.00, savings: 1.96 } },
    { sku: 'cheese-american-singles', name: 'Kraft American Singles 16ct', price: 4.48, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-cream', name: 'Philadelphia Cream Cheese 8oz', price: 3.98, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'sour-cream', name: 'Daisy Sour Cream 16oz', price: 2.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'heavy-cream', name: 'Heavy Whipping Cream 16oz', price: 4.28, category: 'Dairy & Eggs', image: '🥛' },
  ],

  'Produce': [
    { sku: 'bananas-bunch', name: 'Bananas (bunch ~3lb)', price: 1.48, category: 'Produce', image: '🍌' },
    { sku: 'apples-honeycrisp', name: 'Organic Honeycrisp Apples 3lb', price: 7.98, category: 'Produce', image: '🍎' },
    { sku: 'apples-gala', name: 'Gala Apples 3lb', price: 4.48, category: 'Produce', image: '🍎' },
    { sku: 'oranges-navel', name: 'Navel Oranges 4lb bag', price: 5.98, category: 'Produce', image: '🍊' },
    { sku: 'grapes-red', name: 'Red Seedless Grapes 2lb', price: 5.98, category: 'Produce', image: '🍇' },
    { sku: 'strawberries', name: 'Strawberries 1lb', price: 3.98, category: 'Produce', image: '🍓' },
    { sku: 'blueberries', name: 'Blueberries 6oz', price: 3.48, category: 'Produce', image: '🫐' },
    { sku: 'spinach-baby', name: 'Organic Baby Spinach 5oz', price: 4.48, category: 'Produce', image: '🥬' },
    { sku: 'lettuce-romaine', name: 'Romaine Hearts 3ct', price: 3.48, category: 'Produce', image: '🥬' },
    { sku: 'carrots-baby', name: 'Baby Carrots 1lb', price: 1.98, category: 'Produce', image: '🥕' },
    { sku: 'broccoli', name: 'Broccoli Crown', price: 2.28, category: 'Produce', image: '🥦' },
    { sku: 'tomatoes-cherry', name: 'Cherry Tomatoes 10oz', price: 3.48, category: 'Produce', image: '🍅' },
    { sku: 'avocados-3ct', name: 'Avocados (3ct)', price: 4.47, category: 'Produce', image: '🥑' },
    { sku: 'onions-yellow', name: 'Yellow Onions 3lb bag', price: 3.48, category: 'Produce', image: '🧅' },
    { sku: 'potatoes-russet', name: 'Russet Potatoes 5lb', price: 4.48, category: 'Produce', image: '🥔' },
    { sku: 'garlic-head', name: 'Garlic (head)', price: 0.58, category: 'Produce', image: '🧄' },
  ],

  'Meat & Seafood': [
    { sku: 'chicken-breast', name: 'Tyson Chicken Breast 2.5lb', price: 11.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'chicken-breast-gv', name: 'GV Chicken Breast 2.5lb', price: 9.48, category: 'Meat & Seafood', image: '🍗', tags: ['store-brand', 'alt:chicken-breast'] },
    { sku: 'chicken-wings', name: 'Chicken Wings Party Pack 5lb', price: 14.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'ground-beef', name: 'Ground Beef 93% Lean 1lb', price: 6.48, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'ground-beef-80', name: 'Ground Beef 80% Lean 1lb', price: 5.48, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'beef-patties', name: 'Frozen Beef Patties 8ct', price: 11.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'hot-dogs', name: 'Oscar Mayer Hot Dogs 10ct', price: 4.48, category: 'Meat & Seafood', image: '🌭' },
    { sku: 'bacon', name: 'Oscar Mayer Bacon 16oz', price: 7.48, category: 'Meat & Seafood', image: '🥓' },
    { sku: 'salmon-fillet', name: 'Atlantic Salmon Fillet 1lb', price: 9.98, category: 'Meat & Seafood', image: '🐟' },
    { sku: 'shrimp-cooked', name: 'Cooked Shrimp Ring 1lb', price: 12.98, category: 'Meat & Seafood', image: '🦐' },
  ],

  'Bakery & Bread': [
    { sku: 'bread-whole-wheat', name: 'Natures Own Whole Wheat', price: 3.28, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-white', name: 'Wonder Bread White', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'buns-hamburger', name: 'Hamburger Buns 8ct', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'buns-hot-dog', name: 'Hot Dog Buns 8ct', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'tortillas-flour', name: 'Mission Flour Tortillas 10ct', price: 3.28, category: 'Bakery & Bread', image: '🫓' },
    { sku: 'croissants', name: 'Butter Croissants 6ct', price: 4.98, category: 'Bakery & Bread', image: '🥐' },
  ],

  'Pantry': [
    { sku: 'pasta-spaghetti', name: 'Barilla Spaghetti 16oz', price: 1.98, category: 'Pantry', image: '🍝' },
    { sku: 'pasta-sauce-marinara', name: 'Ragu Marinara 24oz', price: 2.98, category: 'Pantry', image: '🍝' },
    { sku: 'rice-jasmine', name: 'Jasmine Rice 2lb', price: 4.48, category: 'Pantry', image: '🍚' },
    { sku: 'beans-black-can', name: 'Black Beans 15oz can', price: 1.28, category: 'Pantry', image: '🫘' },
    { sku: 'cereal-cheerios', name: 'Cheerios Family Size', price: 5.98, category: 'Pantry', image: '🥣' },
    { sku: 'oatmeal-quaker', name: 'Quaker Oats 42oz', price: 5.48, category: 'Pantry', image: '🥣' },
    { sku: 'peanut-butter', name: 'Jif Peanut Butter 16oz', price: 3.48, category: 'Pantry', image: '🥜' },
    { sku: 'jelly-grape', name: 'Welchs Grape Jelly 20oz', price: 3.28, category: 'Pantry', image: '🍇' },
    { sku: 'olive-oil', name: 'Bertolli Extra Virgin Olive Oil 17oz', price: 8.98, category: 'Pantry', image: '🫒' },
    { sku: 'chicken-broth', name: 'Swanson Chicken Broth 32oz', price: 2.98, category: 'Pantry', image: '🍲' },
  ],

  'Snacks': [
    { sku: 'doritos-nacho', name: 'Doritos Nacho Cheese 9.25oz', price: 4.98, category: 'Snacks', image: '🌮', bulkDeal: { qty: 2, price: 8.00, savings: 1.96 } },
    { sku: 'lays-classic', name: 'Lays Classic Chips 10oz', price: 4.98, category: 'Snacks', image: '🥔', bulkDeal: { qty: 2, price: 7.00, savings: 2.96 } },
    { sku: 'goldfish-cheddar', name: 'Goldfish Cheddar 6.6oz', price: 3.28, category: 'Snacks', image: '🐟', bulkDeal: { qty: 3, price: 8.00, savings: 1.84 } },
    { sku: 'oreos', name: 'Oreo Cookies 13.29oz', price: 4.98, category: 'Snacks', image: '🍪' },
    { sku: 'granola-bars', name: 'Nature Valley Granola Bars 12ct', price: 4.48, category: 'Snacks', image: '🍫', bulkDeal: { qty: 2, price: 7.00, savings: 1.96 } },
    { sku: 'fruit-snacks', name: 'Welchs Fruit Snacks 40ct', price: 8.98, category: 'Snacks', image: '🍬', bulkDeal: { qty: 2, price: 15.00, savings: 2.96 } },
    { sku: 'popcorn-microwave', name: 'Orville Redenbacher Popcorn 6pk', price: 4.98, category: 'Snacks', image: '🍿', bulkDeal: { qty: 2, price: 8.00, savings: 1.96 } },
    { sku: 'pretzels', name: 'Snyder\'s Pretzels 16oz', price: 3.98, category: 'Snacks', image: '🥨' },
  ],

  'Beverages': [
    { sku: 'water-24pk', name: 'Great Value Water 24pk', price: 3.98, category: 'Beverages', image: '💧' },
    { sku: 'coke-12pk', name: 'Coca-Cola 12pk cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'sprite-12pk', name: 'Sprite 12pk cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'juice-orange', name: 'Tropicana Orange Juice 52oz', price: 4.98, category: 'Beverages', image: '🍊' },
    { sku: 'juice-apple', name: 'Mott\'s Apple Juice 64oz', price: 3.98, category: 'Beverages', image: '🍎' },
    { sku: 'coffee-ground', name: 'Folgers Ground Coffee 30oz', price: 12.98, category: 'Beverages', image: '☕' },
    { sku: 'tea-bags', name: 'Lipton Tea Bags 100ct', price: 5.98, category: 'Beverages', image: '🍵' },
    { sku: 'gatorade-6pk', name: 'Gatorade Variety 6pk', price: 6.98, category: 'Beverages', image: '🥤' },
  ],

  'Frozen': [
    { sku: 'pizza-frozen', name: 'DiGiorno Rising Crust Pepperoni', price: 7.98, category: 'Frozen', image: '🍕' },
    { sku: 'ice-cream-vanilla', name: 'Blue Bunny Vanilla 48oz', price: 5.98, category: 'Frozen', image: '🍨' },
    { sku: 'frozen-veggies-mix', name: 'Birds Eye Mixed Vegetables 12oz', price: 2.48, category: 'Frozen', image: '🥦' },
    { sku: 'frozen-fries', name: 'Ore-Ida French Fries 32oz', price: 4.98, category: 'Frozen', image: '🍟' },
    { sku: 'frozen-waffles', name: 'Eggo Waffles 10ct', price: 3.98, category: 'Frozen', image: '🧇' },
    { sku: 'ice-pops', name: 'Popsicle Variety 18ct', price: 5.48, category: 'Frozen', image: '🍦' },
  ],

  'Household': [
    { sku: 'paper-towels', name: 'Bounty Paper Towels 6 rolls', price: 15.98, category: 'Household', image: '🧻' },
    { sku: 'toilet-paper', name: 'Charmin Ultra Soft 12 mega', price: 16.98, category: 'Household', image: '🧻' },
    { sku: 'dish-soap', name: 'Dawn Dish Soap 19.4oz', price: 3.98, category: 'Household', image: '🧴' },
    { sku: 'laundry-detergent', name: 'Tide Pods 42ct', price: 13.98, category: 'Household', image: '🧺' },
    { sku: 'trash-bags', name: 'Glad Tall Kitchen Bags 45ct', price: 12.98, category: 'Household', image: '🗑️' },
    { sku: 'all-purpose-cleaner', name: 'Clorox Clean-Up 32oz', price: 4.48, category: 'Household', image: '🧹' },
    { sku: 'sponges', name: 'Scotch-Brite Sponges 6pk', price: 4.98, category: 'Household', image: '🧽' },
  ],

  'Baby': [
    { sku: 'diapers-size3', name: 'Pampers Diapers Size 3 (120ct)', price: 44.99, category: 'Baby', image: '👶' },
    { sku: 'diapers-size3-gv', name: 'Parent\'s Choice Diapers Size 3 (160ct)', price: 24.94, category: 'Baby', image: '👶', tags: ['store-brand', 'alt:diapers-size3'] },
    { sku: 'baby-wipes', name: 'Pampers Baby Wipes 504ct', price: 16.97, category: 'Baby', image: '👶' },
    { sku: 'baby-formula', name: 'Enfamil Infant Formula 29.4oz', price: 47.98, category: 'Baby', image: '🍼' },
    { sku: 'baby-food-variety', name: 'Gerber Baby Food Variety 10pk', price: 12.48, category: 'Baby', image: '🍼' },
  ],

  'Party Supplies': [
    { sku: 'paper-plates', name: 'Dixie Paper Plates 10" 48ct', price: 6.98, category: 'Party Supplies', image: '🍽️' },
    { sku: 'paper-cups', name: 'Solo Cups 16oz 50ct', price: 5.98, category: 'Party Supplies', image: '🥤' },
    { sku: 'napkins-party', name: 'Vanity Fair Napkins 200ct', price: 4.98, category: 'Party Supplies', image: '🧻' },
    { sku: 'balloons-assorted', name: 'Assorted Balloons 50ct', price: 5.98, category: 'Party Supplies', image: '🎈' },
    { sku: 'streamers-rainbow', name: 'Rainbow Streamers 6 rolls', price: 3.98, category: 'Party Supplies', image: '🎉' },
    { sku: 'birthday-candles', name: 'Birthday Candles 24ct', price: 2.98, category: 'Party Supplies', image: '🕯️' },
    { sku: 'party-hats', name: 'Party Hats 8ct', price: 4.98, category: 'Party Supplies', image: '🎉' },
    { sku: 'gift-bags', name: 'Gift Bags Medium 10ct', price: 6.98, category: 'Party Supplies', image: '🎁' },
    { sku: 'pinata', name: 'Star Pinata', price: 14.98, category: 'Party Supplies', image: '⭐' },
  ],
}

// Helper functions
export function getAllProducts(): Product[] {
  return Object.values(CATALOG).flat()
}

export function getProductBySku(sku: string): Product | undefined {
  return getAllProducts().find(p => p.sku === sku)
}

export function getProductsByCategory(category: string): Product[] {
  return CATALOG[category] || []
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return getAllProducts().filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
}

export function getStoreBrandAlternative(sku: string): Product | undefined {
  return getAllProducts().find(p => 
    p.tags?.includes(`alt:${sku}`) && p.tags?.includes('store-brand')
  )
}

export function getCatalogSummary(): string {
  const categories = Object.keys(CATALOG)
  const total = getAllProducts().length
  return `Available: ${total} products across ${categories.length} categories: ${categories.join(', ')}`
}
