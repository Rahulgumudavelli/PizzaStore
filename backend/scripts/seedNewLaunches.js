const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const seedNewLaunches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Create Category
    let category = await Category.findOne({ categoryName: 'New Launches' });
    if (!category) {
      category = await Category.create({ categoryName: 'New Launches' });
      console.log('Category "New Launches" created');
    } else {
      console.log('Category "New Launches" already exists');
    }

    // 2. Add Items
    const items = [
      {
        name: 'Fiesta Chicken Pizza',
        description: 'A fiery blend of spicy chicken, jalapeños, and crunchy onions.',
        price: 459,
        categoryId: category._id,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
        isAvailable: true
      },
      {
        name: 'Triple Cheese Blast',
        description: 'A luxurious blend of mozzarella, cheddar, and gouda with a garlic butter crust.',
        price: 399,
        categoryId: category._id,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&auto=format&fit=crop&q=60',
        isAvailable: true
      },
      {
        name: 'Garden Fresh Delight',
        description: 'Loaded with seasonal farm-fresh vegetables and artisanal pesto sauce.',
        price: 349,
        categoryId: category._id,
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=60',
        isAvailable: true
      }
    ];

    for (const item of items) {
      const existingItem = await MenuItem.findOne({ name: item.name });
      if (!existingItem) {
        await MenuItem.create(item);
        console.log(`Item "${item.name}" added`);
      } else {
        console.log(`Item "${item.name}" already exists`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedNewLaunches();
