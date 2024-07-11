import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addPreDefinedMenuItems, getPreDefinedMenuItemsById, updatePreDefinedMenuItemsById, loadPreDefinedMenuItems } from '../../Data/PreDefinedMenuItems';
import CircularProgress from '@mui/material/CircularProgress';
import './styles.css';

const PredefinedMenuItemForm = () => {
  const { menuItemId } = useParams(); // Fetching parameter from URL
  const navigate = useNavigate(); // Navigation utility from React Router

  // State variables
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(
    sessionStorage.getItem(`preset-menu-item-${menuItemId}`) || null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed().test('fileSize', 'Image size is too large, Should be less than 600KB', (value) => {
      if (!value) return true; // No image selected is valid
      return value.size <= 600 * 1024; // 600KB limit (600 * 1024 bytes)
    }).test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true; // No image selected is valid
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }),
  });

  // Function to handle image preview and set form field value
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Effect to fetch initial values when editing a menu item
  useEffect(() => {
    if (menuItemId) {
      const menuItem = getPreDefinedMenuItemsById(menuItemId); // Fetch menu item by ID
      if (menuItem) {
        setInitialValues(menuItem); // Set initial form values with fetched menu item data
      }
    }
  }, [menuItemId]);

  // Function to handle form submission
  const onSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true); // Set loading state to true
    try {
      if (menuItemId) {
        await updatePreDefinedMenuItemsById(menuItemId, values); // Update existing menu item
        sessionStorage.setItem(`preset-menu-item-${menuItemId}`, imagePreview); // Store image preview in session storage
        alert('Menu item updated successfully!'); // Display success message
      } else {
        await addPreDefinedMenuItems(values); // Add new menu item
        const PreDefinedMenuItems = loadPreDefinedMenuItems(); // Load all predefined menu items
        const idNew = PreDefinedMenuItems.length ? PreDefinedMenuItems[PreDefinedMenuItems.length - 1].id : 1; // Generate new ID
        sessionStorage.setItem(`preset-menu-item-${idNew}`, imagePreview); // Store image preview in session storage
        alert('Menu item added successfully!'); // Display success message
      }
      navigate(`/menu-categories`); // Navigate to menu categories page after submission
    } catch (error) {
      console.error('Error:', error); // Log error if submission fails
      alert('Failed to save menu item. Please try again later.'); // Display error message
    } finally {
      setIsLoading(false); // Set loading state to false
      setSubmitting(false); // Set submitting state to false
    }
  };

  // Render the form for adding or editing menu items
  return (
    <div className="form-container-addMenuItem">
      <div className="form-wrapper-addMenuItem">
        <h2 className="form-title-addMenuItem">{menuItemId ? 'Edit Default Menu Item' : 'Add Menu Item'}</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              {isLoading && <CircularProgress />}

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
                <ErrorMessage name="image" component="div" className="error-message-addMenuItem" />
                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt="Restaurant Preview" className="image-preview-restaurantEdit" />
                  </div>
                )}
              </div>
              <div className="form-field-addMenuItem">
                <button type="submit" className="submit-button-addMenuItem" disabled={isSubmitting}>
                  {menuItemId ? 'Update Menu Item' : 'Add Menu Item'}
                </button>
                <button type="button" className="back-button-addMenuItem" onClick={() => navigate(`/menu-categories`)}>
                  Back
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PredefinedMenuItemForm;
