import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = () => {
    return newPassword === confirmPassword && confirmPassword !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      if (passwordsMatch()) {
        alert(`Password reset for ${resetEmail} was successful`);
        setIsForgotPassword(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert("Passwords don't match");
      }
    } else {
      alert(`Logged in with ${email}`);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {isForgotPassword ? (
          <>
            <h2 className={styles.loginTitle}>Reset Password</h2>
            <p className={styles.loginSubtitle}>Enter your email and new password</p>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.loginInputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.loginInputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className={styles.loginPasswordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              <div className={styles.loginInputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && (
                  <span className={`${styles.loginValidationIcon} ${
                    passwordsMatch() ? styles.valid : styles.invalid
                  }`}>
                    {passwordsMatch() ? '✓' : '✗'}
                  </span>
                )}
                <span
                  className={styles.loginPasswordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              <button type="submit" className={styles.loginButton}>
                Reset Password
              </button>
            </form>
            <p className={styles.loginFooter}>
              Remember your password?{' '}
              <span className={styles.loginLink} onClick={() => setIsForgotPassword(false)}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.loginTitle}>Login to Your Account</h2>
            <p className={styles.loginSubtitle}>Welcome back! Please enter your details</p>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </span>
              </div>
              
              <button type="submit" className={styles.loginButton}>
                Sign In
              </button>
            </form>
            <p className={styles.loginFooter}>
              Don't have an account?{' '}
              <span className={styles.loginLink}>Sign up</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;