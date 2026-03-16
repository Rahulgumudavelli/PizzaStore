import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object({
  email:    Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

/* ── Shared field styles ─── */
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 8,
  fontSize: '0.9rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: '#fff',
  color: '#111',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.82rem',
  color: '#444',
  marginBottom: 6,
  fontFamily: 'Inter, sans-serif',
};

const Login = () => {
  const [serverError, setServerError] = React.useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const { data } = await login(values);
        authLogin(data.user, data.token);
        navigate(data.user.role === 'admin' ? '/admin' : '/');
      } catch (err) {
        setServerError(err.response?.data?.message || 'Login failed');
      }
      setSubmitting(false);
    },
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Left dark panel ── */}
      <div style={{
        flex: '0 0 42%',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', color: '#fff', marginBottom: 16 }}>
            <i className="bi bi-patch-check-fill"></i>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 12 }}>
            Pizza Store
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 260, margin: '0 auto 32px' }}>
            Authentic wood-fired pizzas delivered hot to your door.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['30-min delivery', 'Fresh ingredients daily', 'Exclusive deals for members'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#111', fontSize: '0.65rem', fontWeight: 900 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right white form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f6f6',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#111', marginBottom: 6, letterSpacing: '-0.03em' }}>Welcome back</h2>
          <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 32 }}>Login to continue ordering</p>

          {serverError && <Alert variant="danger" style={{ borderRadius: 8, fontSize: '0.85rem' }}>{serverError}</Alert>}

          <form noValidate onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ ...inputStyle, borderColor: formik.touched.email && formik.errors.email ? '#ef4444' : '#e0e0e0' }}
                onFocus={e => e.target.style.borderColor = '#111'}
              />
              {formik.touched.email && formik.errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, marginBottom: 0 }}>{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ ...inputStyle, borderColor: formik.touched.password && formik.errors.password ? '#ef4444' : '#e0e0e0' }}
                onFocus={e => e.target.style.borderColor = '#111'}
              />
              {formik.touched.password && formik.errors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, marginBottom: 0 }}>{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              style={{
                width: '100%', background: '#111', color: '#fff', border: 'none',
                borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: '0.95rem',
                cursor: formik.isSubmitting ? 'not-allowed' : 'pointer', opacity: formik.isSubmitting ? 0.7 : 1,
                fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => !formik.isSubmitting && (e.target.style.opacity = '0.85')}
              onMouseLeave={e => e.target.style.opacity = formik.isSubmitting ? '0.7' : '1'}
            >
              {formik.isSubmitting ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#888' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#111', fontWeight: 700, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;