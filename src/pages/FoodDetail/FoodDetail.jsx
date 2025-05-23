import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {fetchFoodDetails} from "../../service/foodService.js";
import {toast} from "react-toastify";

const FoodDetail = () => {
    const {id} = useParams();

    const [data, setData] = useState({});

    useEffect(() => {
        const loadFoodDetails = async () => {
            try {
                const foodData = await fetchFoodDetails(id);
                setData(foodData);
            } catch (e) {
                toast.error("Failed to fetch food details", e);
            }
        }
        loadFoodDetails();
    }, [id]);
    return (
        <section className="py-2">
            <div className="container px-2 px-lg-5 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-6"><img className="img-fluid card-img-top mb-4 mb-md-0" style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
                                                   src={data.imageUrl} alt="..."/>
                    </div>
                    <div className="col-md-6">
                        <div className="small mb-1">Category: <span className={"badge text-bg-warning"}>{data.category}</span></div>
                        <h1 className="display-5 fw-bolder">{data.name}</h1>
                        <div className="fs-4 mb-2">
                            <span className="text-decoration-line-through"></span>
                            <span>₹ {data.price}</span>
                        </div>
                        <p className="lead">{data.description}</p>
                        <div className="d-flex">
                            <button className="btn btn-outline-dark flex-shrink-0" type="button">
                                <i className="bi-cart-fill me-1"></i>
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoodDetail;