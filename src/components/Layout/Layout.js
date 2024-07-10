import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../SideBar/Sidebar';
import './styles.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
