import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";
import swal from "sweetalert";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Ilogo from "../../Assests/images/info.svg";
import Binimg from "../../Assests/images/bin.svg";
import Editimg from "../../Assests/images/edit.svg";
import CurrencyInput from "react-currency-input-field";
function ProjectExpense() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [brands, setBrands] = useState([]);
  const [lineExts, setLineExt] = useState([]);
  const [costcenters, setCostCenter] = useState([]);
  const [expenses, setExpense] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedluneExt, setSelectedLineExt] = useState("");
  const [selectedCost, setSelectedCost] = useState("");
  const [selectedExpense, setSelectedExpense] = useState("");
  const [editID, setSetEditID] = useState("");
  const [skus, setSKU] = useState([]);
  const navigate = useNavigate();
  const [todos, setExpensesList] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [Lastbugdet, setTotalLastbugdet] = useState("");
  const [currentbugdet, setTotalCurrentbugdet] = useState("");
  const [inputs, setInputs] = useState({});
  useEffect(() => {
    getBrands();
    getCostCenter();
    getExpenseList();
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
  // const Total = (todos) => {
  //   // const numbers = props.budget;
  //   let lastProjectAmount;
  //   let budgetAmount;
  //   console.log("ddnumbers", budgetAmount);
  //   // if (todos[0].id > 0) {
  //   lastProjectAmount = todos.reduce(
  //     (totalHolder, m) => totalHolder + m.lastProject,
  //     0
  //   );
  //   budgetAmount = todos.reduce((totalHolder, m) => totalHolder + m.budget, 0);
  //   // }

  // return (
  //   <>
  //     <div id="grand-total">
  //       <div className="d-flex align-items-center overflow-sm">
  //         <span>Total:</span>
  //         <div className="total-num">
  //           Last Project ($): {lastProjectAmount}
  //         </div>
  //         <div className="total-num">Current Project ($):{budgetAmount}</div>
  //       </div>
  //     </div>
  //   </>
  // );
  // };

  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "all-project-expenses/" + id,
      method: "get",
      params: {
        url: "all-project-expenses",
        userID: localStorage.getItem("authID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log(">>>Data", response.data.data);
        setExpensesList(response.data.data);
        localStorage.setItem("isEditExpense", "false");
        let lastProjectAmt = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.lastProject,
          0
        );
        let budget = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.budget,
          0
        );
        setTotalLastbugdet(lastProjectAmt);
        setTotalCurrentbugdet(budget);
        localStorage.setItem("currentBudget", budget);
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

  const getCostCenter = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-cost-center", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          url: "get-cost-center",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("user_role"),
          department: localStorage.getItem("projectDepartment"),
        },
      })
      .then(function (response) {
        setCostCenter(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getExpenseList = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-expense-lists", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          url: "cost-center-management",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("user_role"),
        },
      })
      .then(function (response) {
        setExpense(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getAllLineExtension = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "brand-based-line-extension/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          url: "line-extension",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("user_role"),
        },
      })
      .then((response) => {
        if (response.data.data.length <= 0) {
          setLineExt("");
        }
        setLineExt(response.data.data);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  // const getAllBrandSKU = async (id) => {
  //   setIsLoading(true);
  //   axios({
  //     url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + id,
  //     method: "get",
  //     params: {
  //       url: "all-brand-sku",
  //       userID: localStorage.getItem("authID"),
  //       role: localStorage.getItem("user_role"),
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then(function (response) {
  //       console.log(">>>>>>Data Expense", response.data.data);
  //       setIsLoading(false);
  //       setExpensesList(response.data.data);
  //     })
  //     .catch(function (error) {
  //       if (error.response.status === 401) {
  //         localStorage.clear();
  //         navigate("/sign-in");
  //       }
  //       console.log(">>>>>>>>>>>error", error.response);
  //     });
  // };

  // function to handle when the "Edit" button is clicked
  const handleEditClick = async (id) => {
    setIsEditing(true);
    localStorage.setItem("isEditExpense", "true");
    setSetEditID(id);
    //setIsLoadData(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "show-project-expense/" + id)
      .then((res) => {
        localStorage.setItem("admin-brand-expense", res.data.data.Brand.name);
        localStorage.setItem(
          "admin-cost-expense",
          res.data.data.CostCenter.name
        );
        localStorage.setItem(
          "admin-brand-line-ext",
          res.data.data.lineExtension.name
        );
        localStorage.setItem("admin-expense-name", res.data.data.Expense.name);
        getBrands();
        handleBrand(res.data.data.Brand.id);
        // getAllLineExtension(res.data.data.Brand.id);
        handleCostCenter(res.data.data.CostCenter.id);
        handleExpense(res.data.data.Expense.id);
        handleLineExt(res.data.data.lineExtension.id);
        setInputs({
          // scoa: res.data.data.scoa,
          lastProject: res.data.data.lastProject,
          budget: res.data.data.budget,
          // expense: res.data.data.expenses,
        });

        getCostCenter();
        getExpenseList();
        // setIsLoadData(false);
      })
      .catch((error) => {
        setIsLoadData(false);

        console.log("error>>>>>", error.message);
      });
  };

  function handleDeleteClick(id) {
    axios
      .delete(process.env.REACT_APP_API_KEY + "delete-project-expense/" + id)
      .then((res) => {
        getAllBrandSKU(localStorage.getItem("projectID"));
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  }

  const getBrands = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-brands-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          url: "brand-management",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("user_role"),
        },
      })
      .then(function (response) {
        setBrands(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const handleBrand = async (e) => {
    let id =
      localStorage.getItem("isEditExpense") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    getAllLineExtension(id);
    setSelectedBrand(id);
  };

  const handleLineExt = async (e) => {
    let id =
      localStorage.getItem("isEditExpense") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }

    setSelectedLineExt(id);
  };

  const handleCostCenter = async (e) => {
    let id =
      localStorage.getItem("isEditExpense") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedCost(id);
  };

  const handleExpense = async (e) => {
    let id =
      localStorage.getItem("isEditExpense") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedExpense(id);
  };
  const validationSchema = Yup.object().shape({
    brandID: Yup.string().required("required"),
    //lineExtID: Yup.string().required("required"),
    // costCenterID: Yup.string().required("required"),
    // scoa: Yup.string().required("required"),
    expenseID: Yup.string().required("required"),
    // lastProject: Yup.string().required("required"),
    budget: Yup.string().required("required"),
  });

  let url =
    localStorage.getItem("isEditExpense") === "true"
      ? "update-project-expens/" + editID
      : "create-project-expense";

  const initialValues = {
    brandID: selectedBrand,
    lineExtID: selectedluneExt,
    costCenterID: selectedCost,
    // scoa: isEditing ? inputs.scoa : "",
    expenseID: selectedExpense,
    lastProject: isEditing ? inputs.lastProject : "",
    budget: isEditing ? inputs.budget : "",
    projectID: localStorage.getItem("projectID"),
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsEditing(false);
      localStorage.setItem("isEditExpense", "false");
      await axios
        .post(process.env.REACT_APP_API_KEY + url, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: "draft",
            projectID: localStorage.getItem("projectID"),
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("user_role"),
          },
        })
        .then((res) => {
          getAllBrandSKU(localStorage.getItem("projectID"));
          setSelectedBrand("");
          setSelectedCost("");
          setSelectedExpense("");
          setSelectedLineExt("");
          window.localStorage.removeItem("admin-brand-expense");
          window.localStorage.removeItem("admin-cost-expense");
          window.localStorage.removeItem("admin-brand-line-ext");
          window.localStorage.removeItem("admin-expense-name");
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
        });

      console.log(data);
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
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <span>Project Expenses</span>
            <img src={Ilogo} alt="" className="ms-3" />
          </div>
          <button
            class="accordion-button"
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
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <div className="table-responsive-md">
              <form onSubmit={formik.handleSubmit} id="create-course-form">
                <Table responsive className="cp-table4">
                  {todos.length > 0 && (
                    <tr>
                      <th>Brand Code + LineExtension Code + Expense Code</th>
                      <th>Brand</th>
                      <th>Line Extension</th>
                      <th>Expenses</th>
                      <th>Cost Center Code</th>
                      <th>SCOA</th>
                      <th>Last Project ($)</th>
                      <th>Budget ($)</th>
                      <th></th>
                    </tr>
                  )}

                  {todos.length > 0 ? (
                    todos.map((todo, index) => (
                      <React.Fragment key={++index}>
                        <tr>
                          <td>
                            {todo.Brand?.brandCode} +
                            {todo.lineExtension?.lineExtCode}+
                            {todo.Expense?.expenseCode}
                          </td>
                          <td>{todo.Brand?.name}</td>
                          <td>{todo.lineExtension?.name}</td>
                          <td>{todo.Expense?.description}</td>
                          <td>{todo.CostCenter?.centerCode}</td>
                          <td>
                            {todo.Brand?.brandCode}
                            {todo.lineExtension?.lineExtCode}.
                            {todo.Expense?.expenseCode}
                          </td>
                          <td>
                            {new Intl.NumberFormat("en-SG").format(
                              todo.lastProject
                            )}
                          </td>
                          <td>
                            {new Intl.NumberFormat("en-SG").format(todo.budget)}
                          </td>
                          {todo.Project?.ChangeStatus === "rejected" ||
                          todo.Project?.ChangeStatus === "pending" ? (
                            <td>
                              {new Intl.NumberFormat("en-SG").format(
                                todo.newBudgetExpenses
                              )}
                            </td>
                          ) : (
                            ""
                          )}
                          {localStorage.getItem("action") !== "view" ? (
                            <td class="icon-td">
                              <img
                                src={Binimg}
                                alt=""
                                onClick={() => handleDeleteClick(todo.id)}
                              />

                              <img
                                src={Editimg}
                                alt=""
                                onClick={() => handleEditClick(todo.id)}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <span></span>
                  )}
                </Table>

                <div className="extra-row">
                  <div className="item-wrapper">
                    <div className="row-item">
                      <fieldset>
                        <span>Select Brand</span>
                        <select
                          name="brandID "
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handleBrand(e)}
                          defaultValue={formik.values.brandID}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Select Brand --</option>
                          {brands?.map((brand, index) => (
                            <option
                              key={index}
                              value={brand.id}
                              selected={
                                brand.name ===
                                localStorage.getItem("admin-brand-expense")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {brand.name}{" "}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">
                          {formik.errors.brandID && formik.touched.brandID
                            ? formik.errors.brandID
                            : null}
                        </p>
                      </fieldset>
                    </div>
                    <div className="row-item">
                      <fieldset>
                        <span>Select LineExtension</span>
                        <select
                          name="lineExtID "
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handleLineExt(e)}
                          defaultValue={formik.values.lineExtID}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Select LineExtension --</option>
                          {lineExts?.map((brand, index) => (
                            <option
                              key={index}
                              value={brand.id}
                              selected={
                                brand.name ===
                                localStorage.getItem("admin-brand-line-ext")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {brand.name}{" "}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">
                          {formik.errors.lineExtID && formik.touched.lineExtID
                            ? formik.errors.lineExtID
                            : null}
                        </p>
                      </fieldset>
                    </div>

                    <div className="row-item">
                      <fieldset>
                        <span>Cost Center Code</span>
                        <select
                          name="costCenterID "
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handleCostCenter(e)}
                          defaultValue={formik.values.costCenterID}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Cost Center Code --</option>
                          {costcenters?.map((cost, index) => (
                            <option
                              key={index}
                              value={cost.CostCenter?.id}
                              selected={
                                cost.name ===
                                localStorage.getItem("admin-cost-expense")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {cost.CostCenter?.name}{" "}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">
                          {formik.errors.costCenterID &&
                          formik.touched.costCenterID
                            ? formik.errors.costCenterID
                            : null}
                        </p>
                      </fieldset>
                    </div>
                    <div className="row-item">
                      <fieldset>
                        <span>Expense</span>
                        <select
                          name="expenseID "
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handleExpense(e)}
                          defaultValue={formik.values.expenseID}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Expense Name --</option>
                          {expenses?.map((expense, index) => (
                            <option
                              key={index}
                              value={expense.id}
                              selected={
                                expense.name ===
                                localStorage.getItem("admin-expense-name")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {expense.name}{" "}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">
                          {formik.errors.expenseID && formik.touched.expenseID
                            ? formik.errors.expenseID
                            : null}
                        </p>
                      </fieldset>
                    </div>

                    {/* <div className="row-item">
                      <fieldset>
                        <span>SCOA</span>
                        <Form.Control
                          type="text"
                          className="Form-control"
                          name="scoa"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.scoa}
                        />
                        <p className="text-danger">
                          {formik.errors.scoa && formik.touched.scoa
                            ? formik.errors.scoa
                            : null}
                        </p>
                      </fieldset>
                    </div> */}
                    <div className="row-item">
                      <fieldset>
                        <span>Last Project ($)</span>
                        <CurrencyInput
                          type="text"
                          className="form-control"
                          name="lastProject"
                          onValueChange={(event) => {
                            formik.setFieldValue("lastProject", event);
                          }}
                          value={formik.values.lastProject}
                          onKeyPress={onlyNumber}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        />
                        <p className="text-danger">
                          {formik.errors.lastProject &&
                          formik.touched.lastProject
                            ? formik.errors.lastProject
                            : null}
                        </p>
                      </fieldset>
                    </div>
                    <div className="row-item">
                      <fieldset>
                        <span>Budget ($)</span>
                        <CurrencyInput
                          type="text"
                          className="form-control"
                          name="budget"
                          // onChange={formik.handleChange}
                          onValueChange={(event) => {
                            formik.setFieldValue("budget", event);
                          }}
                          value={formik.values.budget}
                          onKeyPress={onlyNumber}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        />
                        <p className="text-danger">
                          {formik.errors.budget && formik.touched.budget
                            ? formik.errors.budget
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>
                  <div className="row-item">
                    {localStorage.getItem("action") !== "view" ? (
                      <button type="submit" className="save-btn expense-btn">
                        {localStorage.getItem("isEditExpense") === "true"
                          ? "Update"
                          : "Save"}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

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
                  </div>
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

export default ProjectExpense;
