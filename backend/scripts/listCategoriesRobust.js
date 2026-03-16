const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');

dotenv.config();

const listCategories = async () => {
    try {
        await connectDB();
        const categories = await Category.find().lean();
        console.log('START_OF_CATEGORIES');
        categories.forEach(c => console.log(c.categoryName));
        console.log('END_OF_CATEGORIES');
        process.exit(0);
    } catch (error) {
        console.error('Error listing categories:', error);
        process.exit(1);
    }
};

listCategories();
