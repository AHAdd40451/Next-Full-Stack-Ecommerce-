import api from '@/app/(frontend)/utils/axios';

export const categoryKeys = {
    all: ['categories'],
};

export const categoriesApi = {
    // Server-side fetch
    getAll: async (isServer = false) => {
        if (isServer) {
            // Direct fetch for server
            const res = await fetch(`${process.env.API_URL}/categories`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch categories');
            return res.json();
        }
        
        // Axios for client
        return api.get('/categories');
    }
};