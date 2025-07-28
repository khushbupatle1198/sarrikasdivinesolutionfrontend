import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
axios.post(`${config.API_BASE_URL}/api/savecourse`, data)

import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = new password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/request-otp?email=${email}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/auth/verify-otp?email=${email}&otp=${otp}`, 
        { method: 'POST' }
      );
      
      const data = await response.json();
      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

 const handleResetPassword = async (e) => {
  e.preventDefault();
  if (newPassword !== confirmPassword) {
    setError("Passwords don't match");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        email: email, 
        otp: otp,
        newPassword: newPassword 
      })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Password reset successful!');
      navigate('/login');
    } else {
      setError(data.message || 'Password reset failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Reset Password</h2>
        
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <p>Enter your email to receive an OTP</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p>Enter the OTP sent to your email</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p>Enter your new password</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
            />
            <button type="submit" disabled={loading || newPassword !== confirmPassword}>
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <p className={styles.backToLogin}>
          Remember your password?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
