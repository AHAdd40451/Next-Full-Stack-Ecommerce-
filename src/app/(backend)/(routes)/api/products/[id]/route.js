import { NextResponse } from 'next/server';
import connectDB from '@/app/(backend)/lib/db';
import { Product } from '@/app/(backend)/models/product.model';
import { Category } from '@/app/(backend)/models/category.model';

export async function GET(request, { params }) {
    await connectDB();

    try {

        const { id } = params;

        // Fetch the product with populated fields
        const product = await Product.findById(id)
            .populate('seller', 'name email')
            .populate('category.main', 'name')
            .lean();

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product
        }, { status: 200 });

    } catch (error) {
        console.error('Product fetch error:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching products",
            error: error.message
        }, { status: 500 });
    }
}