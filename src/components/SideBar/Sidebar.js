import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/restaurants" activeClassName="active">
              Restaurant List
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendors" activeClassName="active">
              Vendors
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu-categories" activeClassName="active">
              Menu Categories
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
