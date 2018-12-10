
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const ProductSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);
