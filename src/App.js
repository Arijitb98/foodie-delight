import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddRestaurant from './components/AddRestaurant/AddRestaurant';
import RestaurantList from './components/RestaurantList/RestaurantList';
import ModifyRestaurant from './components/ModifyRestaurant/ModifyRestaurant';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Layout from './components/Layout/Layout';
import Vendors from './components/Vendors/VendorList';
import AddVendor from './components/AddVendor/AddVendor';
import ModifyVendor from './components/ModifyVendor/ModifyVendor';
import MenuCategories from './components/MenuCategories/MenuCategories';
import AddMenuItem from './components/AddMenuItem/AddMenuItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="restaurants/add" element={<AddRestaurant />} />
            <Route path="restaurants/edit/:id" element={<ModifyRestaurant />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:restaurantId/menu-item/add" element={<AddMenuItem />} />
            <Route path="/restaurants/:restaurantId/menu-item/edit/:menuItemId" element={<AddMenuItem />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/add" element={<AddVendor />} />
            <Route path="vendors/edit/:id" element={<ModifyVendor />} />
            <Route path="menu-categories" element={<MenuCategories />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
