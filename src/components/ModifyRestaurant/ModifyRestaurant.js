import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getRestaurantById, updateRestaurantById } from '../../Data/Restaurants';
import {
  loadMenuItems,
  addMenuItem,
  updateMenuItemById,
  getMenuItemById,
  deleteMenuItemById,
} from '../../Data/MenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css'; // Import the CSS file

const ModifyRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    location: '',
    contactNumber: '',
    openingHour: '', // Separate field for opening hour
    closingHour: '', // Separate field for closing hour
    vendorId: '',
  });
  const [menuItems, setMenuItems] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    description: Yup.string().required('Description is required').max(500, 'Description is too long'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
    openingHour: Yup.string().required('Opening Hour is required'),
    closingHour: Yup.string().required('Closing Hour is required'),
    vendorId: Yup.string().required('Vendor is required')
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      const restaurant = getRestaurantById(id);
      if (restaurant) {
        setInitialValues(restaurant);
        setMenuItems(loadMenuItems(id));
      } else {
        alert('Restaurant not found');
        navigate('/restaurants');
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  const onSubmit = (values, { setSubmitting }) => {
    updateRestaurantById(id, values);
    alert('Restaurant updated successfully!');
    if (location.state && location.state.fromVendor) {
      navigate(`/vendors/edit/${location.state.vendorId}`);
    } else {
      navigate('/restaurants');
    }
    setSubmitting(false);
  };

  const handleAddMenuItem = () => {
    navigate(`/restaurants/${id}/menu-item/add`);
  };

  const handleEditMenuItem = (menuItemId) => {
    navigate(`/restaurants/${id}/menu-item/edit/${menuItemId}`);
  };

  const handleDeleteMenuItem = (menuItemId) => {
    deleteMenuItemById(id, menuItemId);
    setMenuItems(loadMenuItems(id));
  };

  const menuItemColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button onClick={() => handleEditMenuItem(params.row.id)}>Edit</button>
          <button onClick={() => handleDeleteMenuItem(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className="form-container-restaurantEdit">
      <div className="form-wrapper-restaurantEdit">
        <h2 className="form-title-restaurantEdit">Modify Restaurant</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field-restaurantEdit">
                <label htmlFor="name" className="label-restaurantEdit">Name</label>
                <Field type="text" id="name" name="name" className="input-field-restaurantEdit" />
                <ErrorMessage name="name" component="div" className="error-message-restaurantEdit" />
              </div>
              <div className="form-field-restaurantEdit">
                <label htmlFor="description" className="label-restaurantEdit">Description</label>
                <Field type="text" id="description" name="description" className="input-field-restaurantEdit" />
                <ErrorMessage name="description" component="div" className="error-message-restaurantEdit" />
              </div>
              <div className="form-field-restaurantEdit">
                <label htmlFor="location" className="label-restaurantEdit">Location</label>
                <Field type="text" id="location" name="location" className="input-field-restaurantEdit" />
                <ErrorMessage name="location" component="div" className="error-message-restaurantEdit" />
              </div>
              <div className="form-field-restaurantEdit">
                <label htmlFor="contactNumber" className="label-restaurantEdit">Contact Number</label>
                <Field type="text" id="contactNumber" name="contactNumber" className="input-field-restaurantEdit" />
                <ErrorMessage name="contactNumber" component="div" className="error-message-restaurantEdit" />
              </div>

              <div className="form-field-restaurantEdit">
                <label htmlFor="openingHour" className="label-restaurantEdit">Opening Hour</label>
                <Field as="select" id="openingHour" name="openingHour" className="input-field-restaurantEdit">
                  <option value="">Select Opening Hour</option>
                  {[...Array(24).keys()].map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                  ))}
                </Field>
                <ErrorMessage name="openingHour" component="div" className="error-message-restaurantEdit" />
              </div>
              <div className="form-field-restaurantEdit">
                <label htmlFor="closingHour" className="label-restaurantEdit">Closing Hour</label>
                <Field as="select" id="closingHour" name="closingHour" className="input-field-restaurantEdit">
                  <option value="">Select Closing Hour</option>
                  {[...Array(24).keys()].map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                  ))}
                </Field>
                <ErrorMessage name="closingHour" component="div" className="error-message-restaurantEdit" />
              </div>

              <div className="form-field-restaurantEdit">
                <label htmlFor="vendorId" className="label-restaurantEdit">Vendor</label>
                <Field type="text" id="vendorId" name="vendorId" className="input-field-restaurantEdit" disabled />
                <ErrorMessage name="vendorId" component="div" className="error-message-restaurantEdit" />
              </div>
              <div className="form-field-restaurantEdit">
                <button type="submit" className="submit-button-restaurantEdit" disabled={isSubmitting}>Update Restaurant</button>
                <button type="button" className="back-button-restaurantEdit" onClick={() => {
                  if (location.state && location.state.fromVendor) {
                    navigate(`/vendors/edit/${location.state.vendorId}`);
                  } else {
                    navigate('/restaurants');
                  }
                }}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="menu-item-section-restaurantEdit">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ flex: '1 0 auto' }}>Menu Items</h3>
          <button onClick={handleAddMenuItem}>Add Menu Item</button>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={menuItems} columns={menuItemColumns} pageSize={5} />
        </div>
      </div>
    </div>
  );
};

export default ModifyRestaurant;
