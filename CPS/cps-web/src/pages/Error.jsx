import React from 'react'
import { NavLink } from 'react-router-dom'

const Error = () => {
  return (
    <>
    <div className="main-container">
    <div className="contents">
      <h1>4<span>0</span>4</h1>
      <p>Sorry, page not found !</p>
      <NavLink to="/overview">
        Go back to Home Page</NavLink>
    </div>
    </div>
    </>
  )
}

export default Error