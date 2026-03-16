const Address = require('../models/Address');

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const { houseNumber, street, city, state, pincode, landmark, isDefault } = req.body;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user.id,
      houseNumber,
      street,
      city,
      state,
      pincode,
      landmark,
      isDefault: isDefault || false
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { isDefault } = req.body;
    
    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
