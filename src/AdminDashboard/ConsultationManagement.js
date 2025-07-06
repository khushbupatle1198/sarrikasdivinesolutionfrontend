import React, { useState, useEffect } from 'react';
import './ConsultationManagement.css';
import config from '../config';

const ConsultationManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch consultations
  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/consultations`);
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const url = editId 
        ? `${config.API_BASE_URL}/api/consultations/${editId}`
        : `${config.API_BASE_URL}/api/consultations`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        fetchConsultations();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  };

  const handleEdit = (consultation) => {
    setFormData({
      title: consultation.title,
      description: consultation.description,
      price: consultation.price,
      image: null
    });
    setEditId(consultation.id);
    if (consultation.imageUrl) {
      setImagePreview(`${config.API_BASE_URL}/uploads/ConsultationImages/${consultation.imageUrl}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/consultations/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchConsultations();
        }
      } catch (error) {
        console.error('Error deleting consultation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      image: null
    });
    setEditId(null);
    setImagePreview(null);
  };

  return (
    <div className="consultation-container">
      <div className="card-header">
        <h4>Consultation Management</h4>
        <button 
          className="primary-btn"
          onClick={resetForm}
        >
          <i className="bi bi-plus"></i> Add New
        </button>
      </div>

      {/* Consultation Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editId ? 'Update' : 'Save'}
            </button>
            {editId && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Consultations Table */}
      <div className="table-container">
        <table className="consultation-table">
          <thead>
            <tr>
                <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(consultation => (
              <tr key={consultation.id}>
                <td>{consultation.id}</td>
                <td>{consultation.title}</td>
                <td>{consultation.description}</td>
                <td>{consultation.price}</td>
                <td>
                  {consultation.imageUrl && (
                    <img 
                      src={`${config.API_BASE_URL}/uploads/ConsultationImages/${consultation.imageUrl}`} 
                      alt={consultation.title}
                      className="thumbnail"
                    />
                  )}
                </td>
                <td>
                  <button 
                    className="action-btn"
                    onClick={() => handleEdit(consultation)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleDelete(consultation.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultationManagement;