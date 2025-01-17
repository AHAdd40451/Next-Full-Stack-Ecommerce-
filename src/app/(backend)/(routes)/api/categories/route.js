import { NextResponse } from 'next/server';
import { Category } from '@/app/(backend)/models/category.model';
import { Product } from '@/app/(backend)/models/product.model';
import connectDB from '@/app/(backend)/lib/db';

// CREATE: New category with subcategories
export async function POST(request) {
  await connectDB();

  try {
    const { name, image, subCategories } = await request.json();

    // Validation
    if (!name) {
      return NextResponse.json({
        success: false,
        message: "Name is required"
      }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category already exists"
      }, { status: 409 });
    }

    const category = new Category({
      name,
      image,
      subCategories: subCategories || []
    });

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category
    }, { status: 201 });

  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({
      success: false,
      message: "Error creating category",
      error: error.message
    }, { status: 500 });
  }
}

// READ: Get all categories or filter by query
export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const mainCategoryId = searchParams.get('mainCategoryId');

    let filterQuery = { isActive: true };

    // Apply filters if provided
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { 'subCategories.name': { $regex: query, $options: 'i' } }
      ];
    }

    if (mainCategoryId) {
      filterQuery._id = mainCategoryId;
    }

    // First get categories
    const categories = await Category.find(filterQuery).lean();

    // Process each category
    const processedCategories = await Promise.all(categories.map(async (category) => {
      // Get all active products for this category
      const products = await Product.find({
        'category.main': category._id,
        status: 'active'
      })
        .select('title price images status category.sub createdAt')
        .sort({ createdAt: -1 })
        .lean();

      // Process subcategories with their products
      category.subCategories = category.subCategories.map(sub => {
        const subProducts = products.filter(p =>
          p.category.sub.toString() === sub._id.toString()
        );

        return {
          ...sub,
          productCount: subProducts.length,
          products: subProducts
        };
      });

      // Remove main category products array since we're showing them in subcategories
      return {
        ...category,
        products: undefined,
        totalProducts: products.length
      };
    }));

    return NextResponse.json({
      success: true,
      count: processedCategories.length,
      data: processedCategories
    });

  } catch (error) {
    console.error('Category fetch error:', error);
    return NextResponse.json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    }, { status: 500 });
  }
}

// UPDATE: Update category or its subcategories
export async function PUT(request) {
  await connectDB();

  try {
    const { categoryId, updates, subCategoryId } = await request.json();

    if (!categoryId || !updates) {
      return NextResponse.json({
        success: false,
        message: "Category ID and updates are required"
      }, { status: 400 });
    }

    let category;

    if (subCategoryId) {
      // Update subcategory
      category = await Category.findOneAndUpdate(
        {
          _id: categoryId,
          'subCategories._id': subCategoryId
        },
        {
          $set: {
            'subCategories.$.name': updates.name,
            'subCategories.$.image': updates.image,
            'subCategories.$.isActive': updates.isActive
          }
        },
        { new: true }
      );
    } else {
      // Update main category
      category = await Category.findByIdAndUpdate(
        categoryId,
        { $set: updates },
        { new: true }
      );
    }

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Category not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json({
      success: false,
      message: "Error updating category",
      error: error.message
    }, { status: 500 });
  }
}

// DELETE: Delete category or subcategory
export async function DELETE(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');

    if (!categoryId) {
      return NextResponse.json({
        success: false,
        message: "Category ID is required"
      }, { status: 400 });
    }

    let category;

    if (subCategoryId) {
      // Remove subcategory
      category = await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { subCategories: { _id: subCategoryId } } },
        { new: true }
      );
    } else {
      // Check if category has products
      const hasProducts = await Category.findOne({
        _id: categoryId,
        products: { $exists: true, $ne: [] }
      });

      if (hasProducts) {
        return NextResponse.json({
          success: false,
          message: "Cannot delete category with existing products"
        }, { status: 400 });
      }

      // Delete main category
      category = await Category.findByIdAndDelete(categoryId);
    }

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Category not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json({
      success: false,
      message: "Error deleting category",
      error: error.message
    }, { status: 500 });
  }
}