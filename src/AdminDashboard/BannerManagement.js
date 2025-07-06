import React, { useState, useEffect } from 'react';
import config from '../config';
import styles from './BannerManagement.module.css';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!image) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/banners`);
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to fetch banners');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      let response;
      if (editId) {
        response = await fetch(`${config.API_BASE_URL}/api/banners/${editId}`, {
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the correct boundary
        });
      } else {
        response = await fetch(`${config.API_BASE_URL}/api/banners`, {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header when using FormData
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save banner');
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      setError(error.message || 'Failed to save banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setName(banner.name);
    setEditId(banner.id);
    if (banner.imageUrl) {
      setPreview(`${config.API_BASE_URL}/uploads/BannerImages/${banner.imageUrl}`);
    } else {
      setPreview('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      setError('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setName('');
    setImage(null);
    setPreview('');
    setEditId(null);
  };

  return (
    <div className={styles.container}>
      <h2>Banner Management</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Banner Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter banner name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Banner Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className={styles.imagePreview}>
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : editId ? 'Update Banner' : 'Add Banner'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className={styles.cancelBtn}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.bannerList}>
        <h3>Banners</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.name}</td>
                <td>
                  {banner.imageUrl && (
                    <img 
                      src={`${config.API_BASE_URL}/uploads/BannerImages/${banner.imageUrl}`} 
                      alt={banner.name} 
                      className={styles.thumbnail}
                    />
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => handleEdit(banner)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
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

export default BannerManagement;