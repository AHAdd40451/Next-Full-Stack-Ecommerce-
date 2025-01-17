import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  images: [String],
  category: {
    main: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    sub: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  condition: {
    type: String,
    enum: ['new', 'used'],
    default: 'used'
  },
  location: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This will reference your User model
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);