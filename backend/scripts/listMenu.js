const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const listMenu = async () => {
    try {
        await connectDB();
        const categories = await Category.find();
        console.log('--- Categories ---');
        categories.forEach(c => console.log(`${c.categoryName} (${c._id})`));

        const items = await MenuItem.find().populate('categoryId');
        console.log('\n--- Menu Items ---');
        items.forEach(i => {
            console.log(`- ${i.name} [${i.categoryId?.categoryName || 'No Category'}]: $${i.price}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error listing menu:', error);
        process.exit(1);
    }
};

listMenu();
