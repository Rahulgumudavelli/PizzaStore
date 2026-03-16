const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

// Load env
dotenv.config();

// Connect to DB
connectDB();

const categories = [
  'Pizza',
  'Sides',
  'Beverages',
  'Combo',
  'Bestsellers',
  'Veg',
  'Non-Veg'
];

const menuItemsData = [
  // Pizzas
  {
    name: 'Margherita',
    description: 'Classic delight with 100% real mozzarella cheese.',
    price: 299,
    categoryName: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Farmhouse Pizza',
    description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom.',
    price: 399,
    categoryName: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Peppy Paneer',
    description: 'Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika.',
    price: 459,
    categoryName: 'Pizza',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Chicken Dominator',
    description: 'Loaded with double pepper barbecue chicken, peri-peri chicken, chicken tikka & grilled chicken rashers.',
    price: 599,
    categoryName: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500'
  },
  
  // Sides
  {
    name: 'Garlic Breadsticks',
    description: 'Baked to perfection. Your perfect pizza partner! Tastes best with dip.',
    price: 129,
    categoryName: 'Sides',
    image: 'https://images.unsplash.com/photo-1573140247632-18ddf76754e4?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Stuffed Garlic Bread',
    description: 'Freshly baked garlic bread with cheese, juicy corn & tangy jalapeno.',
    price: 169,
    categoryName: 'Sides',
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&q=80&w=500'
  },
  
  // Beverages
  {
    name: 'Pepsi (500ml)',
    description: 'Refreshing Pepsi cola.',
    price: 60,
    categoryName: 'Beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Choco Lava Cake',
    description: 'Chocolate lovers delight! Indulgent, gooey molten lava inside chocolate cake.',
    price: 109,
    categoryName: 'Beverages', // Grouping desserts here for simplicity or could be separate
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=500'
  },
  
  // Bestsellers (Using some premium items)
  {
    name: 'Cheese N Corn',
    description: 'Sweet & Juicy Golden corn and 100% real mozzarella cheese in a delectable combination !',
    price: 359,
    categoryName: 'Bestsellers',
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&q=80&w=500'
  },
  
  // Veg
  {
    name: 'Veg Extravaganza',
    description: 'A pizza that decidedly staggers under an overload of golden corn, exotic black olives, crunchy onions, crisp capsicum, succulent mushrooms, juicyfresh tomatoes and jalapeno - with extra cheese to go all around.',
    price: 499,
    categoryName: 'Veg',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=500'
  },
  
  // Non-Veg
  {
    name: 'Non Veg Supreme',
    description: 'Bite into supreme delight of Black Olives, Onions, Grilled Mushrooms, Pepper BBQ Chicken, Peri-Peri Chicken, Grilled Chicken Rashers.',
    price: 599,
    categoryName: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500'
  },

  // Combos
  {
    name: 'Meal for 2 (Veg)',
    description: '1 Med Veg Pizza + 1 Garlic Breadsticks + 1 Pepsi 500ml',
    price: 499,
    categoryName: 'Combo',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Meal for 4 (Non-Veg)',
    description: '2 Med Non-Veg Pizzas + 2 Garlic Breadsticks + 1 Choco Lava Cake + 2 Pepsi 500ml',
    price: 999,
    categoryName: 'Combo',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=500'
  }
];

const seedDB = async () => {
  try {
    // Clear existing
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const createdCategories = [];
    for (const catName of categories) {
      const cat = await Category.create({ categoryName: catName });
      createdCategories.push(cat);
      console.log(`Added category: ${catName}`);
    }

    // Create lookup map for categories
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.categoryName] = cat._id;
    });

    // Insert Menu Items
    for (const item of menuItemsData) {
      const categoryId = catMap[item.categoryName];
      if (categoryId) {
        await MenuItem.create({
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: categoryId,
          image: item.image,
          isAvailable: true
        });
        console.log(`Added menu item: ${item.name}`);
      } else {
         console.log(`Category not found for item: ${item.name}`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
