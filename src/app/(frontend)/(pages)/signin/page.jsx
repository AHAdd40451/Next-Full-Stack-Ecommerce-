'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/app/(frontend)/features/auth';
import useAuthStore from '@/app/(frontend)/store/useAuthStore';
import { signinSchema } from '@/app/(frontend)/validations/auth.schema';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

const Signin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(signinSchema),
        mode: 'onChange'
    });

    const { mutate: signin, isPending } = useMutation({
        mutationFn: async (credentials) => {
            try {
                const response = await authApi.signin(credentials);
                return response;
            } catch (error) {
                throw new Error(error?.response?.data?.message || error.message || 'Something went wrong');
            }
        },
        onSuccess: (data) => {
            setAuth(
                {
                    email: data.email,
                    name: data.name,
                    status: data.status,
                    role: data.role,
                    uid: data.uid,
                },
                data.token
            );
            localStorage.setItem('token', data.token);
            router.push('/');
            toast.success('Signed in successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const isLoading = isPending || isSubmitting;

    const handleFormSubmit = handleSubmit((data) => {
        signin(data);
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

                    <h1 className="text-3xl text-white">SignIn</h1>

                    <div className="flex w-full flex-col items-center">
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

                    <Link 
                        href="/forgot-password" 
                        className={`text-xs text-white cursor-pointer ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        Forgot password?
                    </Link>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[50%] rounded-lg bg-secondary px-6 py-3 text-white hover:bg-secondary_hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition duration-300"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-200">
                        Don't have an account?{' '}
                        <Link 
                            href="/signup" 
                            className={`cursor-pointer font-semibold uppercase underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signin;
