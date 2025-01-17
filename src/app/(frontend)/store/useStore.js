import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            // Only UI state
            favorites: [],
            filters: {
                category: 'all',
                condition: 'all'
            },

            toggleFavorite: (productId) =>
                set(state => ({
                    favorites: state.favorites.includes(productId)
                        ? state.favorites.filter(id => id !== productId)
                        : [...state.favorites, productId]
                })),

            setFilter: (key, value) =>
                set(state => ({
                    filters: { ...state.filters, [key]: value }
                }))
        }),
        {
            name: 'user-preferences'
        }
    )
);

export default useStore;