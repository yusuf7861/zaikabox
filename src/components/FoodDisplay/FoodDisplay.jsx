
import React, { useContext } from 'react';
import { StoreContext } from "../../context/StoreContext.jsx";
import CategoryCard from "./CategoryCard.jsx";

const FoodDisplay = ({ category, searchText }) => {
    const { foodList } = useContext(StoreContext);

    const filteredFood = foodList.filter(food => (
        (category === 'All' || food.category === category) && food.name.toLowerCase().includes(searchText.toLowerCase())
    ));

    return (
        <section className="section-padding py-3" id="food-display">
            <div className="container">
                <div className="text-center mb-4 animate-slideUp">
                    <span className="text-primary fw-bold text-uppercase small letter-spacing-2">Our Menu</span>
                    <h3 className="fw-bold text-secondary mt-1">Explore Our Best Dishes</h3>
                    <p className="text-muted mx-auto small" style={{ maxWidth: '600px' }}>
                        From sizzling appetizers to mouth-watering main courses, explore a world of flavors.
                    </p>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
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
                            <div className="p-4 bg-light rounded-4">
                                <i className="bi bi-search display-3 text-muted mb-2 d-block"></i>
                                <h5 className="text-secondary">No dishes found</h5>
                                <p className="text-muted small">Try adjusting your filters or search criteria.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FoodDisplay;