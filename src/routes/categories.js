const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

// Admin: add category (expects {name, imageBase64})
router.post('/', auth, async (req, res) => {
  try {
    const { name, imageBase64 } = req.body;
    if (!name || !imageBase64) return res.status(400).json({ message: 'Name/image required' });
    const cloud = await uploadToCloudinary(imageBase64, 'imperial/categories');
    const category = await Category.create({ name, image: cloud.secure_url });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create', error: err.message });
  }
});

// Admin: update category (can update name/image)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, imageBase64 } = req.body;
    const update = {};
    if (name) update.name = name;
    if (imageBase64) {
      const cloud = await uploadToCloudinary(imageBase64, 'imperial/categories');
      update.image = cloud.secure_url;
    }
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update', error: err.message });
  }
});

// Admin: delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted', cat });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
});

module.exports = router;
