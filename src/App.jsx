import Menubar from "./components/Menubar/Menubar.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import ExploreFood from "./pages/ExploreFood/ExploreFood.jsx";
import FoodDetail from "./pages/FoodDetail/FoodDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";


const App = () => {
  return (
    <div>
        <Menubar />
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/contact"} element={<Contact />} />
            <Route path={"/explore"} element={<ExploreFood />} />
            <Route path={"/food/:id"} element={<FoodDetail />} />
            <Route path={"/cart"} element={<Cart />} />
            <Route path={"/orders"} element={<PlaceOrder />} />
        </Routes>
    </div>
  )
}

export default App