const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use a separate test database
const TEST_MONGO_URI = 'mongodb://localhost:27017/pizzastoreTEST';

before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

after(async () => {
  // Optional: drop database after all tests
  // await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
