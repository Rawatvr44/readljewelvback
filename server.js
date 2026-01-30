require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 large images

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/categories', require('./src/routes/categories'));

// MongoDB connection
mongoose.connect("mongodb+srv://rawatvr44_db_user:rnsjiJFW7y9keEFY@cluster0.qnxfghj.mongodb.net/?appName=Cluster0")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
