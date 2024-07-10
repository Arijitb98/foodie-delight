import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addRestaurant } from '../../Data/Restaurants';
import { loadVendors } from '../../Data/Vendors';
import './styles.css'; // Import the CSS file

const AddRestaurant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendors = loadVendors();
  const { vendorId } = location.state || {};

  const initialValues = {
    name: '',
    description: '',
    location: '',
    contactNumber: '',
    openingHour: '', // Separate field for opening hour
    closingHour: '', // Separate field for closing hour
    vendorId: vendorId || '', // Preselect the vendor if provided
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    description: Yup.string().required('Description is required').max(500, 'Description is too long'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
    openingHour: Yup.string().required('Opening Hour is required'),
    closingHour: Yup.string().required('Closing Hour is required'),
    vendorId: Yup.string().required('Vendor is required') // Add validation for vendorId
  });

  const onSubmit = (values, { setSubmitting }) => {
    addRestaurant(values); // Call addRestaurant function to add new restaurant
    alert('Restaurant added successfully!');
    navigate('/restaurants'); // Navigate back to restaurants list after adding
    setSubmitting(false);
  };

  return (
    <div className="form-container-addRestaurant">
      <div className="form-wrapper-addRestaurant">
        <h2 className="form-title-addRestaurant">Add New Restaurant</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field-addRestaurant">
                <label htmlFor="name" className="label-addRestaurant">Name</label>
                <Field type="text" id="name" name="name" className="input-field-addRestaurant" />
                <ErrorMessage name="name" component="div" className="error-message-addRestaurant" />
              </div>
              <div className="form-field-addRestaurant">
                <label htmlFor="description" className="label-addRestaurant">Description</label>
                <Field type="text" id="description" name="description" className="input-field-addRestaurant" />
                <ErrorMessage name="description" component="div" className="error-message-addRestaurant" />
              </div>
              <div className="form-field-addRestaurant">
                <label htmlFor="location" className="label-addRestaurant">Location</label>
                <Field type="text" id="location" name="location" className="input-field-addRestaurant" />
                <ErrorMessage name="location" component="div" className="error-message-addRestaurant" />
              </div>
              <div className="form-field-addRestaurant">
                <label htmlFor="contactNumber" className="label-addRestaurant">Contact Number</label>
                <Field type="text" id="contactNumber" name="contactNumber" className="input-field-addRestaurant" />
                <ErrorMessage name="contactNumber" component="div" className="error-message-addRestaurant" />
              </div>

              <div className="form-field-addRestaurant">
                <label htmlFor="openingHour" className="label-addRestaurant">Opening Hour</label>
                <Field as="select" id="openingHour" name="openingHour" className="input-field-addRestaurant">
                  <option value="">Select Opening Hour</option>
                  {[...Array(24).keys()].map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                  ))}
                </Field>
                <ErrorMessage name="openingHour" component="div" className="error-message-addRestaurant" />
              </div>
              <div className="form-field-addRestaurant">
                <label htmlFor="closingHour" className="label-addRestaurant">Closing Hour</label>
                <Field as="select" id="closingHour" name="closingHour" className="input-field-addRestaurant">
                  <option value="">Select Closing Hour</option>
                  {[...Array(24).keys()].map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                  ))}
                </Field>
                <ErrorMessage name="closingHour" component="div" className="error-message-addRestaurant" />
              </div>

              <div className="form-field-addRestaurant">
                <label htmlFor="vendorId" className="label-addRestaurant">Vendor</label>
                <Field
                  as="select"
                  id="vendorId"
                  name="vendorId"
                  className="input-field-addRestaurant"
                  disabled={!!vendorId} // Disable when vendorId is present
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage name="vendorId" component="div" className="error-message-addRestaurant" />
              </div>
              <div className="form-field-addRestaurant">
                <button type="submit" className="submit-button-addRestaurant" disabled={isSubmitting}>Add Restaurant</button>
                <button type="button" className="back-button-addRestaurant" onClick={() => navigate('/restaurants')}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddRestaurant;
