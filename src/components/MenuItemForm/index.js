import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addMenuItem, getMenuItemById, updateMenuItemById, loadMenuItems } from '../../Data/MenuItems';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css'; // Import the CSS file
import { loadPreDefinedMenuItems } from '../../Data/PreDefinedMenuItems'; // Adjust import as per your file structure

const MenuItemForm = () => {
  const { restaurantId, menuItemId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    category: '',
    image: null, // Initial value for the image
  });
  const [preDefinedMenuItems, setPreDefinedMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(
    sessionStorage.getItem(`menu-item-${menuItemId}`) || null
  );

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed(), // Image is not mandatory
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

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // sessionStorage.setItem(`menu-item-${menuItemId || 'new'}`, reader.result);
        setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

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
      sessionStorage.setItem(`menu-item-${menuItemId}`, imagePreview);
      alert('Menu item updated successfully!');
    } else {
      addMenuItem(restaurantId, values);
      const menuItems = loadMenuItems(restaurantId);
      const id = menuItems.length ? menuItems[menuItems.length - 1].id : 1; // Generate new id
      sessionStorage.setItem(`menu-item-${id}`, imagePreview);
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
