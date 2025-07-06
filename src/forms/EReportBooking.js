import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import styles from './EReportBooking.module.css';

const EReportBooking = ({ onClose }) => {
  const location = useLocation();
  const { state } = location;
  const eReport = state?.eReport;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    birthTime: '',
    birthPlace: '',
    specificQuestions: '',
    paymentProof: null
  });
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!eReport) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>E-Report Not Found</h2>
          <p>Please select an E-Report to purchase.</p>
          <button 
            className={styles.button}
            onClick={() => navigate('/ereport')}
          >
            ← Back to E-Reports
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
  formDataToSend.append('eReportId', eReport.id);
  formDataToSend.append('name', formData.name);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('phone', formData.phone);
  formDataToSend.append('dob', formData.dob);
  formDataToSend.append('birthTime', formData.birthTime);
  formDataToSend.append('birthPlace', formData.birthPlace);
  formDataToSend.append('specificQuestions', formData.specificQuestions);
  formDataToSend.append('amountPaid', eReport.price); // Add this line
  if (formData.paymentProof) {
    formDataToSend.append('paymentProof', formData.paymentProof);
  }

  try {
    const response = await fetch(`${config.API_BASE_URL}/api/ereports/purchase`, {
      method: 'POST',
      body: formDataToSend
    });

    if (response.ok) {
      const purchaseData = await response.json();
      
      const whatsappMessage = `New E-Report Purchase:\n\n` +
        `*Report:* ${eReport.title}\n` +
        `*Price:* ₹${eReport.price}\n\n` +
        `*Customer Details:*\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `DOB: ${formData.dob}\n` +
        `Birth Time: ${formData.birthTime}\n` +
        `Birth Place: ${formData.birthPlace}\n` +
        `Questions: ${formData.specificQuestions}\n\n` +
        `Purchase ID: ${purchaseData.purchaseId}`;
      
      window.open(`https://wa.me/919067690333?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
      if (onClose) {
        onClose();
      } else {
        navigate('/ereport', { state: { purchaseSuccess: true } });
      }
    } else {
      throw new Error('Purchase failed');
    }
  } catch (error) {
    console.error('Purchase error:', error);
    toast.error('Purchase failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className={styles.header}>
          <h2 className={styles.subtitle}>Numerology Energy Report</h2>
          <h1 className={styles.title}>{eReport.title}</h1>
          <div className={styles.priceTag}>₹{eReport.price}</div>
        </div>
        
        <div className={styles.grid}>
          {/* Payment Section */}
          <div className={styles.paymentSection}>
            <h3 className={styles.sectionTitle}>
              <span>✦</span>
              <span>Payment Method</span>
            </h3>
            
            <div className={styles.qrCard}>
              <QRCodeSVG 
                value={`upi://pay?pa=9067690333@ybl&am=${eReport.price.replace(/[^0-9]/g, '')}&cu=INR`} 
                size={180}
                level="H"
                includeMargin={true}
                className={styles.qrCode}
              />
              <div className={styles.upiDetails}>
                <span>UPI ID:</span>
                <span>9067690333@ybl</span>
              </div>
              <div className={styles.paymentApps}>
                <div className={styles.appIcon}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_%28GPay%29_Logo.svg/512px-Google_Pay_%28GPay%29_Logo.svg.png" alt="Google Pay" />
                </div>
                <div className={styles.appIcon}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png" alt="PhonePe" />
                </div>
                <div className={styles.appIcon}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Paytm_Logo_2x.png/640px-Paytm_Logo_2x.png" alt="Paytm" />
                </div>
              </div>
            </div>
            
            <div className={styles.paymentInstructions}>
              <div className={styles.instructionStep}>
                <div>1</div>
                <p>Scan the QR code using any UPI app</p>
              </div>
              <div className={styles.instructionStep}>
                <div>2</div>
                <p>Complete the payment of ₹{eReport.price}</p>
              </div>
              <div className={styles.instructionStep}>
                <div>3</div>
                <p>Upload the payment screenshot below</p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span>✧</span>
                <span>Personal Details</span>
              </h3>
              
              <div className={styles.formGroup}>
                <label>Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Date of Birth*</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Birth Time*</label>
                  <input
                    type="time"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Birth Place*</label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Specific Questions (Optional)</label>
                <textarea
                  name="specificQuestions"
                  value={formData.specificQuestions}
                  onChange={handleInputChange}
                  placeholder="Any specific areas you want the report to focus on?"
                  rows="3"
                />
              </div>
            </div>
            
            {/* Report Points Section */}
            <div className={`${styles.formSection} ${styles.reportPoints}`}>
              <h3 className={styles.sectionTitle}>
                <span>✺</span>
                <span>What's Included</span>
              </h3>
              
              <ul className={styles.pointsList}>
                {eReport.points.map((point, index) => (
                  <li key={index}>
                    <span>✦</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Payment Proof Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span>✧</span>
                <span>Payment Confirmation</span>
              </h3>
              
              <div className={styles.formGroup}>
                <label>Payment Screenshot*</label>
                <div className={styles.fileUpload}>
                  <input
                    type="file"
                    id="paymentProof"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <label htmlFor="paymentProof">
                    {formData.paymentProof ? (
                      <span>{formData.paymentProof.name}</span>
                    ) : (
                      <span>Choose Payment Screenshot</span>
                    )}
                    <span className={styles.uploadIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </label>
                </div>
                
                {paymentProofPreview && (
                  <div className={styles.previewContainer}>
                    <img src={paymentProofPreview} alt="Payment proof" />
                    <button 
                      type="button"
                      className={styles.removeButton}
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
            
            {/* Submit Section */}
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
                  <>
                    Confirm Purchase
                    <span className={styles.priceBadge}>₹{eReport.price}</span>
                  </>
                )}
              </button>
              
              <div className={styles.securityNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M19 11C19 15.9706 12 21 12 21C12 21 5 15.9706 5 11V7C5 6.44772 5.44772 6 6 6H18C18.5523 6 19 6.44772 19 7V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EReportBooking;