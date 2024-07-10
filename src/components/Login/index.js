import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './styles.css';  // Import the CSS file

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const onSubmit = (values, { setSubmitting }) => {
    const dummyCreds = {
      username: 'admin',
      password: 'admin123'
    };

    if (values.username === dummyCreds.username && values.password === dummyCreds.password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/restaurants');
    } else {
      alert('Invalid credentials');
    }
    setSubmitting(false);
  };

  return (
    <div className="container-login">
      <div className="form-wrapper-login">
        <h2 className="title-login">Login</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="form-login">
              <div className="form-group-login">
                <label htmlFor="username" className="label-login">Username</label>
                <Field type="text" id="username" name="username" className="field-login" />
                <ErrorMessage name="username" component="div" className="error-login" />
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
