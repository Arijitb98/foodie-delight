import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RestaurantList from './components/RestaurantList/index';
import RestaurantForm from './components/ManageRestaurant/index';
import Login from './components/Login/index';
import PrivateRoute from './services/PrivateRoute/PrivateRoute';
import Layout from './services/Layout/Layout';
import Vendors from './components/VendorList/index';
import AddVendor from './components/ManageVendors/index';
import ModifyVendor from './components/ModifyVendor/index';
import PreDefinedMenuItems from './components/PreDefinedMenuItems/MenuItems';
import MenuItemForm from './components/MenuItemForm/index';
import PredefinedMenuItemForm from './components/PreDefinedMenuItems/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/restaurants" />} />
            <Route path="restaurants/add" element={<RestaurantForm />} />
            <Route path="restaurants/edit/:id" element={<RestaurantForm />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:restaurantId/menu-item/add" element={<MenuItemForm />} />
            <Route path="/restaurants/:restaurantId/menu-item/edit/:menuItemId" element={<MenuItemForm />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/add" element={<AddVendor />} />
            <Route path="vendors/edit/:id" element={<ModifyVendor />} />
            <Route path="menu-categories" element={<PreDefinedMenuItems />} />
            <Route path="/default-menu-items/edit/:menuItemId" element={<PredefinedMenuItemForm />} />
            <Route path="/default-menu-items/add" element={<PredefinedMenuItemForm />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
