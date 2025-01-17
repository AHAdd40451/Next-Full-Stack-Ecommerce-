import { categoriesApi } from '@/app/(frontend)/features/categories';
import { categoryKeys } from '@/app/(frontend)/features/categories';
import { getQueryClient } from '@/app/(frontend)/utils/getQueryClient';
import PostAdd from '@/app/(frontend)/components/post-add/PostAdd';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

const PostAddPage = async () => {
    const queryClient = getQueryClient();

    await Promise.all([

        queryClient.prefetchQuery({
            queryKey: categoryKeys.all,
            queryFn: () => categoriesApi.getAll(true)
        })
    ]);

    const categories = queryClient.getQueryData(categoryKeys.all);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PostAdd categories={categories} />
        </HydrationBoundary>
    );
};

export default PostAddPage;
