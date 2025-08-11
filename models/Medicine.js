import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: String,
  category: String,
  quantity: Number,
  expiryDate: Date,
  price: Number
}, {
  timestamps: true
});

export default mongoose.model('Medicine', medicineSchema);