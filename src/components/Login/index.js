import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loadLoginCredentials } from '../../Data/Login';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
      )
  });

  const onSubmit = (values, { setSubmitting }) => {
    const credentials = loadLoginCredentials();
    const foundCredential = credentials.find(cred => cred.email === values.email);

    if (foundCredential && foundCredential.password === values.password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/restaurants');
    } else {
      alert('Invalid credentials');
    }
    setSubmitting(false);
  };

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
              <button type="submit" className="submit-button-login" disabled={isSubmitting}>Login</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
