import React, { useState, useEffect } from 'react';
import styles from './BlogManagement.module.css';
import config from '../config';

const BlogManagement = ({ onClose }) => {
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: '',
    featured: false,
    image: null
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/blogs`);
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogForm({
      ...blogForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setBlogForm({
      ...blogForm,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', blogForm.title);
    formData.append('content', blogForm.content);
    formData.append('author', blogForm.author);
    formData.append('featured', blogForm.featured);
    if (blogForm.image) {
      formData.append('image', blogForm.image);
    }

    try {
      const url = editingId 
        ? `${config.API_BASE_URL}/api/blogs/${editingId}`
        : `${config.API_BASE_URL}/api/blogs`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        const updatedBlog = await response.json();
        if (editingId) {
          setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
        } else {
          setBlogs([...blogs, updatedBlog]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      featured: blog.featured,
      image: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/blogs/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setBlogs(blogs.filter(blog => blog.id !== id));
          if (editingId === id) {
            resetForm();
          }
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const resetForm = () => {
    setBlogForm({
      title: '',
      content: '',
      author: '',
      featured: false,
      image: null
    });
    setEditingId(null);
  };

  return (
    <div className={styles.blogManagement}>
      <div className={styles.header}>
        <h2>Blog Management</h2>
        <button onClick={onClose} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
      
      <div className={styles.blogEditor}>
        <h3>{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
        <form onSubmit={handleSubmit} className={styles.blogForm}>
          <div className={styles.formGroup}>
            <label>Title*</label>
            <input
              type="text"
              name="title"
              value={blogForm.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Content*</label>
            <textarea
              name="content"
              value={blogForm.content}
              onChange={handleInputChange}
              rows="10"
              required
              placeholder="Write your blog content here..."
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Author*</label>
              <input
                type="text"
                name="author"
                value={blogForm.author}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Featured</label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={blogForm.featured}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Featured Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {editingId && blogs.find(b => b.id === editingId)?.imageUrl && !blogForm.image && (
              <div className={styles.currentImage}>
                <p>Current Image: {blogs.find(b => b.id === editingId).imageUrl}</p>
              </div>
            )}
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {editingId ? 'Update Blog' : 'Publish Blog'}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={resetForm}
            >
              {editingId ? 'Cancel Edit' : 'Clear Form'}
            </button>
          </div>
        </form>
      </div>
      
      <div className={styles.blogList}>
        <h3>Published Blogs</h3>
        {blogs.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <table className={styles.blogTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{new Date(blog.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.status} ${blog.featured ? styles.active : styles.inactive}`}>
                      {blog.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(blog)} 
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)} 
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;