const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const newItems = [
    // Pizza
    {
        name: 'Tandoori Paneer Pizza',
        description: 'Spiced paneer, onions, and capsicum with a tandoori twist.',
        price: 459,
        categoryName: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Chicken Sausage Pizza',
        description: 'Classic pizza topped with juicy chicken sausages and olives.',
        price: 499,
        categoryName: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500'
    },
    // Sides
    {
        name: 'Peri-Peri Fries',
        description: 'Crispy golden fries tossed in spicy peri-peri seasoning.',
        price: 149,
        categoryName: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Taco Mexicana',
        description: 'Crispy taco shells stuffed with spicy veg/non-veg filling and cheese.',
        price: 199,
        categoryName: 'Sides',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865.jpg?auto=format&fit=crop&q=80&w=500'
    },
    // Beverages
    {
        name: 'Mango Lassi',
        description: 'Creamy and refreshing traditional Indian mango yogurt drink.',
        price: 129,
        categoryName: 'Beverages',
        image: 'https://images.unsplash.com/photo-1523362622747-ad91f0d23f9a?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Cold Coffee',
        description: 'Smooth and frothy cold coffee – a perfect caffeine kick.',
        price: 159,
        categoryName: 'Beverages',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=500'
    },
    // Combo
    {
        name: 'Pizza & Dips Combo',
        description: '1 Personal Pizza + 1 Cheesy Dip + 1 Pepsi 500ml.',
        price: 349,
        categoryName: 'Combo',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Family Feast',
        description: '2 Med Pizzas + 2 Garlic Breadsticks + 1 Choco Lava Cake + 1 Large Pepsi.',
        price: 1299,
        categoryName: 'Combo',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=500'
    },
    // Bestsellers
    {
        name: 'Smoky BBQ Chicken Pizza',
        description: 'BBQ chicken, red onions, and cilantro with a smoky finish.',
        price: 599,
        categoryName: 'Bestsellers',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Veggie Paradise',
        description: 'Golden corn, black olives, capsicum, and red paprika.',
        price: 459,
        categoryName: 'Bestsellers',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500'
    },
    // Veg
    {
        name: 'Paneer Tikka Stuffed Crust',
        description: 'Spicy paneer tikka topping with a cheese-stuffed crust.',
        price: 549,
        categoryName: 'Veg',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Mediterranean Veg',
        description: 'Feta cheese, sun-dried tomatoes, and exotic vegetables.',
        price: 499,
        categoryName: 'Veg',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=500'
    },
    // Non-Veg
    {
        name: 'Mutton Rogan Josh Pizza',
        description: 'Exotic pizza topped with aromatic mutton rogan josh pieces.',
        price: 699,
        categoryName: 'Non-Veg',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Peri-Peri Chicken Wings',
        description: 'Juicy chicken wings tossed in fiery peri-peri sauce.',
        price: 249,
        categoryName: 'Non-Veg',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=500'
    },
    // New Launches
    {
        name: 'Truffle Mushroom Pizza',
        description: 'Exotic mushrooms with truffle oil and parmesan cheese.',
        price: 649,
        categoryName: 'New Launches',
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Dynamite Shrimp Pizza',
        description: 'Crispy dynamite shrimp with a spicy mayo drizzle.',
        price: 749,
        categoryName: 'New Launches',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500'
    }
];

const seedAllCategories = async () => {
    try {
        await connectDB();

        for (const item of newItems) {
            let category = await Category.findOne({ categoryName: item.categoryName });
            
            // If category doesn't exist, create it (best effort)
            if (!category) {
                console.log(`Category ${item.categoryName} not found. Creating it...`);
                category = await Category.create({ categoryName: item.categoryName });
            }

            const existingItem = await MenuItem.findOne({ name: item.name });
            if (existingItem) {
                console.log(`Item ${item.name} already exists. Skipping.`);
                continue;
            }

            await MenuItem.create({
                ...item,
                categoryId: category._id,
                isAvailable: true
            });
            console.log(`Added menu item: ${item.name} to category: ${item.categoryName}`);
        }

        console.log('\nBulk seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error in bulk seeding:', error);
        process.exit(1);
    }
};

seedAllCategories();
