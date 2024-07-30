import React from 'react'
import { useEffect } from 'react';
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from '../Loader/LoadingSpinner';
const TableViewBudget = (props) => {
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
       let tAllocation = response.data?.data?.reduce(
        (totalHolder, m) => totalHolder + m.allocation,
        0
      );  
      
       setBudgetData(response.data.data)
        if (response.data.data.length) {
          const BrandID = [];
          const LineExtID = [];
          response.data.data.forEach((element) => {
            BrandID.push(element.Brand.id);
            LineExtID.push(element.lineExtension.id);
          });
          localStorage.setItem("BrandID", BrandID);
          localStorage.setItem("LineExtID", LineExtID);
        }
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
        <table className='classic stripped pro-budget-table'>
            <tbody>
                <tr>
                  <th>Brand</th>
                  <th>Line Extension</th>
                  <th>Pack Size</th>
                  <th>Pack Type</th>
                  <th>Allocation (%)</th>
                  <th>Allocation ($)</th>
                  {/* <th>Budget Ref.</th> */}
                  <th>Budget Amount (S$)</th>
                  {/* <th>FY</th>
                  <th>&nbsp;</th> */}
                </tr>
                {budgetData?.map((product, index) => (
                <React.Fragment key={++index}>
                <tr>
                <td>{product?.Brand?.name}</td>
                <td>{product?.lineExtension?.name}</td>
                <td>{product?.SKU?.name}</td>
                <td>{product?.PackType?.name}</td>
                <td>{product?.allocationPercent}</td>
                <td>{product?.allocation}</td>
                {/* <td>{(product?.budgetRef) != null?(product?.budgetRef):'-'}</td> */}
                <td>{(product?.budgetAmount) != null?(product?.budgetAmount):'-'}</td>
                {/* <td>{(product?.fy) != null ?(product?.fy):'-'}</td>
                <td><button className='table-action lime'>Budgeted</button></td> */}
                </tr></React.Fragment>
                ))}
            </tbody>
        </table>
    </>
  )
}

export default TableViewBudget


