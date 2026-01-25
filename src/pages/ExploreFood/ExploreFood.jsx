import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";


export const ExploreFood = () => {
    const [category, setCategory] = useState('All');
    const [searchText, setSearchText] = useState('');




    return (
        <div style={{ paddingTop: '100px' }}>
            <div className="container my-4">
                <form
                    className="row g-3 align-items-center justify-content-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* Category Dropdown */}
                    <div className="col-12 col-md-auto">
                        <select
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ minWidth: '150px', fontSize: '1.1rem' }}
                        >
                            <option value="All">All</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Salad">Salad</option>
                            <option value="Cake">Cakes</option>
                            <option value="Burger">Burger</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Ice Cream">Ice Creams</option>
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="col-12 col-md-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search your favourite dish..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '300px', fontSize: '1.1rem' }}
                        />
                    </div>

                    {/* Search Button */}
                    <div className="col-12 col-md-auto">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            style={{ fontSize: '1.1rem' }}
                        >
                            <i className="bi bi-search"></i> Search
                        </button>
                    </div>
                </form>
            </div>

            <FoodDisplay category={category} searchText={searchText} />
        </div>
    )
}

export default ExploreFood