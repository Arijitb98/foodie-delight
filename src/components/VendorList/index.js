import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { loadVendors, deleteVendorById } from '../../Data/Vendors';
import { loadRestaurants } from '../../Data/Restaurants';
import './styles.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load vendors and restaurants from local storage or initial mock data
    setVendors(loadVendors());
    setRestaurants(loadRestaurants());
    setLoading(false);
  }, []);

  // Calculate the number of restaurants owned by each vendor
  const vendorsWithRestaurantCount = vendors.map((vendor) => {
    const restaurantCount = restaurants.filter((restaurant) => restaurant.vendorId == vendor.id).length;
    return { ...vendor, restaurantCount };
  });

  // Function to handle vendor deletion
  const handleDeleteVendor = (id) => {
    deleteVendorById(id);
    // Reload vendors after deletion
    setVendors(loadVendors());
    alert('Vendor deleted successfully');
  };

  // Columns configuration for the DataGrid component
  const columns = [
    // { field: 'id', headerName: 'ID', width: 40 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'restaurantCount', headerName: 'Number of Restaurants', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        // Custom rendering for Actions column with Edit and Delete buttons
        <>
          <Link to={`/vendors/edit/${params.row.id}`} style={{ marginRight: 8 }}>Edit</Link>
          <button onClick={() => handleDeleteVendor(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];

  // Filter vendors based on the search query
  const filteredVendors = vendorsWithRestaurantCount.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="header1">
        <h1>Vendors</h1>
        <button className="add-button" onClick={() => navigate('/vendors/add')}>Add Vendor</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="data-grid-container">
        <DataGrid
          rows={filteredVendors}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default VendorList;
