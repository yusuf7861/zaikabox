
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserOrders, getOrderBillText, getOrderBillPdf } from '../../service/orderService.js';
import { useLoading } from '../../context/LoadingContext.jsx';
import 'jspdf-autotable';

const Orders = () => {
    const location = useLocation();
    const loadingContext = useLoading();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [billTexts, setBillTexts] = useState({});

    // Fetch all orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders when selectedStatus changes
    useEffect(() => {
        if (selectedStatus === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === selectedStatus));
        }
    }, [selectedStatus, orders]);

    // Check if we have a newly placed order from location state
    useEffect(() => {
        if (location.state && location.state.orderId) {
            setExpandedOrderId(location.state.orderId);

            // If we have bill text from the state, store it
            if (location.state.billText) {
                setBillTexts(prev => ({
                    ...prev,
                    [location.state.orderId]: location.state.billText
                }));
            }
        }
    }, [location]);

    const fetchOrders = async () => {
        try {
            const fetchedOrders = await getUserOrders();
            setOrders(fetchedOrders);
            setFilteredOrders(fetchedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const toggleOrderDetails = async (orderId) => {
        // If we're closing the details, just toggle
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
            return;
        }

        // If we're opening the details, set the expanded order ID
        setExpandedOrderId(orderId);

        // If we don't have the bill text for this order yet, fetch it
        if (!billTexts[orderId]) {
            try {
                console.log("Fetching bill for orderId:", orderId);
                const text = await getOrderBillText(orderId);
                setBillTexts(prev => ({
                    ...prev,
                    [orderId]: text
                }));
            } catch (error) {
                console.error("Failed to fetch bill text:", error);
            }
        }
    };

    const downloadBillText = async (orderId) => {
        if (!billTexts[orderId]) return;

        try {

            await getOrderBillText(orderId);

            const element = document.createElement('a');
            const file = new Blob([billTexts[orderId]], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `order_bill_${orderId}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (e) {
            console.error("Error downloading bill:", e);
        }
    };

    const downloadBillPDF = async (orderId) => {
        try {
            const blobData = await getOrderBillPdf(orderId);

            const url = window.URL.createObjectURL(new Blob([blobData]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `order-${orderId}-bill.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading bill:", error);
        }
    };


    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0 fw-bold">My Orders</h4>
                <div className="d-flex align-items-center">
                    <select
                        id="statusFilter"
                        className="form-select form-select-sm"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="ALL">All Orders</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {loadingContext.getLoadingState('getUserOrders') ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 small">Loading your orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="bi bi-bag-x text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="text-secondary">No Orders Found</h5>
                    <p className="text-muted small">
                        {selectedStatus === 'ALL'
                            ? "You haven't placed any orders yet."
                            : `You don't have any orders with status "${selectedStatus}".`}
                    </p>
                    <Link to="/explore" className="btn btn-sm btn-primary mt-2">
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div className="row g-3">
                    {filteredOrders.map(order => (
                        <div key={order.orderId} className="col-lg-6 col-12">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white py-2 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold small">#{order.orderId.substring(0, 8)}...</span>
                                        <span className="text-muted small ms-2">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className={`badge rounded-pill ${order.status === 'DELIVERED' || order.status === 'COMPLETED'
                                        ? 'bg-success'
                                        : order.status === 'CANCELLED'
                                            ? 'bg-danger'
                                            : 'bg-warning text-dark'
                                        }`} style={{ fontSize: '0.7rem' }}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">Total Amount:</span>
                                        <span className="fw-bold">₹{order.totalAmountWithGST.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3 small">
                                        <span className="text-muted">Payment:</span>
                                        <span>{order.paymentMode}</span>
                                    </div>

                                    {expandedOrderId === order.orderId ? (
                                        <div className="mt-3 border-top pt-3">
                                            <h6 className="fw-bold small mb-2">Items</h6>
                                            <div className="table-responsive mb-3">
                                                <table className="table table-sm table-borderless small mb-0">
                                                    <thead className="text-muted">
                                                        <tr>
                                                            <th>Item</th>
                                                            <th className="text-end">Qty</th>
                                                            <th className="text-end">Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item, index) => (
                                                            <tr key={`${item.name}-${item.unitPrice}-${index}`}>
                                                                <td>{item.name}</td>
                                                                <td className="text-end">{item.quantity}</td>
                                                                <td className="text-end">₹{item.total.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => downloadBillText(order.orderId)}
                                                        disabled={!billTexts[order.orderId]}
                                                        title="Download Text Bill"
                                                    >
                                                        <i className="bi bi-file-text"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => downloadBillPDF(order.orderId)}
                                                        disabled={!billTexts[order.orderId]}
                                                        title="Download PDF Bill"
                                                    >
                                                        <i className="bi bi-file-pdf"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-link text-decoration-none w-100 mt-2 text-secondary"
                                                onClick={() => toggleOrderDetails(order.orderId)}
                                            >
                                                <i className="bi bi-chevron-up"></i> Less Details
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-outline-primary w-100"
                                            onClick={() => toggleOrderDetails(order.orderId)}
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
