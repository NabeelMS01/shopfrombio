import mongoose, { Schema, Document } from 'mongoose';

const VariantOptionSchema = new Schema({
  name: { type: String, required: true, trim: true },
  stock: { type: Number },
});

const VariantSchema = new Schema({
  type: { type: String, required: true, trim: true }, // e.g. color, size
  options: [VariantOptionSchema],
});

const ProductSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'amount'],
    },
    value: Number,
  },
  stock: {
    type: Number,
    required: true,
  },
  productType: {
    type: String,
    enum: ['product', 'service'],
    required: true,
  },
  variants: [VariantSchema],
  images: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
