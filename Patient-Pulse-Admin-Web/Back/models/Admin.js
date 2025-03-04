const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  module.exports = Admin;
