const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuItemController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes - anyone can view menu
router.get('/', getMenuItems);
router.get('/category/:categoryId', getMenuItemsByCategory);

// Admin only routes
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;