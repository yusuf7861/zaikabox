import React, {useState} from "react";
import HowItWorks from "../HowItWorks.jsx";
import Footer from "../Footer.jsx";
import Hero from "../Hero.jsx";
import FoodDisplay from "../FoodDisplay/FoodDisplay.jsx";
import ExploreMenu from "../ExploreMenu/ExploreMenu.jsx";

const Header = () => {

    const [category, setCategory] = useState('All');

    return (
        <div className="min-vh-100 bg-white">
            <Hero  />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} searchText={''} />
            {/*<HowItWorks />*/}
            {/*<Footer />*/}
        </div>
    );
};

export default Header;