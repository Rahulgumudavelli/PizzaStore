import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMenuItems, getCategories, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { 
    fetchData(); 

    // Handle deep linking from Home page
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      const mapping = {
        'Pizzas': 'Pizza',
        'Combos': 'Combo'
      };
      setSelectedCategory(mapping[catParam] || catParam);
    }
  }, [location.search]);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([getMenuItems(), getCategories()]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async (item) => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart({ itemId: item._id, name: item.name, price: item.price, quantity: 1 });
      setCartMessage(`${item.name} added to cart!`);
      setTimeout(() => setCartMessage(''), 2500);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.categoryId?.categoryName === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.categoryName === 'Veg') return -1;
    if (b.categoryName === 'Veg') return 1;
    if (a.categoryName === 'Non-Veg') return -1;
    if (b.categoryName === 'Non-Veg') return 1;
    return 0;
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Cart notification */}
      {cartMessage && (
        <div style={{
          position: 'fixed', top: 80, right: 32,
          background: '#000', color: '#fff', padding: '12px 24px', borderRadius: 12,
          fontWeight: 600, fontSize: '0.88rem', zIndex: 1100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <i className="bi bi-check-circle-fill"></i> {cartMessage}
        </div>
      )}

      <Container fluid className="px-0">
        <Row className="g-0">
          {/* Sidebar */}
          <Col lg={3} xl={2} className="border-end d-none d-lg-block bg-light min-vh-100 position-sticky t-0">
            <div className="p-4 pt-5">
              <h6 className="text-muted text-uppercase small fw-bold mb-4 px-2" style={{ letterSpacing: '0.1em' }}>Categories</h6>
              <div className="d-flex flex-column gap-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`border-0 text-start px-3 py-2 rounded-3 fw-bold transition-all ${selectedCategory === 'All' ? 'bg-dark text-white' : 'bg-transparent text-muted'}`}
                  style={{ fontSize: '0.9rem' }}
                >
                  All Items
                </button>
                {sortedCategories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className={`border-0 text-start px-3 py-2 rounded-3 fw-bold transition-all ${selectedCategory === cat.categoryName ? 'bg-dark text-white' : 'bg-transparent text-muted text-hover-dark'}`}
                    style={{ fontSize: '0.9rem' }}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9} xl={10}>
            <div className="p-4 p-md-5">
              <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-4">
                <div>
                  <p className="text-muted small fw-bold text-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>Menu</p>
                  <h1 className="fw-900" style={{ letterSpacing: '-0.04em' }}>Explore our Pizzas</h1>
                </div>
                <div className="position-relative" style={{ minWidth: '300px' }}>
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input 
                    type="text" 
                    className="form-control border-0 bg-light rounded-pill py-3 ps-5 pe-4 shadow-sm"
                    placeholder="Search for pizzas, sides..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ fontSize: '0.9rem', fontWeight: 500 }}
                  />
                </div>
              </div>

              {/* Mobile Category Scroll */}
              <div className="d-lg-none mb-4 overflow-auto text-nowrap pb-2 scrollbar-none" style={{ gap: 8, display: 'flex' }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`border px-4 py-2 rounded-pill fw-bold small ${selectedCategory === 'All' ? 'bg-dark text-white' : 'bg-white text-dark'}`}
                >
                  All
                </button>
                {sortedCategories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className={`border px-4 py-2 rounded-pill fw-bold small ${selectedCategory === cat.categoryName ? 'bg-dark text-white' : 'bg-white text-dark'}`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-dark mb-3" role="status"></div>
                  <p className="text-muted">Loading deliciousness...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4">
                  <p className="text-muted mb-0">No items found in this category.</p>
                </div>
              ) : (
                <Row className="g-4">
                  {filteredItems.map(item => {
                    const isNonVeg = item.categoryId?.categoryName === 'Non-Veg';
                    return (
                      <Col sm={6} md={6} lg={4} xl={4} key={item._id}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden product-card">
                          <div className="position-relative overflow-hidden" style={{ height: 200 }}>
                            <Card.Img variant="top" src={item.image} className="h-100 w-100 object-fit-cover transition-transform duration-300 transform-hover-scale" />
                            <div className="position-absolute top-0 end-0 p-3">
                              <Badge bg="white" className="text-dark shadow-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: isNonVeg ? '#ef4444' : '#22c55e' }} />
                                <span className="small fw-800 text-uppercase" style={{ fontSize: '0.6rem' }}>{isNonVeg ? 'Non-Veg' : 'Veg'}</span>
                              </Badge>
                            </div>
                          </div>
                          <Card.Body className="p-4 d-flex flex-column">
                            <h5 className="fw-800 mb-2">{item.name}</h5>
                            <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: 1.6 }}>{item.description}</p>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <h4 className="fw-900 mb-0">₹{item.price}</h4>
                              <Badge bg={item.isAvailable ? 'light' : 'secondary'} className={item.isAvailable ? 'text-dark' : ''}>
                                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                disabled={!item.isAvailable}
                                onClick={async () => { await handleAddToCart(item); if (user) navigate('/cart'); }}
                                className={`flex-grow-1 border-0 py-2 rounded-3 fw-bold transition-all ${item.isAvailable ? 'bg-dark text-white opacity-hover-80' : 'bg-light text-muted cursor-not-allowed'}`}
                              >
                                Buy Now
                              </button>
                              <button
                                disabled={!item.isAvailable}
                                onClick={() => handleAddToCart(item)}
                                className={`border-1 border py-2 px-3 rounded-3 transition-all ${item.isAvailable ? 'bg-white text-dark border-dark' : 'bg-light text-muted border-light cursor-not-allowed'}`}
                              >
                                <i className="bi bi-cart-plus fs-5"></i>
                              </button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <p className="mb-0 small opacity-50">© 2026 Pizza Store. Authentic Italian Experience.</p>
      </footer>

      <style>{`
        .fw-900 { font-weight: 900; }
        .fw-800 { font-weight: 800; }
        .transition-all { transition: all 0.2s ease; }
        .text-hover-dark:hover { color: #000 !important; }
        .opacity-hover-80:hover { opacity: 0.8; }
        .transform-hover-scale:hover { transform: scale(1.05); }
        .duration-300 { transition-duration: 300ms; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default Menu;