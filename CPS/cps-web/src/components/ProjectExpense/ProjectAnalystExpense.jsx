import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";
import swal from "sweetalert";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Ilogo from "../../images/info.svg";
import CurrencyInput from "react-currency-input-field";

function ProjectAnalystExpense() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputFields, setInputFields] = useState([{}]);
  const navigate = useNavigate();
  const [Lastbugdet, setTotalLastbugdet] = useState("");
  const [currentbugdet, setTotalCurrentbugdet] = useState("");
  const [actualbugdet, setTotalActualbugdet] = useState("");
  const [varianceBugdet, setTotalVaiancebugdet] = useState("");

  const [formStatus, setFormStatus] = useState("");
  const TimeOut = () => {
    swal({
      title: "Time Out",
      text: "You have been logged out. Please log in again",
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/login");
        return;
      }
    });
  };
  useEffect(() => {
    getAllBrandSKU(localStorage.getItem("projectID"));
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
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-project-expenses/" + id,
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
    // setInputFields(dataExpense);

    let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    data[index][name] = event;
    setInputFields(data);
  };

  function refreshPage() {
    window.location.reload();
  }
  const validationSchema = Yup.object().shape({
    // brandID: Yup.string().required("required"),
  });

  const initialValues = {
    // brandID: selectedBrand,
    // projectID: localStorage.getItem("projectID"),
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
      }
      data = inputFields;
      await axios
        .post(
          process.env.REACT_APP_API_KEY +
            "expense-data-analyst/" +
            localStorage.getItem("projectID"),
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
          refreshPage();
          getAllBrandSKU(localStorage.getItem("projectID"));
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
        });
    },
  });

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
            <span>Project Expenses</span>
            <img src={Ilogo} alt="" className="ms-3" />
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
              <form onSubmit={formik.handleSubmit} id="create-course-form">
                <Table responsive className="cp-table4">
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
                      <th>Actual</th>
                      <th>Variance</th>
                      <th>Remark</th>
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
                                className="Form-control  form-control actualExpenseBudget"
                                name="actualExpenseBudget"
                                value={input.actualExpenseBudget}
                                onValueChange={(event) => {
                                  input.varianceBudget = event - input.budget;

                                  handleFormChangeExpense(
                                    index,
                                    "actualExpenseBudget",
                                    event
                                  );
                                }}
                                onKeyPress={onlyNumber}
                              />
                            </td>
                            <td>
                              <CurrencyInput
                                type="text"
                                className="Form-control  form-control actualExpenseBudget"
                                name="varianceBudget"
                                value={input.varianceBudget}
                                onValueChange={(event) => {
                                  input.budgetVolumeIncrease =
                                    input.volumeWithBudget - event;

                                  input.budgetProjectTotalIncrement =
                                    input.contributeBudget *
                                    input.budgetVolumeIncrease;

                                  handleFormChangeExpense(
                                    index,
                                    "varianceBudget",
                                    event
                                  );
                                }}
                                onKeyPress={onlyNumber}
                                disabled
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                className="Form-control expenseRemark form-control"
                                name="expenseRemark"
                                value={input.expenseRemark}
                                onChange={(event) => {
                                  handleFormChangeExpense(
                                    index,
                                    "expenseRemark",
                                    event
                                  );
                                }}
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
                <div id="grand-total">
                  <div className="d-flex align-items-center overflow-sm">
                    <span>Total:</span>
                    <div className="total-num">
                      Last Project ($):{" "}
                      {new Intl.NumberFormat("en-SG").format(Lastbugdet)}
                    </div>
                    <div className="total-num">
                      Current Project ($):
                      {new Intl.NumberFormat("en-SG").format(currentbugdet)}
                    </div>
                    <div className="total-num">
                      Actual Project ($):
                      {new Intl.NumberFormat("en-SG").format(actualbugdet)}
                    </div>
                    <div className="total-num">
                      Variance Project ($):
                      {new Intl.NumberFormat("en-SG").format(varianceBugdet)}
                    </div>
                  </div>
                </div>
                <div className="row-item">
                  <button type="submit" className="save-btn expense-btn">
                    {localStorage.getItem("isEditExpense") === "true"
                      ? "Update"
                      : "Save"}
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

export default ProjectAnalystExpense;
