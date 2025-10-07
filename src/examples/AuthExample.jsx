import React, { useState, useEffect } from 'react';
import { authAPI, authValidation, useAuth } from '../apis/auth';

// Example component showing how to use the authentication APIs
const AuthExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Using the useAuth hook
  const { user, isAuthenticated, login, register, logout, updateProfile } = useAuth();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const validation = authValidation.validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        console.log('Registration successful:', result.user);
        // Redirect or show success message
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const validation = authValidation.validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      if (result.success) {
        console.log('Login successful:', result.user);
        // Redirect or show success message
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
      // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        console.log('Profile updated successfully:', result.user);
      } else {
        console.error('Profile update failed:', result.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      console.log('User is authenticated:', authAPI.getStoredUser());
    }
  }, []);

  return (
    <div className="auth-example">
      <h2>Authentication Example</h2>
      
      {isAuthenticated ? (
        <div className="authenticated-user">
          <h3>Welcome, {user?.firstName}!</h3>
          <p>Email: {user?.email}</p>
          <p>Subscription: {user?.subscription?.plan || 'Free'}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-forms">
          {/* Registration Form */}
          <form onSubmit={handleRegister} className="register-form">
            <h3>Register</h3>
            {errors.general && <div className="error">{errors.general}</div>}
            
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            <div>
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                I agree to the terms and conditions
              </label>
              {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <h3>Login</h3>
            {errors.general && <div className="error">{errors.general}</div>}
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div>
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                Remember me
              </label>
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthExample;

