import { NextResponse } from 'next/server';
import { Product } from '@/app/(backend)/models/product.model';
import { Category } from '@/app/(backend)/models/category.model';
import { User } from '@/app/(backend)/models/user.model';
import connectDB from '@/app/(backend)/lib/db';


// CREATE: New product
export async function POST(request) {
  await connectDB();
  
  try {
    const {
      title,
      description,
      price,
      images,
      category,
      condition,
      location,
      seller
    } = await request.json();

    // Validation
    if (!title || !price || !category.main || !category.sub || !seller || !location) {
      return NextResponse.json({
        success: false,
        message: "Required fields missing",
        required: "title, price, category (main & sub), seller, location"
      }, { status: 400 });
    }

    // Verify category exists
    const existingCategory = await Category.findOne({
      _id: category.main,
      'subCategories._id': category.sub
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Invalid category"
      }, { status: 404 });
    }

    // Verify seller exists
    const existingSeller = await User.findById(seller);
    if (!existingSeller) {
      return NextResponse.json({
        success: false,
        message: "Invalid seller ID"
      }, { status: 404 });
    }

    // Create product
    const product = new Product({
      title,
      description,
      price,
      images,
      category,
      condition,
      location,
      seller
    });

    const savedProduct = await product.save();

    // Add product reference only to subcategory
    await Category.findOneAndUpdate(
      { 
        _id: category.main,
        'subCategories._id': category.sub 
      },
      { 
        $push: { 
          'subCategories.$.products': savedProduct._id 
        } 
      }
    );

    // Populate the saved product with seller and category details
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('category.main', 'name')
      .populate('seller', 'name email');

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({
      success: false,
      message: "Error creating product",
      error: error.message
    }, { status: 500 });
  }
}

// READ: Get products with filters
export async function GET(request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all query parameters
    const mainCategory = searchParams.get('mainCategory');
    const subCategory = searchParams.get('subCategory');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build query
    let query = { status: 'active' };

    if (mainCategory) query['category.main'] = mainCategory;
    if (subCategory) query['category.sub'] = subCategory;
    if (condition) query.condition = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products
    const products = await Product.find(query)
      .populate('category.main', 'name')
      .populate('seller', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects

    // Get all unique main category IDs
    const mainCategoryIds = [...new Set(products.map(p => p.category.main._id.toString()))];

    // Fetch all relevant categories in one query
    const categories = await Category.find({
      _id: { $in: mainCategoryIds }
    }).lean();

    // Create a map for quick category lookup
    const categoryMap = new Map(categories.map(cat => [cat._id.toString(), cat]));

    // Process products to include subcategory names
    const processedProducts = products.map(product => {
      const mainCategory = categoryMap.get(product.category.main._id.toString());
      const subCategory = mainCategory?.subCategories?.find(
        sub => sub._id.toString() === product.category.sub.toString()
      );

      return {
        ...product,
        category: {
          main: {
            _id: product.category.main._id,
            name: product.category.main.name
          },
          sub: {
            _id: product.category.sub,
            name: subCategory?.name || 'Unknown'
          }
        }
      };
    });

    // Get total count
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: processedProducts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: processedProducts.length,
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({
      success: false,
      message: "Error fetching products",
      error: error.message
    }, { status: 500 });
  }
}

// UPDATE: Update product
export async function PUT(request) {
  await connectDB();
  
  try {
    const { productId, updates } = await request.json();

    if (!productId || !updates) {
      return NextResponse.json({
        success: false,
        message: "Product ID and updates are required"
      }, { status: 400 });
    }

    // If category is being updated, verify new category exists
    if (updates.category) {
      const categoryExists = await Category.findOne({
        _id: updates.category.main,
        'subCategories._id': updates.category.sub
      });

      if (!categoryExists) {
        return NextResponse.json({
          success: false,
          message: "Invalid category"
        }, { status: 404 });
      }
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    ).populate('category.main', 'name').populate('seller', 'name email'); // Remove seller populate if not needed

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({
      success: false,
      message: "Error updating product",
      error: error.message
    }, { status: 500 });
  }
}

// DELETE: Delete product
export async function DELETE(request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required"
      }, { status: 400 });
    }

    // Find product first to get category info
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    // Remove product reference from category
    await Category.findByIdAndUpdate(
      product.category.main,
      { $pull: { products: productId } }
    );

    // Delete product
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json({
      success: false,
      message: "Error deleting product",
      error: error.message
    }, { status: 500 });
  }
}