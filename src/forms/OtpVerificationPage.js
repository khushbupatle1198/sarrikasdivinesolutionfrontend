import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config';
import styles from './OtpVerificationPage.module.css'; // Changed to module.css

const OtpVerificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, course, purchaseId, tempProofPath } = location.state || {};
    
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Validate OTP format (6 digits)
            if (!otp || !/^\d{6}$/.test(otp)) {
                throw new Error('Please enter a valid 6-digit OTP');
            }

            // Validate required fields
            if (!email || !course?.id || !purchaseId) {
                throw new Error('Missing required information. Please try the purchase process again.');
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', otp);
            formData.append('courseId', course.id);
            formData.append('purchaseId', purchaseId);
            
            if (tempProofPath) {
                formData.append('tempProofPath', tempProofPath);
            }

            const response = await fetch(`${config.API_BASE_URL}/api/purchase/verify-and-complete`, {
                method: 'POST',
                body: formData
            });

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Invalid server response');
            }
            
            if (!response.ok) {
                throw new Error(data.message || 'OTP verification failed');
            }

            navigate('/login', {
                state: { 
                    message: 'Purchase completed successfully! Please login to access your course.'
                }
            });
        } catch (err) {
            setError(err.message || 'Failed to verify OTP');
            console.error('OTP verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>OTP Verification</h2>
                <p>We've sent an OTP to {email}</p>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <form onSubmit={handleVerifyOtp}>
                    <div className={styles.formGroup}>
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            pattern="\d{6}"
                            title="Please enter a 6-digit OTP"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationPage;