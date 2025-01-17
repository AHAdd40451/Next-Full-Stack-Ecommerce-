import React from "react";
import { useParams } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { toast } from "react-hot-toast";
import ProductDetail from "@/app/(frontend)/components/ProductDetail/productDetail";
import { getQueryClient } from "@/app/(frontend)/utils/getQueryClient";
import { productKeys } from '@/app/(frontend)/features/products';
import { categoryKeys } from '@/app/(frontend)/features/categories';
import { productsApi } from "@/app/(frontend)/features/products";
import { categoriesApi } from "@/app/(frontend)/features/categories";


const ProductDetailsPage = async ({ params }) => {

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: productKeys.byId(params.id),
      queryFn: () => productsApi.getById(params.id, true)
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.all,
      queryFn: () => categoriesApi.getAll(true)
    })
  ]);

  const product = queryClient.getQueryData(productKeys.byId(params.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetail product={product?.product} />
    </HydrationBoundary>
  );
};

export default ProductDetailsPage;
