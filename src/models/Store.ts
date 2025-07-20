import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a store name.'],
    trim: true,
  },
  subdomain: {
    type: String,
    required: [true, 'Please provide a subdomain.'],
    unique: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency.'],
    default: 'USD',
  },
  razorpayKeyId: {
      type: String,
      trim: true,
  },
  theme: {
      type: String,
      default: 'blue',
  },
}, { timestamps: true });

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);
