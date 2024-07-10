import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addMenuItem, getMenuItemById, updateMenuItemById } from '../../Data/MenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css'; // Import the CSS file
import { loadPreDefinedMenuItems } from '../../Data/PreDefinedMenuItems'; // Adjust import as per your file structure

const MenuItemForm = () => {
  const { restaurantId, menuItemId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: ''
  });
  const [preDefinedMenuItems, setPreDefinedMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required')
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const loadedMenuItems = await loadPreDefinedMenuItems(); // Ensure this function correctly loads data
        setPreDefinedMenuItems(loadedMenuItems);
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItemId) {
      const menuItem = getMenuItemById(restaurantId, menuItemId);
      if (menuItem) {
        setInitialValues(menuItem);
      }
    }
  }, [menuItemId, restaurantId]);

  const onSubmit = (values, { setSubmitting }) => {
    if (menuItemId) {
      updateMenuItemById(restaurantId, menuItemId, values);
      alert('Menu item updated successfully!');
    } else {
      addMenuItem(restaurantId, values);
      alert('Menu item added successfully!');
    }
    navigate(`/restaurants/edit/${restaurantId}`);
    setSubmitting(false);
  };

  const handleAddPresetFoodItem = (foodItem) => {
    const newMenuItem = {
      ...foodItem,
      restaurantId: restaurantId
    };
    addMenuItem(restaurantId, newMenuItem);
    alert(`Preset food item "${foodItem.name}" added successfully!`);
    navigate(`/restaurants/edit/${restaurantId}`);
  };

  const presetFoodColumns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleAddPresetFoodItem(params.row)}
          className="add-preset-button"
        >
          Add
        </button>
      ),
    },
  ];

  useEffect(() => {
    // Filter preset food items based on search query
    if (searchQuery.trim() === '') {
      setFilteredItems(preDefinedMenuItems);
    } else {
      const filtered = preDefinedMenuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, preDefinedMenuItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="form-container-addMenuItem">
      <div className="form-wrapper-addMenuItem">
        <h2 className="form-title-addMenuItem">{menuItemId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
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
                <button type="button" className="back-button-addMenuItem" onClick={() => navigate(`/restaurants/edit/${restaurantId}`)}>Back</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {!menuItemId && (
        <div className="preset-food-items-wrapper">
          <h2 className="preset-food-items-title">Preset Food Items</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search preset food items"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="data-grid-container-addMenuItem">
            <DataGrid
              rows={filteredItems}
              columns={presetFoodColumns}
              pageSize={5}
              disableSelectionOnClick
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemForm;
