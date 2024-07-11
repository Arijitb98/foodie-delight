import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { loadLoginCredentials } from '../../Data/Login';
import './styles.css';

const Login = () => {
  const [loading, setLoading] = useState(true); // State for initial loading
  const [formSubmitting, setFormSubmitting] = useState(false); // State for form submission
  const navigate = useNavigate(); // Navigation utility from React Router

  useEffect(() => {
    setLoading(false); // Simulate initial data loading completion
  }, []);

  // Initial form values
  const initialValues = {
    email: '',
    password: ''
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
      )
  });

  // Handle form submission
  const onSubmit = (values, { setSubmitting }) => {
    setFormSubmitting(true); // Start form submission loader

    // Load credentials from data source
    const credentials = loadLoginCredentials();
    const foundCredential = credentials.find(cred => cred.email === values.email);

    // Simulate async operation (e.g., API call)
    setTimeout(() => {
      if (foundCredential && foundCredential.password === values.password) {
        localStorage.setItem('isAuthenticated', 'true'); // Set authentication flag in local storage
        navigate('/restaurants'); // Redirect to restaurants page on successful login
      } else {
        alert('Invalid credentials'); // Alert if credentials are invalid
      }

      setFormSubmitting(false); // Stop form submission loader
      setSubmitting(false); // Set Formik submitting to false
    }, 1000); // Simulate a delay of 1 second
  };

  // Render loading indicator while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render login form with Formik for email and password input
  return (
    <div className="container-login">
      <header className="header">
        <h1 className="header-title">FoodieDelight</h1>
      </header>
      <div className="form-wrapper-login">
        <h2 className="title-login">Admin Login</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="form-login">
              <div className="form-group-login">
                <label htmlFor="email" className="label-login">Email</label>
                <Field type="email" id="email" name="email" className="field-login" />
                <ErrorMessage name="email" component="div" className="error-login" />
              </div>
              <div className="form-group-login">
                <label htmlFor="password" className="label-login">Password</label>
                <Field type="password" id="password" name="password" className="field-login" />
                <ErrorMessage name="password" component="div" className="error-login" />
              </div>
              <button type="submit" className="submit-button-login" disabled={isSubmitting || formSubmitting}>
                {formSubmitting ? <CircularProgress size={24} /> : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
