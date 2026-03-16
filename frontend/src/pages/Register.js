import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const registerSchema = Yup.object({
  name:     Yup.string().min(2, 'Min 2 characters').required('Full name is required'),
  email:    Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  phone:    Yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number').required('Phone is required'),
});

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 8,
  fontSize: '0.88rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: '#fff',
  color: '#111',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.8rem',
  color: '#444',
  marginBottom: 5,
  fontFamily: 'Inter, sans-serif',
};

const Register = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', phone: '', role: 'customer' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        await register(values);
        navigate('/login');
      } catch (err) {
        setServerError(err.response?.data?.message || 'Registration failed');
      }
      setSubmitting(false);
    },
  });

  const field = (name, label, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#ef4444' : '#e0e0e0' }}
        onFocus={e => e.target.style.borderColor = '#111'}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p style={{ color: '#ef4444', fontSize: '0.73rem', marginTop: 3, marginBottom: 0 }}>{formik.errors[name]}</p>
      )}
    </div>
  );

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
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', color: '#fff', marginBottom: 16 }}>
            <i className="bi bi-patch-check-fill"></i>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 12 }}>
            Join Pizza Store
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 260, margin: '0 auto 32px' }}>
            Create your account and start enjoying delicious pizzas delivered to your door.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Free registration', 'Track orders in real-time', 'Exclusive member discounts'].map(f => (
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
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#111', marginBottom: 6, letterSpacing: '-0.03em' }}>Create account</h2>
          <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 28 }}>Let's get you started</p>

          {serverError && <Alert variant="danger" style={{ borderRadius: 8, fontSize: '0.85rem' }}>{serverError}</Alert>}

          <form noValidate onSubmit={formik.handleSubmit}>
            {field('name',     'Full Name',    'text',     'Enter your full name')}
            {field('email',    'Email',        'email',    'you@example.com')}
            {field('password', 'Password',     'password', 'Min 6 characters')}
            {field('phone',    'Phone Number', 'text',     '10-digit number')}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              style={{
                width: '100%', background: '#111', color: '#fff', border: 'none',
                borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: '0.95rem',
                cursor: formik.isSubmitting ? 'not-allowed' : 'pointer', opacity: formik.isSubmitting ? 0.7 : 1,
                fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s', marginTop: 8,
              }}
              onMouseEnter={e => !formik.isSubmitting && (e.target.style.opacity = '0.85')}
              onMouseLeave={e => e.target.style.opacity = formik.isSubmitting ? '0.7' : '1'}
            >
              {formik.isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#888' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#111', fontWeight: 700, textDecoration: 'none' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;