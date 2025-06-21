import React, { useState, useEffect } from 'react';
import styles from './CourseManagement.module.css';
import config from '../config';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/getAllcourses`);
      const data = await response.json();
      setCourses(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
     data.append('price', formData.price);
    if (file) {
      data.append('logo', file);
    }

    const url = editingId
      ? `${config.API_BASE_URL}/api/UpdateCourse/${editingId}`
      : `${config.API_BASE_URL}/api/savecourse`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: data
      });

      if (response.ok) {
        await fetchCourses();
        setFormData({ title: '', description: '', price: '' });
        setFile(null);
        setEditingId(null);
        alert(editingId ? 'Course updated successfully' : 'Course added successfully');
      } else {
        alert('Something went wrong while saving the course.');
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
       price: course.price
    });
    setFile(null); // clear previous file
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/deletecourse/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCourses(courses.filter(course => course.id !== id));
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading courses...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Course Management</h1>

      {/* Course Form */}
      <div className={styles.formContainer}>
        <h2>{editingId ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
  <label htmlFor="price">Price</label>
  <input
    type="text"
    id="price"
    name="price"
    value={formData.price}
    onChange={handleInputChange}
    required
  />
</div>  

          <div className={styles.formGroup}>
            <label htmlFor="logo">Course Logo</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {editingId ? 'Update Course' : 'Add Course'}
          </button>

          {editingId && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setFormData({ title: '', description: '' });
                setFile(null);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Course List */}
      <div className={styles.coursesList}>
        <h2>Available Courses</h2>
        {courses.length === 0 ? (
          <p>No courses available. Add your first course above.</p>
        ) : (
          <table className={styles.coursesTable}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Logo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                    <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.price}</td>
                  <td>
                    {course.logoUrl ? (
                      <img
                        src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`}
                        alt="Logo"
                        className={styles.courseLogo}
                      />
                    ) : (
                      'No Logo'
                    )}
                 { course.logoUrl} </td>
                  <td>
                    <button
                      onClick={() => handleEdit(course)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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

export default CourseManagement;
