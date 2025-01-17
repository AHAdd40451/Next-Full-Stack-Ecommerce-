'use client';
import useStore from '../../store/useStore';
import CardDetail from './Card-detail';
import ReusableSwiper from '../Reusable/Reusable';


const ProductCard = ({ products, categories }) => {


    // Client state
    const { favorites, filters, toggleFavorite, setFilter, } = useStore();

    /* Filter products
    
    const filteredProducts = products?.data?.filter(product => {
        if (filters.category !== 'all' && product.category !== filters.category) {
            return false;
        }
        if (filters.condition !== 'all' && product.condition !== filters.condition) {
            return false;
        }
        return true;
    }); */

    const ProductCardComponent = ({ item }) => {
        return (
            <CardDetail
                product={item}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
            />
        );
    };

    return (
        <div className="my-12">
            <h2 className="text-3xl font-bold mb-8 px-4 text-gray-800">
                Featured Products
            </h2>

            {categories?.data?.length > 0 && categories?.data?.map((category) => (
                <div key={category.id} className="mb-10">
                    {category.totalProducts > 0 && (
                        <h3 className="text-2xl font-bold mb-4 px-4 text-gray-800">
                            {category.name}
                        </h3>
                    )}

                    {category.subCategories.map((subCategory) => (
                        <div key={subCategory.id} className="mb-8">
                            {subCategory.products?.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold px-4 text-gray-800">
                                        {subCategory.name}
                                    </h4>
                                    <div className="px-2">
                                        <ReusableSwiper
                                            data={subCategory?.products}
                                            Component={ProductCardComponent}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ProductCard;