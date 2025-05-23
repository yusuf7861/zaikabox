import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExploreMenu.css';
import {categories} from "../../assets/assets.js";
import {Link} from "react-router-dom";

const ExploreMenu = ({category, setCategory}) => {

    const menuRef = useRef(null);
    const scrollLeft  = () => {
        if(menuRef.current) {
            menuRef.current.scrollBy({left: -300, behavior: 'smooth'});
        }
    }
    const scrollRight  = () => {
        if(menuRef.current) {
            menuRef.current.scrollBy({left: 300, behavior: 'smooth'});
        }
    }

    return (
        <div className={"explore-menu position-relative pt-4"}>
            <h2 className={"d-flex h2 fw-bold text-secondary mb-2 align-items-center justify-content-between"}>
                Explore Our Menu
                <div className={"d-flex"}>
                    <i className={"bi bi-arrow-left-circle scroll-icon"} ref={scrollLeft}></i>
                    <i className={"bi bi-arrow-right-circle scroll-icon"} ref={scrollRight}></i>
                </div>
            </h2>
            <div className={"d-flex justify-content-between gap-4 overflow-auto explore-menu-list"}>
                {
                    categories.map((item, index) => {
                        return (
                            <div key={index} className={"text-center explore-menu-list-item"}>
                                <img src={item.icon} alt="" className={"rounded-circle"} height={128} width={128} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default ExploreMenu;
