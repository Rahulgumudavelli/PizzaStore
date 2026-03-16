const MenuItem = require('../models/MenuItem');

// GET all menu items
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate('categoryId', 'categoryName');
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ categoryId: req.params.categoryId })
      .populate('categoryId', 'categoryName');
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE menu item (admin only)
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, image, isAvailable } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      categoryId,
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE menu item (admin only)
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE menu item (admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};