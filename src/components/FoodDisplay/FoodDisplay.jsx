import React, { useContext } from 'react';
import { StoreContext } from "../../context/StoreContext.jsx";
import CategoryCard from "./CategoryCard.jsx";

const FoodDisplay = ({ category, searchText }) => {
    const { foodList } = useContext(StoreContext);

    const filteredFood = foodList.filter(food => (
        (category === 'All' || food.category === category) && food.name.toLowerCase().includes(searchText.toLowerCase())
    ));

    return (
        <section className="section-padding py-5" id="food-display">
            <div className="container">
                <div className="text-center mb-5 animate-slideUp">
                    <span className="text-primary fw-bold text-uppercase letter-spacing-2">Our Menu</span>
                    <h2 className="display-5 fw-bold text-secondary mt-2">Explore Our Best Dishes</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        From sizzling appetizers to mouth-watering main courses, explore a world of flavors curated just for you.
                    </p>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredFood.length > 0 ? (
                        filteredFood.map((foodItem, index) => (
                            <div key={foodItem.id || index} className="col animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CategoryCard
                                    id={foodItem.id}
                                    name={foodItem.name}
                                    image={foodItem.imageUrl}
                                    price={foodItem.price}
                                    category={foodItem.category}
                                    description={foodItem.description}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="p-5 bg-light rounded-4">
                                <i className="bi bi-search display-1 text-muted mb-3 d-block"></i>
                                <h4 className="text-secondary">No dishes found</h4>
                                <p className="text-muted">Try adjusting your filters or search criteria.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FoodDisplay;