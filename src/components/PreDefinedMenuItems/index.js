import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addPreDefinedMenuItems, getPreDefinedMenuItemsById, updatePreDefinedMenuItemsById } from '../../Data/PreDefinedMenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css'; // Import the CSS file

const PredefinedMenuItemForm = () => {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: ''
  });

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required')
  });

  useEffect(() => {
    if (menuItemId) {
      const menuItem = getPreDefinedMenuItemsById( menuItemId);
      if (menuItem) {
        setInitialValues(menuItem);
      }
    }
  }, [menuItemId]);

  const onSubmit = (values, { setSubmitting }) => {
    if (menuItemId) {
        updatePreDefinedMenuItemsById(menuItemId, values);
      alert('Menu item updated successfully!');
    } else {
      addPreDefinedMenuItems(values);
      alert('Menu item added successfully!');
    }
    navigate(`/menu-categories`);
    setSubmitting(false);
  };

  return (
    <div className="form-container-addMenuItem">
      <div className="form-wrapper-addMenuItem">
        <h2 className="form-title-addMenuItem">{menuItemId ? 'Edit Default Menu Item' : 'Add Menu Item'}</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field-addMenuItem">
                <label htmlFor="name" className="label-addMenuItem">Name</label>
                <Field type="text" id="name" name="name" className="input-field-addMenuItem" />
                <ErrorMessage name="name" component="div" className="error-message-addMenuItem" />
              </div>
              <div className="form-field-addMenuItem">
                <label htmlFor="price" className="label-addMenuItem">Price</label>
                <Field type="text" id="price" name="price" className="input-field-addMenuItem" />
                <ErrorMessage name="price" component="div" className="error-message-addMenuItem" />
              </div>
              <div className="form-field-addMenuItem">
                <label htmlFor="category" className="label-addMenuItem">Category</label>
                <Field type="text" id="category" name="category" className="input-field-addMenuItem" />
                <ErrorMessage name="category" component="div" className="error-message-addMenuItem" />
              </div>
              <div className="form-field-addMenuItem">
                <button type="submit" className="submit-button-addMenuItem" disabled={isSubmitting}>{menuItemId ? 'Update Menu Item' : 'Add Menu Item'}</button>
                <button type="button" className="back-button-addMenuItem" onClick={() => navigate(`/menu-categories`)}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PredefinedMenuItemForm;
