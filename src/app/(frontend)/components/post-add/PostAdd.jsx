"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/app/(frontend)/store/useAuthStore';
import { FaSpinner } from 'react-icons/fa';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import Image from 'next/image';

const PostAdd = ({ categories: categoriesData }) => {

    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // Handle file upload
    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        // Validate file types and size
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
            if (!isValid) toast.error(`${file.name} is not an image`);
            if (!isValidSize) toast.error(`${file.name} is too large (max 5MB)`);
            return isValid && isValidSize;
        });

        if (validFiles.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        validFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/file-upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setUploadedImages(prev => [...prev, ...data.files]);
            toast.success('Images uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload images');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Remove uploaded image
    const handleRemoveImage = (indexToRemove) => {
        setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const { mutate: createProduct, isPending } = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Product created successfully!');
            router.push('/my-ads');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Redirect if not authenticated
    if (!isAuthenticated) {
        router.push('/signin');
        return null;
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);
        setStep(2);
    };

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setStep(3);
    };

    const onSubmit = (data) => {
        if (uploadedImages.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        const productData = {
            ...data,
            category: {
                main: selectedCategory._id,
                sub: selectedSubCategory._id
            },
            seller: user.uid,
            images: uploadedImages.map(img => img.fileUrl)
        };
        createProduct(productData);
    };
    
    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Post an Ad</h1>
                    <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${step >= 1 ? 'bg-secondary' : 'bg-gray-300'}`} />
                        <span className={`h-3 w-3 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-gray-300'}`} />
                        <span className={`h-3 w-3 rounded-full ${step >= 3 ? 'bg-secondary' : 'bg-gray-300'}`} />
                    </div>
                </div>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categoriesData?.data?.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className="p-4 border rounded-lg hover:border-secondary hover:shadow-lg transition-all"
                        >
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.subCategories.length} subcategories</p>
                        </button>
                    ))}
                </div>
            )}

            {step === 2 && selectedCategory && (
                <div>
                    <button
                        onClick={() => setStep(1)}
                        className="mb-4 text-secondary hover:underline font-medium"
                    >
                        ← Back to categories
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedCategory.subCategories.map((subCategory) => (
                            <button
                                key={subCategory._id}
                                onClick={() => handleSubCategorySelect(subCategory)}
                                className="p-4 border rounded-lg hover:border-secondary hover:shadow-md transition-all"
                            >
                                <h3 className="font-semibold">{subCategory.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <button
                        onClick={() => setStep(2)}
                        className="mb-4 text-secondary font-medium hover:underline"
                    >
                        ← Back to subcategories
                    </button>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <label className="block mb-2">Images (Max 5MB each)</label>
                            <div className="flex flex-wrap gap-4">
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="relative w-32 h-32">
                                        <Image
                                            src={image.fileUrl}
                                            alt={`Upload ${index + 1}`}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                ))}

                                {uploadedImages.length < 5 && (
                                    <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary_hover">
                                        {isUploading ? (
                                            <FaSpinner className="animate-spin text-2xl text-gray-300" />
                                        ) : (
                                            <>
                                                <MdCloudUpload className="text-3xl text-gray-300" />
                                                <span className="text-sm text-gray-500">Upload Image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className="w-full p-2 border rounded"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-2 border rounded h-32"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Price</label>
                            <input
                                type="number"
                                {...register('price', { required: 'Price is required' })}
                                className="w-full p-2 border rounded"
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="block mb-2">Condition</label>
                            <select
                                {...register('condition')}
                                className="w-full p-2 border rounded"
                            >
                                <option value="new">New</option>
                                <option value="used">Used</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Location</label>
                            <input
                                {...register('location', { required: 'Location is required' })}
                                className="w-full p-2 border rounded"
                            />
                            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || isUploading}
                            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary_hover disabled:opacity-50 transition duration-200"
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FaSpinner className="animate-spin" />
                                    Creating...
                                </div>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </form>
                </div>
            )}

        </div>
    )
}

export default PostAdd;