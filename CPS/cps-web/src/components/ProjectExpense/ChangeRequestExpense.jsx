import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";
import astick from "../../images/astick-icon.png";
import swal from "sweetalert";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Ilogo from "../../images/info.svg";
import CurrencyInput from "react-currency-input-field";

function ChangeRequestExpense(pros) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputFields, setInputFields] = useState([{}]);
  const [inputFieldsNew, setNewInputFields] = useState([{}]);
  const navigate = useNavigate();
  const [Lastbugdet, setTotalLastbugdet] = useState("");
  const [currentbugdet, setTotalCurrentbugdet] = useState("");
  const [actualbugdet, setTotalActualbugdet] = useState("");
  const [varianceBugdet, setTotalVaiancebugdet] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    getAllBrandSKU(pros.projectID);
  }, []);
  const onlyNumber = async (event) => {
    if (event.which == 46) {
      if (event.target.value.indexOf(".") === -1) {
        console.log(event.target.value);
        return true;
      } else {
        event.preventDefault();
      }
    }

    if ((event.which < 48 || event.which > 57) && event.which !== 46) {
      event.preventDefault();
    }
  };

  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "all-project-expenses/" +
        pros.projectID,
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
        if (response.data.data && response.data.data.length) {
          setFormStatus(response.data.data[0].Project.status);
        }
        setInputFields(response.data.data);

        let lastProjectAmt = response.data.data.reduce(
          (totalHolder, m) => totalHolder + parseFloat(m.lastProject),
          0
        );

        let budget = response.data.data.reduce(
          (totalHolder, m) => totalHolder + parseFloat(m.budget),
          0
        );
        let actualBudget = response.data.data.reduce(
          (totalHolder, m) => totalHolder + parseFloat(m.actualExpenseBudget),
          0
        );

        let varianceBudget = response.data.data.reduce(
          (totalHolder, m) => totalHolder + parseFloat(m.varianceBudget),
          0
        );
        setTotalLastbugdet(lastProjectAmt);
        setTotalCurrentbugdet(budget);
        setTotalActualbugdet(actualBudget);
        setTotalVaiancebugdet(varianceBudget);
        localStorage.setItem("currentBudget", budget);
        localStorage.setItem("ActualCurrentBudget", actualBudget);
        localStorage.setItem("lastBudget", lastProjectAmt);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const handleFormChangeExpense = (index, name, event) => {
    // let dataExpense = [...inputFields];
    // dataExpense[index][event.target.name] = event.target.value;
    // setNewInputFields(dataExpense);

    let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    data[index][name] = event;
    setNewInputFields(data);
    // console.log(">>>Data>>>>>>", data);
  };

  //   initialValues,
  //   validationSchema,
  //   enableReinitialize: true,
  //   //validateOnChange: true,
  //   // validateOnBlur: false,
  //   onSubmit: async (data) => {
  //     data = inputFields;
  //     console.log("data", data);
  //     return;
  //     await axios
  //       .post(
  //         process.env.REACT_APP_API_KEY +
  //           "update-project-expens/" +
  //           localStorage.getItem("projectID"),
  //         data,
  //         {
  //           headers: {
  //             "Content-type": "Application/json",
  //             Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
  //           },
  //           params: {
  //             userID: localStorage.getItem("authID"),
  //             role: localStorage.getItem("auth_role"),
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         refreshPage();
  //         getAllBrandSKU(localStorage.getItem("projectID"));
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.response.status === 422) {
  //           swal("Oops", error.response.data.message, "error");
  //         }
  //       });
  //   },
  // });

  const submitNewExpense = async (e) => {
    let data = inputFieldsNew;
    // console.log("data", data);
    // for (var i = 0; i < inputFields.length; i++) {
    //   if (
    //     (inputFields[i].newBudgetExpenses === null ||
    //       inputFields[i].newBudgetExpenses == undefined) &&
    //     pros.newPeojectAmt
    //   ) {
    //     swal("Oops", "New budget expense is required.", "error");
    //     return;
    //   }
    // }
    let totalNewExpense = data.reduce(
      (totalHolder, m) => totalHolder + parseFloat(m.newBudgetExpenses),
      0
    );
    if (totalNewExpense > pros.newPeojectAmt) {
      // swal("Oops", "New expense total budget can't exceed.", "error");
      return;
    }
    e.preventDefault();
    setIsSubmit(true);
    setIsLoading(true);
    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "update-project-new-expense/" +
          pros.projectID,
        data,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
          },
        }
      )
      .then((res) => {
        // if (res.status === 200) {
        //   swal({
        //     title: "Success!",
        //     text: "Data Saved",
        //     icon: "success",
        //     button: "Okay",
        //   });
        // }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });
  };

  if (isLoading) {
    return (
      <div>
        <h4 style={{ color: "green" }}>Loading....</h4>
      </div>
    );
  }
  return (
    <>
      <div className="accordion-item third-acc">
        <h2 className="accordion-header" id="headingOneTwo">
          <div className="accordian-head-first">
            <img src={astick} alt="" className="mr-1" />
            <span>Project Expenses</span>
            <img src={Ilogo} alt="" className="ms-2" />
          </div>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne3"
            aria-expanded="true"
            aria-controls="collapseOne"
          ></button>
        </h2>
        <div
          id="collapseOne3"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOneTwo"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="table-responsive-md">
              <form onSubmit={submitNewExpense} id="create-course-form">
                <Table className="cp-table4">
                  {inputFields.length > 0 && (
                    <tr>
                      <th>Brand Code + LineExtension Code + Expense Code</th>
                      <th>Brand</th>
                      <th>Line Extension</th>
                      <th>Expenses</th>
                      <th>Cost Center Code</th>
                      <th>SCOA</th>
                      <th>Last Project ($)</th>
                      <th>Budget ($)</th>
                      <th>New Budget($)</th>
                    </tr>
                  )}

                  {inputFields ? (
                    inputFields.map((input, index) => (
                      <>
                        {" "}
                        <React.Fragment key={index}>
                          {/* <Table responsive className="cp-table" key={index}> */}
                          <tr>
                            <td>
                              {input.Brand ? input.Brand.brandCode : ""} +
                              {input.lineExtension
                                ? input.lineExtension.lineExtCode
                                : ""}
                              +{input.Expense ? input.Expense.expenseCode : ""}
                            </td>
                            <td>{input.Brand ? input.Brand.name : ""}</td>
                            <td>
                              {input.lineExtension
                                ? input.lineExtension.name
                                : ""}
                            </td>
                            <td>
                              {input.Expense ? input.Expense.description : ""}
                            </td>
                            <td>
                              {input.CostCenter
                                ? input.CostCenter.centerCode
                                : ""}
                            </td>
                            <td>
                              {input.Brand ? input.Brand.brandCode : ""}
                              {input.lineExtension
                                ? input.lineExtension.lineExtCode
                                : ""}
                              .{input.Expense ? input.Expense.expenseCode : ""}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-SG").format(
                                input.lastProject
                              )}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-SG").format(
                                input.budget
                              )}
                            </td>

                            <td>
                              <CurrencyInput
                                type="text"
                                className="form-control Form-control actualExpenseBudget"
                                name="newBudgetExpenses"
                                value={input.newBudgetExpenses}
                                onValueChange={(event) => {
                                  handleFormChangeExpense(
                                    index,
                                    "newBudgetExpenses",
                                    event
                                  );
                                }}
                                // onChange={(event) => {
                                //   // input.varianceBudget =
                                //   //   event.target.value - input.budget;

                                //   handleFormChangeExpense(index, event);
                                // }}
                                onKeyPress={onlyNumber}
                              />
                            </td>
                          </tr>
                          {/* </Table> */}
                        </React.Fragment>
                      </>
                    ))
                  ) : (
                    <span></span>
                  )}
                </Table>

                <div className="row-item">
                  {/* <NavLink
                    type="button"
                    className="next-btn mx-3"
                    to={{
                      pathname: "/my-projects",
                    }}
                  >
                    Go Back
                  </NavLink> */}
                  <button
                    type="button"
                    id="SaveExpense"
                    className="save-btn expense-btn mt-2"
                    onClick={submitNewExpense}
                    hidden
                  >
                    {localStorage.getItem("isEditExpense") === "true"
                      ? "Update"
                      : "Save Expense"}
                  </button>
                </div>

                {/* shortcode */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeRequestExpense;
