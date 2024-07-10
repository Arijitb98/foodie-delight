import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addVendor } from '../../Data/Vendors'; // Import addVendor function
import './styles.css'; // Import the CSS file

const AddVendor = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    addVendor(values); // Call addVendor function to add new vendor
    alert('Vendor added successfully!');
    navigate('/vendors'); // Navigate back to vendors list after adding
    setSubmitting(false);
  };

  return (
    <div className="form-container-addVendor">
      <div className="form-wrapper-addVendor">
        <h2 className="form-title-addVendor">Add New Vendor</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field-addVendor">
                <label htmlFor="name" className="label">Name</label>
                <Field type="text" id="name" name="name" className="input-field-addVendor" />
                <ErrorMessage name="name" component="div" className="error-message-addVendor" />
              </div>
              <div className="form-field-addVendor">
                <label htmlFor="email" className="label">Email</label>
                <Field type="email" id="email" name="email" className="input-field-addVendor" />
                <ErrorMessage name="email" component="div" className="error-message-addVendor" />
              </div>
              <div className="form-field-addVendor">
                <label htmlFor="phone" className="label">Phone Number</label>
                <Field type="text" id="phone" name="phone" className="input-field-addVendor" />
                <ErrorMessage name="phone" component="div" className="error-message-addVendor" />
              </div>
              <div className="form-field-addVendor">
                <button type="submit" className="submit-button-addVendor" disabled={isSubmitting}>Add Vendor</button>
                <button type="button" className="back-button-addVendor" onClick={() => navigate('/vendors')}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddVendor;
