import api from "@/app/(frontend)/utils/axios";

export const productKeys = {
  all: ["products"],
  byId: (id) => ["product", id],
};

export const productsApi = {
  // Server-side fetch
  getAll: async (isServer = false) => {
    if (isServer) {
      // Direct fetch for server
      const res = await fetch(`${process.env.API_URL}/products`, {
        cache: "no-store", // or configure as needed
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }

    // Axios for client
    return api.get("/products");
  },

  getById: async (id, isServer) => {
    if (isServer) {
      // Direct fetch for server
      const res = await fetch(`${process.env.API_URL}/products/${id}`, {
        cache: "no-store", // or configure as needed
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }

    // Axios for client
    return api.get(`/products/${id}`);
  },
};
