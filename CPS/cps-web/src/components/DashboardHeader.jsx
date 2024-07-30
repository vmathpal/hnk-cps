import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Search from '../images/search.svg'
import Setting from '../images/setting.svg'
import Bell from '../images/bell.svg'
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const DashboardHeader = (props) => {    
    return (
        <Row className='navbar'>
        <div className='col-md-4 nav-left'>
            <h4 className="admin-name">
                Welcome! {props.adminName}
            </h4>
            <p className="designation">
                {props.designation}
            </p>
        </div>
        <div className='col-md-4 nav-middle'>
            <div className="searchbox-wrapper">
                <input type="search" name="" id="" className='admin-search' placeholder='Enter search keywords' />
                <img src={Search} alt="" />
            </div>
        </div>
        <div className='col-md-4 nav-right'>
            <NavLink to='/create-project' className='button' title='Create Project'><span>+</span> Create Project</NavLink>
            <NavLink to='/setting' className='icon setting-icon'><img src={Setting} alt="Setting Icon"></img></NavLink>
            <NavLink to='/notifications' className='icon notification-icon'><img src={Bell} alt="Bell Icon"></img></NavLink>
            <div className="profile-wrapper">
            <NavLink to='/profile' className='icon profile-img'>
                <div className="profile-image-holder">
                    {props.adminShortName}
                </div>
            </NavLink>
                <span className='dropdown-icon'></span>
                <div className="drop-down-items">
                {[''].map(
                    (variant) => (
                    <DropdownButton
                        as={ButtonGroup}
                        key={variant}
                        id={`dropdown-variants-${variant}`}
                        variant={variant.toLowerCase()}
                        title={variant}
                    >
                        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                        <Dropdown.Item eventKey="3" active>
                        Active Item
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    </DropdownButton>
                    ),
                )}
                </div>
            </div>
        </div>
        </Row>
    )
}

export default DashboardHeader

