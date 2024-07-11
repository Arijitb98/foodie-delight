import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { addRestaurant, getRestaurantById, updateRestaurantById, loadRestaurants } from '../../Data/Restaurants';
import {
  loadMenuItems,
  addMenuItem,
  updateMenuItemById,
  getMenuItemById,
  deleteMenuItemById,
} from '../../Data/MenuItems';
import { DataGrid } from '@mui/x-data-grid';
import { loadVendors } from '../../Data/Vendors';
import './styles.css';

const RestaurantForm = () => {
  const { id } = useParams(); // Get id from URL params
  const navigate = useNavigate(); // Navigation utility from React Router
  const location = useLocation(); // Location object to access state
  const vendors = loadVendors(); // Load vendors from data source
  const { vendorId } = location.state || {}; // Get vendorId from location state if present
  const [imagePreview, setImagePreview] = useState(
    sessionStorage.getItem(`restaurant-image-${id}`) || null
  );

  // Form initial values and state management
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    location: '',
    contactNumber: '',
    openingHour: '',
    closingHour: '',
    vendorId: vendorId || '',
    image: null,
  });

  // State for menu items, search query, loading indicators
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // State for initial loading
  const [formSubmitting, setFormSubmitting] = useState(false); // State for form submission

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    description: Yup.string().required('Description is required').max(500, 'Description is too long'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
    openingHour: Yup.string().required('Opening Hour is required'),
    closingHour: Yup.string().required('Closing Hour is required'),
    vendorId: Yup.string().required('Vendor is required'),
  });

  // Fetch initial data for existing restaurant when id changes
  useEffect(() => {
    if (id) {
      const restaurant = getRestaurantById(id); // Get restaurant by id
      if (restaurant) {
        setInitialValues(restaurant); // Set initial form values
        setMenuItems(loadMenuItems(id)); // Load menu items for the restaurant
      } else {
        alert('Restaurant not found'); // Alert if restaurant not found
        navigate('/restaurants'); // Redirect to restaurants page
      }
    }
    setLoading(false); // Set loading to false after initial data fetch (simulated)
  }, [id, navigate]);

  // Handle image file selection and preview
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 600 * 1024) {
        // Display an error message or take appropriate action
        alert('Image size is too large. Please select an image smaller than 600KB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = (values, { setSubmitting }) => {
    setFormSubmitting(true); // Start form submission loader

    // Simulate async operation (e.g., API call)
    setTimeout(() => {
      if (id) {
        updateRestaurantById(id, values); // Update existing restaurant
        if (values.image) {
          sessionStorage.setItem(`restaurant-image-${id}`, imagePreview); // Store image in session storage if image is provided
        }
        alert('Restaurant updated successfully!'); // Alert on successful update
      } else {
        addRestaurant(values); // Add new restaurant
        const restaurants = loadRestaurants();
        const maxId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) : 0;
        const idNew = maxId;
        if (values.image) {
          sessionStorage.setItem(`restaurant-image-${idNew}`, imagePreview); // Store image for new restaurant if image is provided
        }
        alert('Restaurant added successfully!'); // Alert on successful addition
      }

      // Redirect based on navigation state
      if (location.state && location.state.fromVendor) {
        navigate(`/vendors/edit/${location.state.vendorId}`);
      } else {
        navigate('/restaurants');
      }

      setFormSubmitting(false); // Stop form submission loader
      setSubmitting(false); // Set Formik submitting to false
    }, 1000); // Simulated delay for 1 second
  };

  // Navigation functions for menu items
  const handleAddMenuItem = () => {
    navigate(`/restaurants/${id}/menu-item/add`);
  };

  const handleEditMenuItem = (menuItemId) => {
    navigate(`/restaurants/${id}/menu-item/edit/${menuItemId}`);
  };

  const handleDeleteMenuItem = (menuItemId) => {
    deleteMenuItemById(id, menuItemId); // Delete menu item
    setMenuItems(loadMenuItems(id)); // Reload menu items
  };

  // Columns configuration for menu item data grid
  const menuItemColumns = [
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

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((menuItem) =>
    menuItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menuItem.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading indicator while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render form with Formik for restaurant details and menu items
  return (
    <div className="form-container-restaurantEdit">
      <div className="form-wrapper-restaurantEdit">
        <h2 className="form-title-restaurantEdit">{id ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting, setFieldValue }) => (
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
                <Field
                  as="select"
                  id="vendorId"
                  name="vendorId"
                  className="input-field-restaurantEdit"
                  disabled={!!vendorId} // Disable when vendorId is present
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="vendorId" component="div" className="error-message-restaurantEdit" />
              </div>

              <div className="form-field-restaurantEdit">
                <label htmlFor="image" className="label-restaurantEdit">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="input-field-restaurantEdit"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                <ErrorMessage name="image" component="div" className="error-message-addMenuItem" />
                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt="Restaurant Preview" className="image-preview-restaurantEdit" />
                  </div>
                )}
              </div>

              <div className="form-field-restaurantEdit">
                <button type="submit" className="submit-button-restaurantEdit" disabled={isSubmitting || formSubmitting}>
                  {formSubmitting ? <CircularProgress size={24} /> : (id ? 'Update restaurant' : 'Add restaurant')}
                </button>
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
      {id ? <div className="menu-item-section-restaurantEdit">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ flex: '1 0 auto' }}>Menu Items</h3>
          <button onClick={handleAddMenuItem} className="menu-item-button-restaurantEdit">Add Menu Item</button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={filteredMenuItems} columns={menuItemColumns} pageSize={5} />
        </div>
      </div>
        : <></>}
    </div>
  );
};

export default RestaurantForm;
