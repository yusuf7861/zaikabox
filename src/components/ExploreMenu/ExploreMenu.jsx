
import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExploreMenu.css';
import { categories } from "../../assets/assets.js";
import { Link } from "react-router-dom";

const ExploreMenu = ({ category, setCategory }) => {

    const menuRef = useRef(null);
    const scrollLeft = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }
    const scrollRight = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }

    return (
        <div className={"explore-menu position-relative pt-3"}>
            <div className="container">
                <h4 className={"d-flex fw-bold text-secondary mb-3 align-items-center justify-content-between"}>
                    Explore Our Menu
                    <div className={"d-flex"}>
                        <i className={"bi bi-arrow-left-circle scroll-icon fs-5 text-primary me-2 cursor-pointer"} onClick={scrollLeft}></i>
                        <i className={"bi bi-arrow-right-circle scroll-icon fs-5 text-primary cursor-pointer"} onClick={scrollRight}></i>
                    </div>
                </h4>
                <div ref={menuRef} className={"d-flex justify-content-between gap-3 overflow-auto explore-menu-list pb-3"}>
                    {
                        categories.map((item, index) => {
                            return (
                                <div
                                    onClick={() => setCategory(prev => prev === item.category ? "All" : item.category)}
                                    key={index}
                                    className={"text-center explore-menu-list-item flex-shrink-0"}
                                    style={{ width: '90px' }}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.category}
                                        className={`${category === item.category ? "active border-primary border-3" : "border-0"} rounded-circle img-fluid border`}
                                        style={{ width: '80px', height: '80px', padding: '5px', objectFit: 'cover', cursor: 'pointer', transition: 'all 0.3s' }}
                                    />
                                    <p className="mt-1 text-secondary fw-semibold cursor-pointer small text-truncate">{item.category}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
};

export default ExploreMenu;
