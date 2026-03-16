const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const newItems = [
    {
        name: 'Paneer Makhani Pizza',
        description: 'Succulent paneer cubes in a rich makhani sauce with crunchy onions.',
        price: 499,
        categoryName: 'Veg',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Pepperoni Passion',
        description: 'Loaded with spicy pepperoni and extra mozzarella cheese.',
        price: 549,
        categoryName: 'Non-Veg',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Cheesy Dip',
        description: 'Creamy, cheesy dip – the perfect companion for your crust.',
        price: 39,
        categoryName: 'Sides',
        image: 'https://images.unsplash.com/photo-1594627410549-34537330a4ee?auto=format&fit=crop&q=80&w=500'
    },
    {
        name: 'Peach Iced Tea',
        description: 'Refreshing iced tea with a hint of sweet peach.',
        price: 89,
        categoryName: 'Beverages',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=500'
    }
];

const seedMoreItems = async () => {
    try {
        await connectDB();

        for (const item of newItems) {
            const category = await Category.findOne({ categoryName: item.categoryName });
            if (!category) {
                console.log(`Category ${item.categoryName} not found for item ${item.name}`);
                continue;
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
            console.log(`Added menu item: ${item.name}`);
        }

        console.log('Seeding of additional items completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding more items:', error);
        process.exit(1);
    }
};

seedMoreItems();
