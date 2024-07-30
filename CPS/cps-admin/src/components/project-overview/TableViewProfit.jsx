import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import LoadingSpinner from "../Loader/LoadingSpinner";
const TableViewProfit = (props) => {
  console.log("totalProfitProps", props.projectID);
  const [isLoading, setIsLoading] = useState(false);
  const newInitialValues = {
    lastProjectTotalProfit: null,
    lastProjectRoi: null,
    LastProjectNetContribution: null,
    LastProjectPromotionSpend: null,
    currentProjectTotalProfit: null,
    currentProjectRoi: null,
    currentProjectNetContribution: null,
    currentProjectPromotionSpend: null,
  };
  const [formValues, setFormValues] = useState(newInitialValues);
  useEffect(() => {
    getTotalProfitData(props.projectID);
  }, []);
  const getTotalProfitData = async (id) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-total-profit-data/" + id,
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async function (response) {
        console.log("TOtal Profit Data>", response.data.data);
        if (response.data.data) {
          setFormValues({
            currentProjectNetContribution:
              response.data.data.currentProjectNetContribution,
            LastProjectNetContribution:
              response.data.data.LastProjectNetContribution,
            lastProjectTotalProfit: response.data.data.lastProjectTotalProfit,
            currentProjectTotalProfit:
              response.data.data.currentProjectTotalProfit,
            lastProjectRoi: response.data.data.lastProjectRoi,
            currentProjectRoi: response.data.data.currentProjectRoi,
            currentProjectPromotionSpend:
              response.data.data.currentProjectPromotionSpend,
            LastProjectPromotionSpend:
              response.data.data.LastProjectPromotionSpend,
          });
        }
        setIsLoading(false);
      })

      .catch(function (error) {
        setIsLoading(false);
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const formatMoney = (value, currency = "SGD") => {
    const formatter = new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  };
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <table className="classic stripped">
        <thead>
          <tr>
            <th className="default">Total Profit</th>
            <th className="default">Last Project</th>
            <th className="default">Budget</th>
          </tr>
          <tr>
            <th>Total profit from promotion ($)</th>
            <th>
              {formatMoney(
                formValues.lastProjectTotalProfit
                  ? formValues.lastProjectTotalProfit
                  : 0
              )}
            </th>
            <th>
              {formatMoney(
                formValues.currentProjectTotalProfit
                  ? formValues.currentProjectTotalProfit
                  : 0
              )}
            </th>
          </tr>
          <tr>
            <td>ROI</td>
            <td>
              {formatMoney(
                formValues.lastProjectRoi ? formValues.lastProjectRoi : 0
              )}
            </td>
            <td>
              {formatMoney(
                formValues.currentProjectRoi ? formValues.currentProjectRoi : 0
              )}
            </td>
          </tr>
          <tr>
            <td>Net Contribution per hl ($)</td>
            <td>
              {formatMoney(
                formValues.LastProjectNetContribution
                  ? formValues.LastProjectNetContribution
                  : 0
              )}
            </td>
            <td>
              {formatMoney(
                formValues.currentProjectNetContribution
                  ? formValues.currentProjectNetContribution
                  : 0
              )}
            </td>
          </tr>
          <tr>
            <td>Promotion speed per hl ($)</td>
            <td>
              {formatMoney(
                formValues.LastProjectPromotionSpend
                  ? formValues.LastProjectPromotionSpend
                  : 0
              )}
            </td>
            <td>
              {formatMoney(
                formValues.currentProjectPromotionSpend
                  ? formValues.currentProjectPromotionSpend
                  : 0
              )}
            </td>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default TableViewProfit;
