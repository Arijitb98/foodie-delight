import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { mockRestaurants } from '../../Data/Data';

const AddRestaurant = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    description: '',
    location: '',
    contactNumber: '',
    openingHours: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    description: Yup.string().required('Description is required').max(500, 'Description is too long'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().required('Contact Number is required'),
    openingHours: Yup.string().required('Opening Hours are required')
  });

  const onSubmit = (values, { setSubmitting }) => {
    const newRestaurant = { id: (mockRestaurants.length + 1).toString(), ...values };
    mockRestaurants.push(newRestaurant);
    alert('Restaurant added successfully!');
    navigate('/restaurants');
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Add Restaurant</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field type="text" id="description" name="description" />
              <ErrorMessage name="description" component="div" />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <Field type="text" id="location" name="location" />
              <ErrorMessage name="location" component="div" />
            </div>
            <div>
              <label htmlFor="contactNumber">Contact Number</label>
              <Field type="text" id="contactNumber" name="contactNumber" />
              <ErrorMessage name="contactNumber" component="div" />
            </div>
            <div>
              <label htmlFor="openingHours">Opening Hours</label>
              <Field type="text" id="openingHours" name="openingHours" />
              <ErrorMessage name="openingHours" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Add Restaurant</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRestaurant;
