import mongoose from 'mongoose';

// Sub-category schema (nested)
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

// Main category schema with nested subcategories
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  subCategories: [subCategorySchema],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);