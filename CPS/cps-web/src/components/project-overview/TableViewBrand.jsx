import React from 'react'
import { useEffect } from 'react';
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from '../Loader/LoadingSpinner';

const TableViewBrand = (props) => {
  const [status, setStatus] = useState("");
  const [isLoadData, setIsLoadData] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  useEffect(()=>{
    getAllBrands()
  },[])
    const getAllBrands = async () => {
      await axios({
        url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + props.projectId,
        method: "get",
        params: {
          url: "all-brand-sku",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then(function (response) {
          setBudgetData(response.data.data)
        
          setIsLoadData(false);
        })
        .catch(function (error) {
          setIsLoadData(false);
        });
        if (isLoadData) {
          return <LoadingSpinner/>;
        }
    };
  return (
    <>
      <table className='classic stripped'>
        <tbody>
            <tr>
                <th>Brand</th>
                <th>Line Extension</th>
                <th>Pack Size</th>
                <th>Pack type</th>
                <th>Category</th>
            </tr>
            {budgetData?.map((product, index) => (
            <React.Fragment key={++index}>
          <tr>
          <td>{product?.Brand?.name}</td>
          <td>{product?.lineExtension?.name}</td>
          <td>{product?.SKU?.name}</td>
          <td>{product?.PackType?.name}</td>
          <td>{product?.Category?.name}</td>
         </tr></React.Fragment>
          ))}   
        </tbody>
      </table>
    </>
  )
}

export default TableViewBrand