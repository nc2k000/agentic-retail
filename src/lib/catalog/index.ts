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

  'Appliances': [
    // Coffee Makers - High Consideration (budget to premium)
    { sku: 'coffee-mr-coffee', name: 'Mr. Coffee 12-Cup Coffee Maker', price: 29.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-cuisinart', name: 'Cuisinart 14-Cup Programmable', price: 89.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-ninja', name: 'Ninja 12-Cup Programmable Brewer', price: 99.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-keurig-k-mini', name: 'Keurig K-Mini Single Serve', price: 79.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-keurig-k-elite', name: 'Keurig K-Elite Single Serve', price: 169.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-nespresso', name: 'Nespresso Vertuo Plus', price: 179.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-breville-espresso', name: 'Breville Barista Express Espresso', price: 699.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-french-press', name: 'Bodum French Press 34oz', price: 34.99, category: 'Appliances', image: '☕' },
    { sku: 'coffee-grinder', name: 'Cuisinart Coffee Grinder', price: 39.99, category: 'Appliances', image: '☕' },
    { sku: 'kettle-electric', name: 'Hamilton Beach Electric Kettle 1.7L', price: 29.99, category: 'Appliances', image: '🫖' },
    { sku: 'kettle-cuisinart', name: 'Cuisinart Gooseneck Electric Kettle', price: 89.99, category: 'Appliances', image: '🫖' },

    // Blenders & Food Processors - High Consideration
    { sku: 'blender-ninja', name: 'Ninja Personal Blender', price: 49.99, category: 'Appliances', image: '🔪' },
    { sku: 'blender-nutribullet', name: 'NutriBullet 600W Blender', price: 59.99, category: 'Appliances', image: '🔪' },
    { sku: 'blender-ninja-pro', name: 'Ninja Professional Blender 1000W', price: 89.99, category: 'Appliances', image: '🔪' },
    { sku: 'blender-vitamix', name: 'Vitamix E310 Explorian', price: 349.99, category: 'Appliances', image: '🔪' },
    { sku: 'blender-vitamix-pro', name: 'Vitamix Professional Series 750', price: 599.99, category: 'Appliances', image: '🔪' },
    { sku: 'food-processor-cuisinart', name: 'Cuisinart 14-Cup Food Processor', price: 199.99, category: 'Appliances', image: '🔪' },
    { sku: 'food-processor-ninja', name: 'Ninja 8-Cup Food Processor', price: 79.99, category: 'Appliances', image: '🔪' },
    { sku: 'immersion-blender', name: 'Cuisinart Smart Stick Hand Blender', price: 39.99, category: 'Appliances', image: '🔪' },

    // Mixers - High Consideration
    { sku: 'mixer-hand', name: 'Hamilton Beach Hand Mixer', price: 24.99, category: 'Appliances', image: '🥄' },
    { sku: 'mixer-kitchenaid-artisan', name: 'KitchenAid Artisan Stand Mixer 5qt', price: 449.99, category: 'Appliances', image: '🥄' },
    { sku: 'mixer-kitchenaid-classic', name: 'KitchenAid Classic Stand Mixer 4.5qt', price: 329.99, category: 'Appliances', image: '🥄' },
    { sku: 'mixer-cuisinart-stand', name: 'Cuisinart Stand Mixer 5.5qt', price: 299.99, category: 'Appliances', image: '🥄' },

    // Toasters & Toaster Ovens - High Consideration
    { sku: 'toaster-2-slice', name: 'Black+Decker 2-Slice Toaster', price: 19.99, category: 'Appliances', image: '🍞' },
    { sku: 'toaster-4-slice', name: 'Cuisinart 4-Slice Toaster', price: 59.99, category: 'Appliances', image: '🍞' },
    { sku: 'toaster-oven-basic', name: 'Black+Decker Toaster Oven 4-Slice', price: 49.99, category: 'Appliances', image: '🍞' },
    { sku: 'toaster-oven-cuisinart', name: 'Cuisinart Convection Toaster Oven', price: 229.99, category: 'Appliances', image: '🍞' },
    { sku: 'toaster-oven-breville', name: 'Breville Smart Oven Air Fryer', price: 399.99, category: 'Appliances', image: '🍞' },

    // Air Fryers - High Consideration (popular!)
    { sku: 'air-fryer-dash', name: 'Dash Compact Air Fryer 2qt', price: 49.99, category: 'Appliances', image: '🍟' },
    { sku: 'air-fryer-ninja', name: 'Ninja Air Fryer 4qt', price: 99.99, category: 'Appliances', image: '🍟' },
    { sku: 'air-fryer-cosori', name: 'Cosori Air Fryer 5.8qt', price: 119.99, category: 'Appliances', image: '🍟' },
    { sku: 'air-fryer-ninja-foodi', name: 'Ninja Foodi 8qt XL Air Fryer', price: 199.99, category: 'Appliances', image: '🍟' },
    { sku: 'air-fryer-instant-pot', name: 'Instant Pot Vortex Plus 6qt', price: 139.99, category: 'Appliances', image: '🍟' },

    // Slow Cookers & Pressure Cookers - High Consideration
    { sku: 'slow-cooker-3qt', name: 'Crock-Pot 3qt Slow Cooker', price: 29.99, category: 'Appliances', image: '🍲' },
    { sku: 'slow-cooker-6qt', name: 'Crock-Pot 6qt Programmable', price: 49.99, category: 'Appliances', image: '🍲' },
    { sku: 'slow-cooker-8qt', name: 'Hamilton Beach 8qt Slow Cooker', price: 59.99, category: 'Appliances', image: '🍲' },
    { sku: 'instant-pot-duo', name: 'Instant Pot Duo 6qt 7-in-1', price: 99.99, category: 'Appliances', image: '🍲' },
    { sku: 'instant-pot-ultra', name: 'Instant Pot Ultra 8qt 10-in-1', price: 149.99, category: 'Appliances', image: '🍲' },
    { sku: 'ninja-foodi-cooker', name: 'Ninja Foodi 6.5qt Pressure Cooker', price: 179.99, category: 'Appliances', image: '🍲' },

    // Rice Cookers & Specialty
    { sku: 'rice-cooker-basic', name: 'Aroma 8-Cup Rice Cooker', price: 29.99, category: 'Appliances', image: '🍚' },
    { sku: 'rice-cooker-zojirushi', name: 'Zojirushi 10-Cup Rice Cooker', price: 299.99, category: 'Appliances', image: '🍚' },
    { sku: 'waffle-maker', name: 'Cuisinart Belgian Waffle Maker', price: 49.99, category: 'Appliances', image: '🧇' },
    { sku: 'griddle-electric', name: 'Presto Electric Griddle 22"', price: 39.99, category: 'Appliances', image: '🍳' },
    { sku: 'panini-press', name: 'Cuisinart Panini Press', price: 69.99, category: 'Appliances', image: '🥪' },
    { sku: 'juicer-centrifugal', name: 'Hamilton Beach Juicer', price: 49.99, category: 'Appliances', image: '🍊' },
    { sku: 'juicer-masticating', name: 'Omega Masticating Juicer', price: 299.99, category: 'Appliances', image: '🍊' },

    // Microwaves - High Consideration
    { sku: 'microwave-07cu', name: 'Commercial Chef 0.7cu ft Microwave', price: 59.99, category: 'Appliances', image: '📦' },
    { sku: 'microwave-09cu', name: 'GE 0.9cu ft Countertop Microwave', price: 89.99, category: 'Appliances', image: '📦' },
    { sku: 'microwave-11cu', name: 'Panasonic 1.1cu ft Inverter', price: 149.99, category: 'Appliances', image: '📦' },
    { sku: 'microwave-13cu', name: 'Toshiba 1.3cu ft Smart Sensor', price: 179.99, category: 'Appliances', image: '📦' },
    { sku: 'microwave-20cu', name: 'GE 2.0cu ft Over-the-Range', price: 349.99, category: 'Appliances', image: '📦' },

    // Vacuums - High Consideration (major purchase)
    { sku: 'vacuum-dirt-devil', name: 'Dirt Devil Upright Vacuum', price: 49.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-bissell-upright', name: 'Bissell CleanView Upright', price: 89.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-shark-navigator', name: 'Shark Navigator Lift-Away', price: 199.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-shark-rotator', name: 'Shark Rotator Powered Lift-Away', price: 299.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-dyson-v8', name: 'Dyson V8 Cordless Stick Vacuum', price: 449.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-dyson-v11', name: 'Dyson V11 Torque Drive Cordless', price: 599.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-dyson-v15', name: 'Dyson V15 Detect Cordless', price: 749.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-roomba-694', name: 'iRobot Roomba 694 Robot Vacuum', price: 274.99, category: 'Appliances', image: '🤖' },
    { sku: 'vacuum-roomba-j7', name: 'iRobot Roomba j7+ Self-Emptying', price: 799.99, category: 'Appliances', image: '🤖' },
    { sku: 'vacuum-eufy-robovac', name: 'eufy RoboVac 11S Robot Vacuum', price: 199.99, category: 'Appliances', image: '🤖' },
    { sku: 'vacuum-handheld', name: 'Black+Decker Handheld Vacuum', price: 39.99, category: 'Appliances', image: '🧹' },
    { sku: 'vacuum-shop-vac', name: 'Shop-Vac 6gal Wet/Dry Vacuum', price: 79.99, category: 'Appliances', image: '🧹' },

    // Air Quality & Climate
    { sku: 'air-purifier-levoit', name: 'Levoit Core 300 Air Purifier', price: 99.99, category: 'Appliances', image: '💨' },
    { sku: 'air-purifier-dyson', name: 'Dyson Pure Cool Air Purifier Fan', price: 499.99, category: 'Appliances', image: '💨' },
    { sku: 'humidifier-cool-mist', name: 'Honeywell Cool Mist Humidifier', price: 49.99, category: 'Appliances', image: '💧' },
    { sku: 'humidifier-ultrasonic', name: 'TaoTronics Ultrasonic Humidifier', price: 39.99, category: 'Appliances', image: '💧' },
    { sku: 'dehumidifier-30pint', name: 'hOmeLabs 30-Pint Dehumidifier', price: 189.99, category: 'Appliances', image: '💧' },
    { sku: 'fan-tower', name: 'Lasko 42" Tower Fan', price: 49.99, category: 'Appliances', image: '💨' },
    { sku: 'fan-box', name: 'Lasko 20" Box Fan', price: 24.99, category: 'Appliances', image: '💨' },
    { sku: 'heater-space', name: 'Lasko Ceramic Space Heater', price: 39.99, category: 'Appliances', image: '🔥' },

    // Irons & Garment Care
    { sku: 'iron-basic', name: 'Black+Decker Steam Iron', price: 19.99, category: 'Appliances', image: '👔' },
    { sku: 'iron-rowenta', name: 'Rowenta Professional Steam Iron', price: 89.99, category: 'Appliances', image: '👔' },
    { sku: 'steamer-garment', name: 'Conair Handheld Garment Steamer', price: 29.99, category: 'Appliances', image: '👔' },
    { sku: 'steamer-professional', name: 'Jiffy Pro Line Garment Steamer', price: 179.99, category: 'Appliances', image: '👔' },

    // Personal Care Appliances
    { sku: 'hair-dryer-conair', name: 'Conair 1875W Hair Dryer', price: 24.99, category: 'Appliances', image: '💇' },
    { sku: 'hair-dryer-dyson', name: 'Dyson Supersonic Hair Dryer', price: 429.99, category: 'Appliances', image: '💇' },
    { sku: 'shaver-electric', name: 'Philips Norelco Electric Shaver', price: 89.99, category: 'Appliances', image: '🪒' },
    { sku: 'scale-bathroom', name: 'Etekcity Digital Bathroom Scale', price: 19.99, category: 'Appliances', image: '⚖️' },
    { sku: 'scale-smart', name: 'Withings Body+ Smart Scale', price: 99.99, category: 'Appliances', image: '⚖️' },
    { sku: 'scale-kitchen', name: 'Ozeri Digital Kitchen Scale', price: 14.99, category: 'Appliances', image: '⚖️' },
  ],

  'Clothing & Accessories': [
    // Men's Basics - Outcome: Moving In, Everyday
    { sku: 'mens-tshirt-white', name: 'Hanes Men\'s White T-Shirts 6pk', price: 14.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'mens-tshirt-black', name: 'Hanes Men\'s Black T-Shirts 6pk', price: 14.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'mens-tshirt-gray', name: 'Fruit of Loom Men\'s Gray T-Shirts 5pk', price: 12.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'mens-polo', name: 'George Men\'s Polo Shirt', price: 9.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'mens-jeans', name: 'Wrangler Men\'s Regular Fit Jeans', price: 24.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'mens-khakis', name: 'Dickies Men\'s Work Pants', price: 29.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'mens-shorts', name: 'Hanes Men\'s Jersey Shorts', price: 9.99, category: 'Clothing & Accessories', image: '🩳' },
    { sku: 'mens-socks-athletic', name: 'Hanes Men\'s Athletic Socks 12pk', price: 12.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'mens-socks-dress', name: 'Gold Toe Men\'s Dress Socks 6pk', price: 14.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'mens-underwear-briefs', name: 'Hanes Men\'s Briefs 7pk', price: 16.99, category: 'Clothing & Accessories', image: '🩲' },
    { sku: 'mens-underwear-boxers', name: 'Fruit of Loom Men\'s Boxers 5pk', price: 14.99, category: 'Clothing & Accessories', image: '🩲' },

    // Women's Basics - Outcome: Moving In, Everyday
    { sku: 'womens-tshirt-white', name: 'Hanes Women\'s V-Neck Tees 4pk', price: 12.99, category: 'Clothing & Accessories', image: '👚' },
    { sku: 'womens-tshirt-black', name: 'Hanes Women\'s Crew Neck Tees 4pk', price: 12.99, category: 'Clothing & Accessories', image: '👚' },
    { sku: 'womens-tank-tops', name: 'Fruit of Loom Women\'s Tank Tops 5pk', price: 14.99, category: 'Clothing & Accessories', image: '👚' },
    { sku: 'womens-leggings', name: 'No Boundaries Women\'s Leggings', price: 7.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'womens-jeans', name: 'Time & Tru Women\'s Skinny Jeans', price: 19.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'womens-yoga-pants', name: 'Athletic Works Women\'s Yoga Pants', price: 12.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'womens-socks', name: 'Hanes Women\'s No Show Socks 10pk', price: 9.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'womens-underwear', name: 'Hanes Women\'s Underwear 6pk', price: 12.99, category: 'Clothing & Accessories', image: '👙' },
    { sku: 'womens-sports-bra', name: 'Athletic Works Women\'s Sports Bra 2pk', price: 12.99, category: 'Clothing & Accessories', image: '👙' },

    // Kids Basics - Outcome: Back to School, New Wardrobe
    { sku: 'boys-tshirts', name: 'Garanimals Boys\' T-Shirts 5pk', price: 9.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'boys-jeans', name: 'Wrangler Boys\' Jeans', price: 14.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'boys-shorts', name: 'Garanimals Boys\' Shorts', price: 7.99, category: 'Clothing & Accessories', image: '🩳' },
    { sku: 'boys-socks', name: 'Hanes Boys\' Crew Socks 10pk', price: 7.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'boys-underwear', name: 'Fruit of Loom Boys\' Briefs 7pk', price: 9.99, category: 'Clothing & Accessories', image: '🩲' },
    { sku: 'girls-tshirts', name: 'Garanimals Girls\' Tees 5pk', price: 9.99, category: 'Clothing & Accessories', image: '👚' },
    { sku: 'girls-leggings', name: 'Garanimals Girls\' Leggings 3pk', price: 8.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'girls-shorts', name: 'Garanimals Girls\' Shorts', price: 7.99, category: 'Clothing & Accessories', image: '🩳' },
    { sku: 'girls-socks', name: 'Hanes Girls\' No Show Socks 10pk', price: 7.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'girls-underwear', name: 'Fruit of Loom Girls\' Underwear 7pk', price: 9.99, category: 'Clothing & Accessories', image: '👙' },

    // Athletic Wear - Outcome: Workout Journey, Fitness
    { sku: 'mens-athletic-shirt', name: 'Athletic Works Men\'s Performance Tee', price: 6.99, category: 'Clothing & Accessories', image: '👕' },
    { sku: 'mens-athletic-shorts', name: 'Athletic Works Men\'s Athletic Shorts', price: 9.99, category: 'Clothing & Accessories', image: '🩳' },
    { sku: 'mens-athletic-pants', name: 'Athletic Works Men\'s Track Pants', price: 12.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'womens-athletic-shirt', name: 'Athletic Works Women\'s Performance Tee', price: 6.99, category: 'Clothing & Accessories', image: '👚' },
    { sku: 'womens-athletic-shorts', name: 'Athletic Works Women\'s Athletic Shorts', price: 9.99, category: 'Clothing & Accessories', image: '🩳' },
    { sku: 'womens-athletic-capris', name: 'Athletic Works Women\'s Capri Leggings', price: 10.99, category: 'Clothing & Accessories', image: '👖' },
    { sku: 'athletic-headband', name: 'Athletic Works Sweatbands 3pk', price: 4.99, category: 'Clothing & Accessories', image: '🎀' },
    { sku: 'compression-socks', name: 'Athletic Compression Socks 3pk', price: 9.99, category: 'Clothing & Accessories', image: '🧦' },

    // Baby Clothing - Outcome: New Baby
    { sku: 'baby-onesies-nb', name: 'Gerber Baby Onesies Newborn 5pk', price: 12.99, category: 'Clothing & Accessories', image: '👶' },
    { sku: 'baby-onesies-6m', name: 'Gerber Baby Onesies 6-9 Months 5pk', price: 12.99, category: 'Clothing & Accessories', image: '👶' },
    { sku: 'baby-sleepers', name: 'Gerber Baby Sleepers 3pk', price: 16.99, category: 'Clothing & Accessories', image: '👶' },
    { sku: 'baby-socks', name: 'Gerber Baby Socks 8pk', price: 6.99, category: 'Clothing & Accessories', image: '🧦' },
    { sku: 'baby-bibs', name: 'Gerber Baby Bibs 8pk', price: 7.99, category: 'Clothing & Accessories', image: '👶' },
    { sku: 'baby-hats', name: 'Gerber Baby Caps 4pk', price: 8.99, category: 'Clothing & Accessories', image: '🧢' },
    { sku: 'baby-mittens', name: 'Gerber Baby Mittens 4pk', price: 5.99, category: 'Clothing & Accessories', image: '🧤' },

    // Shoes - Outcome: Back to School, Everyday
    { sku: 'mens-sneakers', name: 'Athletic Works Men\'s Sneakers', price: 19.99, category: 'Clothing & Accessories', image: '👟' },
    { sku: 'mens-slides', name: 'Men\'s Comfort Slides', price: 12.99, category: 'Clothing & Accessories', image: '🩴' },
    { sku: 'womens-sneakers', name: 'Athletic Works Women\'s Sneakers', price: 19.99, category: 'Clothing & Accessories', image: '👟' },
    { sku: 'womens-sandals', name: 'Women\'s Comfort Sandals', price: 14.99, category: 'Clothing & Accessories', image: '👡' },
    { sku: 'kids-sneakers-boys', name: 'Athletic Works Boys\' Sneakers', price: 14.99, category: 'Clothing & Accessories', image: '👟' },
    { sku: 'kids-sneakers-girls', name: 'Athletic Works Girls\' Sneakers', price: 14.99, category: 'Clothing & Accessories', image: '👟' },

    // Bags & Backpacks - Outcome: Back to School, Travel
    { sku: 'backpack-classic', name: 'Trailmaker 17" Classic Backpack', price: 9.99, category: 'Clothing & Accessories', image: '🎒' },
    { sku: 'backpack-laptop', name: 'Swiss Gear Laptop Backpack', price: 39.99, category: 'Clothing & Accessories', image: '🎒' },
    { sku: 'backpack-kids', name: 'Kids Character Backpack 16"', price: 12.99, category: 'Clothing & Accessories', image: '🎒' },
    { sku: 'lunchbox', name: 'Insulated Lunch Box', price: 7.99, category: 'Clothing & Accessories', image: '🍱' },
    { sku: 'gym-bag', name: 'Everest Gym Duffel Bag', price: 14.99, category: 'Clothing & Accessories', image: '👜' },
    { sku: 'tote-bag', name: 'Reusable Shopping Tote 3pk', price: 5.99, category: 'Clothing & Accessories', image: '👜' },
    { sku: 'diaper-bag', name: 'Baby Essentials Diaper Bag', price: 24.99, category: 'Clothing & Accessories', image: '👜' },

    // Accessories - Outcome: Various
    { sku: 'belt-mens', name: 'George Men\'s Leather Belt', price: 9.99, category: 'Clothing & Accessories', image: '⚡' },
    { sku: 'belt-womens', name: 'Time & Tru Women\'s Belt', price: 7.99, category: 'Clothing & Accessories', image: '⚡' },
    { sku: 'baseball-cap', name: 'No Boundaries Baseball Cap', price: 5.99, category: 'Clothing & Accessories', image: '🧢' },
    { sku: 'beanie', name: 'Winter Knit Beanie', price: 6.99, category: 'Clothing & Accessories', image: '🧢' },
    { sku: 'gloves-winter', name: 'Fleece Winter Gloves', price: 7.99, category: 'Clothing & Accessories', image: '🧤' },
    { sku: 'scarf', name: 'Knit Winter Scarf', price: 9.99, category: 'Clothing & Accessories', image: '🧣' },
    { sku: 'sunglasses', name: 'Foster Grant Sunglasses', price: 12.99, category: 'Clothing & Accessories', image: '🕶️' },
    { sku: 'wallet-mens', name: 'George Men\'s Bifold Wallet', price: 12.99, category: 'Clothing & Accessories', image: '👛' },
    { sku: 'wallet-womens', name: 'Time & Tru Women\'s Wallet', price: 14.99, category: 'Clothing & Accessories', image: '👛' },
    { sku: 'umbrella', name: 'Compact Travel Umbrella', price: 8.99, category: 'Clothing & Accessories', image: '☂️' },
    { sku: 'watch-mens', name: 'Timex Men\'s Digital Watch', price: 29.99, category: 'Clothing & Accessories', image: '⌚' },
    { sku: 'watch-womens', name: 'Timex Women\'s Analog Watch', price: 34.99, category: 'Clothing & Accessories', image: '⌚' },
  ],

  'Sports & Outdoors': [
    // Fitness Equipment - Outcome: Home Gym, Fitness Journey
    { sku: 'dumbbells-5lb', name: 'CAP Neoprene Dumbbell 5lb Set', price: 12.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'dumbbells-10lb', name: 'CAP Neoprene Dumbbell 10lb Set', price: 19.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'dumbbells-20lb', name: 'CAP Cast Iron Dumbbell 20lb Set', price: 39.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'dumbbell-set-adjustable', name: 'Bowflex SelectTech Adjustable Dumbbells', price: 349.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'kettlebell-15lb', name: 'CAP Kettlebell 15lb', price: 24.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'kettlebell-25lb', name: 'CAP Kettlebell 25lb', price: 39.99, category: 'Sports & Outdoors', image: '🏋️' },
    { sku: 'yoga-mat', name: 'Gaiam Yoga Mat 5mm', price: 19.99, category: 'Sports & Outdoors', image: '🧘' },
    { sku: 'yoga-mat-thick', name: 'Gaiam Premium Yoga Mat 6mm', price: 29.99, category: 'Sports & Outdoors', image: '🧘' },
    { sku: 'yoga-blocks', name: 'Gaiam Yoga Block 2-Pack', price: 12.99, category: 'Sports & Outdoors', image: '🧘' },
    { sku: 'resistance-bands', name: 'Fit Simplify Resistance Bands 5pk', price: 12.99, category: 'Sports & Outdoors', image: '💪' },
    { sku: 'exercise-ball', name: 'Gaiam Balance Ball 65cm', price: 19.99, category: 'Sports & Outdoors', image: '⚽' },
    { sku: 'jump-rope', name: 'WOD Nation Speed Jump Rope', price: 9.99, category: 'Sports & Outdoors', image: '🪢' },
    { sku: 'pull-up-bar', name: 'Iron Gym Doorway Pull-Up Bar', price: 29.99, category: 'Sports & Outdoors', image: '🚪' },
    { sku: 'foam-roller', name: 'AmazonBasics Foam Roller 18"', price: 14.99, category: 'Sports & Outdoors', image: '🔵' },
    { sku: 'ab-roller', name: 'Perfect Fitness Ab Carver Pro', price: 29.99, category: 'Sports & Outdoors', image: '🔵' },
    { sku: 'push-up-bars', name: 'Perfect Fitness Push Up Stands', price: 19.99, category: 'Sports & Outdoors', image: '💪' },

    // Camping Gear - Outcome: Camping Trip
    { sku: 'tent-2-person', name: 'Coleman Sundome 2-Person Tent', price: 49.99, category: 'Sports & Outdoors', image: '⛺' },
    { sku: 'tent-4-person', name: 'Coleman Sundome 4-Person Tent', price: 79.99, category: 'Sports & Outdoors', image: '⛺' },
    { sku: 'tent-6-person', name: 'Coleman Cabin Tent 6-Person', price: 129.99, category: 'Sports & Outdoors', image: '⛺' },
    { sku: 'sleeping-bag-adult', name: 'Coleman Sleeping Bag Adult', price: 29.99, category: 'Sports & Outdoors', image: '🛏️' },
    { sku: 'sleeping-bag-double', name: 'Coleman Double Sleeping Bag', price: 59.99, category: 'Sports & Outdoors', image: '🛏️' },
    { sku: 'sleeping-pad', name: 'Coleman Self-Inflating Sleeping Pad', price: 39.99, category: 'Sports & Outdoors', image: '🛏️' },
    { sku: 'camping-chair', name: 'Coleman Folding Camp Chair', price: 19.99, category: 'Sports & Outdoors', image: '🪑' },
    { sku: 'camping-table', name: 'Coleman Folding Camp Table', price: 39.99, category: 'Sports & Outdoors', image: '🪑' },
    { sku: 'cooler-16qt', name: 'Coleman 16-Quart Cooler', price: 19.99, category: 'Sports & Outdoors', image: '🧊' },
    { sku: 'cooler-48qt', name: 'Coleman 48-Quart Cooler', price: 39.99, category: 'Sports & Outdoors', image: '🧊' },
    { sku: 'cooler-yeti-20', name: 'YETI Roadie 24 Cooler', price: 199.99, category: 'Sports & Outdoors', image: '🧊' },
    { sku: 'camping-lantern', name: 'Coleman LED Camping Lantern', price: 24.99, category: 'Sports & Outdoors', image: '🔦' },
    { sku: 'headlamp', name: 'Energizer LED Headlamp', price: 14.99, category: 'Sports & Outdoors', image: '🔦' },
    { sku: 'flashlight', name: 'Maglite LED Flashlight', price: 24.99, category: 'Sports & Outdoors', image: '🔦' },
    { sku: 'camping-stove', name: 'Coleman Portable Camping Stove', price: 49.99, category: 'Sports & Outdoors', image: '🔥' },
    { sku: 'camping-cookset', name: 'Coleman Camping Cookware Set', price: 29.99, category: 'Sports & Outdoors', image: '🍳' },
    { sku: 'camping-backpack', name: 'Ozark Trail 50L Backpack', price: 39.99, category: 'Sports & Outdoors', image: '🎒' },
    { sku: 'trekking-poles', name: 'Cascade Mountain Tech Trekking Poles', price: 29.99, category: 'Sports & Outdoors', image: '🥾' },
    { sku: 'hammock', name: 'ENO DoubleNest Hammock', price: 69.99, category: 'Sports & Outdoors', image: '🌴' },

    // Sports Balls & Recreation - Outcome: Family Fun, Sports
    { sku: 'basketball', name: 'Spalding NBA Street Basketball', price: 19.99, category: 'Sports & Outdoors', image: '🏀' },
    { sku: 'basketball-indoor', name: 'Spalding NBA Official Game Ball', price: 149.99, category: 'Sports & Outdoors', image: '🏀' },
    { sku: 'football', name: 'Wilson NFL Football', price: 24.99, category: 'Sports & Outdoors', image: '🏈' },
    { sku: 'soccer-ball', name: 'Adidas MLS Soccer Ball', price: 24.99, category: 'Sports & Outdoors', image: '⚽' },
    { sku: 'volleyball', name: 'Wilson Outdoor Volleyball', price: 19.99, category: 'Sports & Outdoors', image: '🏐' },
    { sku: 'baseball-glove', name: 'Rawlings Player Series Baseball Glove', price: 29.99, category: 'Sports & Outdoors', image: '🧤' },
    { sku: 'baseball-bat', name: 'Easton Ghost Baseball Bat', price: 79.99, category: 'Sports & Outdoors', image: '⚾' },
    { sku: 'tennis-racket', name: 'Wilson Federer Tennis Racket', price: 49.99, category: 'Sports & Outdoors', image: '🎾' },
    { sku: 'badminton-set', name: 'Franklin Badminton Set', price: 24.99, category: 'Sports & Outdoors', image: '🏸' },
    { sku: 'frisbee', name: 'Discraft Ultra-Star Frisbee', price: 12.99, category: 'Sports & Outdoors', image: '🥏' },
    { sku: 'cornhole-set', name: 'GoSports Cornhole Bean Bag Toss Game', price: 99.99, category: 'Sports & Outdoors', image: '🎯' },
    { sku: 'spike-ball', name: 'Spikeball Game Set', price: 59.99, category: 'Sports & Outdoors', image: '🏐' },

    // Bikes & Scooters - Outcome: Transportation, Recreation
    { sku: 'bike-adult-mens', name: 'Huffy Men\'s Mountain Bike 26"', price: 149.99, category: 'Sports & Outdoors', image: '🚴' },
    { sku: 'bike-adult-womens', name: 'Schwinn Women\'s Cruiser Bike 26"', price: 199.99, category: 'Sports & Outdoors', image: '🚴' },
    { sku: 'bike-kids', name: 'Huffy Kids\' Bike 20"', price: 99.99, category: 'Sports & Outdoors', image: '🚴' },
    { sku: 'bike-helmet-adult', name: 'Bell Adult Bike Helmet', price: 29.99, category: 'Sports & Outdoors', image: '🪖' },
    { sku: 'bike-helmet-kids', name: 'Bell Kids\' Bike Helmet', price: 19.99, category: 'Sports & Outdoors', image: '🪖' },
    { sku: 'bike-lock', name: 'Kryptonite U-Lock', price: 34.99, category: 'Sports & Outdoors', image: '🔒' },
    { sku: 'scooter-kids', name: 'Razor A Kick Scooter', price: 29.99, category: 'Sports & Outdoors', image: '🛴' },
    { sku: 'skateboard', name: 'WhiteFang Skateboard Complete', price: 39.99, category: 'Sports & Outdoors', image: '🛹' },

    // Water Sports & Pool - Outcome: Summer Fun
    { sku: 'swim-goggles-adult', name: 'Speedo Vanquisher Swim Goggles', price: 14.99, category: 'Sports & Outdoors', image: '🥽' },
    { sku: 'swim-goggles-kids', name: 'Speedo Kids\' Swim Goggles', price: 9.99, category: 'Sports & Outdoors', image: '🥽' },
    { sku: 'pool-float-adult', name: 'Intex Inflatable Pool Float', price: 19.99, category: 'Sports & Outdoors', image: '🏊' },
    { sku: 'pool-float-kids', name: 'SwimSchool Toddler Float', price: 12.99, category: 'Sports & Outdoors', image: '🏊' },
    { sku: 'snorkel-set', name: 'U.S. Divers Snorkel Set', price: 29.99, category: 'Sports & Outdoors', image: '🤿' },
    { sku: 'life-jacket-adult', name: 'Onyx Adult Life Jacket', price: 29.99, category: 'Sports & Outdoors', image: '🦺' },
    { sku: 'life-jacket-kids', name: 'Onyx Kids\' Life Jacket', price: 24.99, category: 'Sports & Outdoors', image: '🦺' },
    { sku: 'beach-towel', name: 'Oversized Beach Towel', price: 12.99, category: 'Sports & Outdoors', image: '🏖️' },

    // Fishing - Outcome: Fishing Trip
    { sku: 'fishing-rod-combo', name: 'Shakespeare Fishing Rod Combo', price: 39.99, category: 'Sports & Outdoors', image: '🎣' },
    { sku: 'fishing-tackle-box', name: 'Plano Tackle Box', price: 19.99, category: 'Sports & Outdoors', image: '🧰' },
    { sku: 'fishing-lures', name: 'Bass Fishing Lures Kit 100pcs', price: 24.99, category: 'Sports & Outdoors', image: '🎣' },

    // Sports Accessories
    { sku: 'water-bottle-32oz', name: 'Contigo AUTOSEAL Water Bottle 32oz', price: 12.99, category: 'Sports & Outdoors', image: '💧' },
    { sku: 'water-bottle-insulated', name: 'Hydro Flask 32oz Insulated', price: 44.99, category: 'Sports & Outdoors', image: '💧' },
    { sku: 'shaker-bottle', name: 'BlenderBottle Protein Shaker', price: 9.99, category: 'Sports & Outdoors', image: '🥤' },
    { sku: 'sports-towel', name: 'Fit Spirit Microfiber Towel 3pk', price: 14.99, category: 'Sports & Outdoors', image: '🧖' },
    { sku: 'first-aid-kit', name: 'Coleman Camping First Aid Kit', price: 19.99, category: 'Sports & Outdoors', image: '🩹' },
    { sku: 'sunscreen-sport', name: 'Coppertone Sport Sunscreen SPF 50', price: 9.99, category: 'Sports & Outdoors', image: '☀️' },
  ],

  'Health & Beauty': [
    // Personal Care - Low Consideration (daily essentials)
    { sku: 'shampoo-pantene', name: 'Pantene Pro-V Shampoo 25.4oz', price: 6.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'shampoo-head-shoulders', name: 'Head & Shoulders Shampoo 23.7oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'shampoo-herbal-essences', name: 'Herbal Essences Shampoo 13.5oz', price: 4.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'conditioner-pantene', name: 'Pantene Pro-V Conditioner 24oz', price: 6.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'conditioner-tresemme', name: 'TRESemmé Conditioner 28oz', price: 5.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'body-wash-dove', name: 'Dove Body Wash 22oz', price: 6.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'body-wash-old-spice', name: 'Old Spice Body Wash 18oz', price: 5.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'body-wash-olay', name: 'Olay Body Wash 22oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'bar-soap-dove', name: 'Dove Bar Soap 8pk', price: 9.99, category: 'Health & Beauty', image: '🧼' },
    { sku: 'bar-soap-irish-spring', name: 'Irish Spring Bar Soap 8pk', price: 6.99, category: 'Health & Beauty', image: '🧼' },
    { sku: 'hand-soap-softsoap', name: 'Softsoap Liquid Hand Soap 50oz', price: 4.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'hand-soap-method', name: 'Method Foaming Hand Soap 3pk', price: 9.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'toothpaste-colgate', name: 'Colgate Total Toothpaste 4.8oz', price: 4.99, category: 'Health & Beauty', image: '🦷' },
    { sku: 'toothpaste-crest', name: 'Crest 3D White Toothpaste 4.1oz', price: 5.49, category: 'Health & Beauty', image: '🦷' },
    { sku: 'toothbrush-colgate', name: 'Colgate 360 Toothbrush 4pk', price: 7.99, category: 'Health & Beauty', image: '🪥' },
    { sku: 'toothbrush-electric', name: 'Oral-B Electric Toothbrush', price: 39.99, category: 'Health & Beauty', image: '🪥' },
    { sku: 'mouthwash-listerine', name: 'Listerine Mouthwash 1L', price: 6.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'deodorant-mens', name: 'Old Spice Deodorant 2.6oz', price: 4.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'deodorant-womens', name: 'Secret Clinical Deodorant 2.6oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'deodorant-dove', name: 'Dove Antiperspirant 2.6oz', price: 5.99, category: 'Health & Beauty', image: '🧴' },

    // Skincare - Medium Consideration
    { sku: 'face-wash-cetaphil', name: 'Cetaphil Gentle Face Cleanser 16oz', price: 12.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'face-wash-cerave', name: 'CeraVe Foaming Facial Cleanser 16oz', price: 14.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'face-wash-neutrogena', name: 'Neutrogena Oil-Free Acne Wash 9.1oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'moisturizer-cetaphil', name: 'Cetaphil Daily Facial Moisturizer 4oz', price: 14.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'moisturizer-cerave', name: 'CeraVe Moisturizing Cream 16oz', price: 17.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'moisturizer-olay', name: 'Olay Regenerist Moisturizer 1.7oz', price: 24.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'sunscreen-neutrogena', name: 'Neutrogena Ultra Sheer SPF 55 3oz', price: 9.99, category: 'Health & Beauty', image: '☀️' },
    { sku: 'sunscreen-coppertone', name: 'Coppertone Ultra Guard SPF 70 8oz', price: 11.99, category: 'Health & Beauty', image: '☀️' },
    { sku: 'lip-balm-chapstick', name: 'ChapStick Classic 3pk', price: 3.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'lip-balm-burt', name: 'Burt\'s Bees Lip Balm 4pk', price: 9.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'lotion-jergens', name: 'Jergens Ultra Healing Lotion 21oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'lotion-aveeno', name: 'Aveeno Daily Moisturizing Lotion 18oz', price: 10.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'body-lotion-nivea', name: 'Nivea Body Lotion 16.9oz', price: 6.99, category: 'Health & Beauty', image: '🧴' },

    // Hair Care & Styling
    { sku: 'hair-gel-got2b', name: 'got2b Glued Styling Gel 6oz', price: 5.99, category: 'Health & Beauty', image: '💇' },
    { sku: 'hairspray-tresemme', name: 'TRESemmé Hairspray 11oz', price: 4.99, category: 'Health & Beauty', image: '💇' },
    { sku: 'hair-mousse', name: 'TRESemmé Mousse 10.5oz', price: 4.99, category: 'Health & Beauty', image: '💇' },
    { sku: 'dry-shampoo', name: 'Batiste Dry Shampoo 6.73oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'hair-brush-paddle', name: 'Revlon Paddle Hair Brush', price: 8.99, category: 'Health & Beauty', image: '💇' },
    { sku: 'hair-comb-set', name: 'Wide Tooth Comb Set 3pk', price: 5.99, category: 'Health & Beauty', image: '💇' },
    { sku: 'hair-ties', name: 'Scunci Hair Ties 100pk', price: 6.99, category: 'Health & Beauty', image: '🎀' },

    // Cosmetics - Medium Consideration
    { sku: 'foundation-maybelline', name: 'Maybelline Fit Me Foundation', price: 7.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'foundation-loreal', name: 'L\'Oreal True Match Foundation', price: 10.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'mascara-maybelline', name: 'Maybelline Great Lash Mascara', price: 5.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'mascara-covergirl', name: 'CoverGirl LashBlast Mascara', price: 7.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'lipstick-revlon', name: 'Revlon Super Lustrous Lipstick', price: 7.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'lip-gloss', name: 'NYX Butter Gloss', price: 5.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'eyeliner-maybelline', name: 'Maybelline Eye Studio Liner', price: 6.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'eyeshadow-palette', name: 'e.l.f. Eyeshadow Palette', price: 10.99, category: 'Health & Beauty', image: '💄' },
    { sku: 'makeup-remover', name: 'Neutrogena Makeup Remover Wipes 25ct', price: 6.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'nail-polish-essie', name: 'Essie Nail Polish', price: 9.99, category: 'Health & Beauty', image: '💅' },
    { sku: 'nail-polish-remover', name: 'Cutex Nail Polish Remover 6.76oz', price: 3.99, category: 'Health & Beauty', image: '💅' },

    // Shaving & Grooming
    { sku: 'razors-mens-disposable', name: 'Gillette Disposable Razors 12pk', price: 11.99, category: 'Health & Beauty', image: '🪒' },
    { sku: 'razors-womens', name: 'Schick Intuition Razor + 2 Cartridges', price: 10.99, category: 'Health & Beauty', image: '🪒' },
    { sku: 'shaving-cream-mens', name: 'Gillette Foamy Shaving Cream 11oz', price: 3.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'shaving-gel-womens', name: 'Skintimate Shaving Gel 7oz', price: 3.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'aftershave', name: 'Nivea Men Aftershave 3.3oz', price: 7.99, category: 'Health & Beauty', image: '🧴' },

    // Feminine Care
    { sku: 'pads-always', name: 'Always Ultra Thin Pads 36ct', price: 7.99, category: 'Health & Beauty', image: '🩹' },
    { sku: 'tampons-tampax', name: 'Tampax Pearl Tampons 36ct', price: 8.99, category: 'Health & Beauty', image: '🩹' },
    { sku: 'panty-liners', name: 'Carefree Panty Liners 54ct', price: 4.99, category: 'Health & Beauty', image: '🩹' },

    // Vitamins & Supplements - Medium Consideration
    { sku: 'multivitamin-mens', name: 'Centrum Men\'s Multivitamin 200ct', price: 17.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'multivitamin-womens', name: 'Centrum Women\'s Multivitamin 200ct', price: 17.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'vitamin-d', name: 'Nature Made Vitamin D3 2000 IU 100ct', price: 12.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'vitamin-c', name: 'Emergen-C Vitamin C 30pk', price: 11.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'fish-oil', name: 'Nature Made Fish Oil 1200mg 100ct', price: 16.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'protein-powder-whey', name: 'Optimum Nutrition Gold Standard Whey 2lb', price: 34.99, category: 'Health & Beauty', image: '💪' },
    { sku: 'protein-powder-plant', name: 'Orgain Organic Plant Protein 2.03lb', price: 27.99, category: 'Health & Beauty', image: '💪' },
    { sku: 'probiotics', name: 'Culturelle Daily Probiotic 30ct', price: 24.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'melatonin', name: 'Nature Made Melatonin 3mg 240ct', price: 9.99, category: 'Health & Beauty', image: '💊' },

    // Medicine & First Aid - Low Consideration
    { sku: 'pain-relief-tylenol', name: 'Tylenol Extra Strength 100ct', price: 12.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'pain-relief-advil', name: 'Advil Pain Reliever 200ct', price: 14.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'allergy-zyrtec', name: 'Zyrtec Allergy Relief 70ct', price: 29.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'allergy-claritin', name: 'Claritin 24-Hour Allergy 70ct', price: 34.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'cold-medicine-dayquil', name: 'Vicks DayQuil Cold & Flu 48 LiquiCaps', price: 14.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'cold-medicine-nyquil', name: 'Vicks NyQuil Cold & Flu 24 LiquiCaps', price: 13.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'cough-drops', name: 'Halls Cough Drops 80ct', price: 7.99, category: 'Health & Beauty', image: '🍬' },
    { sku: 'antacid-tums', name: 'TUMS Antacid Chewable 160ct', price: 9.99, category: 'Health & Beauty', image: '💊' },
    { sku: 'band-aids', name: 'Band-Aid Adhesive Bandages 100ct', price: 6.99, category: 'Health & Beauty', image: '🩹' },
    { sku: 'thermometer-digital', name: 'Vicks Digital Thermometer', price: 9.99, category: 'Health & Beauty', image: '🌡️' },
    { sku: 'cotton-swabs', name: 'Q-tips Cotton Swabs 500ct', price: 4.99, category: 'Health & Beauty', image: '🧴' },
    { sku: 'cotton-balls', name: 'Swisspers Cotton Balls 300ct', price: 3.99, category: 'Health & Beauty', image: '☁️' },
  ],

  'Home Goods': [
    // Bedding - Outcome: Moving In, Dorm Setup
    { sku: 'sheet-set-twin', name: 'Mainstays Twin Sheet Set', price: 12.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'sheet-set-queen', name: 'Mainstays Queen Sheet Set', price: 16.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'sheet-set-king', name: 'Mainstays King Sheet Set', price: 19.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'pillows-standard', name: 'Mainstays Standard Pillows 2pk', price: 12.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'pillows-memory-foam', name: 'Beautyrest Memory Foam Pillows 2pk', price: 29.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'comforter-twin', name: 'Mainstays Twin Comforter', price: 19.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'comforter-queen', name: 'Mainstays Queen Comforter Set', price: 34.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'comforter-king', name: 'Mainstays King Comforter Set', price: 44.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'mattress-pad-twin', name: 'Mainstays Twin Mattress Pad', price: 14.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'mattress-pad-queen', name: 'Mainstays Queen Mattress Pad', price: 19.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'mattress-topper-memory', name: 'Lucid 2" Memory Foam Topper Queen', price: 49.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'blanket-throw', name: 'Mainstays Throw Blanket 50x60', price: 7.99, category: 'Home Goods', image: '🧣' },

    // Bath - Outcome: Moving In, Bathroom Refresh
    { sku: 'towel-set-bath', name: 'Mainstays Bath Towel 4pk', price: 14.99, category: 'Home Goods', image: '🛁' },
    { sku: 'towel-set-hand', name: 'Mainstays Hand Towel 6pk', price: 9.99, category: 'Home Goods', image: '🛁' },
    { sku: 'towel-set-wash', name: 'Mainstays Washcloth 12pk', price: 6.99, category: 'Home Goods', image: '🛁' },
    { sku: 'shower-curtain', name: 'Mainstays Shower Curtain 70x72', price: 7.99, category: 'Home Goods', image: '🚿' },
    { sku: 'shower-curtain-liner', name: 'PEVA Shower Curtain Liner', price: 4.99, category: 'Home Goods', image: '🚿' },
    { sku: 'bath-mat', name: 'Mainstays Bath Mat 20x32', price: 6.99, category: 'Home Goods', image: '🛁' },
    { sku: 'bath-rug-set', name: 'Mainstays Bath Rug Set 2pc', price: 12.99, category: 'Home Goods', image: '🛁' },
    { sku: 'toilet-brush-set', name: 'Better Homes Toilet Brush Set', price: 5.99, category: 'Home Goods', image: '🚽' },
    { sku: 'waste-basket', name: 'Sterilite Wastebasket 13qt', price: 4.99, category: 'Home Goods', image: '🗑️' },
    { sku: 'soap-dispenser', name: 'Better Homes Soap Dispenser', price: 6.99, category: 'Home Goods', image: '🧴' },
    { sku: 'toothbrush-holder', name: 'Better Homes Toothbrush Holder', price: 5.99, category: 'Home Goods', image: '🪥' },

    // Kitchen Essentials - Outcome: Moving In, First Kitchen
    { sku: 'cookware-set', name: 'Mainstays 15-Piece Cookware Set', price: 49.99, category: 'Home Goods', image: '🍳' },
    { sku: 'pot-set', name: 'Mainstays 7-Piece Pot Set', price: 29.99, category: 'Home Goods', image: '🍲' },
    { sku: 'bakeware-set', name: 'Mainstays 5-Piece Bakeware Set', price: 19.99, category: 'Home Goods', image: '🥐' },
    { sku: 'knife-set', name: 'Mainstays 14-Piece Knife Set', price: 19.99, category: 'Home Goods', image: '🔪' },
    { sku: 'cutting-board-set', name: 'Mainstays Cutting Board Set 3pk', price: 9.99, category: 'Home Goods', image: '🔪' },
    { sku: 'utensil-set', name: 'Mainstays Kitchen Utensil Set 17pc', price: 14.99, category: 'Home Goods', image: '🥄' },
    { sku: 'mixing-bowl-set', name: 'Mainstays Mixing Bowl Set 5pc', price: 12.99, category: 'Home Goods', image: '🥣' },
    { sku: 'measuring-cups', name: 'Mainstays Measuring Cup Set', price: 5.99, category: 'Home Goods', image: '🥄' },
    { sku: 'measuring-spoons', name: 'Mainstays Measuring Spoon Set', price: 3.99, category: 'Home Goods', image: '🥄' },
    { sku: 'dinnerware-set-12pc', name: 'Mainstays 12-Piece Dinnerware Set', price: 19.99, category: 'Home Goods', image: '🍽️' },
    { sku: 'dinnerware-set-30pc', name: 'Better Homes 30-Piece Dinnerware', price: 49.99, category: 'Home Goods', image: '🍽️' },
    { sku: 'glassware-set', name: 'Mainstays Drinking Glass Set 12pc', price: 12.99, category: 'Home Goods', image: '🥤' },
    { sku: 'silverware-set', name: 'Mainstays 40-Piece Silverware Set', price: 16.99, category: 'Home Goods', image: '🍴' },
    { sku: 'coffee-mugs', name: 'Mainstays Coffee Mug Set 6pk', price: 9.99, category: 'Home Goods', image: '☕' },
    { sku: 'can-opener', name: 'Mainstays Manual Can Opener', price: 3.99, category: 'Home Goods', image: '🔧' },
    { sku: 'colander', name: 'Mainstays Colander 3qt', price: 6.99, category: 'Home Goods', image: '🥣' },
    { sku: 'pot-holders', name: 'Mainstays Pot Holder Set 4pk', price: 5.99, category: 'Home Goods', image: '🧤' },

    // Storage & Organization - Outcome: Organization, Dorm Setup
    { sku: 'storage-bin-6qt', name: 'Sterilite 6qt Storage Box', price: 2.99, category: 'Home Goods', image: '📦' },
    { sku: 'storage-bin-32qt', name: 'Sterilite 32qt Storage Tote', price: 9.99, category: 'Home Goods', image: '📦' },
    { sku: 'storage-bin-66qt', name: 'Sterilite 66qt Storage Tote', price: 14.99, category: 'Home Goods', image: '📦' },
    { sku: 'drawer-organizer', name: 'Mainstays Drawer Organizer 6pk', price: 7.99, category: 'Home Goods', image: '📦' },
    { sku: 'closet-organizer', name: 'Better Homes Hanging Closet Organizer', price: 12.99, category: 'Home Goods', image: '👔' },
    { sku: 'hangers-velvet', name: 'Joy Mangano Velvet Hangers 50pk', price: 19.99, category: 'Home Goods', image: '👔' },
    { sku: 'hangers-plastic', name: 'Mainstays Plastic Hangers 20pk', price: 7.99, category: 'Home Goods', image: '👔' },
    { sku: 'shoe-rack', name: '3-Tier Shoe Rack', price: 14.99, category: 'Home Goods', image: '👟' },
    { sku: 'laundry-basket', name: 'Mainstays Laundry Basket', price: 6.99, category: 'Home Goods', image: '🧺' },
    { sku: 'hamper-popup', name: 'Mainstays Pop-Up Hamper', price: 7.99, category: 'Home Goods', image: '🧺' },
    { sku: 'over-door-hooks', name: 'Over-the-Door Hooks 5pk', price: 8.99, category: 'Home Goods', image: '🪝' },

    // Home Decor - Outcome: Room Makeover, Moving In
    { sku: 'curtains-panel', name: 'Mainstays Curtain Panel 84" 2pk', price: 14.99, category: 'Home Goods', image: '🪟' },
    { sku: 'curtain-rod', name: 'Mainstays Curtain Rod 28-48"', price: 9.99, category: 'Home Goods', image: '🪟' },
    { sku: 'area-rug-5x7', name: 'Mainstays Area Rug 5x7', price: 39.99, category: 'Home Goods', image: '🏠' },
    { sku: 'area-rug-8x10', name: 'Better Homes Area Rug 8x10', price: 79.99, category: 'Home Goods', image: '🏠' },
    { sku: 'door-mat', name: 'Mainstays Welcome Door Mat', price: 7.99, category: 'Home Goods', image: '🚪' },
    { sku: 'picture-frames-5x7', name: 'Mainstays Picture Frames 5x7 4pk', price: 12.99, category: 'Home Goods', image: '🖼️' },
    { sku: 'picture-frames-8x10', name: 'Mainstays Picture Frame 8x10', price: 7.99, category: 'Home Goods', image: '🖼️' },
    { sku: 'wall-clock', name: 'Mainstays 10" Wall Clock', price: 9.99, category: 'Home Goods', image: '🕐' },
    { sku: 'table-lamp', name: 'Mainstays Table Lamp', price: 14.99, category: 'Home Goods', image: '💡' },
    { sku: 'floor-lamp', name: 'Mainstays Floor Lamp', price: 29.99, category: 'Home Goods', image: '💡' },
    { sku: 'candles-jar', name: 'Better Homes Jar Candle 18oz', price: 9.99, category: 'Home Goods', image: '🕯️' },
    { sku: 'candles-pillar', name: 'Mainstays Pillar Candles 3pk', price: 7.99, category: 'Home Goods', image: '🕯️' },
    { sku: 'throw-pillows', name: 'Mainstays Decorative Pillows 2pk', price: 14.99, category: 'Home Goods', image: '🛋️' },
    { sku: 'mirror-wall', name: 'Mainstays 18x24 Wall Mirror', price: 19.99, category: 'Home Goods', image: '🪞' },

    // Small Furniture - Outcome: Dorm Setup, Moving In
    { sku: 'desk-lamp', name: 'Mainstays LED Desk Lamp', price: 14.99, category: 'Home Goods', image: '💡' },
    { sku: 'folding-table', name: 'Mainstays 4ft Folding Table', price: 29.99, category: 'Home Goods', image: '🪑' },
    { sku: 'folding-chairs', name: 'Cosco Folding Chair 4pk', price: 49.99, category: 'Home Goods', image: '🪑' },
    { sku: 'bookshelf-3-tier', name: 'Mainstays 3-Shelf Bookcase', price: 39.99, category: 'Home Goods', image: '📚' },
    { sku: 'bookshelf-5-tier', name: 'Mainstays 5-Shelf Bookcase', price: 59.99, category: 'Home Goods', image: '📚' },
    { sku: 'nightstand', name: 'Mainstays Nightstand', price: 29.99, category: 'Home Goods', image: '🛏️' },
    { sku: 'tv-stand', name: 'Mainstays TV Stand for 55" TV', price: 79.99, category: 'Home Goods', image: '📺' },
  ],

  'Office Supplies': [
    // School Supplies - Outcome: Back to School
    { sku: 'notebooks-wide', name: 'Mead Wide Ruled Notebooks 5pk', price: 4.99, category: 'Office Supplies', image: '📓' },
    { sku: 'notebooks-college', name: 'Mead College Ruled Notebooks 3pk', price: 3.99, category: 'Office Supplies', image: '📓' },
    { sku: 'composition-notebooks', name: 'Composition Notebooks 4pk', price: 3.99, category: 'Office Supplies', image: '📓' },
    { sku: 'spiral-notebooks-1subject', name: '1-Subject Spiral Notebooks 10pk', price: 5.99, category: 'Office Supplies', image: '📓' },
    { sku: 'spiral-notebooks-5subject', name: '5-Subject Spiral Notebook 200pg', price: 4.99, category: 'Office Supplies', image: '📓' },
    { sku: 'binders-1inch', name: 'Avery 1" Binders 4pk', price: 9.99, category: 'Office Supplies', image: '📁' },
    { sku: 'binders-2inch', name: 'Avery 2" Binder', price: 4.99, category: 'Office Supplies', image: '📁' },
    { sku: 'binder-dividers', name: 'Avery 8-Tab Dividers 3pk', price: 5.99, category: 'Office Supplies', image: '📑' },
    { sku: 'folders-pocket', name: 'Pocket Folders 12pk', price: 5.99, category: 'Office Supplies', image: '📁' },
    { sku: 'folders-file', name: 'File Folders Letter Size 100pk', price: 12.99, category: 'Office Supplies', image: '📁' },
    { sku: 'paper-loose-wide', name: 'Loose Leaf Wide Ruled 200ct', price: 3.99, category: 'Office Supplies', image: '📄' },
    { sku: 'paper-loose-college', name: 'Loose Leaf College Ruled 300ct', price: 4.99, category: 'Office Supplies', image: '📄' },
    { sku: 'index-cards-3x5', name: 'Index Cards 3x5 300ct', price: 3.99, category: 'Office Supplies', image: '📇' },
    { sku: 'index-cards-5x8', name: 'Index Cards 5x8 100ct', price: 4.99, category: 'Office Supplies', image: '📇' },
    { sku: 'sticky-notes', name: 'Post-it Notes 3x3 12pk', price: 9.99, category: 'Office Supplies', image: '📝' },
    { sku: 'sticky-notes-variety', name: 'Post-it Notes Variety Pack 24pk', price: 14.99, category: 'Office Supplies', image: '📝' },

    // Writing Instruments - Low Consideration
    { sku: 'pens-ballpoint-black', name: 'BIC Round Stic Black Pens 60pk', price: 7.99, category: 'Office Supplies', image: '✒️' },
    { sku: 'pens-ballpoint-blue', name: 'BIC Round Stic Blue Pens 60pk', price: 7.99, category: 'Office Supplies', image: '✒️' },
    { sku: 'pens-gel', name: 'Paper Mate InkJoy Gel Pens 14pk', price: 12.99, category: 'Office Supplies', image: '✒️' },
    { sku: 'pens-felt-tip', name: 'Paper Mate Flair Pens 16pk', price: 14.99, category: 'Office Supplies', image: '✒️' },
    { sku: 'pencils-no2', name: 'Ticonderoga #2 Pencils 96pk', price: 9.99, category: 'Office Supplies', image: '✏️' },
    { sku: 'pencils-mechanical', name: 'Paper Mate Mechanical Pencils 12pk', price: 7.99, category: 'Office Supplies', image: '✏️' },
    { sku: 'pencil-lead', name: 'BIC Pencil Lead Refills 0.7mm', price: 3.99, category: 'Office Supplies', image: '✏️' },
    { sku: 'erasers-pink', name: 'Pink Pearl Erasers 12pk', price: 3.99, category: 'Office Supplies', image: '🧹' },
    { sku: 'highlighters', name: 'Sharpie Highlighters 12pk', price: 9.99, category: 'Office Supplies', image: '🖍️' },
    { sku: 'markers-permanent', name: 'Sharpie Permanent Markers 12pk Black', price: 11.99, category: 'Office Supplies', image: '🖍️' },
    { sku: 'markers-washable', name: 'Crayola Washable Markers 40pk', price: 9.99, category: 'Office Supplies', image: '🖍️' },
    { sku: 'dry-erase-markers', name: 'Expo Dry Erase Markers 12pk', price: 14.99, category: 'Office Supplies', image: '🖍️' },
    { sku: 'crayons-24', name: 'Crayola Crayons 24ct', price: 2.49, category: 'Office Supplies', image: '🖍️' },
    { sku: 'colored-pencils', name: 'Crayola Colored Pencils 50ct', price: 7.99, category: 'Office Supplies', image: '✏️' },

    // Office Essentials - Outcome: Home Office Setup
    { sku: 'paper-copy', name: 'Hammermill Copy Paper 500 Sheets', price: 9.99, category: 'Office Supplies', image: '📄' },
    { sku: 'paper-printer', name: 'Hammermill Printer Paper 1500 Sheets', price: 24.99, category: 'Office Supplies', image: '📄' },
    { sku: 'stapler', name: 'Swingline Standard Stapler', price: 8.99, category: 'Office Supplies', image: '📎' },
    { sku: 'staples', name: 'Swingline Staples 5000ct', price: 4.99, category: 'Office Supplies', image: '📎' },
    { sku: 'stapler-heavy-duty', name: 'Swingline Heavy Duty Stapler', price: 19.99, category: 'Office Supplies', image: '📎' },
    { sku: 'paper-clips', name: 'Paper Clips 500ct', price: 2.99, category: 'Office Supplies', image: '📎' },
    { sku: 'binder-clips', name: 'Binder Clips Assorted 60pk', price: 5.99, category: 'Office Supplies', image: '📎' },
    { sku: 'tape-scotch', name: 'Scotch Transparent Tape 6pk', price: 8.99, category: 'Office Supplies', image: '📏' },
    { sku: 'tape-dispenser', name: 'Scotch Tape Dispenser', price: 5.99, category: 'Office Supplies', image: '📏' },
    { sku: 'tape-packing', name: 'Scotch Packing Tape 6pk', price: 12.99, category: 'Office Supplies', image: '📦' },
    { sku: 'tape-double-sided', name: 'Scotch Double-Sided Tape', price: 4.99, category: 'Office Supplies', image: '📏' },
    { sku: 'glue-sticks', name: 'Elmer\'s Glue Sticks 30pk', price: 9.99, category: 'Office Supplies', image: '🧴' },
    { sku: 'glue-white', name: 'Elmer\'s School Glue 4oz 4pk', price: 5.99, category: 'Office Supplies', image: '🧴' },
    { sku: 'scissors-8inch', name: 'Fiskars 8" Scissors', price: 6.99, category: 'Office Supplies', image: '✂️' },
    { sku: 'scissors-kids', name: 'Fiskars Kids Scissors 5" 3pk', price: 5.99, category: 'Office Supplies', image: '✂️' },
    { sku: 'ruler-12inch', name: '12" Plastic Ruler', price: 1.99, category: 'Office Supplies', image: '📏' },
    { sku: 'calculator-basic', name: 'Casio Basic Calculator', price: 7.99, category: 'Office Supplies', image: '🔢' },
    { sku: 'calculator-scientific', name: 'Texas Instruments Scientific Calculator', price: 14.99, category: 'Office Supplies', image: '🔢' },

    // Desk Accessories - Outcome: Home Office, Organization
    { sku: 'desk-organizer', name: 'Mesh Desk Organizer 5-Compartment', price: 12.99, category: 'Office Supplies', image: '📦' },
    { sku: 'pencil-cup', name: 'Mesh Pencil Cup', price: 4.99, category: 'Office Supplies', image: '🥤' },
    { sku: 'file-organizer', name: 'Mesh File Organizer 3-Tier', price: 14.99, category: 'Office Supplies', image: '📁' },
    { sku: 'letter-tray', name: 'Stackable Letter Tray 3pk', price: 12.99, category: 'Office Supplies', image: '📬' },
    { sku: 'mouse-pad', name: 'Basic Mouse Pad', price: 3.99, category: 'Office Supplies', image: '🖱️' },
    { sku: 'mouse-pad-wrist', name: 'Mouse Pad with Wrist Rest', price: 9.99, category: 'Office Supplies', image: '🖱️' },
    { sku: 'keyboard-wrist-rest', name: 'Keyboard Wrist Rest', price: 12.99, category: 'Office Supplies', image: '⌨️' },
    { sku: 'monitor-stand', name: 'Monitor Stand with Storage', price: 29.99, category: 'Office Supplies', image: '🖥️' },
    { sku: 'desk-pad', name: 'Large Desk Pad 31x15"', price: 14.99, category: 'Office Supplies', image: '📋' },
    { sku: 'clipboard', name: 'Clipboard Letter Size', price: 3.99, category: 'Office Supplies', image: '📋' },
    { sku: 'whiteboard-small', name: 'Small Dry Erase Board 11x14', price: 9.99, category: 'Office Supplies', image: '⬜' },
    { sku: 'whiteboard-large', name: 'Dry Erase Board 24x36', price: 24.99, category: 'Office Supplies', image: '⬜' },
    { sku: 'cork-board', name: 'Cork Board 24x36 with Pins', price: 19.99, category: 'Office Supplies', image: '📌' },
    { sku: 'push-pins', name: 'Push Pins Assorted 100pk', price: 3.99, category: 'Office Supplies', image: '📌' },

    // Filing & Storage - Outcome: Organization
    { sku: 'file-box', name: 'Bankers Box File Storage 12pk', price: 29.99, category: 'Office Supplies', image: '📦' },
    { sku: 'file-cabinet', name: 'Lorell 2-Drawer File Cabinet', price: 149.99, category: 'Office Supplies', image: '🗄️' },
    { sku: 'storage-cart', name: '3-Drawer Rolling Storage Cart', price: 39.99, category: 'Office Supplies', image: '🗃️' },
    { sku: 'magazine-holder', name: 'Magazine File Holder 3pk', price: 12.99, category: 'Office Supplies', image: '📚' },
    { sku: 'label-maker', name: 'Dymo LetraTag Label Maker', price: 19.99, category: 'Office Supplies', image: '🏷️' },
    { sku: 'labels-shipping', name: 'Avery Shipping Labels 100pk', price: 12.99, category: 'Office Supplies', image: '🏷️' },
    { sku: 'envelopes-10', name: '#10 Envelopes 500pk', price: 14.99, category: 'Office Supplies', image: '✉️' },
    { sku: 'envelopes-manila', name: 'Manila Envelopes 9x12 100pk', price: 19.99, category: 'Office Supplies', image: '✉️' },
    { sku: 'poly-mailers', name: 'Poly Mailers 10x13 100pk', price: 16.99, category: 'Office Supplies', image: '📦' },
    { sku: 'bubble-mailers', name: 'Bubble Mailers 6x10 25pk', price: 14.99, category: 'Office Supplies', image: '📦' },
  ],

  'Pet Care': [
    // Dog Food - Weekly Essentials
    { sku: 'dog-food-pedigree-30lb', name: 'Pedigree Adult Dry Dog Food 30lb', price: 29.99, category: 'Pet Care', image: '🐕' },
    { sku: 'dog-food-purina-one-16lb', name: 'Purina ONE SmartBlend 16.5lb', price: 24.99, category: 'Pet Care', image: '🐕' },
    { sku: 'dog-food-blue-buffalo-24lb', name: 'Blue Buffalo Life Protection 24lb', price: 49.99, category: 'Pet Care', image: '🐕' },
    { sku: 'dog-food-iams-30lb', name: 'IAMS ProActive Health 30lb', price: 34.99, category: 'Pet Care', image: '🐕' },
    { sku: 'dog-food-wet-pedigree', name: 'Pedigree Wet Dog Food 13.2oz 12pk', price: 14.99, category: 'Pet Care', image: '🥫' },
    { sku: 'dog-food-wet-cesar', name: 'Cesar Classic Loaf 3.5oz 24pk', price: 21.99, category: 'Pet Care', image: '🥫' },
    { sku: 'dog-food-puppy', name: 'Purina Puppy Chow 16.5lb', price: 24.99, category: 'Pet Care', image: '🐕' },
    { sku: 'dog-food-senior', name: 'Pedigree Senior Dog Food 15lb', price: 19.99, category: 'Pet Care', image: '🐕' },

    // Cat Food - Weekly Essentials
    { sku: 'cat-food-meow-mix-16lb', name: 'Meow Mix Original Dry Food 16lb', price: 14.99, category: 'Pet Care', image: '🐱' },
    { sku: 'cat-food-purina-one-16lb', name: 'Purina ONE Indoor Cat Food 16lb', price: 24.99, category: 'Pet Care', image: '🐱' },
    { sku: 'cat-food-friskies-16lb', name: 'Friskies Surfin\' & Turfin\' 16lb', price: 16.99, category: 'Pet Care', image: '🐱' },
    { sku: 'cat-food-iams-16lb', name: 'IAMS ProActive Health 16lb', price: 26.99, category: 'Pet Care', image: '🐱' },
    { sku: 'cat-food-wet-fancy-feast', name: 'Fancy Feast Classic 3oz 24pk', price: 19.99, category: 'Pet Care', image: '🥫' },
    { sku: 'cat-food-wet-friskies', name: 'Friskies Pate Variety 5.5oz 32pk', price: 24.99, category: 'Pet Care', image: '🥫' },
    { sku: 'cat-food-kitten', name: 'Purina Kitten Chow 3.15lb', price: 9.99, category: 'Pet Care', image: '🐱' },

    // Pet Treats
    { sku: 'dog-treats-milk-bone', name: 'Milk-Bone Dog Treats 24oz', price: 6.99, category: 'Pet Care', image: '🦴' },
    { sku: 'dog-treats-beggin-strips', name: 'Beggin\' Strips Bacon 25oz', price: 9.99, category: 'Pet Care', image: '🦴' },
    { sku: 'dog-treats-dentastix', name: 'Pedigree Dentastix 40ct', price: 14.99, category: 'Pet Care', image: '🦴' },
    { sku: 'dog-treats-greenies', name: 'Greenies Dental Treats 36oz', price: 24.99, category: 'Pet Care', image: '🦴' },
    { sku: 'dog-treats-rawhide', name: 'Good\'n\'Fun Rawhide Chews 50pk', price: 16.99, category: 'Pet Care', image: '🦴' },
    { sku: 'cat-treats-temptations', name: 'Temptations Cat Treats 16oz', price: 6.99, category: 'Pet Care', image: '🐟' },
    { sku: 'cat-treats-greenies', name: 'Greenies Feline Treats 4.6oz', price: 7.99, category: 'Pet Care', image: '🐟' },

    // Pet Toys
    { sku: 'dog-toy-rope', name: 'Dog Rope Tug Toy 3-Pack', price: 9.99, category: 'Pet Care', image: '🧶' },
    { sku: 'dog-toy-ball', name: 'Kong Classic Dog Toy', price: 12.99, category: 'Pet Care', image: '⚽' },
    { sku: 'dog-toy-squeaky', name: 'Squeaky Plush Dog Toys 5pk', price: 14.99, category: 'Pet Care', image: '🧸' },
    { sku: 'dog-toy-chew', name: 'Nylabone Dura Chew', price: 8.99, category: 'Pet Care', image: '🦴' },
    { sku: 'cat-toy-mice', name: 'Fur Mouse Cat Toys 10pk', price: 6.99, category: 'Pet Care', image: '🐭' },
    { sku: 'cat-toy-wand', name: 'Cat Feather Wand Toy', price: 5.99, category: 'Pet Care', image: '🪶' },
    { sku: 'cat-toy-laser', name: 'PetSafe Laser Toy', price: 9.99, category: 'Pet Care', image: '🔴' },
    { sku: 'cat-toy-scratching-post', name: 'Cat Scratching Post 16"', price: 19.99, category: 'Pet Care', image: '🏛️' },
    { sku: 'cat-toy-tunnel', name: 'Cat Play Tunnel Collapsible', price: 12.99, category: 'Pet Care', image: '🚇' },

    // Pet Supplies - Outcome: New Pet
    { sku: 'dog-leash-6ft', name: 'Dog Leash 6ft Nylon', price: 7.99, category: 'Pet Care', image: '🦮' },
    { sku: 'dog-collar-adjustable', name: 'Adjustable Dog Collar', price: 8.99, category: 'Pet Care', image: '⭕' },
    { sku: 'dog-harness', name: 'No-Pull Dog Harness', price: 19.99, category: 'Pet Care', image: '🦮' },
    { sku: 'dog-bowl-stainless', name: 'Stainless Steel Dog Bowl Set', price: 14.99, category: 'Pet Care', image: '🥣' },
    { sku: 'dog-bed-medium', name: 'Dog Bed Medium 30x20"', price: 29.99, category: 'Pet Care', image: '🛏️' },
    { sku: 'dog-bed-large', name: 'Dog Bed Large 40x30"', price: 49.99, category: 'Pet Care', image: '🛏️' },
    { sku: 'dog-crate-24', name: 'Dog Crate 24" Single Door', price: 39.99, category: 'Pet Care', image: '📦' },
    { sku: 'dog-crate-36', name: 'Dog Crate 36" Double Door', price: 59.99, category: 'Pet Care', image: '📦' },
    { sku: 'pet-carrier-small', name: 'Pet Carrier Small 18"', price: 24.99, category: 'Pet Care', image: '🧳' },
    { sku: 'pet-carrier-medium', name: 'Pet Carrier Medium 23"', price: 34.99, category: 'Pet Care', image: '🧳' },
    { sku: 'cat-collar-breakaway', name: 'Breakaway Cat Collar with Bell', price: 4.99, category: 'Pet Care', image: '🔔' },
    { sku: 'cat-bowl-ceramic', name: 'Ceramic Cat Bowl Set', price: 12.99, category: 'Pet Care', image: '🥣' },
    { sku: 'cat-bed', name: 'Cat Bed Cushion 18"', price: 19.99, category: 'Pet Care', image: '🛏️' },
    { sku: 'cat-litter-box', name: 'Cat Litter Box with Hood', price: 24.99, category: 'Pet Care', image: '🧺' },
    { sku: 'cat-litter-scoop', name: 'Cat Litter Scoop Metal', price: 5.99, category: 'Pet Care', image: '🥄' },

    // Pet Grooming
    { sku: 'dog-shampoo', name: 'Hartz Dog Shampoo 18oz', price: 6.99, category: 'Pet Care', image: '🧴' },
    { sku: 'dog-brush', name: 'Self-Cleaning Slicker Brush', price: 12.99, category: 'Pet Care', image: '🪮' },
    { sku: 'dog-nail-clippers', name: 'Dog Nail Clippers with Guard', price: 9.99, category: 'Pet Care', image: '✂️' },
    { sku: 'dog-toothbrush', name: 'Dog Toothbrush & Toothpaste Kit', price: 7.99, category: 'Pet Care', image: '🪥' },
    { sku: 'cat-shampoo', name: 'Burt\'s Bees Cat Shampoo 10oz', price: 8.99, category: 'Pet Care', image: '🧴' },
    { sku: 'cat-brush', name: 'Cat Grooming Brush', price: 7.99, category: 'Pet Care', image: '🪮' },
    { sku: 'pet-wipes', name: 'Pet Grooming Wipes 100ct', price: 6.99, category: 'Pet Care', image: '🧻' },

    // Pet Health & Wellness
    { sku: 'flea-tick-frontline-dog', name: 'Frontline Plus Dogs 45-88lb 3pk', price: 44.99, category: 'Pet Care', image: '💊' },
    { sku: 'flea-tick-frontline-cat', name: 'Frontline Plus Cats 3pk', price: 39.99, category: 'Pet Care', image: '💊' },
    { sku: 'flea-tick-collar-dog', name: 'Seresto Flea Collar Large Dog', price: 59.99, category: 'Pet Care', image: '⭕' },
    { sku: 'flea-tick-collar-cat', name: 'Seresto Flea Collar Cat', price: 54.99, category: 'Pet Care', image: '⭕' },
    { sku: 'pet-vitamins-dog', name: 'Zesty Paws Dog Multivitamin 90ct', price: 24.99, category: 'Pet Care', image: '💊' },
    { sku: 'pet-vitamins-cat', name: 'Zesty Paws Cat Multivitamin 60ct', price: 19.99, category: 'Pet Care', image: '💊' },

    // Pet Waste Management
    { sku: 'cat-litter-tidy-cats', name: 'Tidy Cats Clumping Litter 35lb', price: 18.99, category: 'Pet Care', image: '🪨' },
    { sku: 'cat-litter-fresh-step', name: 'Fresh Step Multi-Cat Litter 25lb', price: 16.99, category: 'Pet Care', image: '🪨' },
    { sku: 'cat-litter-arm-hammer', name: 'Arm & Hammer Cat Litter 28lb', price: 14.99, category: 'Pet Care', image: '🪨' },
    { sku: 'dog-waste-bags', name: 'Dog Waste Bags 900ct', price: 12.99, category: 'Pet Care', image: '💩' },
    { sku: 'pee-pads', name: 'Pet Training Pee Pads 100ct', price: 24.99, category: 'Pet Care', image: '🟦' },

    // Small Animal & Bird Supplies
    { sku: 'hamster-food', name: 'Kaytee Hamster Food 2lb', price: 6.99, category: 'Pet Care', image: '🐹' },
    { sku: 'guinea-pig-food', name: 'Oxbow Guinea Pig Food 5lb', price: 14.99, category: 'Pet Care', image: '🐹' },
    { sku: 'rabbit-food', name: 'Kaytee Rabbit Food 5lb', price: 12.99, category: 'Pet Care', image: '🐰' },
    { sku: 'bird-food', name: 'Wild Bird Seed 20lb', price: 16.99, category: 'Pet Care', image: '🐦' },
    { sku: 'fish-food', name: 'Tetra Goldfish Flakes 2.2oz', price: 5.99, category: 'Pet Care', image: '🐠' },
    { sku: 'hamster-cage', name: 'Hamster Cage with Tubes', price: 34.99, category: 'Pet Care', image: '🏠' },
    { sku: 'bird-cage', name: 'Bird Cage 18x18x24"', price: 49.99, category: 'Pet Care', image: '🏠' },
    { sku: 'fish-tank-10gal', name: 'Aqua Culture 10 Gallon Tank Kit', price: 39.99, category: 'Pet Care', image: '🐠' },
  ],

  'Garden & Outdoor': [
    // Plants & Seeds - Outcome: Spring Gardening
    { sku: 'seeds-tomato', name: 'Heirloom Tomato Seeds 4 Varieties', price: 5.99, category: 'Garden & Outdoor', image: '🍅' },
    { sku: 'seeds-vegetable-garden', name: 'Vegetable Garden Seed Kit 10pk', price: 14.99, category: 'Garden & Outdoor', image: '🌱' },
    { sku: 'seeds-herb-garden', name: 'Herb Garden Seed Kit 8pk', price: 12.99, category: 'Garden & Outdoor', image: '🌿' },
    { sku: 'seeds-flower-wildflower', name: 'Wildflower Seed Mix 1lb', price: 9.99, category: 'Garden & Outdoor', image: '🌸' },
    { sku: 'seeds-sunflower', name: 'Mammoth Sunflower Seeds', price: 4.99, category: 'Garden & Outdoor', image: '🌻' },
    { sku: 'seeds-grass-sun', name: 'Scotts Turf Builder Grass Seed Sun & Shade 7lb', price: 34.99, category: 'Garden & Outdoor', image: '🌱' },
    { sku: 'bulbs-tulip', name: 'Tulip Bulbs Assorted 25pk', price: 19.99, category: 'Garden & Outdoor', image: '🌷' },
    { sku: 'bulbs-daffodil', name: 'Daffodil Bulbs 15pk', price: 14.99, category: 'Garden & Outdoor', image: '🌼' },

    // Soil, Fertilizer & Mulch
    { sku: 'potting-soil-miracle-gro', name: 'Miracle-Gro Potting Mix 16qt', price: 12.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'potting-soil-organic', name: 'Organic Potting Soil 1.5 cu ft', price: 9.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'garden-soil', name: 'Vigoro Garden Soil 2 cu ft', price: 5.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'topsoil', name: 'Premium Topsoil 40lb', price: 4.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'compost', name: 'Organic Compost 1 cu ft', price: 7.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'mulch-brown', name: 'Brown Mulch 2 cu ft', price: 4.99, category: 'Garden & Outdoor', image: '🪵' },
    { sku: 'mulch-red', name: 'Red Mulch 2 cu ft', price: 4.99, category: 'Garden & Outdoor', image: '🪵' },
    { sku: 'fertilizer-miracle-gro', name: 'Miracle-Gro All Purpose Plant Food 1.5lb', price: 8.99, category: 'Garden & Outdoor', image: '🧪' },
    { sku: 'fertilizer-lawn', name: 'Scotts Turf Builder Lawn Food 15000 sqft', price: 49.99, category: 'Garden & Outdoor', image: '🧪' },
    { sku: 'weed-killer', name: 'Roundup Weed & Grass Killer 1gal', price: 24.99, category: 'Garden & Outdoor', image: '🧪' },
    { sku: 'weed-control-lawn', name: 'Scotts Weed & Feed 5000 sqft', price: 34.99, category: 'Garden & Outdoor', image: '🧪' },
    { sku: 'insect-killer-garden', name: 'Sevin Garden Insect Killer 32oz', price: 14.99, category: 'Garden & Outdoor', image: '🐛' },

    // Pots, Planters & Containers
    { sku: 'planter-6inch', name: 'Terracotta Pot 6" 4pk', price: 9.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'planter-10inch', name: 'Terracotta Pot 10"', price: 7.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'planter-hanging', name: 'Hanging Basket Planter 10" 3pk', price: 14.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'planter-window-box', name: 'Window Box Planter 24"', price: 19.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'planter-raised-bed', name: 'Raised Garden Bed 4x4ft', price: 79.99, category: 'Garden & Outdoor', image: '📦' },
    { sku: 'planter-large-resin', name: 'Large Resin Planter 16"', price: 34.99, category: 'Garden & Outdoor', image: '🪴' },
    { sku: 'planter-saucer', name: 'Plant Saucers Assorted 5pk', price: 7.99, category: 'Garden & Outdoor', image: '🍽️' },

    // Garden Tools - Outcome: Gardening, Yard Work
    { sku: 'shovel-round-point', name: 'Round Point Shovel', price: 24.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'shovel-spade', name: 'Garden Spade', price: 19.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'rake-leaf', name: 'Leaf Rake 24"', price: 16.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'rake-garden', name: 'Garden Rake Bow', price: 18.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'hoe', name: 'Garden Hoe Warren', price: 14.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'trowel-hand', name: 'Hand Trowel & Cultivator Set', price: 9.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'pruning-shears', name: 'Fiskars Pruning Shears', price: 14.99, category: 'Garden & Outdoor', image: '✂️' },
    { sku: 'loppers', name: 'Bypass Loppers 28"', price: 24.99, category: 'Garden & Outdoor', image: '✂️' },
    { sku: 'hedge-trimmer-manual', name: 'Manual Hedge Shears', price: 19.99, category: 'Garden & Outdoor', image: '✂️' },
    { sku: 'garden-tool-set', name: '10-Piece Garden Tool Set', price: 39.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'wheelbarrow', name: 'Wheelbarrow 4 cu ft', price: 79.99, category: 'Garden & Outdoor', image: '🚚' },
    { sku: 'garden-kneeler', name: 'Garden Kneeler with Handles', price: 29.99, category: 'Garden & Outdoor', image: '🪑' },
    { sku: 'garden-gloves', name: 'Gardening Gloves 3pk', price: 8.99, category: 'Garden & Outdoor', image: '🧤' },

    // Watering Equipment
    { sku: 'hose-50ft', name: 'Garden Hose 50ft', price: 24.99, category: 'Garden & Outdoor', image: '💦' },
    { sku: 'hose-100ft', name: 'Garden Hose 100ft Heavy Duty', price: 44.99, category: 'Garden & Outdoor', image: '💦' },
    { sku: 'hose-nozzle', name: '8-Pattern Hose Nozzle', price: 12.99, category: 'Garden & Outdoor', image: '💦' },
    { sku: 'hose-reel', name: 'Hose Reel Cart 300ft Capacity', price: 89.99, category: 'Garden & Outdoor', image: '🎡' },
    { sku: 'sprinkler-oscillating', name: 'Oscillating Sprinkler', price: 19.99, category: 'Garden & Outdoor', image: '💦' },
    { sku: 'sprinkler-impact', name: 'Impact Sprinkler Metal', price: 14.99, category: 'Garden & Outdoor', image: '💦' },
    { sku: 'watering-can-2gal', name: 'Watering Can 2 Gallon', price: 12.99, category: 'Garden & Outdoor', image: '🚰' },
    { sku: 'soaker-hose', name: 'Soaker Hose 50ft', price: 19.99, category: 'Garden & Outdoor', image: '💦' },

    // Outdoor Decor
    { sku: 'garden-gnome', name: 'Garden Gnome Statue 12"', price: 19.99, category: 'Garden & Outdoor', image: '🧙' },
    { sku: 'bird-feeder', name: 'Wild Bird Feeder Tube', price: 14.99, category: 'Garden & Outdoor', image: '🐦' },
    { sku: 'bird-bath', name: 'Bird Bath Pedestal 28"', price: 49.99, category: 'Garden & Outdoor', image: '🛁' },
    { sku: 'wind-chimes', name: 'Wind Chimes Metal 36"', price: 24.99, category: 'Garden & Outdoor', image: '🎐' },
    { sku: 'solar-lights-path', name: 'Solar Path Lights 8pk', price: 29.99, category: 'Garden & Outdoor', image: '💡' },
    { sku: 'solar-lights-string', name: 'Solar String Lights 48ft', price: 24.99, category: 'Garden & Outdoor', image: '💡' },
    { sku: 'garden-stakes', name: 'Decorative Garden Stakes 4pk', price: 19.99, category: 'Garden & Outdoor', image: '🌸' },
    { sku: 'garden-flag', name: 'Seasonal Garden Flag 12x18"', price: 9.99, category: 'Garden & Outdoor', image: '🚩' },

    // Patio Furniture - Outcome: Outdoor Living
    { sku: 'patio-chair-folding', name: 'Folding Patio Chair 2pk', price: 49.99, category: 'Garden & Outdoor', image: '🪑' },
    { sku: 'patio-table-round', name: 'Round Patio Table 38"', price: 89.99, category: 'Garden & Outdoor', image: '🪑' },
    { sku: 'patio-umbrella', name: 'Patio Umbrella 9ft', price: 79.99, category: 'Garden & Outdoor', image: '☂️' },
    { sku: 'patio-umbrella-base', name: 'Umbrella Base 50lb', price: 49.99, category: 'Garden & Outdoor', image: '⚓' },
    { sku: 'outdoor-cushions', name: 'Outdoor Seat Cushions 2pk', price: 34.99, category: 'Garden & Outdoor', image: '🛋️' },
    { sku: 'adirondack-chair', name: 'Adirondack Chair Resin', price: 89.99, category: 'Garden & Outdoor', image: '🪑' },

    // Grills & Outdoor Cooking - Outcome: BBQ Party
    { sku: 'grill-charcoal', name: 'Charcoal Grill 22"', price: 89.99, category: 'Garden & Outdoor', image: '🔥' },
    { sku: 'grill-gas-2burner', name: '2-Burner Gas Grill', price: 199.99, category: 'Garden & Outdoor', image: '🔥' },
    { sku: 'grill-gas-4burner', name: '4-Burner Gas Grill with Side Burner', price: 399.99, category: 'Garden & Outdoor', image: '🔥' },
    { sku: 'grill-cover', name: 'Grill Cover 64" Heavy Duty', price: 29.99, category: 'Garden & Outdoor', image: '🧥' },
    { sku: 'charcoal-briquettes', name: 'Kingsford Charcoal Briquettes 20lb', price: 19.99, category: 'Garden & Outdoor', image: '🪨' },
    { sku: 'propane-tank', name: 'Propane Tank 20lb Empty', price: 39.99, category: 'Garden & Outdoor', image: '🔥' },
    { sku: 'grill-tools', name: 'BBQ Grill Tool Set 3-Piece', price: 19.99, category: 'Garden & Outdoor', image: '🍴' },
    { sku: 'grill-brush', name: 'Grill Cleaning Brush', price: 9.99, category: 'Garden & Outdoor', image: '🧹' },

    // Lawn Care
    { sku: 'lawn-mower-push', name: 'Push Reel Lawn Mower 18"', price: 99.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'lawn-edger', name: 'Manual Lawn Edger', price: 29.99, category: 'Garden & Outdoor', image: '🛠️' },
    { sku: 'leaf-blower', name: 'Worx Electric Leaf Blower', price: 49.99, category: 'Garden & Outdoor', image: '💨' },
    { sku: 'lawn-bags', name: 'Lawn & Leaf Bags 30gal 25pk', price: 12.99, category: 'Garden & Outdoor', image: '🗑️' },
  ],

  'Automotive': [
    // Motor Oil - Regular Maintenance
    { sku: 'oil-motor-5w30-conventional', name: 'Pennzoil 5W-30 Conventional Oil 5qt', price: 14.99, category: 'Automotive', image: '🛢️' },
    { sku: 'oil-motor-5w30-synthetic', name: 'Mobil 1 5W-30 Full Synthetic 5qt', price: 29.99, category: 'Automotive', image: '🛢️' },
    { sku: 'oil-motor-10w30', name: 'Castrol 10W-30 Conventional 5qt', price: 16.99, category: 'Automotive', image: '🛢️' },
    { sku: 'oil-motor-0w20-synthetic', name: 'Mobil 1 0W-20 Full Synthetic 5qt', price: 32.99, category: 'Automotive', image: '🛢️' },
    { sku: 'oil-filter-standard', name: 'Fram Extra Guard Oil Filter', price: 6.99, category: 'Automotive', image: '🔧' },
    { sku: 'oil-filter-premium', name: 'Mobil 1 Extended Performance Filter', price: 12.99, category: 'Automotive', image: '🔧' },

    // Fluids - Maintenance
    { sku: 'coolant-antifreeze', name: 'Prestone Antifreeze Coolant 1gal', price: 14.99, category: 'Automotive', image: '🧪' },
    { sku: 'brake-fluid', name: 'Prestone Brake Fluid DOT 3 32oz', price: 5.99, category: 'Automotive', image: '🧪' },
    { sku: 'transmission-fluid', name: 'Valvoline ATF Transmission Fluid 1qt', price: 8.99, category: 'Automotive', image: '🧪' },
    { sku: 'power-steering-fluid', name: 'Prestone Power Steering Fluid 32oz', price: 5.99, category: 'Automotive', image: '🧪' },
    { sku: 'windshield-washer-fluid', name: 'Rain-X Windshield Washer Fluid 1gal', price: 4.99, category: 'Automotive', image: '💦' },
    { sku: 'windshield-washer-deicer', name: 'Prestone De-Icer Washer Fluid 1gal', price: 6.99, category: 'Automotive', image: '💦' },

    // Filters
    { sku: 'air-filter', name: 'Fram Extra Guard Air Filter', price: 14.99, category: 'Automotive', image: '🔧' },
    { sku: 'cabin-air-filter', name: 'Fram Fresh Breeze Cabin Air Filter', price: 12.99, category: 'Automotive', image: '🔧' },
    { sku: 'fuel-filter', name: 'Fram Fuel Filter', price: 9.99, category: 'Automotive', image: '🔧' },

    // Car Wash & Care - Outcome: Car Detailing
    { sku: 'car-wash-soap', name: 'Meguiar\'s Car Wash Soap 64oz', price: 9.99, category: 'Automotive', image: '🧴' },
    { sku: 'car-wax', name: 'Turtle Wax Carnauba Car Wax', price: 12.99, category: 'Automotive', image: '🧴' },
    { sku: 'car-polish', name: 'Meguiar\'s Ultimate Polish 16oz', price: 14.99, category: 'Automotive', image: '🧴' },
    { sku: 'tire-shine', name: 'Armor All Tire Shine 18oz', price: 6.99, category: 'Automotive', image: '🧴' },
    { sku: 'wheel-cleaner', name: 'Meguiar\'s Hot Rims Wheel Cleaner 24oz', price: 8.99, category: 'Automotive', image: '🧴' },
    { sku: 'glass-cleaner-auto', name: 'Invisible Glass Cleaner 22oz', price: 5.99, category: 'Automotive', image: '🧴' },
    { sku: 'interior-cleaner', name: 'Armor All Multi-Purpose Cleaner 16oz', price: 5.99, category: 'Automotive', image: '🧴' },
    { sku: 'leather-conditioner', name: 'Meguiar\'s Leather Conditioner 16oz', price: 9.99, category: 'Automotive', image: '🧴' },
    { sku: 'detailing-clay', name: 'Mothers Clay Bar System', price: 19.99, category: 'Automotive', image: '🧼' },
    { sku: 'microfiber-towels-auto', name: 'Microfiber Detailing Towels 12pk', price: 12.99, category: 'Automotive', image: '🧻' },
    { sku: 'wash-mitt', name: 'Meguiar\'s Wash Mitt', price: 7.99, category: 'Automotive', image: '🧤' },
    { sku: 'foam-applicator-pads', name: 'Foam Applicator Pads 6pk', price: 4.99, category: 'Automotive', image: '🔵' },

    // Wiper Blades & Bulbs - Replacement Parts
    { sku: 'wiper-blades-18', name: 'Rain-X Wiper Blades 18" Pair', price: 19.99, category: 'Automotive', image: '🚗' },
    { sku: 'wiper-blades-22', name: 'Bosch ICON Wiper Blades 22"', price: 24.99, category: 'Automotive', image: '🚗' },
    { sku: 'headlight-bulb-h11', name: 'Sylvania H11 Headlight Bulb', price: 19.99, category: 'Automotive', image: '💡' },
    { sku: 'headlight-bulb-9006', name: 'Sylvania 9006 Headlight Bulb', price: 18.99, category: 'Automotive', image: '💡' },
    { sku: 'brake-light-bulb', name: 'Sylvania Brake Light Bulbs 2pk', price: 7.99, category: 'Automotive', image: '💡' },

    // Accessories - Low Consideration
    { sku: 'air-freshener-tree', name: 'Little Trees Air Freshener 6pk', price: 5.99, category: 'Automotive', image: '🌲' },
    { sku: 'air-freshener-vent', name: 'Febreze Car Vent Clips 2pk', price: 7.99, category: 'Automotive', image: '🌸' },
    { sku: 'phone-mount-car', name: 'Universal Car Phone Mount', price: 14.99, category: 'Automotive', image: '📱' },
    { sku: 'cup-holder-organizer', name: 'Car Cup Holder Organizer', price: 9.99, category: 'Automotive', image: '🥤' },
    { sku: 'trunk-organizer', name: 'Collapsible Trunk Organizer', price: 19.99, category: 'Automotive', image: '📦' },
    { sku: 'seat-covers', name: 'Universal Seat Covers 2pk', price: 29.99, category: 'Automotive', image: '🪑' },
    { sku: 'floor-mats-rubber', name: 'Rubber Floor Mats 4pc', price: 24.99, category: 'Automotive', image: '🟫' },
    { sku: 'steering-wheel-cover', name: 'Steering Wheel Cover Leather', price: 12.99, category: 'Automotive', image: '⭕' },
    { sku: 'sunshade-windshield', name: 'Windshield Sunshade Foldable', price: 14.99, category: 'Automotive', image: '☀️' },
    { sku: 'car-vacuum', name: 'Portable Car Vacuum Cleaner', price: 29.99, category: 'Automotive', image: '🧹' },
    { sku: 'ice-scraper', name: 'Ice Scraper with Snow Brush', price: 9.99, category: 'Automotive', image: '❄️' },

    // Emergency & Safety
    { sku: 'jumper-cables', name: 'Jumper Cables 12ft 8-Gauge', price: 19.99, category: 'Automotive', image: '🔌' },
    { sku: 'jumper-cables-heavy', name: 'Heavy Duty Jumper Cables 20ft 4-Gauge', price: 34.99, category: 'Automotive', image: '🔌' },
    { sku: 'roadside-kit', name: 'Roadside Emergency Kit 42-Piece', price: 29.99, category: 'Automotive', image: '🚨' },
    { sku: 'first-aid-kit-auto', name: 'Auto First Aid Kit 73-Piece', price: 14.99, category: 'Automotive', image: '🩹' },
    { sku: 'tire-pressure-gauge', name: 'Digital Tire Pressure Gauge', price: 9.99, category: 'Automotive', image: '⚙️' },
    { sku: 'tire-inflator', name: 'Portable Tire Inflator 12V', price: 29.99, category: 'Automotive', image: '⚙️' },
    { sku: 'tow-strap', name: 'Tow Strap 3" x 20ft', price: 19.99, category: 'Automotive', image: '🪢' },

    // Maintenance Tools
    { sku: 'oil-drain-pan', name: 'Oil Drain Pan 5qt', price: 12.99, category: 'Automotive', image: '🪣' },
    { sku: 'oil-filter-wrench', name: 'Oil Filter Wrench Adjustable', price: 9.99, category: 'Automotive', image: '🔧' },
    { sku: 'socket-set-automotive', name: 'Automotive Socket Set 40-Piece', price: 39.99, category: 'Automotive', image: '🔧' },
    { sku: 'wrench-set', name: 'Combination Wrench Set 12-Piece', price: 29.99, category: 'Automotive', image: '🔧' },
    { sku: 'funnel-oil', name: 'Oil Funnel with Spout', price: 5.99, category: 'Automotive', image: '⏬' },
    { sku: 'work-light-led', name: 'LED Work Light Rechargeable', price: 24.99, category: 'Automotive', image: '🔦' },

    // Battery & Charging
    { sku: 'car-battery-charger', name: 'Battery Charger 6/12V 2A', price: 29.99, category: 'Automotive', image: '🔋' },
    { sku: 'battery-terminal-cleaner', name: 'Battery Terminal Cleaner Brush', price: 4.99, category: 'Automotive', image: '🧹' },
    { sku: 'usb-car-charger', name: 'Dual USB Car Charger 3.1A', price: 9.99, category: 'Automotive', image: '🔌' },
  ],

  'Tools & Hardware': [
    // Hand Tools - Outcome: Home Repair, DIY Projects
    { sku: 'hammer-claw', name: 'Stanley 16oz Claw Hammer', price: 14.99, category: 'Tools & Hardware', image: '🔨' },
    { sku: 'hammer-rubber-mallet', name: 'Rubber Mallet 16oz', price: 9.99, category: 'Tools & Hardware', image: '🔨' },
    { sku: 'screwdriver-set', name: 'Stanley 6-Piece Screwdriver Set', price: 12.99, category: 'Tools & Hardware', image: '🪛' },
    { sku: 'screwdriver-set-precision', name: 'Precision Screwdriver Set 32-Piece', price: 9.99, category: 'Tools & Hardware', image: '🪛' },
    { sku: 'pliers-set', name: 'Pliers Set 3-Piece', price: 16.99, category: 'Tools & Hardware', image: '🔧' },
    { sku: 'adjustable-wrench', name: 'Adjustable Wrench 10"', price: 12.99, category: 'Tools & Hardware', image: '🔧' },
    { sku: 'allen-wrench-set', name: 'Hex Key Allen Wrench Set', price: 7.99, category: 'Tools & Hardware', image: '🔧' },
    { sku: 'utility-knife', name: 'Stanley Retractable Utility Knife', price: 6.99, category: 'Tools & Hardware', image: '🔪' },
    { sku: 'utility-knife-blades', name: 'Utility Knife Blades 100pk', price: 8.99, category: 'Tools & Hardware', image: '🔪' },
    { sku: 'tape-measure-25ft', name: 'Stanley 25ft Tape Measure', price: 9.99, category: 'Tools & Hardware', image: '📏' },
    { sku: 'level-torpedo', name: 'Torpedo Level 9"', price: 7.99, category: 'Tools & Hardware', image: '📏' },
    { sku: 'level-48inch', name: 'Stanley 48" Box Level', price: 29.99, category: 'Tools & Hardware', image: '📏' },
    { sku: 'stud-finder', name: 'Zircon Stud Finder', price: 19.99, category: 'Tools & Hardware', image: '🔍' },

    // Power Tools - High Consideration
    { sku: 'drill-cordless', name: 'Black+Decker 20V Cordless Drill', price: 49.99, category: 'Tools & Hardware', image: '🔧' },
    { sku: 'drill-dewalt', name: 'DeWalt 20V MAX Drill Driver Kit', price: 129.99, category: 'Tools & Hardware', image: '🔧' },
    { sku: 'drill-bit-set', name: 'DeWalt Drill Bit Set 100-Piece', price: 29.99, category: 'Tools & Hardware', image: '🔩' },
    { sku: 'circular-saw', name: 'Black+Decker Circular Saw 15A', price: 59.99, category: 'Tools & Hardware', image: '⚙️' },
    { sku: 'jigsaw', name: 'Black+Decker Jigsaw 5A', price: 39.99, category: 'Tools & Hardware', image: '⚙️' },
    { sku: 'orbital-sander', name: 'Black+Decker Orbital Sander', price: 34.99, category: 'Tools & Hardware', image: '⚙️' },
    { sku: 'power-tool-combo', name: 'Ryobi 18V 6-Tool Combo Kit', price: 299.99, category: 'Tools & Hardware', image: '🔧' },

    // Fasteners & Hardware
    { sku: 'screws-wood-assorted', name: 'Wood Screw Assortment 260pc', price: 12.99, category: 'Tools & Hardware', image: '🔩' },
    { sku: 'nails-common', name: 'Common Nails 16d 5lb', price: 9.99, category: 'Tools & Hardware', image: '📌' },
    { sku: 'nails-finish', name: 'Finish Nails Assortment 500pc', price: 8.99, category: 'Tools & Hardware', image: '📌' },
    { sku: 'anchors-drywall', name: 'Drywall Anchors 100pk', price: 9.99, category: 'Tools & Hardware', image: '⚓' },
    { sku: 'hooks-utility', name: 'Utility Hooks Assorted 20pk', price: 7.99, category: 'Tools & Hardware', image: '🪝' },
    { sku: 'hooks-command', name: 'Command Strips Hooks Variety 16pk', price: 12.99, category: 'Tools & Hardware', image: '🪝' },
    { sku: 'brackets-shelf', name: 'Shelf Brackets 8" 4pk', price: 12.99, category: 'Tools & Hardware', image: '📐' },
    { sku: 'hinges-door', name: 'Door Hinges 3.5" Satin Nickel 3pk', price: 9.99, category: 'Tools & Hardware', image: '🚪' },
    { sku: 'door-handle', name: 'Door Handle Set Satin Nickel', price: 19.99, category: 'Tools & Hardware', image: '🚪' },

    // Paint & Supplies - Outcome: Home Improvement
    { sku: 'paint-roller-kit', name: 'Paint Roller Kit 9-Piece', price: 12.99, category: 'Tools & Hardware', image: '🖌️' },
    { sku: 'paint-brushes-set', name: 'Paint Brush Set 10-Piece', price: 14.99, category: 'Tools & Hardware', image: '🖌️' },
    { sku: 'paint-tray', name: 'Paint Tray with Liner 5pk', price: 6.99, category: 'Tools & Hardware', image: '🎨' },
    { sku: 'painters-tape-2inch', name: 'ScotchBlue Painter\'s Tape 2" 60yd', price: 12.99, category: 'Tools & Hardware', image: '📏' },
    { sku: 'drop-cloth', name: 'Canvas Drop Cloth 9x12ft', price: 14.99, category: 'Tools & Hardware', image: '🧱' },
    { sku: 'sandpaper-assorted', name: 'Sandpaper Sheets Assorted Grit 25pk', price: 8.99, category: 'Tools & Hardware', image: '📄' },
    { sku: 'wood-filler', name: 'Elmer\'s Wood Filler 16oz', price: 7.99, category: 'Tools & Hardware', image: '🪵' },
    { sku: 'spackling-paste', name: 'DAP Spackling Paste 16oz', price: 5.99, category: 'Tools & Hardware', image: '🧱' },
    { sku: 'caulk-white', name: 'DAP White Silicone Caulk', price: 4.99, category: 'Tools & Hardware', image: '🧴' },
    { sku: 'caulk-gun', name: 'Caulk Gun Smooth Rod', price: 7.99, category: 'Tools & Hardware', image: '🔫' },

    // Electrical
    { sku: 'electrical-tape', name: 'Electrical Tape Black 10pk', price: 9.99, category: 'Tools & Hardware', image: '📦' },
    { sku: 'wire-nuts', name: 'Wire Nuts Assortment 150pk', price: 7.99, category: 'Tools & Hardware', image: '🔩' },
    { sku: 'outlet-standard', name: 'Electrical Outlets 15A 10pk', price: 12.99, category: 'Tools & Hardware', image: '🔌' },
    { sku: 'light-switch', name: 'Light Switches Single Pole 10pk', price: 11.99, category: 'Tools & Hardware', image: '💡' },
    { sku: 'extension-cord-25ft', name: 'Extension Cord 25ft 16/3 Outdoor', price: 14.99, category: 'Tools & Hardware', image: '🔌' },
    { sku: 'extension-cord-50ft', name: 'Extension Cord 50ft Heavy Duty', price: 24.99, category: 'Tools & Hardware', image: '🔌' },
    { sku: 'power-strip', name: 'Power Strip 8-Outlet with Surge', price: 19.99, category: 'Tools & Hardware', image: '🔌' },
    { sku: 'led-bulbs-60w', name: 'LED Light Bulbs 60W Equivalent 8pk', price: 12.99, category: 'Tools & Hardware', image: '💡' },
    { sku: 'led-bulbs-100w', name: 'LED Light Bulbs 100W Equivalent 4pk', price: 14.99, category: 'Tools & Hardware', image: '💡' },

    // Plumbing
    { sku: 'plunger', name: 'Toilet Plunger with Caddy', price: 9.99, category: 'Tools & Hardware', image: '🚽' },
    { sku: 'drain-snake', name: 'Drain Snake 25ft', price: 12.99, category: 'Tools & Hardware', image: '🐍' },
    { sku: 'teflon-tape', name: 'Teflon Plumber\'s Tape 5pk', price: 4.99, category: 'Tools & Hardware', image: '📦' },
    { sku: 'pipe-wrench', name: 'Pipe Wrench 14"', price: 19.99, category: 'Tools & Hardware', image: '🔧' },

    // Adhesives & Sealants
    { sku: 'super-glue', name: 'Super Glue Gel 4pk', price: 5.99, category: 'Tools & Hardware', image: '🧴' },
    { sku: 'gorilla-glue', name: 'Gorilla Glue Original 4oz', price: 7.99, category: 'Tools & Hardware', image: '🦍' },
    { sku: 'wood-glue', name: 'Titebond Wood Glue 16oz', price: 8.99, category: 'Tools & Hardware', image: '🧴' },
    { sku: 'epoxy-5-minute', name: '5-Minute Epoxy 0.85oz', price: 5.99, category: 'Tools & Hardware', image: '🧴' },
    { sku: 'duct-tape', name: 'Duck Tape Silver 1.88" x 60yd', price: 6.99, category: 'Tools & Hardware', image: '📦' },
    { sku: 'wd40', name: 'WD-40 Multi-Use Product 12oz', price: 5.99, category: 'Tools & Hardware', image: '🧴' },

    // Safety Equipment
    { sku: 'safety-glasses', name: 'Safety Glasses Clear 3pk', price: 9.99, category: 'Tools & Hardware', image: '🥽' },
    { sku: 'work-gloves', name: 'Work Gloves Leather 3pk', price: 12.99, category: 'Tools & Hardware', image: '🧤' },
    { sku: 'dust-masks', name: 'Dust Masks N95 20pk', price: 14.99, category: 'Tools & Hardware', image: '😷' },
    { sku: 'ear-plugs', name: 'Foam Ear Plugs 50 Pair', price: 9.99, category: 'Tools & Hardware', image: '👂' },
    { sku: 'knee-pads', name: 'Knee Pads Heavy Duty', price: 19.99, category: 'Tools & Hardware', image: '🦵' },

    // Tool Storage
    { sku: 'toolbox-16inch', name: '16" Tool Box with Tray', price: 19.99, category: 'Tools & Hardware', image: '🧰' },
    { sku: 'toolbox-22inch', name: '22" Pro Tool Box', price: 34.99, category: 'Tools & Hardware', image: '🧰' },
    { sku: 'tool-bag', name: 'Tool Bag 16" with Pockets', price: 24.99, category: 'Tools & Hardware', image: '👜' },
    { sku: 'pegboard-kit', name: 'Pegboard Organizer Kit 48"', price: 39.99, category: 'Tools & Hardware', image: '🗄️' },
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
