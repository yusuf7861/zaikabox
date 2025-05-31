import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parseBillText } from '../../service/orderService.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const OrderSuccess = () => {
    const location = useLocation();
    const [orderId, setOrderId] = useState('');
    const [billText, setBillText] = useState('');
    const [parsedBill, setParsedBill] = useState(null);
    const [showBill, setShowBill] = useState(false);

    useEffect(() => {
        // Get orderId and billText from location state
        if (location.state) {
            const { orderId, billText } = location.state;
            setOrderId(orderId || '');
            setBillText(billText || '');

            // Parse the bill text
            if (billText) {
                const parsed = parseBillText(billText);
                setParsedBill(parsed);
            }
        }
    }, [location]);

    // Function to download bill as text file
    const downloadBill = () => {
        if (!billText) return;

        const element = document.createElement('a');
        const file = new Blob([billText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `order_bill_${orderId}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Function to generate and download bill as PDF
    const downloadPDF = () => {
        if (!parsedBill) return;

        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.text('ZaikaBox - Order Bill', 105, 15, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(20, 20, 190, 20);

        // Add order details
        doc.setFontSize(12);
        doc.text(`Order ID: ${parsedBill.orderId}`, 20, 30);
        doc.text(`Order Date: ${parsedBill.orderDate}`, 20, 37);
        doc.text(`Payment Mode: ${parsedBill.paymentMode}`, 120, 30);
        doc.text(`Status: ${parsedBill.status}`, 120, 37);

        // Add items table
        const tableColumn = ["No.", "Item", "Qty", "Unit Price", "Total"];
        const tableRows = [];

        parsedBill.items.forEach(item => {
            const itemData = [
                item.number,
                item.name,
                item.quantity,
                `$${item.unitPrice.toFixed(2)}`,
                `$${item.total.toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [66, 139, 202] }
        });

        // Add totals
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Subtotal: $${parsedBill.subtotal.toFixed(2)}`, 150, finalY, { align: 'right' });
        doc.text(`GST (${parsedBill.gstRate}%): $${parsedBill.gst.toFixed(2)}`, 150, finalY + 7, { align: 'right' });
        doc.setFontSize(14);
        doc.text(`Total: $${parsedBill.total.toFixed(2)}`, 150, finalY + 15, { align: 'right' });

        // Add footer
        doc.setLineWidth(0.5);
        doc.line(20, finalY + 25, 190, finalY + 25);
        doc.setFontSize(12);
        doc.text('Thank you for your order!', 105, finalY + 32, { align: 'center' });

        // Save the PDF
        doc.save(`order_invoice_${parsedBill.orderId}.pdf`);
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h1 className="display-4 fw-bold text-success mb-4">Order Placed Successfully!</h1>
                {orderId && (
                    <p className="lead mb-2">
                        Order ID: <strong>{orderId}</strong>
                    </p>
                )}
                <p className="lead mb-4">
                    Thank you for your order. Your food will be delivered soon.
                </p>
                <p className="mb-5">
                    A confirmation email has been sent to your email address.
                </p>
            </div>

            {billText && (
                <div className="row justify-content-center mb-5">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Order Bill</h5>
                                <div>
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => setShowBill(!showBill)}
                                    >
                                        {showBill ? 'Hide Bill' : 'View Bill'}
                                    </button>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm btn-outline-secondary" 
                                            onClick={downloadBill}
                                        >
                                            <i className="bi bi-download me-1"></i>
                                            Text
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary" 
                                            onClick={downloadPDF}
                                            disabled={!parsedBill}
                                        >
                                            <i className="bi bi-file-pdf me-1"></i>
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {showBill && (
                                <div className="card-body">
                                    {parsedBill ? (
                                        <div>
                                            <div className="mb-4">
                                                <h6 className="fw-bold">Order Details</h6>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Order ID:</strong> {parsedBill.orderId}</p>
                                                        <p className="mb-1"><strong>Order Date:</strong> {parsedBill.orderDate}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Payment Mode:</strong> {parsedBill.paymentMode}</p>
                                                        <p className="mb-1"><strong>Status:</strong> {parsedBill.status}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h6 className="fw-bold">Items</h6>
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>No.</th>
                                                                <th>Item</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {parsedBill.items.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.number}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>${item.unitPrice.toFixed(2)}</td>
                                                                    <td>${item.total.toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="row justify-content-end">
                                                    <div className="col-md-6">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Subtotal:</span>
                                                            <span>${parsedBill.subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>GST ({parsedBill.gstRate}%):</span>
                                                            <span>${parsedBill.gst.toFixed(2)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between fw-bold">
                                                            <span>Total:</span>
                                                            <span>${parsedBill.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                                            {billText}
                                        </pre>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="d-grid gap-2 col-md-6 mx-auto">
                <Link to="/explore" className="btn btn-primary btn-lg">
                    Continue Shopping
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
