import React, { useState, useEffect } from 'react';
import './EReportManagement.css';
import config from '../config';
import { BiUpload, BiSave, BiRefresh, BiPencil, BiTrash, BiError } from 'react-icons/bi';

const EReportManagement = () => {
  const [eReports, setEReports] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    price: '',
    image: null,
    imagePreview: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch eReports on component mount
  useEffect(() => {
    fetchEReports();
  }, []);

  const fetchEReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/ereports`);
      if (!response.ok) throw new Error('Failed to fetch eReports');
      const data = await response.json();
      setEReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('points', formData.points);
      formDataToSend.append('price', formData.price);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = editingId 
        ? `${config.API_BASE_URL}/api/ereports/${editingId}`
        : `${config.API_BASE_URL}/api/ereports`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update eReport' : 'Failed to create eReport');
      }

      // Reset form and fetch updated data
      resetForm();
      fetchEReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (eReport) => {
    setFormData({
      title: eReport.title,
      description: eReport.description,
      points: eReport.points.join('\n'),
      price: eReport.price,
      image: null,
      imagePreview: eReport.imageUrl || ''
    });
    setEditingId(eReport.id);
  };

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this eReport?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/ereports/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imagePath })
      });

      if (!response.ok) throw new Error('Failed to delete eReport');

      fetchEReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      points: '',
      price: '',
      image: null,
      imagePreview: ''
    });
    setEditingId(null);
  };

  return (
    <div className="eReportManagement">
      <h3>EReport Management</h3>
      
      {error && (
        <div className="errorAlert">
          <BiError /> {error}
        </div>
      )}

      {/* EReport Form */}
      <div className="card">
        <div className="cardHeader">
          <h4>{editingId ? 'Edit EReport' : 'Add New EReport'}</h4>
        </div>
        <form onSubmit={handleSubmit} className="eReportForm">
          <div className="formGroup">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
            />
          </div>

          <div className="formGroup">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Key Points (one per line)</label>
            <textarea
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Enter each point on a new line"
            />
          </div>

          <div className="formGroup">
            <label>Image</label>
            <div className="fileUploadContainer">
              <input
                type="file"
                id="eReportImage"
                accept="image/*"
                onChange={handleFileChange}
                className="fileInput"
              />
              <label htmlFor="eReportImage" className="fileUploadBtn">
                <BiUpload /> Choose Image
              </label>
              {formData.imagePreview && (
                <div className="imagePreview">
                  <img 
                    src={formData.imagePreview.startsWith('blob:') 
                      ? formData.imagePreview 
                      : `${config.API_BASE_URL}/uploads/EReportImages/${formData.imageUrl}`}
                    alt="Preview" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="formActions">
            <button type="submit" className="primaryBtn" disabled={isLoading}>
              {isLoading ? (
                <span><BiRefresh /> Processing...</span>
              ) : (
                <span><BiSave /> {editingId ? 'Update' : 'Save'}</span>
              )}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="secondaryBtn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* EReports List */}
      <div className="card">
        {isLoading && !eReports.length ? (
          <div className="loading">
            <BiRefresh /> Loading...
          </div>
        ) : (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Points</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eReports.map(eReport => (
                  <tr key={eReport.id}>
                    <td>{eReport.id}</td>
                    <td>{eReport.title}</td>
                    <td>{eReport.description.substring(0, 50)}...</td>
                    <td>₹{eReport.price}</td>
                    <td>
                      <ul className="pointsList">
                        {eReport.points.slice(0, 2).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                        {eReport.points.length > 2 && (
                          <li>+{eReport.points.length - 2} more</li>
                        )}
                      </ul>
                    </td>
                    <td>
                      {eReport.imageUrl && (
                        <img 
                          src={`${config.API_BASE_URL}/uploads/EReportImages/${eReport.imageUrl}`}
                          alt={eReport.title} 
                          className="thumbnail" 
                        />
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleEdit(eReport)}
                        className="actionBtn"
                      >
                        <BiPencil />
                      </button>
                      <button 
                        onClick={() => handleDelete(eReport.id, eReport.imagePath)}
                        className="actionBtn"
                      >
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EReportManagement;