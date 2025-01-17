'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/app/(frontend)/features/auth';
import { signupSchema } from '@/app/(frontend)/validations/auth.schema';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(signupSchema),
        mode: 'onChange'
    });

    const { mutate: signup, isPending } = useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authApi.signup(userData);
                return response;
            } catch (error) {
                throw new Error(error?.response?.data?.message || error.message || 'Something went wrong');
            }
        },
        onSuccess: () => {
            toast.success('Please check your email for verification link');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const isLoading = isPending || isSubmitting;

    const handleFormSubmit = handleSubmit((data) => {
        signup(data);
    });

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="grid w-full grid-cols-1 items-center justify-between md:grid-cols-2">
                <div className="hidden items-center justify-center md:flex">
                    <Image src={"/assets/logo.jpg"} alt="logo" width={400} height={400} />
                </div>

                <form 
                    onSubmit={handleFormSubmit}
                    className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#001219]"
                >
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        className="flex md:hidden"
                        width={200}
                        height={200}
                    />

                    <h1 className="text-3xl text-white">Sign Up</h1>

                    <div className="flex w-full flex-col items-center">
                        <div className="w-[50%] py-4">
                            <input
                                type="text"
                                placeholder="Enter name"
                                {...register('name')}
                                disabled={isLoading}
                                className="w-full rounded-lg p-3 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="w-[50%] py-4">
                            <input
                                type="email"
                                placeholder="Enter email"
                                {...register('email')}
                                disabled={isLoading}
                                className="w-full rounded-lg p-3 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="w-[50%] py-4">
                            <input
                                type="password"
                                placeholder="Enter password"
                                {...register('password')}
                                disabled={isLoading}
                                className="w-full rounded-lg p-3 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[50%] rounded-lg bg-secondary px-6 py-3 text-white hover:bg-secondary_hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transtion duration-300"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin h-5 w-5" />
                                <span>Signing up...</span>
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-200">
                        Already have an account?{' '}
                        <Link 
                            href="/signin" 
                            className={`cursor-pointer font-semibold uppercase underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
