import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import styles from './ConsultationBooking.module.css';

const ConsultationBooking = ({ onClose }) => {
  const location = useLocation();
  const { state } = location;
  const consultation = state?.consultation;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    time: '',
    placeOfBirth: '',
    questions: '',
    paymentProof: null
  });
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!consultation) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.errorTitle}>Consultation Not Found</h2>
          <p className={styles.errorText}>Please select a consultation to book.</p>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/consultation')}
          >
            ← Back to Consultations
          </button>
        </div>
      </div>
    );
  }

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
      paymentProof: file
    });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('consultationId', consultation.id);
    formDataToSend.append('title', consultation.title);
    formDataToSend.append('price', consultation.price);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('placeOfBirth', formData.placeOfBirth);
    formDataToSend.append('questions', formData.questions);
    if (formData.paymentProof) {
      formDataToSend.append('paymentProof', formData.paymentProof);
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/consultations/book`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        
        const bookingData = await response.json();
        
        const whatsappMessage = `New Consultation Booking:\n\n` +
          `*Service:* ${consultation.title}\n` +
          `*Price:* ${consultation.price}\n\n` +
          `*Client Details:*\n` +
          `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Phone: ${formData.phone}\n` +
          `DOB: ${formData.dob}\n` +
          `Time: ${formData.time}\n` +
          `Place of Birth: ${formData.placeOfBirth}\n\n` +
          `*Questions:*\n${formData.questions}\n\n` +
          `Booking ID: ${bookingData.bookingId}`;
        
        window.open(`https://wa.me/919067690333?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        
        if (onClose) {
          onClose();
        } else {
           
          navigate('/consultation', { state: { bookingSuccess: true } });
        }
      } else {
        throw new toast.error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <div className={styles.header}>
          <h2 className={styles.title}>Book {consultation.title}</h2>
          <p className={styles.price}>₹{consultation.price}</p>
        </div>
        
        <div className={styles.bookingContainer}>
          <div className={styles.paymentSection}>
            <h3 className={styles.sectionTitle}>Scan & Pay via UPI</h3>
            <div className={styles.qrContainer}>
              <div className={styles.qrCodeWrapper}>
                <QRCodeSVG 
                  value={`upi://pay?pa=9067690333@ybl&am=${consultation.price.replace(/[^0-9]/g, '')}&cu=INR`} 
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className={styles.upiId}>UPI ID: 9067690333@ybl</p>
              <div className={styles.paymentApps}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_%28GPay%29_Logo.svg/512px-Google_Pay_%28GPay%29_Logo.svg.png" alt="Google Pay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png" alt="PhonePe" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Paytm_Logo_2x.png/640px-Paytm_Logo_2x.png" alt="Paytm" />
              </div>
            </div>
            <p className={styles.paymentNote}>
              Scan the QR code using any UPI app to complete your payment.
              After payment, please upload the screenshot below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Birth Details</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date of Birth*</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Time of Birth*</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Place of Birth*</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="City, Country"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Consultation Details</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Questions/Concerns</label>
                <textarea
                  name="questions"
                  value={formData.questions}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="What would you like to discuss in the consultation?"
                  rows="4"
                />
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Payment Confirmation</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Payment Proof (Screenshot)*</label>
                <div className={styles.fileUploadWrapper}>
                  <input
                    type="file"
                    id="paymentProof"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    required
                  />
                  <label htmlFor="paymentProof" className={styles.fileLabel}>
                    <span className={styles.fileLabelText}>
                      {formData.paymentProof ? formData.paymentProof.name : 'Choose file'}
                    </span>
                    <span className={styles.fileLabelButton}>
                      {formData.paymentProof ? 'Change' : 'Browse'}
                    </span>
                  </label>
                </div>
                {paymentProofPreview && (
                  <div className={styles.previewContainer}>
                    <img src={paymentProofPreview} alt="Payment proof" className={styles.previewImage} />
                    <button 
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => {
                        setFormData({...formData, paymentProof: null});
                        setPaymentProofPreview(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking & Pay ₹' + consultation.price
                )}
              </button>
              
              <p className={styles.secureNote}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Your information is secure and will not be shared
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationBooking;