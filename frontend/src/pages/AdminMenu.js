import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { getMenuItems, getCategories, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import Navbar from '../components/Navbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const menuItemSchema = Yup.object({
  name:        Yup.string().min(2, 'Name must be at least 2 characters').required('Item name is required'),
  price:       Yup.number().typeError('Price must be a number').positive('Price must be greater than 0').required('Price is required'),
  categoryId:  Yup.string().required('Please select a category'),
  description: Yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  image:       Yup.string().url('Enter a valid image URL').nullable().notRequired(),
  isAvailable: Yup.boolean(),
});

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => { fetchData(); }, []);

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

  const formik = useFormik({
    initialValues: { name: '', description: '', price: '', categoryId: '', image: '', isAvailable: true },
    validationSchema: menuItemSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEditing) {
          await updateMenuItem(currentItemId, values);
        } else {
          await createMenuItem(values);
        }
        setShowModal(false);
        resetForm();
        fetchData();
      } catch (error) {
        console.error('Error saving item:', error);
      }
      setSubmitting(false);
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItemId(null);
    formik.resetForm();
  };

  const handleShowEditModal = (item) => {
    setIsEditing(true);
    setCurrentItemId(item._id);
    formik.setValues({
      name:        item.name,
      description: item.description,
      price:       item.price,
      categoryId:  item.categoryId?._id || '',
      image:       item.image || '',
      isAvailable: item.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item permanently?')) {
      try {
        await deleteMenuItem(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div className="text-center text-md-start mb-4 mb-md-0">
            <h1 className="fw-900 mb-2" style={{ letterSpacing: '-0.04em' }}>Edit Menu</h1>
            <p className="text-muted">Manage your store's culinary offerings</p>
          </div>
          <Button variant="dark" className="rounded-pill px-5 fw-bold py-2 shadow-sm" onClick={() => { setIsEditing(false); formik.resetForm(); setShowModal(true); }}>
            + Add New Item
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        ) : (
          <Row className="g-4">
            {menuItems.map(item => (
              <Col xs={12} key={item._id}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                  <Row className="g-0 align-items-center">
                    <Col md={2} className="p-3 text-center text-md-start">
                      <div className="rounded-4 overflow-hidden mx-auto mx-md-0" style={{ height: 100, width: 100 }}>
                        <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="h-100 w-100 object-fit-cover" />
                      </div>
                    </Col>
                    <Col md={5} className="p-4 text-center text-md-start">
                      <h5 className="fw-800 mb-1">{item.name}</h5>
                      <p className="text-muted small mb-1">{item.categoryId?.categoryName || 'Uncategorized'}</p>
                      <Badge bg={item.isAvailable ? 'success' : 'secondary'} className="rounded-pill px-3">
                        {item.isAvailable ? 'Available' : 'Hidden'}
                      </Badge>
                    </Col>
                    <Col md={2} className="p-4 text-center">
                      <h4 className="fw-900 mb-0">₹{item.price}</h4>
                    </Col>
                    <Col md={3} className="p-4 mt-n4 mt-md-0">
                      <div className="d-flex gap-2 justify-content-center justify-content-md-end">
                        <Button variant="outline-dark" size="sm" className="rounded-pill px-4 fw-bold" onClick={() => handleShowEditModal(item)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-4 fw-bold" onClick={() => handleDelete(item._id)}>Delete</Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="border-0">
        <Modal.Body className="p-5">
          <h2 className="fw-900 mb-4" style={{ letterSpacing: '-0.04em' }}>{isEditing ? 'Edit Item' : 'New Menu Item'}</h2>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Item Name</Form.Label>
                  <Form.Control type="text" name="name" className="border-0 bg-light p-3 rounded-3" value={formik.values.name} onChange={formik.handleChange} isInvalid={formik.touched.name && !!formik.errors.name} />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Price (₹)</Form.Label>
                  <Form.Control type="number" name="price" className="border-0 bg-light p-3 rounded-3" value={formik.values.price} onChange={formik.handleChange} isInvalid={formik.touched.price && !!formik.errors.price} />
                  <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Category</Form.Label>
                  <Form.Select name="categoryId" className="border-0 bg-light p-3 rounded-3" value={formik.values.categoryId} onChange={formik.handleChange} isInvalid={formik.touched.categoryId && !!formik.errors.categoryId}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.categoryName}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Image URL</Form.Label>
                  <Form.Control type="url" name="image" className="border-0 bg-light p-3 rounded-3" value={formik.values.image} onChange={formik.handleChange} />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" className="border-0 bg-light p-3 rounded-3" value={formik.values.description} onChange={formik.handleChange} isInvalid={formik.touched.description && !!formik.errors.description} />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Check type="switch" label="Available for ordering" name="isAvailable" checked={formik.values.isAvailable} onChange={formik.handleChange} />
              </Col>
            </Row>
            <div className="d-flex gap-3 mt-5">
              <Button variant="dark" type="submit" className="w-100 py-3 rounded-pill fw-bold" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Confirm Changes'}
              </Button>
              <Button variant="light" className="w-100 py-3 rounded-pill fw-bold" onClick={handleCloseModal}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <footer className="py-4 text-center border-top mt-auto">
        <p className="small text-muted mb-0">© 2026 Pizza Store · Internal Cataloging</p>
      </footer>
      <style>{` .fw-900 { font-weight: 900; } .fw-800 { font-weight: 800; } `}</style>
    </div>
  );
};

export default AdminMenu;
