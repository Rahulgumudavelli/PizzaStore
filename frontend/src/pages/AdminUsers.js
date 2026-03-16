import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal } from 'react-bootstrap';
import { getUsers, deleteUser } from '../services/api';
import Navbar from '../components/Navbar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <Container className="mt-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
          <div className="text-center text-md-start">
            <h2 className="fw-bold mb-0">User Management</h2>
            <p className="text-muted mb-0">View and manage all registered users</p>
          </div>
          <Badge bg="dark" className="px-3 py-2 fs-6 rounded-pill">
            Total Users: {users.length}
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 shadow-sm rounded-4">
            <Table responsive hover className="align-middle">
              <thead>
                <tr className="border-bottom-custom">
                  <th className="py-3 text-muted text-uppercase small fw-bold">Name</th>
                  <th className="py-3 text-muted text-uppercase small fw-bold">Email</th>
                  <th className="py-3 text-muted text-uppercase small fw-bold">Phone</th>
                  <th className="py-3 text-muted text-uppercase small fw-bold">Role</th>
                  <th className="py-3 text-muted text-uppercase small fw-bold">Joined On</th>
                  <th className="py-3 text-muted text-uppercase small fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 fw-bold">{u.name}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.phone || 'N/A'}</td>
                    <td className="py-3">
                      <Badge bg={u.role === 'admin' ? 'dark' : 'secondary'} className="text-capitalize">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {u.role !== 'admin' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="rounded-pill px-3"
                          onClick={() => handleDeleteClick(u)}
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          Are you sure you want to remove <strong>{userToDelete?.name}</strong>? This action will permanently delete their account and data.
        </Modal.Body>
        <Modal.Footer className="border-0 pb-4">
          <Button variant="light" className="px-4 rounded-pill fw-bold" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="dark" className="px-4 rounded-pill fw-bold" onClick={confirmDelete}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2026 Pizza Store. All rights reserved.</p>
      </footer>

      <style>{`
        .border-bottom-custom {
          border-bottom: 2px solid #f8f9fa !important;
        }
        tr:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
