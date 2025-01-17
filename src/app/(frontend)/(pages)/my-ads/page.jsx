import React from "react";
import { useParams } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import MyAds from "@/app/(frontend)/components/MyAds/MyAds";
import { getQueryClient } from "@/app/(frontend)/utils/getQueryClient";
import { productKeys } from "@/app/(frontend)/features/products";
import { categoryKeys } from "@/app/(frontend)/features/categories";
import { productsApi } from "@/app/(frontend)/features/products";
import { categoriesApi } from "@/app/(frontend)/features/categories";

const MyAdsPage = async ({ params }) => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: productKeys.all,
      queryFn: () => productsApi.getAll(true),
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.all,
      queryFn: () => categoriesApi.getAll(true),
    }),
  ]);

  const product = queryClient.getQueryData(productKeys.all);
  console.log("Product data:", product);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyAds product={product?.data} />
    </HydrationBoundary>
  );
};

export default MyAdsPage;
