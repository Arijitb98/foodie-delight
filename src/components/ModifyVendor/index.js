import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getVendorById, updateVendorById } from '../../Data/Vendors';
import { loadRestaurants, deleteRestaurantById } from '../../Data/Restaurants';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css';

const ModifyVendor = () => {
  const { id } = useParams(); // Fetching parameter from URL
  const navigate = useNavigate(); // Navigation utility from React Router
  const location = useLocation(); // Location object to manage location state

  // State variables
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [restaurants, setRestaurants] = useState([]); // State for restaurants
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required')
  });

  // Effect to fetch vendor and associated restaurants on component mount
  useEffect(() => {
    const fetchVendorAndRestaurants = async () => {
      const vendor = getVendorById(id); // Fetch vendor by ID
      if (vendor) {
        setInitialValues(vendor); // Set initial form values with fetched vendor data
      } else {
        alert('Vendor not found'); // Alert if vendor is not found
        navigate('/vendors'); // Navigate back to vendors list
      }

      const allRestaurants = loadRestaurants(); // Load all restaurants
      const vendorRestaurants = allRestaurants.filter(restaurant => restaurant.vendorId == parseInt(id)); // Filter restaurants for the vendor
      setRestaurants(vendorRestaurants); // Set filtered restaurants to state
    };

    fetchVendorAndRestaurants(); // Call fetchVendorAndRestaurants function on component mount
  }, [id, navigate]);

  // Handle form submission
  const onSubmit = (values, { setSubmitting }) => {
    updateVendorById(id, values); // Update vendor with new values
    alert('Vendor updated successfully!'); // Display success message
    navigate('/vendors'); // Navigate back to vendors list
    setSubmitting(false); // Set submitting state to false
  };

  // Handle restaurant deletion
  const handleDeleteRestaurant = (restaurantId) => {
    deleteRestaurantById(restaurantId); // Delete restaurant by ID
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId)); // Update restaurants state after deletion
  };

  // Navigate to add restaurant page
  const handleAddRestaurant = () => {
    navigate('/restaurants/add', { state: { vendorId: id, returnTo: location.pathname } }); // Navigate to add restaurant page with vendor ID in state
  };

  // Columns configuration for restaurants data grid
  const restaurantColumns = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => navigate(`/restaurants/edit/${params.row.id}`, { state: { fromVendor: true, vendorId: id } })}
            style={{ marginRight: 8 }}
          >
            Edit
          </button>
          <button onClick={() => handleDeleteRestaurant(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];

  // Filter restaurants based on the search query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.contactNumber.includes(searchQuery)
  );

  // Render the modify vendor form and associated restaurants
  return (
    <div className="form-container-modifyVendor">
      <div className="form-wrapper-modifyVendor">
        <h2 className="form-title-modifyVendor">Modify Vendor</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field-modifyVendor">
                <label htmlFor="name" className="label-modifyVendor">Name</label>
                <Field type="text" id="name" name="name" className="input-field-modifyVendor" />
                <ErrorMessage name="name" component="div" className="error-message-modifyVendor" />
              </div>
              <div className="form-field-modifyVendor">
                <label htmlFor="email" className="label-modifyVendor">Email</label>
                <Field type="email" id="email" name="email" className="input-field-modifyVendor" />
                <ErrorMessage name="email" component="div" className="error-message-modifyVendor" />
              </div>
              <div className="form-field-modifyVendor">
                <label htmlFor="phoneNumber" className="label-modifyVendor">Phone Number</label>
                <Field type="text" id="phoneNumber" name="phoneNumber" className="input-field-modifyVendor" />
                <ErrorMessage name="phoneNumber" component="div" className="error-message-modifyVendor" />
              </div>
              <div className="form-field-modifyVendor">
                <button type="submit" className="submit-button-modifyVendor" disabled={isSubmitting}>Update Vendor</button>
                <button type="button" className="back-button-modifyVendor" onClick={() => navigate('/vendors')}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="form-wrapper-modifyVendor">
        <h2 className="form-title-modifyVendor">Restaurants for {initialValues.name}</h2>
        <div className="search-container-modifyVendor">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-modifyVendor"
          />
        </div>
        <div className="data-grid-container-modifyVendor">
          <DataGrid
            rows={filteredRestaurants}
            columns={restaurantColumns}
            pageSize={5}
            disableSelectionOnClick
          />
        </div>
        <div className="form-field-modifyVendor">
          <button type="button" className="add-restaurant-button-modifyVendor" onClick={handleAddRestaurant}>Add Restaurant</button>
        </div>
      </div>
    </div>
  );
};

export default ModifyVendor;
