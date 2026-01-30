const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  goldWeight: { type: Number, required: true },
  goldPurity: { type: String, required: true }, // e.g., '24K', '22K', '18K', etc.
  image: { type: String, required: true }, // image file path or URL
  description: { type: String }
},{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);