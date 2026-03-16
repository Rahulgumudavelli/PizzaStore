import React, { useEffect, useState } from 'react';
import { Badge, Navbar as RBNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavbarComponent = ({ transparent = false }) => {
  const { user, logout, unreadCount, updateUnreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (user) updateUnreadCount();
  }, [user, updateUnreadCount]);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  const navBg = transparent && !scrolled
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)'
    : '#1a1a1a';

  const navStyle = {
    background: navBg,
    position: transparent ? 'absolute' : 'sticky',
    top: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'background 0.35s ease',
    borderBottom: transparent && !scrolled ? 'none' : '1px solid rgba(255,255,255,0.07)',
    backdropFilter: transparent && !scrolled ? 'none' : 'blur(8px)',
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? '#ffffff' : 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    borderBottom: isActive(path) ? '2px solid #fff' : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
    display: 'inline-block'
  });

  const outlineBtnStyle = {
    background: 'transparent',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '0.83rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
  };

  const solidBtnStyle = {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '0.83rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <RBNavbar expand="lg" variant="dark" style={navStyle} className="py-2">
      <Container fluid className="px-3 px-lg-5">
        {/* Brand */}
        <RBNavbar.Brand 
          onClick={() => navigate('/')}
          className="d-flex align-items-center gap-2 cursor-pointer"
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-patch-check-fill text-white fs-4"></i>
          <span className="text-white fw-800 fs-5" style={{ letterSpacing: '-0.02em' }}>
            Pizza Store
          </span>
        </RBNavbar.Brand>

        {/* Toggle button for mobile - Moved back to right */}
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none ps-0">
          <span className="bi bi-list fs-3 text-white"></span>
        </RBNavbar.Toggle>

        {/* Collapsible Content */}
        <RBNavbar.Collapse id="basic-navbar-nav" className="mobile-menu-overlay">
          <Nav className="ms-auto align-items-lg-center gap-2 gap-lg-4 mt-3 mt-lg-0 menu-items-container">
            {user ? (
              <>
                <div className="d-lg-none py-2 border-bottom border-secondary mb-2 text-white-50 small text-start">
                  Hey, <span className="text-white fw-bold">{user.name.split(' ')[0]}</span>
                </div>
                
                <span className="d-none d-lg-block text-white-50 small">
                  Hey, <strong className="text-white">{user.name.split(' ')[0]}</strong>
                </span>

                {user.role === 'admin' ? (
                  <>
                    <Nav.Link as="button" style={{ ...linkStyle('/admin'), ...luxurySmallLink }} onClick={() => navigate('/admin')}>Dashboard</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/admin/menu'), ...luxurySmallLink }} onClick={() => navigate('/admin/menu')}>Edit Menu</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/admin/users'), ...luxurySmallLink }} onClick={() => navigate('/admin/users')}>Users</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as="button" style={{ ...linkStyle('/'), ...luxurySmallLink }} onClick={() => navigate('/')}>Home</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/menu'), ...luxurySmallLink }} onClick={() => navigate('/menu')}>Menu</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/cart'), ...luxurySmallLink }} onClick={() => navigate('/cart')}>Cart</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/orders'), ...luxurySmallLink }} onClick={() => navigate('/orders')}>Orders</Nav.Link>
                    <Nav.Link as="button" style={{ ...linkStyle('/profile'), ...luxurySmallLink }} onClick={() => navigate('/profile')}>Profile</Nav.Link>
                    <Nav.Link 
                      as="button"
                      style={{ ...linkStyle('/notifications'), ...luxurySmallLink, position: 'relative' }}
                      onClick={() => navigate('/notifications')}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <Badge
                          pill
                          bg="dark"
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-6px',
                            fontSize: '0.6rem',
                            minWidth: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Nav.Link>
                  </>
                )}
                <Button 
                  variant="outline-light" 
                  style={outlineBtnStyle} 
                  onClick={handleLogout}
                  className="mt-2 mt-lg-0 w-100 w-lg-auto"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as="button" style={{ ...linkStyle('/'), ...luxurySmallLink }} onClick={() => navigate('/')}>Home</Nav.Link>
                <Nav.Link as="button" style={{ ...linkStyle('/menu'), ...luxurySmallLink }} onClick={() => navigate('/menu')}>Menu</Nav.Link>
                <div className="d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
                  <Button 
                    variant="outline-light" 
                    style={outlineBtnStyle} 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="light" 
                    style={solidBtnStyle} 
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
      <style>{`
        @media (max-width: 991.98px) {
          .mobile-menu-overlay {
            position: absolute;
            top: 60px;
            right: 16px;
            left: auto;
            width: 240px;
            background: #1a1a1a;
            border-radius: 16px;
            padding: 1.25rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            z-index: 1001;
            transform-origin: top right;
          }
          .menu-items-container {
            text-align: left !important;
            align-items: flex-start !important;
          }
          .nav-link {
            text-align: left !important;
            width: 100%;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </RBNavbar>
  );
};

const luxurySmallLink = {
  textAlign: 'left',
  width: '100%'
};

export default NavbarComponent;
