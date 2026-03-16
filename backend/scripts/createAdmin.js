const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword'; // You should change this after first login

    try {
        await connectDB();

        // Check if admin already exists
        let user = await User.findOne({ email: adminEmail });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (user) {
            console.log(`User ${adminEmail} already exists. Updating to admin and resetting password...`);
            user.role = 'admin';
            user.password = hashedPassword;
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log(`Creating new admin user: ${adminEmail}...`);
            user = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                phone: '0000000000',
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        console.log('\nAdmin Credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating/updating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
