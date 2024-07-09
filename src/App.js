import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddRestaurant from './components/AddRestaurant/AddRestaurant';
import RestaurantList from './components/RestaurantList/RestaurantList';
import ModifyRestaurant from './components/ModifyRestaurant/ModifyRestaurant';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/restaurants/add" element={<AddRestaurant />} />
          <Route path="/restaurants/edit/:id" element={<ModifyRestaurant />} />
          <Route path="/restaurants" element={<RestaurantList />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;