import React from "react";
import WishList from "../../components/Wishlist/WishList";
import { getQueryClient } from "../../utils/getQueryClient";
import { productsApi } from "../../features/products";
import { productKeys } from "../../features/products";

export default async function Page({ params }) {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: productKeys.all,
      queryFn: () => productsApi.getAll(true),
    }),
  ]);

  const products = queryClient.getQueryData(productKeys.all);

  return (
    <div>
      <WishList MyAd={products?.data} params={params.id} />
    </div>
  );
}
