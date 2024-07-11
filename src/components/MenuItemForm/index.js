import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addMenuItem, getMenuItemById, updateMenuItemById, loadMenuItems } from '../../Data/MenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css';
import { loadPreDefinedMenuItems } from '../../Data/PreDefinedMenuItems';

const MenuItemForm = () => {
  const { restaurantId, menuItemId } = useParams(); // Fetch parameters from the URL
  const navigate = useNavigate(); // Navigation utility from React Router

  // State variables
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
  });
  const [preDefinedMenuItems, setPreDefinedMenuItems] = useState([]); // State for pre-defined menu items
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered pre-defined menu items
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [imagePreview, setImagePreview] = useState(
    sessionStorage.getItem(`menu-item-${menuItemId}`) || null
  ); // State for image preview

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

  // Effect to load pre-defined menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const loadedMenuItems = await loadPreDefinedMenuItems(); // Load pre-defined menu items
        setPreDefinedMenuItems(loadedMenuItems); // Set loaded menu items to state
      } catch (error) {
        console.error("Error loading menu items:", error); // Log error if fetching fails
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchMenuItems(); // Call fetchMenuItems function on component mount
  }, []);

  // Handle image change and preview
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview URL
        setFieldValue('image', file); // Set formik field value for image
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  // Effect to set initial values for editing existing menu item
  useEffect(() => {
    if (menuItemId) {
      const menuItem = getMenuItemById(restaurantId, menuItemId); // Fetch menu item by ID
      if (menuItem) {
        setInitialValues(menuItem); // Set initial form values for editing
      }
    }
  }, [menuItemId, restaurantId]);

  // Handle form submission
  const onSubmit = (values, { setSubmitting }) => {
    if (menuItemId) {
      updateMenuItemById(restaurantId, menuItemId, values); // Update existing menu item
      sessionStorage.setItem(`menu-item-${menuItemId}`, imagePreview); // Store image preview in session storage
      alert('Menu item updated successfully!'); // Display success message
    } else {
      addMenuItem(restaurantId, values); // Add new menu item
      const menuItems = loadMenuItems(restaurantId); // Load all menu items
      const id = menuItems.length ? menuItems[menuItems.length - 1].id : 1; // Generate new ID
      sessionStorage.setItem(`menu-item-${id}`, imagePreview); // Store image preview in session storage
      alert('Menu item added successfully!'); // Display success message
    }
    navigate(`/restaurants/edit/${restaurantId}`); // Navigate back to restaurant edit page
    setSubmitting(false); // Set submitting state to false
  };

  // Handle adding preset food item to menu
  const handleAddPresetFoodItem = (foodItem) => {
    const newMenuItem = {
      ...foodItem,
      restaurantId: restaurantId
    };
    addMenuItem(restaurantId, newMenuItem); // Add preset food item as new menu item
    alert(`Preset food item "${foodItem.name}" added successfully!`); // Display success message
    navigate(`/restaurants/edit/${restaurantId}`); // Navigate back to restaurant edit page
  };

  // Columns configuration for preset food items data grid
  const presetFoodColumns = [
    { field: 'name', headerName: 'Name', width: 180 },
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

  // Effect to filter preset food items based on search query
  useEffect(() => {
    if (searchQuery.trim() == '') {
      setFilteredItems(preDefinedMenuItems); // Set filtered items to all pre-defined menu items
    } else {
      const filtered = preDefinedMenuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered); // Set filtered items based on search query
    }
  }, [searchQuery, preDefinedMenuItems]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Render the form for adding/editing menu items
  return (
    <div className="form-container-addMenuItem">
      <div className="form-wrapper-addMenuItem">
        <h2 className="form-title-addMenuItem">{menuItemId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
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
                <ErrorMessage name="image" component="div" className="error-message-addMenuItem" />
                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt="Restaurant Preview" className="image-preview-restaurantEdit" />
                  </div>
                )}
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
