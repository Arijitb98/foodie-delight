import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getVendorById, updateVendorById } from '../../Data/Vendors';
import { loadRestaurants, deleteRestaurantById } from '../../Data/Restaurants';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css';

const ModifyVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').max(100, 'Name is too long'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required')
  });

  useEffect(() => {
    const fetchVendorAndRestaurants = async () => {
      const vendor = getVendorById(id);
      if (vendor) {
        setInitialValues(vendor);
      } else {
        alert('Vendor not found');
        navigate('/vendors');
      }

      const allRestaurants = loadRestaurants();
      const vendorRestaurants = allRestaurants.filter(restaurant => restaurant.vendorId == parseInt(id));
      setRestaurants(vendorRestaurants);
    };

    fetchVendorAndRestaurants();
  }, [id, navigate]);

  const onSubmit = (values, { setSubmitting }) => {
    updateVendorById(id, values);
    alert('Vendor updated successfully!');
    navigate('/vendors');
    setSubmitting(false);
  };

  const handleDeleteRestaurant = (restaurantId) => {
    deleteRestaurantById(restaurantId);
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
  };

  const handleAddRestaurant = () => {
    navigate('/restaurants/add', { state: { vendorId: id, returnTo: location.pathname } });
  };

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
