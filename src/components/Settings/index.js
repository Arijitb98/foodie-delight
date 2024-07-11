import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  loadLoginCredentials,
  updateLoginCredentialById
} from '../../Data/Login';
import './styles.css';

const Settings = () => {
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    const storedCredentials = loadLoginCredentials();
    setCredentials(storedCredentials.length > 0 ? storedCredentials[0] : null);
  }, []);

  const initialValues = credentials || { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    if (credentials) {
      updateLoginCredentialById(credentials.id, values);
      alert('Credentials updated successfully');
    } else {
      alert('No credentials found to update');
    }
    setSubmitting(false);
  };

  return (
    <div className="container-settings1">
      <h1 className="title-settings1">Settings</h1>
      {credentials ? (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="form-settings1">
              <div className="form-group-settings1">
                <label htmlFor="email" className="label-settings1">Email</label>
                <Field type="email" id="email" name="email" className="field-settings1" />
                <ErrorMessage name="email" component="div" className="error-settings1" />
              </div>
              <div className="form-group-settings1">
                <label htmlFor="password" className="label-settings1">Password</label>
                <Field type="password" id="password" name="password" className="field-settings1" />
                <ErrorMessage name="password" component="div" className="error-settings1" />
              </div>
              <button type="submit" className="submit-button-settings1" disabled={isSubmitting}>Save</button>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Settings;
