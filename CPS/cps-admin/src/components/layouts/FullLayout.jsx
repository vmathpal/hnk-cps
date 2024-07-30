import React from 'react'
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

export default function FullLayout() {
  return (
    <div className="app align-content-stretch d-flex flex-wrap">
      <SideBar/>
      
      <div className="app-container app-content">
      <Outlet />
      </div>
    
    </div>
  )
}
