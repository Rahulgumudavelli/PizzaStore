const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');

dotenv.config();

const listCategories = async () => {
    try {
        await connectDB();
        const categories = await Category.find();
        console.log('--- Categories ---');
        categories.forEach(c => console.log(`${c.categoryName}`));
        process.exit(0);
    } catch (error) {
        console.error('Error listing categories:', error);
        process.exit(1);
    }
};

listCategories();
