import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Badge, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder, addToCart } from '../services/api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const cancellingIdRef = useRef(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const confirmCancel = (orderId) => {
    cancellingIdRef.current = orderId;
    setShowCancelConfirm(true);
  };

  const handleCancel = async () => {
    const idToCancel = cancellingIdRef.current;
    if (!idToCancel) return;
    setCancelLoading(true);
    try {
      await cancelOrder(idToCancel);
      setShowCancelConfirm(false);
      setShowBillModal(false);
      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error cancelling order');
    }
    setCancelLoading(false);
    cancellingIdRef.current = null;
  };

  const handleReorder = async (order) => {
    try {
      for (let item of order.items) {
        await addToCart({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
      }
      navigate('/cart');
    } catch (err) {
      alert('Failed to reorder items');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending:   'warning',
      confirmed: 'info',
      accepted:  'success',
      preparing: 'primary',
      'out for delivery': 'primary',
      delivered: 'success',
      cancelled: 'secondary',
      rejected:  'danger'
    };
    return (
      <Badge 
        bg={variants[status] || 'secondary'} 
        className="text-uppercase px-3 py-2 rounded-pill"
        style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <Container className="py-5" style={{ maxWidth: '900px' }}>
        <div className="mb-5">
          <h1 className="fw-900 mb-2" style={{ letterSpacing: '-0.04em' }}>Your Orders</h1>
          <p className="text-muted">History of your delicious pizza journeys</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-0 bg-light text-center py-5 rounded-4">
            <Card.Body>
              <div className="mb-4" style={{ fontSize: '3rem' }}>
                <i className="bi bi-basket text-muted"></i>
              </div>
              <h4 className="fw-bold">No orders found!</h4>
              <p className="text-muted">Looks like you haven't ordered any pizza yet.</p>
              <Button variant="dark" className="rounded-pill px-5 fw-bold mt-2" onClick={() => navigate('/menu')}>Start Ordering</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {orders.map((order) => (
              <Col xs={12} key={order._id}>
                <Card className="border shadow-sm rounded-4 overflow-hidden">
                  <Card.Body className="p-4">
                    <Row className="align-items-start">
                      <Col md={8}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <h6 className="fw-bold mb-0 text-dark">#{order._id.slice(-8).toUpperCase()}</h6>
                          {getStatusBadge(order.orderStatus)}
                          <small className="text-muted fw-500">{formatDate(order.createdAt)}</small>
                        </div>
                        
                        <div className="mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="small text-dark fw-600 mb-1">
                              {item.name} <span className="text-muted">× {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex flex-wrap gap-3 mt-auto">
                          <Button 
                            variant="dark" 
                            size="sm" 
                            className="rounded-pill px-4 fw-bold"
                            onClick={() => { setSelectedOrder(order); setShowBillModal(true); }}
                          >
                            View Invoice
                          </Button>
                          
                          {(['delivered', 'cancelled', 'rejected'].includes(order.orderStatus)) && (
                            <Button 
                              variant="outline-dark" 
                              size="sm" 
                              className="rounded-pill px-4 fw-bold"
                              onClick={() => handleReorder(order)}
                            >
                              Reorder
                            </Button>
                          )}

                          {order.orderStatus === 'pending' && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-danger fw-bold text-decoration-none"
                              onClick={() => confirmCancel(order._id)}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </Col>
                      
                      <Col md={4} className="text-md-end mt-4 mt-md-0">
                        <div className="mb-1 text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Amount Paid</div>
                        <h3 className="fw-900 mb-0">₹{order.totalAmount}</h3>
                        <Badge bg="success" className="bg-opacity-10 text-success mt-2">
                           <i className="bi bi-patch-check-fill me-1"></i> Paid Online
                        </Badge>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* ── Cancel Confirmation Modal ──────────────────────────── */}
      <Modal show={showCancelConfirm} onHide={() => setShowCancelConfirm(false)} centered className="border-0">
        <Modal.Body className="text-center p-5">
          <div className="mb-4 text-warning" style={{ fontSize: '3rem' }}>
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h4 className="fw-900 mb-2">Cancel your pizza?</h4>
          <p className="text-muted mb-4 px-3">We only allow cancellations for pending orders. This action cannot be undone.</p>
          <div className="d-flex gap-3">
            <Button variant="light" className="w-100 rounded-pill py-2 fw-bold" onClick={() => setShowCancelConfirm(false)}>Dismiss</Button>
            <Button variant="dark" className="w-100 rounded-pill py-2 fw-bold" onClick={handleCancel} disabled={cancelLoading}>
              {cancelLoading ? 'Processing...' : 'Yes, Cancel'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ── Bill Modal (Modernised) ─────────────────────────────── */}
      <Modal show={showBillModal} onHide={() => setShowBillModal(false)} centered size="lg">
        <Modal.Body className="p-0 border-0">
          {selectedOrder && (
            <div className="bg-white rounded-4 overflow-hidden">
              <div className="p-5" id="printable-bill">
                <div className="d-flex justify-content-between align-items-start mb-5 pb-4 border-bottom">
                  <div>
                    <h1 className="fw-900 mb-0" style={{ fontSize: '2.5rem' }}>INVOICE</h1>
                    <p className="text-muted mb-0">#{selectedOrder._id.toUpperCase()}</p>
                  </div>
                  <div className="text-end">
                    <h5 className="fw-800 mb-1">Pizza Store</h5>
                    <p className="text-muted small mb-0">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <div className="mt-3">{getStatusBadge(selectedOrder.orderStatus)}</div>
                  </div>
                </div>

                <Row className="mb-5 g-4">
                  <Col sm={6}>
                    <div className="mb-2 text-muted text-uppercase small fw-bold" style={{ letterSpacing: '0.05em' }}>Ship To</div>
                    <div className="fw-bold">{selectedOrder.userId?.name || 'Customer'}</div>
                    <div className="text-muted small">{selectedOrder.userId?.email}</div>
                  </Col>
                  <Col sm={6} className="text-sm-end">
                    <div className="mb-2 text-muted text-uppercase small fw-bold" style={{ letterSpacing: '0.05em' }}>Delivery Mode</div>
                    <div className="fw-bold text-capitalize">{selectedOrder.deliveryMode || 'Delivery'}</div>
                  </Col>
                </Row>

                <div className="mb-5">
                   <div className="d-flex justify-content-between text-muted small fw-bold text-uppercase mb-3 px-2" style={{ letterSpacing: '0.05em' }}>
                      <span>Description</span>
                      <span>Total</span>
                   </div>
                   {selectedOrder.items.map((item, idx) => (
                     <div key={idx} className="d-flex justify-content-between p-3 bg-light rounded-3 mb-2 fw-600">
                        <span>{item.quantity}× {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                </div>

                <div className="d-flex justify-content-between align-items-center bg-dark text-white p-4 rounded-4 shadow-sm h4 fw-900 mb-0">
                  <span>Grand Total</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
              <div className="p-4 bg-light text-center border-top">
                <Button variant="dark" className="rounded-pill px-5 fw-bold" onClick={() => window.print()}>Print Receipt</Button>
                <Button variant="link" className="text-muted d-block mt-2 text-decoration-none small" onClick={() => setShowBillModal(false)}>Close Window</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <footer className="footer-modern py-5 border-top mt-auto">
        <Container className="text-center">
           <p className="text-muted small mb-0">© 2026 Pizza Store. Authentic wood-fired delivery.</p>
        </Container>
      </footer>

      <style>{`
        .fw-900 { font-weight: 900; }
        .fw-800 { font-weight: 800; }
        .fw-600 { font-weight: 600; }
        .fw-500 { font-weight: 500; }
        @media print {
          .navbar, .btn, .d-flex.gap-3, footer, .modal-header, .btn-link { display: none !important; }
          .modal-body { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Orders;