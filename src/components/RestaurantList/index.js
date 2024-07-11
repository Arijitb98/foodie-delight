import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadRestaurants, deleteRestaurantById } from '../../Data/Restaurants';
import { loadVendors } from '../../Data/Vendors';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const loadedRestaurants = loadRestaurants();
        const loadedVendors = loadVendors();

        // Wait for both data to resolve
        await Promise.all([loadedRestaurants, loadedVendors]);

        const restaurantsWithVendorEmail = loadedRestaurants.map((restaurant) => {
          const vendor = loadedVendors.find((v) => v.id == restaurant.vendorId);
          return {
            ...restaurant,
            vendorEmail: vendor ? vendor.email : 'N/A'
          };
        });

        setRestaurants(restaurantsWithVendorEmail);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Function to handle restaurant deletion
  const handleDelete = (id) => {
    deleteRestaurantById(id); // Update local storage

    // Update restaurants state after deletion
    const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    setRestaurants(updatedRestaurants);

    alert('Restaurant deleted successfully');
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'location', headerName: 'Location', width: 110 },
    { field: 'vendorEmail', headerName: 'Vendor Email', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Link to={`/restaurants/edit/${params.row.id}`} style={{ marginRight: 8 }}>Edit</Link>
          <button onClick={() => handleDelete(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];

  // Filter restaurants based on the search query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.vendorEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading indicator while data is loading
  if (loading) return <div>Loading...</div>;

  // Render error message if there was an error loading data
  if (error) return <div>Error: {error}</div>;

  // Render the component with the filtered restaurants in a data grid
  return (
    <div className="container">
      <div className="header1">
        <h1>Restaurants</h1>
        <button className="add-button" onClick={() => navigate('/restaurants/add')}>Add New Restaurant</button>
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
          rows={filteredRestaurants}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default RestaurantList;
