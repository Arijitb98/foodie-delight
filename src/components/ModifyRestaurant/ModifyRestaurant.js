import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getRestaurantById, updateRestaurantById } from '../../Data/Data';
import './styles.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ModifyRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    location: '',
    contactNumber: '',
    openingHours: ''
  });

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    description: Yup.string().required('Description is required').max(500, 'Description is too long'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().required('Contact Number is required'),
    openingHours: Yup.string().required('Opening Hours are required')
  });

  useEffect(() => {
    const fetchRestaurant = () => {
      const restaurant = getRestaurantById(id);
      if (restaurant) {
        setInitialValues(restaurant);
      } else {
        alert('Restaurant not found');
        navigate('/restaurants'); // Navigate to restaurants list if restaurant not found
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  const onSubmit = (values, { setSubmitting }) => {
    updateRestaurantById(id, values);
    alert('Restaurant updated successfully!');
    navigate('/restaurants'); // Navigate back to restaurants list after update
    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2 className="form-title">Modify Restaurant</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field">
                <label htmlFor="name" className="label">Name</label>
                <Field type="text" id="name" name="name" className="input-field" />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <label htmlFor="description" className="label">Description</label>
                <Field type="text" id="description" name="description" className="input-field" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <label htmlFor="location" className="label">Location</label>
                <Field type="text" id="location" name="location" className="input-field" />
                <ErrorMessage name="location" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <label htmlFor="contactNumber" className="label">Contact Number</label>
                <Field type="text" id="contactNumber" name="contactNumber" className="input-field" />
                <ErrorMessage name="contactNumber" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <label htmlFor="openingHours" className="label">Opening Hours</label>
                <Field type="text" id="openingHours" name="openingHours" className="input-field" />
                <ErrorMessage name="openingHours" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <button type="submit" className="submit-button" disabled={isSubmitting}>Update Restaurant</button>
                <button type="button" className="back-button" onClick={() => navigate('/restaurants')}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModifyRestaurant;
