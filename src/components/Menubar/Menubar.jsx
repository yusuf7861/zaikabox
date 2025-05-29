import "./Menubar.css";
import {assets} from "../../assets/assets.js";
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {StoreContext} from "../../context/StoreContext.jsx";

const Menubar = () => {

  const [active, setActive] = useState('home');
  const { quantities } = useContext(StoreContext);

  // Total cart items from context
  const totalItems = Object.values(quantities).filter(qty => qty > 0).length;

  return (
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container">
          <Link to={"/"}><img src={assets.logo} alt={"logo"} height={48} width={48} className={"me-2"} /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                  aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={active === 'home' ? "nav-link fw-semibold" : "nav-link"} to="/" onClick={() => setActive('home')}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className={active === 'explore' ? "nav-link fw-semibold" : "nav-link"} aria-current="page" to="/explore" onClick={() => setActive('explore')}>Explore</Link>
              </li>
              <li className="nav-item">
                <Link className={active === 'contact' ? "nav-link fw-semibold" : "nav-link"} aria-current="page" to="/contact" onClick={() => setActive('contact')}>Contact Us</Link>
              </li>
            </ul>
            <div className={"d-flex align-items-center gap-4"}>
              <Link to={`/cart`}>
                <div className={"position-relative"}>
                  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12M20 42C20 43.1046 19.1046 44 18 44C16.8954 44 16 43.1046 16 42C16 40.8954 16.8954 40 18 40C19.1046 40 20 40.8954 20 42ZM42 42C42 43.1046 41.1046 44 40 44C38.8954 44 38 43.1046 38 42C38 40.8954 38.8954 40 40 40C41.1046 40 42 40.8954 42 42Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  {totalItems > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
        {totalItems}
      </span>
                  )}
                </div>
              </Link>
              <Link to={'/login'} className={"btn btn-outline-primary"}>Login</Link>
              <Link to={'/register'} className={"btn btn-outline-success"}>Register</Link>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Menubar;
