import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Login successful! Redirecting...', { autoClose: 2000 });
      
      // Redirect based on user role
      if (data.role === 'ADMIN') {
        setTimeout(() => navigate('/admindash'), 2000);
      } else {
        setTimeout(() => navigate('/userdashboard'), 2000);
      }
    } else {
      toast.error(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (err) {
    toast.error('Network error. Please try again.');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.loginPage}>
      <ToastContainer position="top-center" theme="colored" />
      
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login to Your Account</h2>
        <p className={styles.loginSubtitle}>Welcome back! Please enter your details</p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.loginInputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.loginInputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.loginPasswordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          
          <div className={styles.loginOptions}>
            <div className={styles.loginRememberMe}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <span
              className={styles.loginForgotPassword}
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </span>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <p className={styles.loginFooter}>
          Go To {' '}
          <span 
            className={styles.loginLink}
            onClick={() => navigate('/')}
          >
            Home
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
