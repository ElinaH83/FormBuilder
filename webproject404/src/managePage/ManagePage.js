import React, { useEffect, useState} from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authFetch } from "../services/authService.js";

const ManagePage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch folders from backend
  const fetchFolders = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await authFetch("https://webproject404-backend.darkube.app/api/folders");
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      setFolders(data);
      if (data.length > 0 && !selectedFolderId) {
        setSelectedFolderId(data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch folders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line
  }, []);

  // Delete form
  const handleDeleteForm = async (formId) => {
  setError('');
  setSuccess('');
  try {
      const res = await authFetch(`https://webproject404-backend.darkube.app/api/folders/form/${formId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete form");
      setSuccess("Form deleted successfully.");
      fetchFolders();
  } catch (err) {
    console.error(err.response?.data || err.message);
    setError('Failed to delete form.');
  }
};

  const handleEditForm = (formId) => {
    navigate(`/design-form/${formId}`);
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(to bottom, #B8C6FF, #EEFFCF)' }}>
      {/* Header */}
      <Navbar/>

      {/* Main content */}
      <div className="container mt-5 flex-grow-1">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading ? (
          <div className="text-center my-5">Loading...</div>
        ) : (
          <div className="row">
            {/* Folder Content */}
            <div className="col-12">
              {selectedFolder ? (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <h4 className="fw-bold">{selectedFolder.name}</h4>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary btn-sm me-2" disabled>Name</button>
                      <button className="btn btn-outline-secondary btn-sm" disabled>Date</button>
                    </div>
                  </div>
                  <div className="row g-3">
                    {selectedFolder.forms && selectedFolder.forms.length > 0 ? (
                      selectedFolder.forms.map(form => (
                        <div className="col-md-4" key={form.id}>
                          <div className="card p-3 shadow-sm">
                            <div className="d-flex justify-content-center align-items-center mb-3">
                              <div className="circle-icon bg-secondary p-4 rounded-circle text-white">
                                <i className="bi bi-file-earmark-text" />
                              </div>
                            </div>
                            <h5 className="fw-bold">{form.name || 'Untitled Form'}</h5>
                            <p className="text-muted">{form.description || 'No description provided.'}</p>
                            <div className="d-flex justify-content-between">
                              <button className="btn btn-primary btn-sm" onClick={() => handleEditForm(form.id)}>Edit</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteForm(form.id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center text-muted">No forms in this folder.</div>
                    )}
                    {/* Add New Form */}
                    <div className="col-md-4">
                      <div className="card p-3 text-center border-dashed">
                        <Link to="/design-form" className="btn btn-outline-primary w-100 p-4">
                          <i className="bi bi-plus-circle-fill" style={{ fontSize: '3rem' }} />
                          <p className="mt-2 fw-bold">Add a new Form</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted">Please select a folder.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default ManagePage;