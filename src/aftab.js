require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // adjust path if needed

async function createAdmin() {
  try {
    await mongoose.connect("mongodb+srv://rawatvr44_db_user:rnsjiJFW7y9keEFY@cluster0.qnxfghj.mongodb.net/?appName=Cluster0");

    const hashedPassword = await bcrypt.hash("aftab123984", 10);

    const admin = new Admin({
      username: "aftab",
      password: hashedPassword
    });

    await admin.save();
    console.log("Admin user created successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
