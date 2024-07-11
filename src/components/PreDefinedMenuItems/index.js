import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addPreDefinedMenuItems, getPreDefinedMenuItemsById, updatePreDefinedMenuItemsById, loadPreDefinedMenuItems } from '../../Data/PreDefinedMenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css'; // Import the CSS file

const PredefinedMenuItemForm = () => {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: '',
    image: null, // Initial value for the image
  });

  const [imagePreview, setImagePreview] = useState(
    sessionStorage.getItem(`preset-menu-item-${menuItemId}`) || null
  );

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed(), // Image is not mandatory
  });

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // sessionStorage.setItem(`menu-item-${menuItemId || 'new'}`, reader.result);
        setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (menuItemId) {
      const menuItem = getPreDefinedMenuItemsById(menuItemId);
      if (menuItem) {
        setInitialValues(menuItem);
      }
    }
  }, [menuItemId]);

  const onSubmit = (values, { setSubmitting }) => {
    if (menuItemId) {
      updatePreDefinedMenuItemsById(menuItemId, values);
      sessionStorage.setItem(`preset-menu-item-${menuItemId}`, imagePreview);
      alert('Menu item updated successfully!');
    } else {
      addPreDefinedMenuItems(values);
      const PreDefinedMenuItems = loadPreDefinedMenuItems();
      const idNew = PreDefinedMenuItems.length ? PreDefinedMenuItems[PreDefinedMenuItems.length - 1].id : 1; // Generate new id
      sessionStorage.setItem(`preset-menu-item-${idNew}`, imagePreview);
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
          {({ isSubmitting, setFieldValue }) => (
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
              <div className="form-field-restaurantEdit">
                <label htmlFor="image" className="label-restaurantEdit">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="input-field-restaurantEdit"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt="Restaurant Preview" className="image-preview-restaurantEdit" />
                  </div>
                )}
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
