import "./Menubar.css";
import {assets} from "../../assets/assets.js";
import {Link} from "react-router-dom";
import {useState} from "react";

const Menubar = () => {

  const [active, setActive] = useState('home');

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
                  <img src={assets.cart} height={48} width={48} alt={"cart"}/>
                  <span className={"position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"}></span>
                </div>
              </Link>
              <button className={"btn btn-outline-primary"}>Login</button>
              <button className={"btn btn-outline-success"}>Register</button>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Menubar;
