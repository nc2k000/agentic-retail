import { Product } from '@/types'

// EXPANDED Product Catalog - 400+ items
// Organized to support 4 shopping journeys:
// 1. Weekly Essentials - Recurring grocery shopping
// 2. Outcome Baskets - Event-driven complete solutions
// 3. High Consideration - Research-heavy big purchases
// 4. Low Consideration - Quick grabs (milk, bread, dish soap)

export const CATALOG: Record<string, Product[]> = {
  'Dairy & Eggs': [
    // Milk - Low Consideration (multiple brands, sizes, types)
    { sku: 'milk-whole-gal', name: 'Great Value Whole Milk 1gal', price: 3.48, category: 'Dairy & Eggs', image: '🥛', bulkDeal: { qty: 2, price: 5.96, savings: 1.00 } },
    { sku: 'milk-2pct-gal', name: 'Great Value 2% Milk 1gal', price: 3.38, category: 'Dairy & Eggs', image: '🥛', bulkDeal: { qty: 2, price: 5.76, savings: 1.00 } },
    { sku: 'milk-skim-gal', name: 'Great Value Skim Milk 1gal', price: 3.28, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-whole-half', name: 'Great Value Whole Milk 0.5gal', price: 2.18, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-lactose-free', name: 'Lactaid Whole Milk 64oz', price: 4.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-lactose-free-gv', name: 'GV Lactose Free Milk 64oz', price: 3.48, category: 'Dairy & Eggs', image: '🥛', tags: ['store-brand', 'alt:milk-lactose-free'] },

    // Plant-based milk - Vegetarian essentials
    { sku: 'milk-oat', name: 'Oatly Oat Milk 64oz', price: 5.48, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-oat-gv', name: 'GV Oat Milk 64oz', price: 3.98, category: 'Dairy & Eggs', image: '🥛', tags: ['store-brand', 'alt:milk-oat'] },
    { sku: 'milk-almond', name: 'Silk Almond Milk Unsweetened 64oz', price: 4.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-almond-vanilla', name: 'Silk Almond Milk Vanilla 64oz', price: 4.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-soy', name: 'Silk Soy Milk Original 64oz', price: 4.48, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'milk-coconut', name: 'So Delicious Coconut Milk 64oz', price: 4.98, category: 'Dairy & Eggs', image: '🥥' },

    // Eggs - Low Consideration
    { sku: 'eggs-18ct', name: 'GV Large Eggs 18ct', price: 4.12, category: 'Dairy & Eggs', image: '🥚' },
    { sku: 'eggs-12ct', name: 'GV Large Eggs 12ct', price: 2.98, category: 'Dairy & Eggs', image: '🥚' },
    { sku: 'eggs-organic', name: 'Organic Large Eggs 12ct', price: 5.48, category: 'Dairy & Eggs', image: '🥚' },
    { sku: 'eggs-cage-free', name: 'Cage Free Large Eggs 12ct', price: 4.48, category: 'Dairy & Eggs', image: '🥚' },

    // Yogurt - Weekly Essentials (brand variety)
    { sku: 'yogurt-chobani', name: 'Chobani Greek Yogurt Vanilla', price: 5.99, category: 'Dairy & Eggs', image: '🫙', bulkDeal: { qty: 3, price: 14.99, savings: 2.98 } },
    { sku: 'yogurt-chobani-strawberry', name: 'Chobani Greek Yogurt Strawberry', price: 5.99, category: 'Dairy & Eggs', image: '🫙' },
    { sku: 'yogurt-yoplait', name: 'Yoplait Original Strawberry 6oz', price: 0.58, category: 'Dairy & Eggs', image: '🫙' },
    { sku: 'yogurt-gv', name: 'GV Greek Yogurt Vanilla 32oz', price: 3.98, category: 'Dairy & Eggs', image: '🫙', tags: ['store-brand'] },
    { sku: 'yogurt-oikos', name: 'Oikos Triple Zero Vanilla 5.3oz', price: 1.48, category: 'Dairy & Eggs', image: '🫙' },
    { sku: 'yogurt-activia', name: 'Activia Probiotic Vanilla 4oz 4pk', price: 4.48, category: 'Dairy & Eggs', image: '🫙' },

    // Butter - Weekly Essentials
    { sku: 'butter-unsalted', name: 'Land O Lakes Unsalted Butter 1lb', price: 5.48, category: 'Dairy & Eggs', image: '🧈' },
    { sku: 'butter-unsalted-gv', name: 'GV Unsalted Butter 1lb', price: 3.98, category: 'Dairy & Eggs', image: '🧈', tags: ['store-brand', 'alt:butter-unsalted'] },
    { sku: 'butter-salted', name: 'Land O Lakes Salted Butter 1lb', price: 5.48, category: 'Dairy & Eggs', image: '🧈' },
    { sku: 'butter-salted-gv', name: 'GV Salted Butter 1lb', price: 3.98, category: 'Dairy & Eggs', image: '🧈', tags: ['store-brand'] },

    // Cheese - Weekly Essentials (variety)
    { sku: 'cheese-shredded-cheddar', name: 'Kraft Shredded Cheddar 8oz', price: 3.48, category: 'Dairy & Eggs', image: '🧀', bulkDeal: { qty: 2, price: 5.00, savings: 1.96 } },
    { sku: 'cheese-shredded-mozzarella', name: 'Kraft Shredded Mozzarella 8oz', price: 3.48, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-shredded-mexican', name: 'Kraft Mexican Blend 8oz', price: 3.48, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-american-singles', name: 'Kraft American Singles 16ct', price: 4.48, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-cream', name: 'Philadelphia Cream Cheese 8oz', price: 3.98, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-parmesan', name: 'Kraft Grated Parmesan 8oz', price: 4.98, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-string', name: 'Kraft String Cheese 12ct', price: 4.98, category: 'Dairy & Eggs', image: '🧀' },
    { sku: 'cheese-block-cheddar', name: 'Tillamook Cheddar Block 8oz', price: 5.48, category: 'Dairy & Eggs', image: '🧀' },

    // Other dairy
    { sku: 'sour-cream', name: 'Daisy Sour Cream 16oz', price: 2.98, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'heavy-cream', name: 'Heavy Whipping Cream 16oz', price: 4.28, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'half-and-half', name: 'Half and Half 32oz', price: 3.48, category: 'Dairy & Eggs', image: '🥛' },
    { sku: 'cottage-cheese', name: 'Daisy Cottage Cheese 16oz', price: 3.48, category: 'Dairy & Eggs', image: '🥛' },
  ],

  'Produce': [
    // Fruits - Weekly Essentials
    { sku: 'bananas-bunch', name: 'Bananas (bunch ~3lb)', price: 1.48, category: 'Produce', image: '🍌' },
    { sku: 'bananas-organic', name: 'Organic Bananas (bunch ~3lb)', price: 1.88, category: 'Produce', image: '🍌' },
    { sku: 'apples-honeycrisp', name: 'Organic Honeycrisp Apples 3lb', price: 7.98, category: 'Produce', image: '🍎' },
    { sku: 'apples-gala', name: 'Gala Apples 3lb', price: 4.48, category: 'Produce', image: '🍎' },
    { sku: 'apples-granny', name: 'Granny Smith Apples 3lb', price: 4.48, category: 'Produce', image: '🍏' },
    { sku: 'apples-fuji', name: 'Fuji Apples 3lb', price: 4.98, category: 'Produce', image: '🍎' },
    { sku: 'oranges-navel', name: 'Navel Oranges 4lb bag', price: 5.98, category: 'Produce', image: '🍊' },
    { sku: 'oranges-mandarin', name: 'Mandarin Oranges 3lb bag', price: 4.98, category: 'Produce', image: '🍊' },
    { sku: 'grapes-red', name: 'Red Seedless Grapes 2lb', price: 5.98, category: 'Produce', image: '🍇' },
    { sku: 'grapes-green', name: 'Green Seedless Grapes 2lb', price: 5.98, category: 'Produce', image: '🍇' },
    { sku: 'strawberries', name: 'Strawberries 1lb', price: 3.98, category: 'Produce', image: '🍓' },
    { sku: 'strawberries-organic', name: 'Organic Strawberries 1lb', price: 5.98, category: 'Produce', image: '🍓' },
    { sku: 'blueberries', name: 'Blueberries 6oz', price: 3.48, category: 'Produce', image: '🫐' },
    { sku: 'raspberries', name: 'Raspberries 6oz', price: 4.48, category: 'Produce', image: '🫐' },
    { sku: 'blackberries', name: 'Blackberries 6oz', price: 4.48, category: 'Produce', image: '🫐' },
    { sku: 'watermelon', name: 'Seedless Watermelon (whole)', price: 5.98, category: 'Produce', image: '🍉' },
    { sku: 'cantaloupe', name: 'Cantaloupe (whole)', price: 3.98, category: 'Produce', image: '🍈' },
    { sku: 'pineapple', name: 'Fresh Pineapple (whole)', price: 3.98, category: 'Produce', image: '🍍' },
    { sku: 'mango', name: 'Mango (each)', price: 1.48, category: 'Produce', image: '🥭' },
    { sku: 'kiwi', name: 'Kiwi Fruit 4ct', price: 2.98, category: 'Produce', image: '🥝' },
    { sku: 'pears', name: 'Bartlett Pears 3lb', price: 4.48, category: 'Produce', image: '🍐' },
    { sku: 'peaches', name: 'Yellow Peaches 2lb', price: 4.98, category: 'Produce', image: '🍑' },
    { sku: 'plums', name: 'Red Plums 2lb', price: 4.48, category: 'Produce', image: '🍑' },
    { sku: 'cherries', name: 'Bing Cherries 2lb', price: 8.98, category: 'Produce', image: '🍒' },

    // Vegetables - Weekly Essentials (vegetarian focus)
    { sku: 'spinach-baby', name: 'Organic Baby Spinach 5oz', price: 4.48, category: 'Produce', image: '🥬' },
    { sku: 'spinach-regular', name: 'Baby Spinach 10oz', price: 2.98, category: 'Produce', image: '🥬' },
    { sku: 'lettuce-romaine', name: 'Romaine Hearts 3ct', price: 3.48, category: 'Produce', image: '🥬' },
    { sku: 'lettuce-iceberg', name: 'Iceberg Lettuce (head)', price: 1.98, category: 'Produce', image: '🥬' },
    { sku: 'lettuce-mixed', name: 'Spring Mix Salad 5oz', price: 3.48, category: 'Produce', image: '🥬' },
    { sku: 'kale-bunch', name: 'Fresh Kale Bunch', price: 2.48, category: 'Produce', image: '🥬' },
    { sku: 'carrots-baby', name: 'Baby Carrots 1lb', price: 1.98, category: 'Produce', image: '🥕' },
    { sku: 'carrots-whole', name: 'Whole Carrots 2lb', price: 1.98, category: 'Produce', image: '🥕' },
    { sku: 'broccoli', name: 'Broccoli Crown', price: 2.28, category: 'Produce', image: '🥦' },
    { sku: 'cauliflower', name: 'Cauliflower Head', price: 3.98, category: 'Produce', image: '🥦' },
    { sku: 'tomatoes-cherry', name: 'Cherry Tomatoes 10oz', price: 3.48, category: 'Produce', image: '🍅' },
    { sku: 'tomatoes-grape', name: 'Grape Tomatoes 10oz', price: 3.48, category: 'Produce', image: '🍅' },
    { sku: 'tomatoes-roma', name: 'Roma Tomatoes (lb)', price: 1.98, category: 'Produce', image: '🍅' },
    { sku: 'tomatoes-beefsteak', name: 'Beefsteak Tomato (each)', price: 1.48, category: 'Produce', image: '🍅' },
    { sku: 'cucumber', name: 'Cucumber (each)', price: 0.88, category: 'Produce', image: '🥒' },
    { sku: 'cucumbers-mini', name: 'Mini Cucumbers 6ct', price: 3.48, category: 'Produce', image: '🥒' },
    { sku: 'bell-pepper-green', name: 'Green Bell Pepper (each)', price: 1.18, category: 'Produce', image: '🫑' },
    { sku: 'bell-pepper-red', name: 'Red Bell Pepper (each)', price: 1.48, category: 'Produce', image: '🫑' },
    { sku: 'bell-pepper-yellow', name: 'Yellow Bell Pepper (each)', price: 1.48, category: 'Produce', image: '🫑' },
    { sku: 'bell-pepper-orange', name: 'Orange Bell Pepper (each)', price: 1.48, category: 'Produce', image: '🫑' },
    { sku: 'peppers-mini-sweet', name: 'Mini Sweet Peppers 16oz', price: 3.98, category: 'Produce', image: '🫑' },
    { sku: 'jalapenos', name: 'Jalapeño Peppers (lb)', price: 1.48, category: 'Produce', image: '🌶️' },
    { sku: 'avocados-3ct', name: 'Avocados (3ct)', price: 4.47, category: 'Produce', image: '🥑' },
    { sku: 'avocado-single', name: 'Avocado (each)', price: 1.68, category: 'Produce', image: '🥑' },
    { sku: 'onions-yellow', name: 'Yellow Onions 3lb bag', price: 3.48, category: 'Produce', image: '🧅' },
    { sku: 'onions-red', name: 'Red Onions 3lb bag', price: 3.98, category: 'Produce', image: '🧅' },
    { sku: 'onions-white', name: 'White Onions 3lb bag', price: 3.48, category: 'Produce', image: '🧅' },
    { sku: 'onions-green', name: 'Green Onions Bunch', price: 1.18, category: 'Produce', image: '🧅' },
    { sku: 'potatoes-russet', name: 'Russet Potatoes 5lb', price: 4.48, category: 'Produce', image: '🥔' },
    { sku: 'potatoes-red', name: 'Red Potatoes 5lb', price: 4.98, category: 'Produce', image: '🥔' },
    { sku: 'potatoes-yukon', name: 'Yukon Gold Potatoes 5lb', price: 5.48, category: 'Produce', image: '🥔' },
    { sku: 'sweet-potatoes', name: 'Sweet Potatoes 3lb', price: 4.48, category: 'Produce', image: '🍠' },
    { sku: 'garlic-head', name: 'Garlic (head)', price: 0.58, category: 'Produce', image: '🧄' },
    { sku: 'garlic-minced-jar', name: 'Minced Garlic Jar 8oz', price: 3.48, category: 'Produce', image: '🧄' },
    { sku: 'ginger-root', name: 'Fresh Ginger Root (lb)', price: 3.98, category: 'Produce', image: '🫚' },
    { sku: 'mushrooms-white', name: 'White Mushrooms 8oz', price: 2.48, category: 'Produce', image: '🍄' },
    { sku: 'mushrooms-baby-bella', name: 'Baby Bella Mushrooms 8oz', price: 2.98, category: 'Produce', image: '🍄' },
    { sku: 'celery', name: 'Celery Bunch', price: 1.98, category: 'Produce', image: '🥬' },
    { sku: 'zucchini', name: 'Zucchini (lb)', price: 1.98, category: 'Produce', image: '🥒' },
    { sku: 'squash-yellow', name: 'Yellow Squash (lb)', price: 1.98, category: 'Produce', image: '🥒' },
    { sku: 'asparagus', name: 'Fresh Asparagus 1lb', price: 4.98, category: 'Produce', image: '🥬' },
    { sku: 'brussels-sprouts', name: 'Brussels Sprouts 1lb', price: 3.98, category: 'Produce', image: '🥬' },
    { sku: 'green-beans', name: 'Fresh Green Beans 1lb', price: 2.98, category: 'Produce', image: '🫘' },
    { sku: 'corn-on-cob', name: 'Corn on the Cob 6ct', price: 3.98, category: 'Produce', image: '🌽' },
    { sku: 'snap-peas', name: 'Sugar Snap Peas 8oz', price: 3.48, category: 'Produce', image: '🫛' },
    { sku: 'radishes', name: 'Radishes Bunch', price: 1.48, category: 'Produce', image: '🥬' },
    { sku: 'beets', name: 'Fresh Beets Bunch', price: 2.98, category: 'Produce', image: '🥬' },
    { sku: 'eggplant', name: 'Eggplant (each)', price: 2.48, category: 'Produce', image: '🍆' },

    // Herbs - Weekly Essentials
    { sku: 'basil-fresh', name: 'Fresh Basil Bunch', price: 2.98, category: 'Produce', image: '🌿' },
    { sku: 'cilantro-fresh', name: 'Fresh Cilantro Bunch', price: 0.98, category: 'Produce', image: '🌿' },
    { sku: 'parsley-fresh', name: 'Fresh Parsley Bunch', price: 1.48, category: 'Produce', image: '🌿' },
    { sku: 'rosemary-fresh', name: 'Fresh Rosemary', price: 2.98, category: 'Produce', image: '🌿' },
    { sku: 'thyme-fresh', name: 'Fresh Thyme', price: 2.98, category: 'Produce', image: '🌿' },
    { sku: 'mint-fresh', name: 'Fresh Mint', price: 2.98, category: 'Produce', image: '🌿' },
  ],

  'Meat & Seafood': [
    // Poultry
    { sku: 'chicken-breast', name: 'Tyson Chicken Breast 2.5lb', price: 11.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'chicken-breast-gv', name: 'GV Chicken Breast 2.5lb', price: 9.48, category: 'Meat & Seafood', image: '🍗', tags: ['store-brand', 'alt:chicken-breast'] },
    { sku: 'chicken-thighs', name: 'Chicken Thighs 2.5lb', price: 8.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'chicken-wings', name: 'Chicken Wings Party Pack 5lb', price: 14.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'chicken-drumsticks', name: 'Chicken Drumsticks 3lb', price: 7.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'chicken-whole', name: 'Whole Chicken 5-6lb', price: 9.98, category: 'Meat & Seafood', image: '🍗' },
    { sku: 'turkey-breast', name: 'Turkey Breast Cutlets 1lb', price: 6.98, category: 'Meat & Seafood', image: '🦃' },
    { sku: 'turkey-ground', name: 'Ground Turkey 1lb', price: 4.98, category: 'Meat & Seafood', image: '🦃' },

    // Beef
    { sku: 'ground-beef', name: 'Ground Beef 93% Lean 1lb', price: 6.48, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'ground-beef-80', name: 'Ground Beef 80% Lean 1lb', price: 5.48, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'beef-patties', name: 'Frozen Beef Patties 8ct', price: 11.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'steak-ribeye', name: 'Ribeye Steak 1lb', price: 14.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'steak-sirloin', name: 'Sirloin Steak 1lb', price: 9.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'beef-roast', name: 'Chuck Roast 2-3lb', price: 16.98, category: 'Meat & Seafood', image: '🥩' },

    // Pork
    { sku: 'pork-chops', name: 'Pork Chops 1lb', price: 5.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'pork-tenderloin', name: 'Pork Tenderloin 1.5lb', price: 8.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'bacon', name: 'Oscar Mayer Bacon 16oz', price: 7.48, category: 'Meat & Seafood', image: '🥓' },
    { sku: 'bacon-thick', name: 'Thick Cut Bacon 24oz', price: 9.98, category: 'Meat & Seafood', image: '🥓' },
    { sku: 'sausage-breakfast', name: 'Breakfast Sausage Links 12oz', price: 4.98, category: 'Meat & Seafood', image: '🌭' },
    { sku: 'hot-dogs', name: 'Oscar Mayer Hot Dogs 10ct', price: 4.48, category: 'Meat & Seafood', image: '🌭' },
    { sku: 'bratwurst', name: 'Johnsonville Bratwurst 5ct', price: 5.98, category: 'Meat & Seafood', image: '🌭' },

    // Seafood
    { sku: 'salmon-fillet', name: 'Atlantic Salmon Fillet 1lb', price: 9.98, category: 'Meat & Seafood', image: '🐟' },
    { sku: 'tilapia-fillet', name: 'Tilapia Fillets 1lb', price: 6.98, category: 'Meat & Seafood', image: '🐟' },
    { sku: 'cod-fillet', name: 'Cod Fillets 1lb', price: 8.98, category: 'Meat & Seafood', image: '🐟' },
    { sku: 'shrimp-cooked', name: 'Cooked Shrimp Ring 1lb', price: 12.98, category: 'Meat & Seafood', image: '🦐' },
    { sku: 'shrimp-raw', name: 'Raw Shrimp 1lb', price: 10.98, category: 'Meat & Seafood', image: '🦐' },
    { sku: 'crab-imitation', name: 'Imitation Crab 16oz', price: 4.98, category: 'Meat & Seafood', image: '🦀' },

    // Deli/Prepared
    { sku: 'deli-turkey', name: 'Sliced Deli Turkey 1lb', price: 7.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'deli-ham', name: 'Sliced Deli Ham 1lb', price: 6.98, category: 'Meat & Seafood', image: '🥩' },
    { sku: 'rotisserie-chicken', name: 'Rotisserie Chicken (whole)', price: 4.98, category: 'Meat & Seafood', image: '🍗' },

    // VEGETARIAN PROTEIN ALTERNATIVES (Important!)
    { sku: 'tofu-firm', name: 'Nasoya Firm Tofu 14oz', price: 2.48, category: 'Meat & Seafood', image: '🥡' },
    { sku: 'tofu-extra-firm', name: 'Nasoya Extra Firm Tofu 14oz', price: 2.48, category: 'Meat & Seafood', image: '🥡' },
    { sku: 'tempeh', name: 'Lightlife Tempeh 8oz', price: 3.48, category: 'Meat & Seafood', image: '🥡' },
    { sku: 'beyond-burger', name: 'Beyond Meat Burgers 2pk', price: 5.98, category: 'Meat & Seafood', image: '🍔' },
    { sku: 'impossible-burger', name: 'Impossible Burger 12oz', price: 7.98, category: 'Meat & Seafood', image: '🍔' },
    { sku: 'veggie-burger', name: 'MorningStar Veggie Burgers 4ct', price: 4.98, category: 'Meat & Seafood', image: '🍔' },
    { sku: 'veggie-sausage', name: 'Field Roast Sausages 4pk', price: 5.98, category: 'Meat & Seafood', image: '🌭' },
    { sku: 'veggie-nuggets', name: 'MorningStar Chick\'n Nuggets', price: 4.98, category: 'Meat & Seafood', image: '🍗' },
  ],

  'Bakery & Bread': [
    // Bread - Low Consideration (multiple brands)
    { sku: 'bread-whole-wheat', name: 'Nature\'s Own Whole Wheat', price: 3.28, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-white', name: 'Wonder Bread White', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-white-gv', name: 'GV White Bread', price: 1.98, category: 'Bakery & Bread', image: '🍞', tags: ['store-brand'] },
    { sku: 'bread-wheat-gv', name: 'GV Whole Wheat Bread', price: 1.98, category: 'Bakery & Bread', image: '🍞', tags: ['store-brand'] },
    { sku: 'bread-honey-wheat', name: 'Nature\'s Own Honey Wheat', price: 3.28, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-multigrain', name: 'Dave\'s Killer 21 Grain', price: 5.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-sourdough', name: 'San Luis Sourdough Loaf', price: 4.48, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'bread-italian', name: 'Fresh Italian Bread Loaf', price: 2.98, category: 'Bakery & Bread', image: '🥖' },
    { sku: 'bread-french', name: 'French Baguette', price: 2.48, category: 'Bakery & Bread', image: '🥖' },
    { sku: 'bread-rye', name: 'Rye Bread Loaf', price: 3.98, category: 'Bakery & Bread', image: '🍞' },

    // Buns & Rolls
    { sku: 'buns-hamburger', name: 'Hamburger Buns 8ct', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'buns-hot-dog', name: 'Hot Dog Buns 8ct', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'rolls-dinner', name: 'Dinner Rolls 12ct', price: 3.48, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'rolls-hawaiian', name: 'King\'s Hawaiian Rolls 12ct', price: 4.48, category: 'Bakery & Bread', image: '🍞' },

    // Tortillas & Wraps
    { sku: 'tortillas-flour', name: 'Mission Flour Tortillas 10ct', price: 3.28, category: 'Bakery & Bread', image: '🫓' },
    { sku: 'tortillas-flour-large', name: 'Mission Large Flour Tortillas 8ct', price: 3.98, category: 'Bakery & Bread', image: '🫓' },
    { sku: 'tortillas-corn', name: 'Mission Corn Tortillas 30ct', price: 2.98, category: 'Bakery & Bread', image: '🫓' },
    { sku: 'tortillas-whole-wheat', name: 'Mission Whole Wheat Tortillas 8ct', price: 3.48, category: 'Bakery & Bread', image: '🫓' },
    { sku: 'wraps-spinach', name: 'Mission Spinach Wraps 6ct', price: 3.98, category: 'Bakery & Bread', image: '🫓' },

    // Bakery items
    { sku: 'bagels-plain', name: 'Plain Bagels 6ct', price: 3.48, category: 'Bakery & Bread', image: '🥯' },
    { sku: 'bagels-everything', name: 'Everything Bagels 6ct', price: 3.48, category: 'Bakery & Bread', image: '🥯' },
    { sku: 'english-muffins', name: 'English Muffins 6ct', price: 2.98, category: 'Bakery & Bread', image: '🍞' },
    { sku: 'croissants', name: 'Butter Croissants 6ct', price: 4.98, category: 'Bakery & Bread', image: '🥐' },
    { sku: 'muffins-blueberry', name: 'Blueberry Muffins 4ct', price: 4.98, category: 'Bakery & Bread', image: '🧁' },
    { sku: 'donuts-glazed', name: 'Glazed Donuts 6ct', price: 4.48, category: 'Bakery & Bread', image: '🍩' },
    { sku: 'cinnamon-rolls', name: 'Pillsbury Cinnamon Rolls 8ct', price: 4.48, category: 'Bakery & Bread', image: '🥐' },
  ],

  'Pantry & Dry Goods': [
    // Pasta - Weekly Essentials
    { sku: 'pasta-spaghetti', name: 'Barilla Spaghetti 16oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🍝' },
    { sku: 'pasta-penne', name: 'Barilla Penne 16oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🍝' },
    { sku: 'pasta-rotini', name: 'Barilla Rotini 16oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🍝' },
    { sku: 'pasta-linguine', name: 'Barilla Linguine 16oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🍝' },
    { sku: 'pasta-gv', name: 'GV Spaghetti 16oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🍝', tags: ['store-brand'] },
    { sku: 'pasta-whole-wheat', name: 'Whole Wheat Spaghetti 13.25oz', price: 2.48, category: 'Pantry & Dry Goods', image: '🍝' },
    { sku: 'mac-cheese', name: 'Kraft Mac & Cheese Original', price: 1.48, category: 'Pantry & Dry Goods', image: '🧀' },
    { sku: 'mac-cheese-deluxe', name: 'Kraft Deluxe Mac & Cheese', price: 3.48, category: 'Pantry & Dry Goods', image: '🧀' },

    // Sauces - Weekly Essentials
    { sku: 'sauce-marinara', name: 'Prego Traditional Marinara 24oz', price: 2.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'sauce-tomato-basil', name: 'Prego Tomato Basil 24oz', price: 2.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'sauce-alfredo', name: 'Classico Alfredo 15oz', price: 4.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'sauce-pesto', name: 'Classico Pesto 8oz', price: 5.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'sauce-gv-marinara', name: 'GV Marinara Sauce 24oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🥫', tags: ['store-brand'] },

    // Rice & Grains - Weekly Essentials
    { sku: 'rice-white', name: 'Minute White Rice 28oz', price: 4.48, category: 'Pantry & Dry Goods', image: '🍚' },
    { sku: 'rice-brown', name: 'Uncle Ben\'s Brown Rice 14oz', price: 3.48, category: 'Pantry & Dry Goods', image: '🍚' },
    { sku: 'rice-jasmine', name: 'Jasmine Rice 5lb', price: 8.98, category: 'Pantry & Dry Goods', image: '🍚' },
    { sku: 'rice-basmati', name: 'Basmati Rice 4lb', price: 7.98, category: 'Pantry & Dry Goods', image: '🍚' },
    { sku: 'quinoa', name: 'Organic Quinoa 12oz', price: 5.98, category: 'Pantry & Dry Goods', image: '🌾' },
    { sku: 'couscous', name: 'Near East Couscous 10oz', price: 2.98, category: 'Pantry & Dry Goods', image: '🌾' },

    // Canned Goods - Weekly Essentials
    { sku: 'beans-black', name: 'Black Beans 15oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'beans-pinto', name: 'Pinto Beans 15oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'beans-kidney', name: 'Kidney Beans 15oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'beans-garbanzo', name: 'Garbanzo Beans (Chickpeas) 15oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'beans-refried', name: 'Refried Beans 16oz', price: 1.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'tomatoes-diced', name: 'Diced Tomatoes 14.5oz', price: 1.18, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'tomatoes-crushed', name: 'Crushed Tomatoes 28oz', price: 1.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'tomato-paste', name: 'Tomato Paste 6oz', price: 0.88, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'corn-canned', name: 'Whole Kernel Corn 15oz', price: 0.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'green-beans-canned', name: 'Cut Green Beans 14.5oz', price: 0.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'soup-chicken-noodle', name: 'Campbell\'s Chicken Noodle Soup', price: 1.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'soup-tomato', name: 'Campbell\'s Tomato Soup', price: 1.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'tuna-canned', name: 'Starkist Chunk Light Tuna 5oz', price: 1.48, category: 'Pantry & Dry Goods', image: '🥫' },

    // Breakfast - Weekly Essentials
    { sku: 'cereal-cheerios', name: 'Cheerios Original 18oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'cereal-frosted-flakes', name: 'Kellogg\'s Frosted Flakes 24oz', price: 5.48, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'cereal-lucky-charms', name: 'Lucky Charms 20.5oz', price: 5.98, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'cereal-raisin-bran', name: 'Raisin Bran 25.5oz', price: 5.48, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'cereal-gv', name: 'GV Toasted Oats 18oz', price: 2.98, category: 'Pantry & Dry Goods', image: '🥣', tags: ['store-brand'] },
    { sku: 'oatmeal-instant', name: 'Quaker Instant Oatmeal 10pk', price: 4.48, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'oatmeal-old-fashioned', name: 'Quaker Old Fashioned Oats 42oz', price: 5.98, category: 'Pantry & Dry Goods', image: '🥣' },
    { sku: 'pancake-mix', name: 'Aunt Jemima Pancake Mix 32oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🥞' },
    { sku: 'syrup-maple', name: 'Aunt Jemima Syrup 24oz', price: 4.48, category: 'Pantry & Dry Goods', image: '🍯' },

    // Oils & Condiments - Low Consideration
    { sku: 'oil-olive', name: 'Bertolli Extra Virgin Olive Oil 25oz', price: 9.98, category: 'Pantry & Dry Goods', image: '🫒' },
    { sku: 'oil-vegetable', name: 'Crisco Vegetable Oil 48oz', price: 6.48, category: 'Pantry & Dry Goods', image: '🧴' },
    { sku: 'oil-canola', name: 'Canola Oil 48oz', price: 5.98, category: 'Pantry & Dry Goods', image: '🧴' },
    { sku: 'cooking-spray', name: 'PAM Cooking Spray 6oz', price: 4.48, category: 'Pantry & Dry Goods', image: '🧴' },
    { sku: 'ketchup', name: 'Heinz Ketchup 38oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'mustard-yellow', name: 'French\'s Yellow Mustard 20oz', price: 2.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'mustard-dijon', name: 'Grey Poupon Dijon 8oz', price: 4.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'mayo', name: 'Hellmann\'s Mayonnaise 30oz', price: 6.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'mayo-gv', name: 'GV Mayonnaise 30oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🥫', tags: ['store-brand'] },
    { sku: 'bbq-sauce', name: 'Sweet Baby Ray\'s BBQ 28oz', price: 3.48, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'hot-sauce', name: 'Frank\'s RedHot 12oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🌶️' },
    { sku: 'soy-sauce', name: 'Kikkoman Soy Sauce 15oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'ranch-dressing', name: 'Hidden Valley Ranch 16oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🥫' },
    { sku: 'italian-dressing', name: 'Kraft Italian Dressing 16oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🥫' },

    // Baking - Weekly Essentials
    { sku: 'flour-all-purpose', name: 'Gold Medal All Purpose Flour 5lb', price: 3.98, category: 'Pantry & Dry Goods', image: '🌾' },
    { sku: 'sugar-granulated', name: 'Domino Granulated Sugar 4lb', price: 3.48, category: 'Pantry & Dry Goods', image: '🍬' },
    { sku: 'sugar-brown', name: 'Domino Light Brown Sugar 2lb', price: 2.98, category: 'Pantry & Dry Goods', image: '🍬' },
    { sku: 'sugar-powdered', name: 'Powdered Sugar 2lb', price: 2.48, category: 'Pantry & Dry Goods', image: '🍬' },
    { sku: 'baking-powder', name: 'Clabber Girl Baking Powder 8oz', price: 2.48, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'baking-soda', name: 'Arm & Hammer Baking Soda 1lb', price: 1.48, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'vanilla-extract', name: 'McCormick Vanilla Extract 2oz', price: 8.98, category: 'Pantry & Dry Goods', image: '🧴' },
    { sku: 'chocolate-chips', name: 'Nestle Toll House Chips 12oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🍫' },

    // Spices - Low Consideration
    { sku: 'salt', name: 'Morton Iodized Salt 26oz', price: 1.48, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'pepper-black', name: 'McCormick Black Pepper 3oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'garlic-powder', name: 'McCormick Garlic Powder 3oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'onion-powder', name: 'McCormick Onion Powder 2.6oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'chili-powder', name: 'McCormick Chili Powder 2.5oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'cumin', name: 'McCormick Ground Cumin 1.5oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'paprika', name: 'McCormick Paprika 2.12oz', price: 3.98, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'oregano', name: 'McCormick Oregano Leaves 0.75oz', price: 3.48, category: 'Pantry & Dry Goods', image: '🧂' },
    { sku: 'cinnamon', name: 'McCormick Ground Cinnamon 2.37oz', price: 4.98, category: 'Pantry & Dry Goods', image: '🧂' },
  ],

  'Snacks': [
    // Chips - Low Consideration (brand variety)
    { sku: 'chips-lays-classic', name: 'Lay\'s Classic Potato Chips 10oz', price: 4.98, category: 'Snacks', image: '🥔' },
    { sku: 'chips-lays-bbq', name: 'Lay\'s BBQ Chips 10oz', price: 4.98, category: 'Snacks', image: '🥔' },
    { sku: 'chips-lays-sour-cream', name: 'Lay\'s Sour Cream & Onion 10oz', price: 4.98, category: 'Snacks', image: '🥔' },
    { sku: 'chips-doritos-nacho', name: 'Doritos Nacho Cheese 11oz', price: 5.48, category: 'Snacks', image: '🧀' },
    { sku: 'chips-doritos-cool-ranch', name: 'Doritos Cool Ranch 11oz', price: 5.48, category: 'Snacks', image: '🧀' },
    { sku: 'chips-pringles-original', name: 'Pringles Original 5.5oz', price: 2.48, category: 'Snacks', image: '🥔' },
    { sku: 'chips-cheetos', name: 'Cheetos Crunchy 8.5oz', price: 4.98, category: 'Snacks', image: '🧀' },
    { sku: 'chips-tortilla', name: 'Tostitos Scoops 10oz', price: 4.98, category: 'Snacks', image: '🌮' },
    { sku: 'chips-gv', name: 'GV Potato Chips 10oz', price: 2.98, category: 'Snacks', image: '🥔', tags: ['store-brand'] },

    // Crackers & Pretzels
    { sku: 'crackers-ritz', name: 'Ritz Crackers 13.7oz', price: 4.48, category: 'Snacks', image: '🧈' },
    { sku: 'crackers-wheat-thins', name: 'Wheat Thins Original 9oz', price: 4.48, category: 'Snacks', image: '🧈' },
    { sku: 'crackers-triscuit', name: 'Triscuit Original 9oz', price: 4.48, category: 'Snacks', image: '🧈' },
    { sku: 'pretzels', name: 'Rold Gold Pretzels 16oz', price: 3.98, category: 'Snacks', image: '🥨' },
    { sku: 'goldfish', name: 'Pepperidge Farm Goldfish 30oz', price: 8.98, category: 'Snacks', image: '🐠' },

    // Cookies - Weekly Essentials
    { sku: 'cookies-oreo', name: 'Oreo Cookies 14.3oz', price: 5.48, category: 'Snacks', image: '🍪' },
    { sku: 'cookies-chips-ahoy', name: 'Chips Ahoy! 13oz', price: 4.98, category: 'Snacks', image: '🍪' },
    { sku: 'cookies-nilla-wafers', name: 'Nilla Wafers 11oz', price: 3.98, category: 'Snacks', image: '🍪' },
    { sku: 'cookies-milano', name: 'Pepperidge Farm Milano 7oz', price: 4.48, category: 'Snacks', image: '🍪' },

    // Candy
    { sku: 'candy-mm', name: 'M&M\'s Milk Chocolate 10.7oz', price: 5.98, category: 'Snacks', image: '🍫' },
    { sku: 'candy-reeses', name: 'Reese\'s Peanut Butter Cups 10pk', price: 7.98, category: 'Snacks', image: '🥜' },
    { sku: 'candy-skittles', name: 'Skittles Original 14oz', price: 4.98, category: 'Snacks', image: '🌈' },
    { sku: 'candy-starburst', name: 'Starburst Original 14oz', price: 4.98, category: 'Snacks', image: '🌈' },
    { sku: 'candy-twizzlers', name: 'Twizzlers Strawberry 16oz', price: 4.48, category: 'Snacks', image: '🍓' },
    { sku: 'gum-extra', name: 'Extra Spearmint Gum 15pk', price: 5.98, category: 'Snacks', image: '🟢' },

    // Healthy Snacks
    { sku: 'almonds-roasted', name: 'Blue Diamond Roasted Almonds 16oz', price: 8.98, category: 'Snacks', image: '🥜' },
    { sku: 'cashews-roasted', name: 'Planters Roasted Cashews 10oz', price: 9.98, category: 'Snacks', image: '🥜' },
    { sku: 'mixed-nuts', name: 'Planters Deluxe Mixed Nuts 15.25oz', price: 10.98, category: 'Snacks', image: '🥜' },
    { sku: 'trail-mix', name: 'Kirkland Trail Mix 28oz', price: 9.98, category: 'Snacks', image: '🥜' },
    { sku: 'protein-bars', name: 'Kind Bars Variety 12pk', price: 12.98, category: 'Snacks', image: '🥜' },
    { sku: 'granola-bars', name: 'Nature Valley Granola Bars 12pk', price: 5.98, category: 'Snacks', image: '🌾' },
    { sku: 'rice-cakes', name: 'Quaker Rice Cakes Lightly Salted', price: 3.48, category: 'Snacks', image: '🍘' },

    // Popcorn
    { sku: 'popcorn-microwave', name: 'Orville Redenbacher\'s Butter 6pk', price: 5.48, category: 'Snacks', image: '🍿' },
    { sku: 'popcorn-smart-pop', name: 'Smart Pop! Kettle Corn 10pk', price: 6.48, category: 'Snacks', image: '🍿' },
  ],

  'Beverages': [
    // Water - Low Consideration
    { sku: 'water-24pk', name: 'Dasani Water 24pk 16.9oz', price: 6.98, category: 'Beverages', image: '💧' },
    { sku: 'water-gv-24pk', name: 'GV Purified Water 24pk', price: 3.98, category: 'Beverages', image: '💧', tags: ['store-brand'] },
    { sku: 'water-gallon', name: 'Spring Water Gallon', price: 1.48, category: 'Beverages', image: '💧' },
    { sku: 'water-sparkling', name: 'La Croix Sparkling Water 12pk', price: 6.98, category: 'Beverages', image: '💧' },
    { sku: 'water-sparkling-gv', name: 'GV Sparkling Water 12pk', price: 3.98, category: 'Beverages', image: '💧', tags: ['store-brand'] },

    // Soda - Low Consideration (brand variety)
    { sku: 'coke-12pk', name: 'Coca-Cola 12pk 12oz Cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'coke-2l', name: 'Coca-Cola 2 Liter', price: 2.48, category: 'Beverages', image: '🥤' },
    { sku: 'pepsi-12pk', name: 'Pepsi 12pk 12oz Cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'sprite-12pk', name: 'Sprite 12pk 12oz Cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'dr-pepper-12pk', name: 'Dr Pepper 12pk 12oz Cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'mountain-dew-12pk', name: 'Mountain Dew 12pk 12oz Cans', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'ginger-ale', name: 'Canada Dry Ginger Ale 2L', price: 2.48, category: 'Beverages', image: '🥤' },
    { sku: 'soda-gv-cola', name: 'GV Cola 12pk 12oz Cans', price: 4.98, category: 'Beverages', image: '🥤', tags: ['store-brand'] },

    // Juice - Weekly Essentials
    { sku: 'juice-orange', name: 'Tropicana Orange Juice 52oz', price: 4.98, category: 'Beverages', image: '🍊' },
    { sku: 'juice-orange-gv', name: 'GV Orange Juice 52oz', price: 3.48, category: 'Beverages', image: '🍊', tags: ['store-brand'] },
    { sku: 'juice-apple', name: 'Mott\'s Apple Juice 64oz', price: 3.98, category: 'Beverages', image: '🍎' },
    { sku: 'juice-cranberry', name: 'Ocean Spray Cranberry 64oz', price: 4.98, category: 'Beverages', image: '🍒' },
    { sku: 'juice-grape', name: 'Welch\'s Grape Juice 64oz', price: 4.48, category: 'Beverages', image: '🍇' },
    { sku: 'lemonade', name: 'Minute Maid Lemonade 52oz', price: 3.48, category: 'Beverages', image: '🍋' },

    // Coffee & Tea - Low Consideration
    { sku: 'coffee-folgers', name: 'Folgers Classic Roast 30.5oz', price: 12.98, category: 'Beverages', image: '☕' },
    { sku: 'coffee-kcups', name: 'Starbucks K-Cups Pike Place 32pk', price: 24.98, category: 'Beverages', image: '☕' },
    { sku: 'coffee-instant', name: 'Folgers Instant Coffee 8oz', price: 8.98, category: 'Beverages', image: '☕' },
    { sku: 'tea-lipton', name: 'Lipton Black Tea 100ct', price: 6.98, category: 'Beverages', image: '🍵' },
    { sku: 'tea-green', name: 'Bigelow Green Tea 40ct', price: 5.48, category: 'Beverages', image: '🍵' },

    // Sports Drinks
    { sku: 'gatorade-8pk', name: 'Gatorade Thirst Quencher 8pk', price: 7.98, category: 'Beverages', image: '🥤' },
    { sku: 'powerade-8pk', name: 'Powerade 8pk 20oz', price: 6.98, category: 'Beverages', image: '🥤' },

    // Energy Drinks
    { sku: 'red-bull-4pk', name: 'Red Bull Energy 4pk 8.4oz', price: 8.98, category: 'Beverages', image: '🥤' },
    { sku: 'monster-energy', name: 'Monster Energy 16oz', price: 2.48, category: 'Beverages', image: '🥤' },
  ],

  'Frozen Foods': [
    // Pizza - Low Consideration
    { sku: 'pizza-digiorno', name: 'DiGiorno Rising Crust Pepperoni', price: 7.98, category: 'Frozen Foods', image: '🍕' },
    { sku: 'pizza-red-baron', name: 'Red Baron Classic Crust Pepperoni', price: 5.98, category: 'Frozen Foods', image: '🍕' },
    { sku: 'pizza-gv', name: 'GV Pepperoni Pizza', price: 3.98, category: 'Frozen Foods', image: '🍕', tags: ['store-brand'] },
    { sku: 'pizza-cheese', name: 'DiGiorno Four Cheese', price: 7.98, category: 'Frozen Foods', image: '🍕' },
    { sku: 'pizza-rolls', name: 'Totino\'s Pizza Rolls 90ct', price: 9.98, category: 'Frozen Foods', image: '🍕' },

    // Ice Cream - Low Consideration (brand variety for learning)
    { sku: 'ice-cream-vanilla', name: 'Breyers Vanilla 48oz', price: 5.98, category: 'Frozen Foods', image: '🍨' },
    { sku: 'ice-cream-chocolate', name: 'Breyers Chocolate 48oz', price: 5.98, category: 'Frozen Foods', image: '🍨' },
    { sku: 'ice-cream-cookies-cream', name: 'Breyers Cookies & Cream 48oz', price: 5.98, category: 'Frozen Foods', image: '🍨' },
    { sku: 'ice-cream-ben-jerry', name: 'Ben & Jerry\'s Half Baked 1pt', price: 5.48, category: 'Frozen Foods', image: '🍨' },
    { sku: 'ice-cream-haagen-dazs', name: 'Häagen-Dazs Vanilla 14oz', price: 5.98, category: 'Frozen Foods', image: '🍨' },
    { sku: 'ice-cream-gv', name: 'GV Vanilla Ice Cream 48oz', price: 3.48, category: 'Frozen Foods', image: '🍨', tags: ['store-brand'] },

    // Frozen Vegetables - Weekly Essentials (vegetarian)
    { sku: 'frozen-broccoli', name: 'Birds Eye Broccoli Florets 12oz', price: 2.48, category: 'Frozen Foods', image: '🥦' },
    { sku: 'frozen-mixed-veg', name: 'Birds Eye Mixed Vegetables 16oz', price: 2.48, category: 'Frozen Foods', image: '🥕' },
    { sku: 'frozen-corn', name: 'Birds Eye Sweet Corn 16oz', price: 2.48, category: 'Frozen Foods', image: '🌽' },
    { sku: 'frozen-green-beans', name: 'Green Giant Cut Green Beans 12oz', price: 2.48, category: 'Frozen Foods', image: '🫘' },
    { sku: 'frozen-peas', name: 'Birds Eye Sweet Peas 16oz', price: 2.48, category: 'Frozen Foods', image: '🫛' },
    { sku: 'frozen-spinach', name: 'Birds Eye Chopped Spinach 10oz', price: 2.48, category: 'Frozen Foods', image: '🥬' },

    // Frozen Meals - Low Consideration
    { sku: 'frozen-lasagna', name: 'Stouffer\'s Meat Lasagna 38oz', price: 8.98, category: 'Frozen Foods', image: '🍝' },
    { sku: 'frozen-mac-cheese', name: 'Stouffer\'s Mac & Cheese 20oz', price: 5.98, category: 'Frozen Foods', image: '🧀' },
    { sku: 'tv-dinner-hungry-man', name: 'Hungry Man Fried Chicken', price: 4.98, category: 'Frozen Foods', image: '🍗' },
    { sku: 'hot-pockets', name: 'Hot Pockets Pepperoni Pizza 9oz', price: 3.98, category: 'Frozen Foods', image: '🥙' },

    // Breakfast Items
    { sku: 'frozen-waffles', name: 'Eggo Homestyle Waffles 24ct', price: 5.98, category: 'Frozen Foods', image: '🧇' },
    { sku: 'frozen-pancakes', name: 'Aunt Jemima Pancakes 12ct', price: 4.48, category: 'Frozen Foods', image: '🥞' },
    { sku: 'french-toast-sticks', name: 'Eggo French Toast Sticks 12oz', price: 4.98, category: 'Frozen Foods', image: '🍞' },

    // Appetizers - Outcome Baskets (party)
    { sku: 'chicken-wings-frozen', name: 'TGI Friday\'s Chicken Wings 2.5lb', price: 12.98, category: 'Frozen Foods', image: '🍗' },
    { sku: 'mozzarella-sticks', name: 'Farm Rich Mozzarella Sticks 24oz', price: 8.98, category: 'Frozen Foods', image: '🧀' },
    { sku: 'jalapeno-poppers', name: 'Farm Rich Jalapeño Poppers 18oz', price: 7.98, category: 'Frozen Foods', image: '🌶️' },
  ],

  'Household & Cleaning': [
    // LAUNDRY - CRITICAL FOR TESTING (Multiple Tide varieties!)
    { sku: 'tide-pods-spring', name: 'Tide PODS Spring Meadow 81ct', price: 19.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'tide-pods-original', name: 'Tide PODS Original 81ct', price: 19.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'tide-pods-clean-breeze', name: 'Tide PODS Clean Breeze 81ct', price: 19.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'tide-liquid-spring', name: 'Tide Liquid Spring Meadow 100oz', price: 16.98, category: 'Household & Cleaning', image: '🧴', tags: ['alt:tide-pods-spring'] },
    { sku: 'tide-liquid-original', name: 'Tide Liquid Original 100oz', price: 16.98, category: 'Household & Cleaning', image: '🧴', tags: ['alt:tide-pods-original'] },
    { sku: 'gain-pods', name: 'Gain Flings! Original 81ct', price: 18.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'gain-liquid', name: 'Gain Liquid Original 100oz', price: 15.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'all-detergent', name: 'All Liquid Free & Clear 94oz', price: 12.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'downy-fabric-softener', name: 'Downy April Fresh 103oz', price: 8.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'bounce-dryer-sheets', name: 'Bounce Dryer Sheets 240ct', price: 9.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'laundry-detergent-gv', name: 'GV Laundry Detergent 150oz', price: 9.98, category: 'Household & Cleaning', image: '🧴', tags: ['store-brand'] },

    // DISH SOAP - Low Consideration
    { sku: 'dawn-dish-soap', name: 'Dawn Ultra Dishwashing Liquid 56oz', price: 5.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'dawn-dish-soap-gv', name: 'GV Dish Soap 56oz', price: 2.98, category: 'Household & Cleaning', image: '🧴', tags: ['store-brand', 'alt:dawn-dish-soap'] },
    { sku: 'cascade-pods', name: 'Cascade Platinum ActionPacs 62ct', price: 18.98, category: 'Household & Cleaning', image: '🧺' },
    { sku: 'finish-pods', name: 'Finish Quantum 68ct', price: 19.98, category: 'Household & Cleaning', image: '🧺' },

    // All-Purpose Cleaners - Low Consideration
    { sku: 'lysol-spray', name: 'Lysol Disinfectant Spray 19oz', price: 6.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'clorox-spray', name: 'Clorox Clean-Up Spray 32oz', price: 5.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'windex', name: 'Windex Glass Cleaner 26oz', price: 4.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'mr-clean', name: 'Mr. Clean Multi-Surface 45oz', price: 4.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'pine-sol', name: 'Pine-Sol Multi-Surface 100oz', price: 6.98, category: 'Household & Cleaning', image: '🧴' },
    { sku: 'fabuloso', name: 'Fabuloso Lavender 56oz', price: 4.98, category: 'Household & Cleaning', image: '🧴' },

    // Paper Products - Low Consideration
    { sku: 'paper-towels-bounty', name: 'Bounty Paper Towels 8 Rolls', price: 21.98, category: 'Household & Cleaning', image: '🧻' },
    { sku: 'paper-towels-gv', name: 'GV Paper Towels 8 Rolls', price: 12.98, category: 'Household & Cleaning', image: '🧻', tags: ['store-brand'] },
    { sku: 'toilet-paper-charmin', name: 'Charmin Ultra Strong 18 Mega Rolls', price: 29.98, category: 'Household & Cleaning', image: '🧻' },
    { sku: 'toilet-paper-cottonelle', name: 'Cottonelle Ultra Comfort 18 Rolls', price: 24.98, category: 'Household & Cleaning', image: '🧻' },
    { sku: 'toilet-paper-gv', name: 'GV Bath Tissue 18 Rolls', price: 14.98, category: 'Household & Cleaning', image: '🧻', tags: ['store-brand'] },
    { sku: 'tissues-kleenex', name: 'Kleenex Facial Tissues 4 Boxes', price: 6.98, category: 'Household & Cleaning', image: '🧻' },
    { sku: 'napkins', name: 'Vanity Fair Napkins 400ct', price: 5.98, category: 'Household & Cleaning', image: '🧻' },

    // Trash & Storage - Low Consideration
    { sku: 'trash-bags-glad', name: 'Glad ForceFlex Trash Bags 80ct', price: 18.98, category: 'Household & Cleaning', image: '🗑️' },
    { sku: 'trash-bags-hefty', name: 'Hefty Strong Trash Bags 90ct', price: 19.98, category: 'Household & Cleaning', image: '🗑️' },
    { sku: 'trash-bags-gv', name: 'GV Trash Bags 100ct', price: 12.98, category: 'Household & Cleaning', image: '🗑️', tags: ['store-brand'] },
    { sku: 'ziploc-gallon', name: 'Ziploc Gallon Storage Bags 100ct', price: 12.98, category: 'Household & Cleaning', image: '🔲' },
    { sku: 'ziploc-sandwich', name: 'Ziploc Sandwich Bags 150ct', price: 7.98, category: 'Household & Cleaning', image: '🔲' },
    { sku: 'aluminum-foil', name: 'Reynolds Wrap Aluminum Foil 200sqft', price: 9.98, category: 'Household & Cleaning', image: '📄' },
    { sku: 'plastic-wrap', name: 'Glad Press\'n Seal 140sqft', price: 7.98, category: 'Household & Cleaning', image: '📄' },
    { sku: 'parchment-paper', name: 'Reynolds Parchment Paper 50sqft', price: 5.98, category: 'Household & Cleaning', image: '📄' },

    // Cleaning Tools
    { sku: 'sponges', name: 'Scotch-Brite Sponges 9pk', price: 7.98, category: 'Household & Cleaning', image: '🧽' },
    { sku: 'paper-plates', name: 'Dixie Paper Plates 220ct', price: 12.98, category: 'Household & Cleaning', image: '🍽️' },
    { sku: 'plastic-cups', name: 'Solo Plastic Cups 240ct', price: 9.98, category: 'Household & Cleaning', image: '🥤' },
    { sku: 'plastic-forks', name: 'Hefty Disposable Forks 160ct', price: 6.98, category: 'Household & Cleaning', image: '🍴' },
  ],

  'Baby & Kids': [
    // Diapers - High Consideration (size variety)
    { sku: 'diapers-pampers-nb', name: 'Pampers Swaddlers Newborn 84ct', price: 34.98, category: 'Baby & Kids', image: '👶' },
    { sku: 'diapers-pampers-1', name: 'Pampers Swaddlers Size 1 120ct', price: 44.98, category: 'Baby & Kids', image: '👶' },
    { sku: 'diapers-pampers-2', name: 'Pampers Swaddlers Size 2 132ct', price: 48.98, category: 'Baby & Kids', image: '👶' },
    { sku: 'diapers-pampers-3', name: 'Pampers Swaddlers Size 3 136ct', price: 48.98, category: 'Baby & Kids', image: '👶' },
    { sku: 'diapers-pampers-4', name: 'Pampers Swaddlers Size 4 144ct', price: 49.98, category: 'Baby & Kids', image: '👶' },
    { sku: 'diapers-huggies-1', name: 'Huggies Little Snugglers Size 1 128ct', price: 44.98, category: 'Baby & Kids', image: '👶', tags: ['alt:diapers-pampers-1'] },
    { sku: 'diapers-huggies-2', name: 'Huggies Little Snugglers Size 2 136ct', price: 48.98, category: 'Baby & Kids', image: '👶', tags: ['alt:diapers-pampers-2'] },
    { sku: 'diapers-gv-2', name: 'GV Diapers Size 2 132ct', price: 28.98, category: 'Baby & Kids', image: '👶', tags: ['store-brand', 'alt:diapers-pampers-2'] },

    // Wipes - Low Consideration
    { sku: 'wipes-pampers', name: 'Pampers Sensitive Wipes 504ct', price: 19.98, category: 'Baby & Kids', image: '🧻' },
    { sku: 'wipes-huggies', name: 'Huggies Natural Care Wipes 504ct', price: 19.98, category: 'Baby & Kids', image: '🧻' },
    { sku: 'wipes-gv', name: 'GV Baby Wipes 480ct', price: 11.98, category: 'Baby & Kids', image: '🧻', tags: ['store-brand'] },

    // Baby Food - Weekly Essentials
    { sku: 'baby-food-gerber-peas', name: 'Gerber 1st Foods Peas 2oz 2pk', price: 2.48, category: 'Baby & Kids', image: '🍼' },
    { sku: 'baby-food-gerber-carrots', name: 'Gerber 1st Foods Carrots 2oz 2pk', price: 2.48, category: 'Baby & Kids', image: '🍼' },
    { sku: 'baby-food-gerber-apples', name: 'Gerber 1st Foods Apples 2oz 2pk', price: 2.48, category: 'Baby & Kids', image: '🍼' },
    { sku: 'baby-food-pouches', name: 'Gerber Pouches Variety 12pk', price: 12.98, category: 'Baby & Kids', image: '🍼' },

    // Formula - High Consideration
    { sku: 'formula-enfamil-infant', name: 'Enfamil Infant Formula 30oz', price: 38.98, category: 'Baby & Kids', image: '🍼' },
    { sku: 'formula-similac-infant', name: 'Similac Pro-Advance 30.8oz', price: 39.98, category: 'Baby & Kids', image: '🍼' },
    { sku: 'formula-gv', name: 'GV Infant Formula 35oz', price: 24.98, category: 'Baby & Kids', image: '🍼', tags: ['store-brand'] },

    // Baby Care
    { sku: 'baby-shampoo', name: 'Johnson\'s Baby Shampoo 20oz', price: 6.98, category: 'Baby & Kids', image: '🧴' },
    { sku: 'baby-lotion', name: 'Johnson\'s Baby Lotion 27oz', price: 7.98, category: 'Baby & Kids', image: '🧴' },
    { sku: 'diaper-cream', name: 'Desitin Maximum Strength 4oz', price: 8.98, category: 'Baby & Kids', image: '🧴' },
    { sku: 'baby-powder', name: 'Johnson\'s Baby Powder 15oz', price: 6.48, category: 'Baby & Kids', image: '🧴' },
  ],

  'Party Supplies': [
    // Birthday - Outcome Baskets (5-year-old birthday example)
    { sku: 'plates-birthday-paw', name: 'Paw Patrol Party Plates 24ct', price: 6.98, category: 'Party Supplies', image: '🍽️' },
    { sku: 'cups-birthday-paw', name: 'Paw Patrol Party Cups 24ct', price: 5.98, category: 'Party Supplies', image: '🥤' },
    { sku: 'napkins-birthday-paw', name: 'Paw Patrol Napkins 48ct', price: 4.98, category: 'Party Supplies', image: '🧻' },
    { sku: 'banner-happy-birthday', name: 'Happy Birthday Banner', price: 7.98, category: 'Party Supplies', image: '🎉' },
    { sku: 'balloons-assorted', name: 'Assorted Balloons 50ct', price: 8.98, category: 'Party Supplies', image: '🎈' },
    { sku: 'balloons-number-5', name: 'Number 5 Foil Balloon Giant', price: 4.98, category: 'Party Supplies', image: '🎈' },
    { sku: 'candles-birthday', name: 'Birthday Candles Multicolor 24ct', price: 2.98, category: 'Party Supplies', image: '🕯️' },
    { sku: 'party-hats', name: 'Colorful Party Hats 8ct', price: 4.98, category: 'Party Supplies', image: '🎩' },
    { sku: 'streamers', name: 'Crepe Paper Streamers 4pk', price: 5.98, category: 'Party Supplies', image: '🎀' },
    { sku: 'tablecloth-plastic', name: 'Plastic Tablecloth 54x108in', price: 3.98, category: 'Party Supplies', image: '🎨' },

    // Generic Party
    { sku: 'plates-paper-white', name: 'White Paper Plates 100ct', price: 8.98, category: 'Party Supplies', image: '🍽️' },
    { sku: 'cups-red-solo', name: 'Red Solo Cups 120ct', price: 12.98, category: 'Party Supplies', image: '🥤' },
    { sku: 'napkins-white', name: 'White Napkins 250ct', price: 6.98, category: 'Party Supplies', image: '🧻' },
    { sku: 'plastic-forks-party', name: 'Clear Plastic Forks 150ct', price: 7.98, category: 'Party Supplies', image: '🍴' },
    { sku: 'plastic-spoons', name: 'Clear Plastic Spoons 150ct', price: 7.98, category: 'Party Supplies', image: '🥄' },
    { sku: 'plastic-knives', name: 'Clear Plastic Knives 150ct', price: 7.98, category: 'Party Supplies', image: '🔪' },

    // Decorations
    { sku: 'confetti', name: 'Metallic Confetti Mix 2oz', price: 3.98, category: 'Party Supplies', image: '✨' },
    { sku: 'gift-bags', name: 'Gift Bags Assorted 6pk', price: 7.98, category: 'Party Supplies', image: '🎁' },
    { sku: 'tissue-paper', name: 'Tissue Paper Assorted Colors 20pk', price: 5.98, category: 'Party Supplies', image: '📄' },
    { sku: 'goodie-bags', name: 'Goodie Bags 50ct', price: 6.98, category: 'Party Supplies', image: '🛍️' },
    { sku: 'stickers-reward', name: 'Reward Stickers 500ct', price: 4.98, category: 'Party Supplies', image: '⭐' },
    { sku: 'piñata', name: 'Rainbow Donkey Piñata', price: 14.98, category: 'Party Supplies', image: '🪅' },
    { sku: 'piñata-candy-filler', name: 'Piñata Candy Filler 5lb', price: 12.98, category: 'Party Supplies', image: '🍬' },
    { sku: 'cake-topper', name: 'Happy Birthday Cake Topper', price: 5.98, category: 'Party Supplies', image: '🎂' },
    { sku: 'party-favors', name: 'Toy Party Favors 48pc', price: 18.98, category: 'Party Supplies', image: '🎁' },
  ],

  'Electronics': [
    // TVs - High Consideration (budget to premium)
    { sku: 'tv-32-hisense', name: 'Hisense 32" HD Smart TV', price: 148.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-43-tcl', name: 'TCL 43" 4K UHD Smart Roku TV', price: 228.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-50-samsung', name: 'Samsung 50" Crystal 4K UHD TV', price: 348.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-55-lg', name: 'LG 55" 4K UHD Smart TV', price: 448.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-65-samsung', name: 'Samsung 65" QLED 4K Smart TV', price: 898.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-75-sony', name: 'Sony 75" 4K UHD LED TV', price: 1298.00, category: 'Electronics', image: '📺' },
    { sku: 'tv-77-lg-oled', name: 'LG 77" OLED 4K Smart TV', price: 2498.00, category: 'Electronics', image: '📺' },

    // TV Accessories - High Consideration (bundled)
    { sku: 'tv-mount-fixed', name: 'Fixed TV Wall Mount 32-70"', price: 24.98, category: 'Electronics', image: '📺' },
    { sku: 'tv-mount-full-motion', name: 'Full Motion TV Mount 40-80"', price: 49.98, category: 'Electronics', image: '📺' },
    { sku: 'hdmi-cable-6ft', name: 'HDMI 2.1 Cable 6ft 4K', price: 12.98, category: 'Electronics', image: '🔌' },
    { sku: 'hdmi-cable-15ft', name: 'HDMI 2.1 Cable 15ft 4K', price: 19.98, category: 'Electronics', image: '🔌' },
    { sku: 'surge-protector', name: 'Belkin 12-Outlet Surge Protector', price: 29.98, category: 'Electronics', image: '🔌' },
    { sku: 'soundbar-vizio', name: 'VIZIO 2.1 Soundbar', price: 148.00, category: 'Electronics', image: '🔊' },
    { sku: 'soundbar-samsung', name: 'Samsung 3.1.2ch Soundbar', price: 348.00, category: 'Electronics', image: '🔊' },
    { sku: 'soundbar-sonos', name: 'Sonos Beam Gen 2 Soundbar', price: 449.00, category: 'Electronics', image: '🔊' },
    { sku: 'roku-streaming', name: 'Roku Streaming Stick 4K', price: 39.98, category: 'Electronics', image: '📱' },
    { sku: 'fire-tv-stick', name: 'Amazon Fire TV Stick 4K', price: 44.98, category: 'Electronics', image: '📱' },
    { sku: 'apple-tv', name: 'Apple TV 4K 64GB', price: 149.00, category: 'Electronics', image: '📱' },

    // Headphones & Audio
    { sku: 'airpods-3', name: 'Apple AirPods 3rd Gen', price: 169.00, category: 'Electronics', image: '🎧' },
    { sku: 'airpods-pro-2', name: 'Apple AirPods Pro 2nd Gen', price: 249.00, category: 'Electronics', image: '🎧' },
    { sku: 'bose-qc45', name: 'Bose QuietComfort 45 Headphones', price: 329.00, category: 'Electronics', image: '🎧' },
    { sku: 'sony-wh1000xm5', name: 'Sony WH-1000XM5 Noise Cancelling', price: 398.00, category: 'Electronics', image: '🎧' },
    { sku: 'jbl-earbuds', name: 'JBL Tune Wireless Earbuds', price: 49.98, category: 'Electronics', image: '🎧' },
    { sku: 'anker-earbuds', name: 'Anker Soundcore Earbuds', price: 29.98, category: 'Electronics', image: '🎧' },

    // Smart Home
    { sku: 'echo-dot', name: 'Amazon Echo Dot 5th Gen', price: 49.99, category: 'Electronics', image: '🔊' },
    { sku: 'echo-show-8', name: 'Amazon Echo Show 8', price: 129.99, category: 'Electronics', image: '📺' },
    { sku: 'google-nest-mini', name: 'Google Nest Mini', price: 49.99, category: 'Electronics', image: '🔊' },
    { sku: 'google-nest-hub', name: 'Google Nest Hub 2nd Gen', price: 99.99, category: 'Electronics', image: '📺' },
    { sku: 'ring-doorbell', name: 'Ring Video Doorbell', price: 99.99, category: 'Electronics', image: '📹' },
    { sku: 'smart-bulbs', name: 'Philips Hue White & Color 4pk', price: 189.99, category: 'Electronics', image: '💡' },
    { sku: 'smart-plug', name: 'Kasa Smart Plug 4pk', price: 29.99, category: 'Electronics', image: '🔌' },

    // Gaming
    { sku: 'ps5-controller', name: 'PlayStation 5 DualSense Controller', price: 74.99, category: 'Electronics', image: '🎮' },
    { sku: 'xbox-controller', name: 'Xbox Wireless Controller', price: 59.99, category: 'Electronics', image: '🎮' },
    { sku: 'nintendo-switch-pro', name: 'Nintendo Switch Pro Controller', price: 69.99, category: 'Electronics', image: '🎮' },

    // Computers & Tablets
    { sku: 'ipad-9', name: 'Apple iPad 9th Gen 64GB', price: 329.00, category: 'Electronics', image: '📱' },
    { sku: 'ipad-air', name: 'Apple iPad Air 64GB', price: 599.00, category: 'Electronics', image: '📱' },
    { sku: 'kindle-basic', name: 'Amazon Kindle 6" (2022)', price: 99.99, category: 'Electronics', image: '📱' },
    { sku: 'kindle-paperwhite', name: 'Kindle Paperwhite 8GB', price: 139.99, category: 'Electronics', image: '📱' },
    { sku: 'laptop-chromebook', name: 'HP Chromebook 14" 4GB', price: 249.00, category: 'Electronics', image: '💻' },
    { sku: 'laptop-hp-15', name: 'HP 15.6" Laptop 8GB 256GB', price: 499.00, category: 'Electronics', image: '💻' },

    // Accessories
    { sku: 'usb-c-cable', name: 'USB-C to USB-C Cable 6ft', price: 12.98, category: 'Electronics', image: '🔌' },
    { sku: 'lightning-cable', name: 'Lightning to USB-C Cable 6ft', price: 19.98, category: 'Electronics', image: '🔌' },
    { sku: 'phone-charger', name: 'Anker 20W USB-C Fast Charger', price: 19.99, category: 'Electronics', image: '🔌' },
    { sku: 'power-bank', name: 'Anker PowerCore 10000mAh', price: 29.99, category: 'Electronics', image: '🔋' },
    { sku: 'sd-card-128', name: 'SanDisk 128GB microSD Card', price: 19.99, category: 'Electronics', image: '💾' },
    { sku: 'keyboard-wireless', name: 'Logitech Wireless Keyboard', price: 29.99, category: 'Electronics', image: '⌨️' },
    { sku: 'mouse-wireless', name: 'Logitech Wireless Mouse', price: 19.99, category: 'Electronics', image: '🖱️' },
    { sku: 'webcam-logitech', name: 'Logitech C920 HD Webcam', price: 79.99, category: 'Electronics', image: '📹' },
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

export function getCatalogSummary(): string {
  const categories = Object.keys(CATALOG)
  const totalProducts = getAllProducts().length
  return `Available: ${totalProducts} products across ${categories.length} categories: ${categories.join(', ')}`
}
