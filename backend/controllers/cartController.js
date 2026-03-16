const Cart = require('../models/Cart');

// GET cart by user
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.itemId', 'name price image');
    if (!cart) {
      return res.status(200).json({ items: [], totalAmount: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD item to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, name, price, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ itemId, name, price, quantity }],
        totalAmount: price * quantity
      });
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find(
        item => item.itemId.toString() === itemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ itemId, name, price, quantity });
      }

      // Recalculate total
      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );

      await cart.save();
    }

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE item from cart
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.itemId.toString() !== req.params.itemId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE item quantity in cart
const updateCartQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (quantity < 1) {
       return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.itemId.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json({ message: 'Cart quantity updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart, updateCartQuantity };