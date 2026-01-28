
import "./Menubar.css";
import { assets, backendUrl } from "../../assets/assets.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { quantities } = useContext(StoreContext);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check login state
    useEffect(() => {
        const checkLogin = () => {
            const authToken = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');

            if (authToken) {
                setIsLoggedIn(true);
                setUserEmail(email || '');
            } else {
                setIsLoggedIn(false);
                setUserEmail('');
            }
        };

        checkLogin();

        const handleLoginEvent = () => checkLogin();
        window.addEventListener('login', handleLoginEvent);

        return () => {
            window.removeEventListener('login', handleLoginEvent);
        };
    }, [location]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${backendUrl}/api/v1/auth/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error(e);
            // toast.error('Logout failed'); // Better to just log out locally silently if server fails
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            setIsLoggedIn(false);
            setUserEmail('');
            toast.success('Logged out successfully');
            navigate('/login');
        }
    }

    const totalItems = Object.values(quantities).filter(qty => qty > 0).length;

    return (
        <nav className={`navbar navbar-expand-lg fixed-top transition-all ${isScrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={assets.logo} alt="Zaikabox" height={40} className="me-2 drop-shadow" />
                    <span className="fw-bold" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>ZaikaBox</span>
                </Link>

                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navContent" style={{ outline: 'none' }}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4">
                        {['home', 'explore', 'contact'].map((item) => (
                            <li className="nav-item" key={item}>
                                <Link
                                    className={`nav-link text-capitalize ${active === item ? 'active-link' : ''}`}
                                    to={item === 'home' ? '/' : `/${item}`}
                                    onClick={() => setActive(item)}
                                    style={{ fontWeight: '500', color: 'var(--secondary)' }}
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-4">
                        <Link to="/cart" className="position-relative text-dark transition-transform hover-scale">
                            <i className="bi bi-cart2 fs-4"></i>
                            {totalItems > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <div className="dropdown">
                                <button className="btn btn-sm btn-outline-primary dropdown-toggle rounded-pill px-3" type="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-1"></i> Account
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
                                    <li><h6 className="dropdown-header">{userEmail}</h6></li>
                                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/orders"><i className="bi bi-bag me-2"></i>Orders</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-sm btn-outline-secondary rounded-pill px-4">Login</Link>
                                <Link to="/register" className="btn btn-sm btn-primary rounded-pill px-4">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menubar;
