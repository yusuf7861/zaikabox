import React, {useContext} from 'react';
import {StoreContext, StoreContextProvider} from "../../context/StoreContext.jsx";
import CategoryCard from "./CategoryCard.jsx";

const FoodDisplay = ({category, searchText}) => {

    const {foodList} = useContext(StoreContext);

    const filteredFood = foodList.filter(food => (
        (category === 'All' || food.category === category) && food.name.toLowerCase().includes(searchText.toLowerCase())
    ));

    return (
        <section className="section-padding">
            <div className="container">
                <div className="mt-4 d-flex flex-column flex-md-row align-items-md-baseline justify-content-between mb-4">
                    <div>
                        <h2 className="h2 fw-bold text-secondary mb-2">Food Categories</h2>
                        <p className="text-muted">Explore our wide selection of cuisines</p>
                    </div>
                </div>

                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3 g-md-4">
                    {filteredFood.length > 0 ? (
                        filteredFood.map((foodItem, index) => (
                                <div key={foodItem.id || index} className="col">
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
                        <div className={"text-center mt-4"}>
                            <h4>No food found.</h4>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FoodDisplay;