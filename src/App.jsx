import { Route, Routes } from "react-router-dom";
import Menubar from "./components/Menubar/Menubar.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import ExploreFood from "./pages/ExploreFood/ExploreFood.jsx";
import FoodDetail from "./pages/FoodDetail/FoodDetail.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login_Register/Login.jsx";
import Register from "./pages/Login_Register/Register.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess.jsx";
import ErrorBoundary from "./components/ErrorHandling/ErrorBoundary.jsx";


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
            <Route path={"/order-success"} element={<OrderSuccess />} />
            <Route path={"/login"} element={<ErrorBoundary><Login /></ErrorBoundary>} />
            <Route path={"/register"} element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
