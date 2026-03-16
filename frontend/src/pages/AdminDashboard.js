import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { getAllOrders, updateOrderStatus, getMonthlyRevenue } from '../services/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({
    orderId: null,
    userId: null,
    status: '',
    message: ''
  });
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔔 Real-time: refresh orders when a customer cancels
  const handleWsMessage = useCallback((data) => {
    if (data.type === 'ORDER_CANCELLED_BY_USER') {
      fetchOrdersOnly(); // pull fresh order list
    }
  }, []);

  useEffect(() => {
    window._adminWsHandler = handleWsMessage;
    return () => { window._adminWsHandler = null; };
  }, [handleWsMessage]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, revenueRes] = await Promise.all([
        getAllOrders(),
        getMonthlyRevenue()
      ]);
      setOrders(ordersRes.data);
      setRevenue(revenueRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchOrdersOnly = async () => {
    try {
      const ordersRes = await getAllOrders();
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const openMessageModal = (orderId, status, userId) => {
    const defaultMessages = {
      accepted: 'Your order has been accepted!',
      rejected: 'Sorry, your order has been rejected.',
      delivered: 'Your order has been delivered! Enjoy your pizza!'
    };
    
    setMessageData({
      orderId,
      userId,
      status,
      message: defaultMessages[status] || ''
    });
    setShowMessageModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(messageData.orderId, { 
        orderStatus: messageData.status,
        message: messageData.message 
      });

      setShowMessageModal(false);
      fetchOrdersOnly();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleShowBill = (order) => {
    setSelectedOrder(order);
    setShowBillModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending:   'dark',
      accepted:  'dark',
      confirmed: 'dark',
      preparing: 'dark',
      'out for delivery': 'dark',
      delivered: 'dark',
      cancelled: 'secondary',
      rejected:  'dark'
    };
    const labels = { cancelled: 'CANCELLED BY CUSTOMER' };
    return (
      <Badge 
        bg={variants[status] || 'secondary'} 
        className={`text-uppercase ${status === 'pending' ? 'bg-opacity-75' : ''}`}
        style={{ fontWeight: 600, fontSize: '0.7rem' }}
      >
        {labels[status] || status}
      </Badge>
    );
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, color: '#111' },
    { label: 'Pending Orders', value: orders.filter(o => o.orderStatus === 'pending').length, color: '#444' },
    { label: 'Completed Orders', value: orders.filter(o => o.orderStatus === 'delivered').length, color: '#111' },
    { label: 'Revenue', value: `₹${revenue[0]?.totalRevenue || 0}`, color: '#111' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <Container className="py-5" style={{ maxWidth: '1100px' }}>
        <div className="mb-5 text-center">
          <h1 className="fw-800" style={{ letterSpacing: '-0.04em' }}>Admin Control</h1>
          <p className="text-muted">Manage orders, revenue, and store operations</p>
        </div>

        {/* 2x2 Stats Grid */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col key={i} xs={12} sm={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: '#f8f9fa' }}>
                <Card.Body className="p-4">
                  <p className="text-muted text-uppercase small fw-bold mb-1" style={{ letterSpacing: '0.05em' }}>{s.label}</p>
                  <h2 className="fw-800 mb-0" style={{ color: s.color }}>{s.value}</h2>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tab Controls */}
        <div className="d-flex flex-wrap gap-2 mb-4 bg-light p-1 rounded-3 w-fit-content mx-auto justify-content-center">
          {['orders', 'revenue'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'dark' : 'transparent'}
              className={`px-4 py-2 rounded-2 fw-bold text-capitalize ${activeTab === tab ? '' : 'text-muted'}`}
              onClick={() => setActiveTab(tab)}
              style={{ fontSize: '0.85rem' }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
            {loading ? (
              <div className="p-5 text-center text-muted">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-5 text-center text-muted">No orders found.</div>
            ) : (
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">ID</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Customer</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Address</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Total</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Status</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 fw-bold border-0">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 border-0">
                        <div className="fw-600">{order.userId?.name}</div>
                        <div className="text-muted small">{order.userId?.email}</div>
                      </td>
                      <td className="px-4 py-3 border-0">
                        <div className="small text-truncate" style={{ maxWidth: '150px' }}>
                          {order.addressId ? `${order.addressId.street}, ${order.addressId.city}` : 'No Address'}
                        </div>
                      </td>
                      <td className="px-4 py-3 fw-bold border-0">₹{order.totalAmount}</td>
                      <td className="px-4 py-3 border-0">{getStatusBadge(order.orderStatus)}</td>
                      <td className="px-4 py-3 border-0">
                        <div className="d-flex gap-2">
                          {order.orderStatus === 'pending' && (
                            <>
                              <Button variant="dark" size="sm" className="rounded-2 px-3 fw-bold" onClick={() => openMessageModal(order._id, 'accepted', order.userId?._id)}>Accept</Button>
                              <Button variant="outline-dark" size="sm" className="rounded-2 px-3 fw-bold" onClick={() => openMessageModal(order._id, 'rejected', order.userId?._id)}>Reject</Button>
                            </>
                          )}
                          {order.orderStatus === 'accepted' && (
                            <Button variant="dark" size="sm" className="rounded-2 px-3 fw-bold" onClick={() => openMessageModal(order._id, 'delivered', order.userId?._id)}>Delivered</Button>
                          )}
                          <Button variant="link" className="text-dark p-0" onClick={() => handleShowBill(order)}><i className="bi bi-receipt fs-5"></i></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
             <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Month</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Total Orders</th>
                    <th className="px-4 py-3 text-muted text-uppercase small fw-bold border-0">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 fw-bold border-0">{getMonthName(r._id.month)} {r._id.year}</td>
                      <td className="px-4 py-3 border-0">{r.totalOrders}</td>
                      <td className="px-4 py-3 fw-bold border-0 text-dark">₹{r.totalRevenue}</td>
                    </tr>
                  ))}
                  {revenue.length === 0 && (
                    <tr><td colSpan="3" className="p-5 text-center text-muted">No revenue data available</td></tr>
                  )}
                </tbody>
              </Table>
          </div>
        )}
      </Container>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered className="border-0">
        <Modal.Body className="p-4">
          <h5 className="fw-800 mb-3">Update Order Status</h5>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-muted text-uppercase">Notification Message</Form.Label>
            <Form.Control 
              as="textarea" rows={3} 
              value={messageData.message}
              onChange={e => setMessageData({...messageData, message: e.target.value})}
              className="border-0 bg-light rounded-3 p-3"
              style={{ fontSize: '0.9rem' }}
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button variant="dark" className="w-100 py-2 fw-bold" onClick={handleStatusUpdate}>Confirm</Button>
            <Button variant="light" className="w-100 py-2 fw-bold" onClick={() => setShowMessageModal(false)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Bill Modal (Simplified for Monochrome) */}
      <Modal show={showBillModal} onHide={() => setShowBillModal(false)} size="lg" centered>
        <Modal.Body className="p-5" id="printable-bill">
          <div className="d-flex justify-content-between align-items-start mb-5 pb-4 border-bottom">
            <div>
              <h2 className="fw-900 mb-0">INVOICE</h2>
              <p className="text-muted small mb-0">#{selectedOrder?._id?.toUpperCase()}</p>
            </div>
            <div className="text-end">
              <h5 className="fw-bold mb-0">Pizza Store</h5>
              <p className="small text-muted mb-0">{new Date(selectedOrder?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Row className="mb-5">
            <Col sm={6}>
              <p className="text-muted text-uppercase small fw-bold mb-2">Customer</p>
              <h6 className="fw-bold mb-1">{selectedOrder?.userId?.name}</h6>
              <p className="small text-muted mb-0">{selectedOrder?.userId?.email}</p>
            </Col>
            <Col sm={6} className="text-sm-end mt-4 mt-sm-0">
               <p className="text-muted text-uppercase small fw-bold mb-2">Address</p>
               <p className="small mb-0">
                  {selectedOrder?.addressId ? (
                    `${selectedOrder.addressId.houseNumber}, ${selectedOrder.addressId.street}, ${selectedOrder.addressId.city}`
                  ) : 'Standard Pickup'}
               </p>
            </Col>
          </Row>

          <Table borderless className="mb-5">
            <thead>
              <tr className="border-bottom text-muted small text-uppercase fw-bold">
                <th className="py-2 px-0">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-end px-0">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.items.map((item, i) => (
                <tr key={i} className="border-bottom">
                   <td className="py-3 px-0 fw-600">{item.name}</td>
                   <td className="py-3 text-center">{item.quantity}</td>
                   <td className="py-3 text-end px-0">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mb-5">
             <h4 className="fw-900 mb-0">Total Amount</h4>
             <h4 className="fw-900 mb-0">₹{selectedOrder?.totalAmount}</h4>
          </div>

          <div className="text-center d-print-none">
            <Button variant="dark" className="px-5 py-2 fw-bold" onClick={handlePrint}>Print Invoice</Button>
          </div>
        </Modal.Body>
      </Modal>

      <footer className="py-4 border-top mt-auto text-center">
        <p className="small text-muted mb-0">© 2026 Pizza Store · Internal Admin Panel</p>
      </footer>

      <style>{`
        .fw-800 { font-weight: 800; }
        .fw-900 { font-weight: 900; }
        .fw-600 { font-weight: 600; }
        .w-fit-content { width: fit-content; }
        tr { transition: background 0.2s; }
        .table-hover tbody tr:hover { background-color: #fcfcfc !important; }
        @media print {
          .navbar, .d-print-none, footer { display: none !important; }
          body, .container, .modal-body { padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;