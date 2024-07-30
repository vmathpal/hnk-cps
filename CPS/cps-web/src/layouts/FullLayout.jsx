import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboard from './Dashboard'
import SideBar from './SideBar'
import '../App.css'

export default function FullLayout() {
  return (
      <div className="main">
        <div className="sidebar-container">
          <SideBar />
        </div>
        <div className="page">
          <Dashboard />
          <Outlet />
        </div>
      </div>
  );
}
