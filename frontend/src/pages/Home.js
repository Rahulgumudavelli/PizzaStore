import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToMenu = () => navigate(user ? '/menu' : '/login');

  const categories = [
    { name: 'Pizzas',    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=200&auto=format&fit=crop' },
    { name: 'Sides',     img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200&auto=format&fit=crop' },
    { name: 'Beverages', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop' },
    { name: 'Combos',    img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=200&auto=format&fit=crop' },
  ];

  const highlights = [
    { 
      icon: '', 
      title: '30-Minute Delivery', 
      desc: 'Blazing fast delivery from our oven to your door.' 
    },
    { 
      icon: '', 
      title: 'Fresh & Organic', 
      desc: 'Only the finest handpicked ingredients for you.' 
    },
    { 
      icon: '', 
      title: 'Artisan Chefs', 
      desc: 'Expertly crafted by master pizza artisans.' 
    }
  ];

  return (
    <div className="bg-white min-vh-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar transparent={false} />

      {/* ── Hero Section (Swiggy Style Split) ────────────────── */}
      <section className="py-4 py-lg-5 bg-light overflow-hidden">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6} className="text-center text-lg-start">
              <div className="pe-lg-5">
                <h6 className="text-muted fw-bold text-uppercase small mb-3" style={{ letterSpacing: '0.15em' }}>Premium Pizza Experience —</h6>
                <h1 className="hero-title fw-900 mb-4" style={{ letterSpacing: '-0.05em', lineHeight: 1.1 }}>
                  Better Pizza,<br />Better Moments.
                </h1>
                <p className="fs-5 text-muted mb-4 mb-lg-5 mx-auto mx-lg-0" style={{ maxWidth: '500px', lineHeight: 1.6 }}>
                  Experience the true taste of artisan wood-fired pizzas, delivered fresh to your doorstep in 30 minutes.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <button 
                    onClick={goToMenu}
                    className="btn btn-dark rounded-pill px-5 py-3 fw-800 shadow-lg border-0"
                    style={{ fontSize: '1.1rem', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  >
                    Order Now
                  </button>
                  <button 
                    onClick={() => navigate('/menu')}
                    className="btn btn-outline-dark rounded-pill px-5 py-3 fw-800"
                    style={{ fontSize: '1.1rem' }}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="position-relative">
                <div className="bg-dark rounded-circle position-absolute d-none d-lg-block" style={{ width: '120%', height: '120%', top: '-10%', right: '-30%', opacity: 0.03 }}></div>
                <img 
                  src="/pizza.jpg" 
                  alt="Delicious Pizza" 
                  className="img-fluid rounded-4 shadow-2xl position-relative z-1"
                  style={{ transform: 'rotate(2deg)' }}
                  onError={(e) => {
                     e.target.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop";
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Circular Categories ("What's on your mind?") ─────── */}
      <section className="py-5 py-lg-10 border-bottom">
        <Container>
           <div className="mb-4 mb-lg-5 text-center text-md-start">
              <h2 className="fw-900 mb-0 category-title" style={{ letterSpacing: '-0.04em' }}>What's on your mind?</h2>
           </div>
           
           <div className="d-flex gap-4 gap-lg-5 overflow-auto pb-4 scrollbar-none scroll-snap-x">
              {categories.map((cat, i) => (
                <div 
                  key={i} 
                  className="text-center cursor-pointer transition-all duration-300 transform-hover-scale"
                  onClick={() => navigate(`/menu?category=${cat.name}`)}
                  style={{ minWidth: '120px', flexShrink: 0 }}
                >
                  <div className="rounded-circle overflow-hidden mb-3 border bg-white shadow-sm category-circle" style={{ margin: '0 auto' }}>
                    <img src={cat.img} alt={cat.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <h6 className="fw-800 text-muted small mb-0">{cat.name}</h6>
                </div>
              ))}
           </div>
        </Container>
      </section>

      {/* ── Feature Highlights ──────────────────────────────── */}
      <section className="py-5 py-lg-10 bg-white">
        <Container>
          <Row className="g-4">
             {highlights.map((h, i) => (
               <Col sm={6} md={4} key={i}>
                  <Card className="h-100 border-0 bg-light rounded-4 p-4 text-center transition-all hover-shadow">
                    <div className="mb-3">
                       <i className={`bi ${i===0?'bi-speedometer2':i===1?'bi-leaf':'bi-person-badge'} fs-1`}></i>
                    </div>
                    <h4 className="fw-900 mb-2">{h.title}</h4>
                    <p className="text-muted small mb-0">{h.desc}</p>
                  </Card>
               </Col>
             ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-5 py-lg-10 bg-dark text-white text-center">
        <Container>
          <h2 className="display-4 fw-900 mb-4 cta-title" style={{ letterSpacing: '-0.03em' }}>Ready to taste perfection?</h2>
          <p className="fs-5 opacity-75 mb-4 mb-lg-5 mx-auto" style={{ maxWidth: '600px' }}>Join thousand of pizza lovers who choose us for their daily cravings.</p>
          {!user && (
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-light rounded-pill px-5 py-2 fw-bold"
              >
                Sign Up Now
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-outline-light rounded-pill px-5 py-2 fw-bold"
              >
                Login
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-5 bg-white border-top">
         <Container>
            <Row className="align-items-center text-center text-md-start">
               <Col md={6}>
                  <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start mb-4 mb-md-0">
                     <i className="bi bi-patch-check-fill fs-4"></i>
                     <span className="fw-900 fs-5">PIZZA STORE</span>
                  </div>
               </Col>
               <Col md={6} className="text-md-end">
                  <div className="d-flex gap-4 justify-content-center justify-content-md-end text-muted small fw-bold">
                     <button className="btn btn-link text-decoration-none text-muted p-0 small fw-bold" onClick={(e) => e.preventDefault()}>Instagram</button>
                     <button className="btn btn-link text-decoration-none text-muted p-0 small fw-bold" onClick={(e) => e.preventDefault()}>Twitter</button>
                     <button className="btn btn-link text-decoration-none text-muted p-0 small fw-bold" onClick={(e) => e.preventDefault()}>Support</button>
                  </div>
               </Col>
            </Row>
            <hr className="my-4 opacity-10" />
            <div className="text-center text-muted small opacity-50">
               © 2026 Pizza Store. Crafted for the best.
            </div>
         </Container>
      </footer>

      <style>{`
        .fw-900 { font-weight: 900; }
        .fw-800 { font-weight: 800; }
        .py-10 { padding-top: 5rem; padding-bottom: 5rem; }
        .hero-title { font-size: 2.5rem; }
        .category-title { font-size: 2rem; }
        .cta-title { font-size: 2rem; }
        .category-circle { width: 100px; height: 100px; }
        
        @media (min-width: 768px) {
          .hero-title { font-size: 3.5rem; }
          .category-title { font-size: 2.5rem; }
          .cta-title { font-size: 2.5rem; }
          .category-circle { width: 120px; height: 120px; }
        }
        
        @media (min-width: 992px) {
          .hero-title { font-size: 4.5rem; }
          .category-title { font-size: 3.5rem; }
          .cta-title { font-size: 3.5rem; }
          .category-circle { width: 140px; height: 140px; }
        }

        .transform-hover-scale:hover { transform: scale(1.05); }
        .transition-all { transition: all 0.3s ease; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .scroll-snap-x { scroll-snap-type: x mandatory; }
        .scroll-snap-x > div { scroll-snap-align: start; }
        .duration-300 { transition-duration: 300ms; }
        .hover-shadow:hover { box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; transform: translateY(-5px); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default Home;