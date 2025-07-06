import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import config from '../config';
import styles from './CoursePurchaseForm.module.css'; // Changed to module.css

const CoursePurchaseForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  
  // UPI Payment Details
  const upiId = '9067690333@ybl';
  const receiverName = 'Sacred Numerology';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(receiverName)}&am=${course?.price || ''}&cu=INR&tn=Course Payment`;

  const [isExistingUser, setIsExistingUser] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    dob: '',
    birthTime: '',
    birthPlace: '',
    password: '',
    confirmPassword: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('courseId', course.id);
      
      if (paymentScreenshot) {
        formDataToSend.append('paymentProof', paymentScreenshot);
      }

      if (!isExistingUser) {
        if (!formData.fullName || !formData.phone || !formData.dob || 
            !formData.birthTime || !formData.birthPlace || !formData.password) {
          throw new Error('All fields are required for new users');
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('dob', formData.dob);
        formDataToSend.append('birthTime', formData.birthTime);
        formDataToSend.append('birthPlace', formData.birthPlace);
        formDataToSend.append('password', formData.password);
      }

      const response = await fetch(`${config.API_BASE_URL}/api/purchase/initiate`, {
        method: 'POST',
        body: formDataToSend
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Invalid server response');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      if (data.otpRequired) {
        navigate('/purchase/otp', {
          state: { 
            email: formData.email,
            course: course,
            purchaseId: data.purchaseId,
            tempProofPath: data.tempProofPath,
            isNewUser: !isExistingUser
          }
        });
      } else {
        setSuccess('Purchase completed successfully!');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to process purchase');
      console.error('Purchase error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Purchase Course: {course?.title}</h2>
        <p className={styles.price}>Price: ₹{course?.price || '0'}</p>
        
        <div className={styles.userTypeToggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${isExistingUser ? styles.active : ''}`}
            onClick={() => setIsExistingUser(true)}
          >
            Existing User
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!isExistingUser ? styles.active : ''}`}
            onClick={() => setIsExistingUser(false)}
          >
            New User
          </button>
        </div>

        {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
        {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {!isExistingUser && (
            <>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Time of Birth</label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Place of Birth</label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label>Make Payment</label>
            <div className={styles.paymentSection}>
              <div className={styles.qrCodeContainer}>
                <div className={styles.qrCodeWrapper}>
                  <QRCodeSVG 
                    value={upiLink}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <div className={styles.paymentDetails}>
                    <p className={styles.amount}>Amount: ₹{course?.price || '0'}</p>
                    <p className={styles.upiId}>{upiId}</p>
                    <p className={styles.receiverName}>{receiverName}</p>
                  </div>
                </div>
                <p className={styles.instructions}>
                  Scan this QR code with any UPI app to pay instantly
                </p>
              </div>
            </div>
            
            <div className={styles.screenshotUpload}>
              <label>Upload Payment Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className={styles.fileInput}
              />
              {previewImage && (
                <div className={styles.screenshotPreview}>
                  <img src={previewImage} alt="Payment Screenshot Preview" />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Purchase Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoursePurchaseForm;