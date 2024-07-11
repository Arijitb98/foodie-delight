import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import {
  loadPreDefinedMenuItems,
  deletePreDefinedMenuItemsById
} from '../../Data/PreDefinedMenuItems';
import './styles.css';

const PreDefinedMenuItems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [preDefinedMenuItems, setPreDefinedMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Effect to load menu items when component mounts
  useEffect(() => {
    const loadedMenuItems = loadPreDefinedMenuItems(); // Load predefined menu items
    setPreDefinedMenuItems(loadedMenuItems); // Set loaded items to state
    setLoading(false); // Update loading state once items are loaded
  }, []);

  // Function to handle menu item deletion
  const handleDeleteMenuItem = (id) => {
    deletePreDefinedMenuItemsById(id); // Delete item from storage or API
    // Filter out the deleted item from state
    const updatedMenuItems = preDefinedMenuItems.filter(item => item.id !== id);
    setPreDefinedMenuItems(updatedMenuItems); // Update state with filtered items
    alert('Menu item deleted successfully'); // Display deletion success message
  };

  // Function to navigate to add menu item page
  const handleAddMenuItem = () => {
    navigate(`/default-menu-items/add`);
  };

  // Columns configuration for the data grid
  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Link to={`/default-menu-items/edit/${params.row.id}`} style={{ marginRight: 8 }}>Edit</Link>
          <button onClick={() => handleDeleteMenuItem(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];

  // Filter menu items based on the search query
  const filteredMenuItems = preDefinedMenuItems.filter((menuItem) =>
    menuItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menuItem.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading indicator while data is loading
  if (loading) return <div>Loading...</div>;

  // Render the component with the filtered menu items in a data grid
  return (
    <div className="container">
      <div className="header1">
        <h1>Preset Menu Items</h1>
        <button onClick={handleAddMenuItem} className="menu-item-button-restaurantEdit">Add Menu Item</button>

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
          rows={filteredMenuItems}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default PreDefinedMenuItems;
