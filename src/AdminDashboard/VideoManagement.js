import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import styles from './VideoManagement.module.css';

const VideoManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editPreviewVideo, setEditPreviewVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchVideos(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/getCourse`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    }
  };

  const fetchVideos = async (courseId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/courses/${courseId}/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      const videoUrl = URL.createObjectURL(file);
      setPreviewVideo(videoUrl);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  if (!selectedCourse || !title.trim() || !videoFile) {
    setError('Please select a course, enter a title, and choose a video file');
    setIsLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('video', videoFile);

  try {
    const response = await fetch(
      `${config.API_BASE_URL}/api/upload/${selectedCourse.id}`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          // Add this header to handle CORS preflight
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload video');
    }

    
    
    // Reset form and refresh videos
    setTitle('');
    setVideoFile(null);
    setPreviewVideo(null);
    document.getElementById('video').value = '';
    fetchVideos(selectedCourse.id);
  } catch (error) {
    console.error('Error uploading video:', error);
    setError(error.message || 'Failed to upload video');
  } finally {
    setIsLoading(false);
  }
};

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete video');
      }

      fetchVideos(selectedCourse.id);
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Failed to delete video');
    }
  };

  const handleUpdate = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditPreviewVideo(null);
    setEditVideoFile(null);
  };

  const handleEditFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditVideoFile(file);
      
      const videoUrl = URL.createObjectURL(file);
      setEditPreviewVideo(videoUrl);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editTitle.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      if (editVideoFile) {
        formData.append('video', editVideoFile);
      }

      const response = await fetch(`${config.API_BASE_URL}/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update video');
      }

      setEditingVideo(null);
      setEditTitle('');
      setEditVideoFile(null);
      setEditPreviewVideo(null);
      fetchVideos(selectedCourse.id);
    } catch (error) {
      console.error('Error updating video:', error);
      setError(error.message || 'Failed to update video');
    }
  };

  const playVideo = (videoUrl) => {
    setPreviewVideo(`${config.API_BASE_URL}/uploads/CourseVideos/${videoUrl}`);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowPlayer(false);
  };

  return (
    <div className={styles.container}>
      <h2>Video Management</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.courseSelection}>
        <h3>Select Course</h3>
        <div className={styles.courseGrid}>
          {courses.map(course => (
            <div 
              key={course.id}
              className={`${styles.courseCard} ${selectedCourse?.id === course.id ? styles.selected : ''}`}
              onClick={() => setSelectedCourse(course)}
            >
              {course.logoUrl && (
                <img 
                  src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`} 
                  alt={course.title}
                  className={styles.courseLogo}
                />
              )}
              <h4>{course.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Video Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="video">Video File</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
              {previewVideo && (
                <div className={styles.videoPreview}>
                  <video src={previewVideo} controls className={styles.previewPlayer} />
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>

          <div className={styles.videoList}>
            <h3>Videos for {selectedCourse.title}</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Video Title</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? (
                  videos.map(video => (
                    <tr key={video.id}>
                      <td>{selectedCourse.title}</td>
                      <td>
                        {editingVideo?.id === video.id ? (
                          <div className={styles.editContainer}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className={styles.editInput}
                            />
                            <input
                              type="file"
                              onChange={handleEditFileChange}
                              className={styles.editFileInput}
                            />
                            {editPreviewVideo && (
                              <div className={styles.editVideoPreview}>
                                <video src={editPreviewVideo} controls className={styles.previewPlayer} />
                              </div>
                            )}
                          </div>
                        ) : (
                          video.title
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => playVideo(video.videoUrl)}
                          className={styles.playBtn}
                        >
                          Play
                        </button>
                      </td>
                      <td>
                        {editingVideo?.id === video.id ? (
                          <div className={styles.editActions}>
                            <button 
                              onClick={handleUpdateSubmit}
                              className={styles.saveBtn}
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingVideo(null)}
                              className={styles.cancelBtn}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className={styles.actionButtons}>
                            <button 
                              onClick={() => handleUpdate(video)}
                              className={styles.editBtn}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(video.id)}
                              className={styles.deleteBtn}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.noVideos}>No videos found for this course</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showPlayer && (
        <div className={styles.videoModal}>
          <div className={styles.modalContent}>
            <button 
              onClick={handleClosePlayer}
              className={styles.closeBtn}
            >
              &times;
            </button>
            <video 
              ref={videoRef}
              src={previewVideo} 
              controls 
              autoPlay 
              className={styles.modalPlayer}
            />
            <div className={styles.modalControls}>
              <button 
                onClick={handleClosePlayer}
                className={styles.closeVideoBtn}
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;