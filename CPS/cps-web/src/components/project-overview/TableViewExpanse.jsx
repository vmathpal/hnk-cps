import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import LoadingSpinner from "../Loader/LoadingSpinner";
const TableViewExpanse = (props) => {
  const [expenses, setExpensesList] = useState([]);
  const [LastBudget, setTotalLastBudget] = useState(0);
  const [currentBudget, setTotalCurrentBudget] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "all-project-expenses/" +
        props.projectId,
      method: "get",
      params: {
        url: "all-project-expenses",
        userID: localStorage.getItem("authID"),
        role: localStorage.getItem("auth_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(async function (response) {
        setExpensesList(response.data.data);
        console.log(response.data.data);
        let dataLast = [];
        response.data.data.map((item) => {
          dataLast.push(item.lastProject);
        });
        const lastTotal = dataLast.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        let data = [];
        response.data.data.map((item) => {
          data.push(item.budget);
        });
        const budgetTotal = data.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        console.log("Total Budget:", budgetTotal);
        setTotalLastBudget(lastTotal);
        setTotalCurrentBudget(budgetTotal);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>error", error.response);
        setIsLoading(false);
      });
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <table className="classic stripped">
        <tbody>
          <tr>
            {/* <th>Code</th> */}
            <th>Brand</th>
            <th>Line Extension</th>
            <th>Expenses</th>
            <th>Cost Center Code</th>
            <th>SCOA</th>
            <th>Last Project ($)</th>
            <th>Budget ($)</th>
          </tr>

          {expenses.length
            ? expenses?.map((product, index) => (
                <React.Fragment key={++index}>
                  <tr>
                    <td>{product?.Brand?.name}</td>
                    <td>{product?.lineExtension?.name}</td>
                    <td>{product?.Expense?.name}</td>
                    <td>{product?.CostCenter?.centerCode}</td>
                    <td>
                      {product.Brand?.brandCode}
                      {product.lineExtension?.lineExtCode}.
                      {product.Expense?.expenseCode}
                    </td>
                    <td>
                      {product?.lastProject != null
                        ? product?.lastProject
                        : "0"}
                    </td>
                    <td>{product?.budget}</td>
                  </tr>
                </React.Fragment>
              ))
            : ""}
        </tbody>
      </table>
      <div className="calulations">
        <b>
          Total: <span className="calc">Last Project($):{LastBudget}</span>
          <span className="calc">Current Project($): {currentBudget}</span>
        </b>
      </div>
    </>
  );
};

export default TableViewExpanse;
