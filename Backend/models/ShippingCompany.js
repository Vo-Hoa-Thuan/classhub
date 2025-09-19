const mongoose = require('mongoose');

const shippingCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  webUrl: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  saleOff: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true
  }
},{timestamps: true});
module.exports = mongoose.model("ShippingCompany", shippingCompanySchema);
