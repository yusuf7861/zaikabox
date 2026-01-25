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
        <div className="container py-5" style={{ paddingTop: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">My Orders</h1>
                <div className="d-flex align-items-center">
                    <label htmlFor="statusFilter" className="me-2">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        className="form-select"
                        value={selectedStatus}
                        onChange={handleStatusChange}
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
                    <p className="mt-3">Loading your orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    </div>
                    <h3>No Orders Found</h3>
                    <p className="text-muted">
                        {selectedStatus === 'ALL'
                            ? "You haven't placed any orders yet."
                            : `You don't have any orders with status "${selectedStatus}".`}
                    </p>
                    <Link to="/explore" className="btn btn-primary mt-3">
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {filteredOrders.map(order => (
                        <div key={order.orderId} className="col-12 mb-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">Order #{order.orderId}</h5>
                                        <small className="text-muted">
                                            {new Date(order.orderDate).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className={`badge ${order.status === 'DELIVERED' || order.status === 'COMPLETED'
                                                ? 'bg-success'
                                                : order.status === 'CANCELLED'
                                                    ? 'bg-danger'
                                                    : 'bg-warning'
                                            } me-3`}>
                                            {order.status}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleOrderDetails(order.orderId)}
                                        >
                                            {expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>

                                {expandedOrderId === order.orderId && (
                                    <div className="card-body">
                                        <div className="mb-4">
                                            <h6 className="fw-bold">Order Items</h6>
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item, index) => (
                                                            <tr key={`${item.name}-${item.unitPrice}-${index}`}>
                                                                <td>{item.name}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>₹{item.unitPrice.toFixed(2)}</td>
                                                                <td>₹{item.total.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6 className="fw-bold">Order Details</h6>
                                                <p className="mb-1"><strong>Payment Mode:</strong> {order.paymentMode}</p>
                                                <p className="mb-1"><strong>Status:</strong> {order.status}</p>
                                                <p className="mb-1"><strong>Total Amount:</strong> ₹{order.totalAmountWithGST.toFixed(2)}</p>
                                            </div>
                                            <div className="col-md-6 text-md-end">
                                                <h6 className="fw-bold">Download Bill</h6>
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => downloadBillText(order.orderId)}
                                                        disabled={!billTexts[order.orderId]}
                                                    >
                                                        <i className="bi bi-file-text me-1"></i>
                                                        Text
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => downloadBillPDF(order.orderId)}
                                                        disabled={!billTexts[order.orderId]}
                                                    >
                                                        <i className="bi bi-file-pdf me-1"></i>
                                                        PDF
                                                    </button>
                                                </div>
                                                {!billTexts[order.orderId] && loadingContext.getLoadingState('getOrderBillText') && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">Loading bill...</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
