import { Route, Routes, useLocation } from "react-router-dom";
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
import Orders from "./pages/Orders/Orders.jsx";
import ErrorBoundary from "./components/ErrorHandling/ErrorBoundary.jsx";
import Profile from "./pages/Profile/Profile.jsx";


const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const shouldAddPadding = !isHome && !isAuthPage;

  return (
    <div className={shouldAddPadding ? 'page-padding' : ''}>
      <Menubar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/contact"} element={<Contact />} />
        <Route path={"/explore"} element={<ExploreFood />} />
        <Route path={"/food/:id"} element={<FoodDetail />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/place-order"} element={<PlaceOrder />} />
        <Route path={"/orders"} element={<Orders />} />
        <Route path={"/order-success"} element={<OrderSuccess />} />
        <Route path={"/login"} element={<ErrorBoundary><Login /></ErrorBoundary>} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/profile"} element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
