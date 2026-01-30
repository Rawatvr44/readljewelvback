const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const router = express.Router();

// Public: get all products or filter by category
router.get('/', async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  const products = await Product.find(query).sort('-createdAt');
  res.json(products);
});

// Admin: add product (expects direct fields + imageBase64)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, price, goldWeight, goldPurity, description, imageBase64 } = req.body;
    let imageUrl = '';
    if (imageBase64) {
      const cloud = await uploadToCloudinary(imageBase64, 'imperial/products');
      imageUrl = cloud.secure_url;
    } else {
      imageUrl = req.body.image;
    }
    const product = new Product({ name, category, price, goldWeight, goldPurity, description, image: imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

// Admin: update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, price, goldWeight, goldPurity, description, imageBase64 } = req.body;
    const update = {};
    if (name) update.name = name;
    if (category) update.category = category;
    if (price) update.price = price;
    if (goldWeight) update.goldWeight = goldWeight;
    if (goldPurity) update.goldPurity = goldPurity;
    if (description) update.description = description;
    if (imageBase64) {
      const cloud = await uploadToCloudinary(imageBase64, 'imperial/products');
      update.image = cloud.secure_url;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// Admin: delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', product });
  } catch(err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
});

module.exports = router;
