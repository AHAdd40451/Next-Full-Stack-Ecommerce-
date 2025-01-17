import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { productKeys } from '@/app/(frontend)/features/products';
import { categoryKeys } from '@/app/(frontend)/features/categories';
import ProductCard from '@/app/(frontend)/components/Cards/Cards';
import Categories from '../components/Categories/Categories';
import { getQueryClient } from '@/app/(frontend)/utils/getQueryClient';
import { productsApi } from '@/app/(frontend)/features/products';
import { categoriesApi } from '@/app/(frontend)/features/categories';

// Server Component
export default async function Page() {
    const queryClient = getQueryClient();
    
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: productKeys.all,
            queryFn: () => productsApi.getAll(true)
        }),
        queryClient.prefetchQuery({
            queryKey: categoryKeys.all,
            queryFn: () => categoriesApi.getAll(true)
        })
    ]);

    const products = queryClient.getQueryData(productKeys.all);
    const categories = queryClient.getQueryData(categoryKeys.all);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className='w-[90%] m-auto'>
                <Categories categories={categories} />
                <ProductCard products={products} categories={categories} />
            </div>
        </HydrationBoundary>
    );
}
