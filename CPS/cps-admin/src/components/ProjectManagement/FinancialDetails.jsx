import React from "react";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
//import Breadcrumbs from "../components/Breadcrumb";
import Ilogo from "../../Assests/images/info.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Binimg from "../../Assests/images/bin.svg";
import Editimg from "../../Assests/images/edit.svg";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import ProjectExpenses from "./ProjectExpenses";
import CurrencyInput from "react-currency-input-field";
//import FileUpload from "../components/FileUpload/FileUpload";
//import ProjectExpense from "../components/ProjectExpense/ProjectExpense";
// import LoadingSpinner from "../components/Loader/LoadingSpinner";

const FinancialDetails = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [selectedValue, setSelectedValue] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [status, setStatus] = useState("draft");
  const [inputFields, setInputFields] = useState([{}]);
  const [channels, setChannels] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultVal, setSelectedList] = useState(false);
  const [todos, setTodos] = useState({});
  const [currentbugdetIncrement, setbudgetProjectTotalIncrement] = useState("");
  const [lastbugdetIncrement, setLastbudgetProjectTotalIncrement] =
    useState("");
  const [ids, setIDs] = useState([]);
  const data = [];
  // handle onChange event of the dropdown
  const newInitialValues = {
    lastProjectTotalProfit: 0,
    lastProjectRoi: 0,
    LastProjectNetContribution: 0,
    LastProjectPromotionSpend: 0,
    currentProjectTotalProfit: 0,
    currentProjectRoi: 0,
    currentProjectNetContribution: 0,
    currentProjectPromotionSpend: 0,
  };
  const [formValues, setFormValues] = useState(newInitialValues);

  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  useEffect(() => {
    getTotalProfitData();
    EditReviewer();
  }, []);
  useEffect(() => {
    getAllBrandSKU(localStorage.getItem("projectID"));

    // getAllReviewers();
  }, []);
  const onlyNumber = async (event) => {
    if (event.which == 46) {
      if (event.target.value.indexOf(".") === -1) {
        return true;
      } else {
        event.preventDefault();
      }
    }

    if ((event.which < 48 || event.which > 57) && event.which !== 46) {
      event.preventDefault();
    }
  };

  const handleChangeTotalProfit = (name, value) => {
    // const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(">>>>>>>>>", formValues);
  };

  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + id,
      method: "get",
      params: {
        url: "all-brand-sku",
        userID: localStorage.getItem("authID"),
        projectID: localStorage.getItem("projectID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log("financial Data", response.data.data);
        setInputFields(response.data.data);
        setTodos(response.data.data);
        let budgetProjectTotalIncrement = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.budgetProjectTotalIncrement,
          0
        );
        let setTotalBudgetIncrease = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.budgetVolumeIncrease,
          0
        );

        let lastbudgetProjectTotalIncrement = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.lastProjectTotalIncrement,
          0
        );
        let setTotalLastBudgetIncrease = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.lastProjectVolumeInc,
          0
        );
        //setTotalLastBudgetIncrease(setTotalLastBudgetIncrease);

        setbudgetProjectTotalIncrement(budgetProjectTotalIncrement);
        //setTotalBudgetIncrease(setTotalBudgetIncrease);
        setLastbudgetProjectTotalIncrement(lastbudgetProjectTotalIncrement);
        localStorage.setItem("setTotalBudgetIncrease", setTotalBudgetIncrease);
        localStorage.setItem(
          "setTotalLastBudgetIncrease",
          setTotalLastBudgetIncrease
        );
        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const getAllReviewers = async () => {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "reviewers-list/",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setChannels(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  if (channels) {
    channels.forEach((element) => {
      data.push({
        value: element.id,
        label: element.email,
      });
    });
  }
  const list = [];
  const ID = [];

  const EditReviewer = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "edit-reviewers-list/" +
        localStorage.getItem("projectID"),
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
        console.log("selected", response.data.data);
        //setSelectedValue(6)
        if (response.data.data.length > 0 && response.data.data) {
          response.data.data.forEach((element) => {
            list.push({
              value: element.User.id,
              label: element.User.email,
            });
            ID.push(element.User.id);
          });
          setIDs(ID);
          setSelectedList(list);
        }

        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const handleFormChange = (index, name, event) => {
    // let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    // setInputFields(data);
    // console.log(">>>Data>>>>>>", data);
    let data = [...inputFields];
    data[index][name] = event;
    setInputFields(data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "create-project-financial/" +
          localStorage.getItem("projectID"),
        inputFields,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: status,
            projectID: localStorage.getItem("projectID"),
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Success!",
            text: "Saved Successfully!",
            icon: "success",
            button: "Okay",
          });
          //  navigate("/create-project-financial");
        }
        getAllBrandSKU(localStorage.getItem("projectID"));
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });
    console.log(">>>>DAta submit", inputFields);
  };

  const handleClick = (e) => {
    setIsActive((current) => !current);
  };

  const validationSchema = Yup.object().shape({
    // userID: Yup.array()
    //   .min(1)
    //   .of(Yup.string().trim().required("Reviewers is required")),
  });
  const initialValues = {
    userID: selectedValue.length ? selectedValue : ids,
  };
  const formik = useFormik({
    initialValues,
    //validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      await axios
        .post(
          process.env.REACT_APP_API_KEY +
            "project-reviewers/" +
            localStorage.getItem("projectID"),
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
            params: {
              status: "completed",
              projectID: localStorage.getItem("projectID"),
              role: localStorage.getItem("auth_role"),
            },
          }
        )

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Saved Successfully!",
              icon: "success",
              button: "Okay",
            });
            navigate("/project-management");
          }
        })
        .catch((error) => {
          if (error.response.status === 423) {
            swal("Oops", error.response.data.message, "error");
          }
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      //console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const getTotalProfitData = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "get-total-profit-data/" +
        localStorage.getItem("projectID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(async function (response) {
        // console.log("TOtal Profit Data>", response.data.data);
        if (response.data.data) {
          localStorage.setItem(
            "currentProjectNetContribution",
            response.data.data.currentProjectNetContribution
              ? response.data.data.currentProjectNetContribution
              : 0
          );
          localStorage.setItem(
            "LastProjectNetContribution",
            response.data.data.LastProjectNetContribution
              ? response.data.data.LastProjectNetContribution
              : 0
          );
          localStorage.setItem(
            "lastProjectTotalProfit",
            response.data.data.lastProjectTotalProfit
              ? response.data.data.lastProjectTotalProfit
              : 0
          );
          localStorage.setItem(
            "currentProjectTotalProfit",
            response.data.data.currentProjectTotalProfit
              ? response.data.data.currentProjectTotalProfit
              : 0
          );
          localStorage.setItem(
            "lastProjectRoi",
            response.data.data.lastProjectRoi
              ? response.data.data.lastProjectRoi
              : 0
          );
          localStorage.setItem(
            "currentProjectRoi",
            response.data.data.currentProjectRoi
              ? response.data.data.currentProjectRoi
              : 0
          );
          localStorage.setItem(
            "currentProjectPromotionSpend",
            response.data.data.currentProjectPromotionSpend
              ? response.data.data.currentProjectPromotionSpend
              : 0
          );
          localStorage.setItem(
            "LastProjectPromotionSpend",
            response.data.data.LastProjectPromotionSpend
              ? response.data.data.LastProjectPromotionSpend
              : 0
          );
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
  const handleSubmitTotalProfit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsLoading(true);
    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "save-total-profit/" +
          localStorage.getItem("projectID"),
        formValues,
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
        if (res.status === 200) {
          swal({
            title: "Success!",
            text: "Saved Successfully!",
            icon: "success",
            button: "Okay",
          });
          //  navigate("/create-project-financial");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });
  };
  if (isLoading) {
    return <div>{/* <LoadingSpinner /> */}</div>;
  }
  return (
    <>
      <div className="main_wrapper mt-3">
        <Row>
          <div className="right-contents p-0 mt-3">
            <div className="main-box create-project">
              <div className="form-header">
                <Row>
                  <div className="p-0">
                    <div className="back-link">
                      <NavLink
                        to={{
                          pathname: "/project-management/edit-districts",
                        }}
                      >
                        Back
                      </NavLink>
                    </div>
                    <h3>Create Project (Step 2)</h3>
                  </div>
                </Row>
                <div className="breadcrumb-container">
                  {/* <Breadcrumbs /> */}
                </div>
              </div>

              <div>
                <div className="accordion-box">
                  <div class="accordion" id="accordionExample">
                    <ProjectExpenses />
                    <div class="accordion-item ">
                      <h2 class="accordion-header" id="headingOne">
                        <div className="accordian-head-first">
                          <span>Details</span>
                        </div>
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        ></button>
                      </h2>

                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <form onSubmit={submit}>
                          <div class="accordion-body">
                            <div className="table-responsive-md">
                              {inputFields ? (
                                inputFields.map((input, index) => (
                                  <>
                                    {" "}
                                    <React.Fragment key={index}>
                                      <Table
                                        responsive
                                        className="cp-table"
                                        key={index}
                                      >
                                        <tr key={index}>
                                          <th>
                                            <h5
                                              style={{
                                                color: "#0f2f81",
                                                fontFamily: "HEINEKEN-Bold",
                                              }}
                                            >
                                              {input.Brand
                                                ? input.Brand.name
                                                : ""}
                                              &nbsp; &nbsp;
                                              {input.lineExtension
                                                ? input.lineExtension.name
                                                : ""}
                                              &nbsp; &nbsp;
                                              {input.SKU ? input.SKU.name : ""}
                                              (Optional)
                                            </h5>
                                          </th>
                                          <th>Last Project Budget</th>
                                          <th>Budget</th>
                                        </tr>
                                        <tr>
                                          <td>
                                            Volume without promotion during this
                                            period (hl)
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="volumeWithoutLastBudget"
                                              value={
                                                input.volumeWithoutLastBudget
                                              }
                                              onValueChange={(event) => {
                                                input.lastProjectVolumeInc =
                                                  input.volumeWithLastBudget -
                                                  event;

                                                input.lastProjectTotalIncrement =
                                                  input.contributeLastBudget *
                                                  input.lastProjectVolumeInc;

                                                handleFormChange(
                                                  index,
                                                  "volumeWithoutLastBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="volumeWithoutBudget"
                                              value={input.volumeWithoutBudget}
                                              onValueChange={(event) => {
                                                input.budgetVolumeIncrease =
                                                  input.volumeWithBudget -
                                                  event;

                                                input.budgetProjectTotalIncrement =
                                                  input.contributeBudget *
                                                  input.budgetVolumeIncrease;

                                                handleFormChange(
                                                  index,
                                                  "volumeWithoutBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>
                                            Volume with promotion during this
                                            period (hl)
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="volumeWithLastBudget"
                                              value={input.volumeWithLastBudget}
                                              onValueChange={(event) => {
                                                input.lastProjectVolumeInc =
                                                  event -
                                                  input.volumeWithoutLastBudget;

                                                input.lastProjectTotalIncrement =
                                                  input.contributeLastBudget *
                                                  input.lastProjectVolumeInc;
                                                handleFormChange(
                                                  index,
                                                  "volumeWithLastBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="volumeWithBudget"
                                              value={input.volumeWithBudget}
                                              onValueChange={(event) => {
                                                input.budgetVolumeIncrease =
                                                  event -
                                                  input.volumeWithoutBudget;

                                                input.budgetProjectTotalIncrement =
                                                  input.contributeBudget *
                                                  input.budgetVolumeIncrease;

                                                handleFormChange(
                                                  index,
                                                  "volumeWithBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>Contribution per hl ($)</td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="contributeLastBudget"
                                              value={input.contributeLastBudget}
                                              onValueChange={(event) => {
                                                input.lastProjectTotalIncrement =
                                                  event *
                                                  input.lastProjectVolumeInc;

                                                handleFormChange(
                                                  index,
                                                  "contributeLastBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="contributeBudget"
                                              value={input.contributeBudget}
                                              onValueChange={(event) => {
                                                input.budgetProjectTotalIncrement =
                                                  event *
                                                  input.budgetVolumeIncrease;

                                                handleFormChange(
                                                  index,
                                                  "contributeBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>Other Contribution ($)</td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="othContributeLastBudget"
                                              value={
                                                input.othContributeLastBudget
                                              }
                                              onValueChange={(event) => {
                                                handleFormChange(
                                                  index,
                                                  "othContributeLastBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                          <td>
                                            <CurrencyInput
                                              type="text"
                                              className="Form-control form-control"
                                              name="othContributeBudget"
                                              value={input.othContributeBudget}
                                              onValueChange={(event) => {
                                                handleFormChange(
                                                  index,
                                                  "othContributeBudget",
                                                  event
                                                );
                                              }}
                                              onKeyPress={onlyNumber}
                                              disabled={
                                                localStorage.getItem(
                                                  "action"
                                                ) === "view"
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </td>
                                        </tr>
                                        <tr className="content">
                                          <td colSpan={3}>
                                            {" "}
                                            <hr></hr>
                                          </td>
                                        </tr>
                                      </Table>

                                      <div className="mid-box">
                                        <div className="table-responsive-md">
                                          <Table
                                            responsive
                                            className="cp-table2"
                                          >
                                            <tr key={index}>
                                              <td>
                                                Volume increase with promotion
                                                (hl)
                                              </td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                  className="Form-control form-control"
                                                  name="lastProjectVolumeInc"
                                                  value={
                                                    input.lastProjectVolumeInc
                                                  }
                                                  disabled
                                                />
                                              </td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                  className="Form-control form-control"
                                                  disabled
                                                  name="budgetVolumeIncrease"
                                                  value={
                                                    input.budgetVolumeIncrease
                                                  }
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                Total incremental contribution
                                                form promotion ($)
                                              </td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                  className="Form-control form-control"
                                                  name="lastProjectTotalIncrement"
                                                  value={
                                                    input.lastProjectTotalIncrement
                                                  }
                                                  disabled
                                                />
                                              </td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                  className="Form-control form-control"
                                                  name="budgetProjectTotalIncrement"
                                                  value={
                                                    input.budgetProjectTotalIncrement
                                                  }
                                                  disabled
                                                />
                                              </td>
                                            </tr>
                                            {/* <tr>
                                              <td>Other Contribution ($)</td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                 className="Form-control form-control"
                                                  disabled
                                                  value="0"
                                                />
                                              </td>
                                              <td>
                                                <CurrencyInput
                                                  type="text"
                                                 className="Form-control form-control"
                                                  disabled
                                                  value="0"
                                                />
                                              </td>
                                            </tr> */}
                                          </Table>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  </>
                                ))
                              ) : (
                                <span></span>
                              )}

                              {localStorage.getItem("action") === "view" ? (
                                ""
                              ) : (
                                <button
                                  type="button"
                                  class="save-btn"
                                  onClick={submit}
                                >
                                  {localStorage.getItem("action") !== "view"
                                    ? "Save"
                                    : ""}
                                </button>
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div class="form-btn">
                  <button type="button" class="blue-btn">
                    Compute
                  </button>
                  <button type="button" class="white-btn">
                    Enter Manually
                  </button>
                </div> */}

                <div className="mid-box">
                  <div className="table-responsive-md">
                    <div className="table-responsive-md">
                      <form onSubmit={handleSubmitTotalProfit}>
                        <Table responsive className="cp-table3">
                          <tr>
                            <th>
                              {/* <img src={astick} alt="Astric" />{" "} */}
                              <span>Total Profit</span>
                            </th>
                            <th>Last Project Budget</th>
                            <th>Budget</th>
                          </tr>
                          <tr>
                            <td>Total Profit from promotion ($)</td>
                            <td>
                              <CurrencyInput
                                type="text"
                                name="lastProjectTotalProfit"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                defaultValue={
                                  formValues.lastProjectTotalProfit !== 0
                                    ? formValues.lastProjectTotalProfit
                                    : localStorage.getItem(
                                        "lastProjectTotalProfit"
                                      )
                                }
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "lastProjectTotalProfit",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td>
                              <CurrencyInput
                                type="text"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                defaultValue={
                                  formValues.currentProjectTotalProfit !== 0
                                    ? formValues.currentProjectTotalProfit
                                    : localStorage.getItem(
                                        "currentProjectTotalProfit"
                                      )
                                }
                                name="currentProjectTotalProfit"
                                id="currentProjectTotalProfit"
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "currentProjectTotalProfit",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>ROI</td>
                            <td>
                              <CurrencyInput
                                // type="text"
                                onKeyPress={onlyNumber}
                                defaultValue={
                                  formValues.lastProjectRoi !== 0
                                    ? formValues.lastProjectRoi
                                    : localStorage.getItem("lastProjectRoi")
                                }
                                name="lastProjectRoi"
                                className="Form-control form-control"
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "lastProjectRoi",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td>
                              <CurrencyInput
                                type="text"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                defaultValue={
                                  formValues.currentProjectRoi !== 0
                                    ? formValues.currentProjectRoi
                                    : localStorage.getItem("currentProjectRoi")
                                }
                                name="currentProjectRoi"
                                id="currentProjectRoi"
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "currentProjectRoi",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Net Contribution per hl ($)</td>
                            <td>
                              <CurrencyInput
                                type="text"
                                className="Form-control form-control"
                                name="LastProjectNetContribution"
                                onKeyPress={onlyNumber}
                                defaultValue={
                                  formValues.LastProjectNetContribution !== 0
                                    ? formValues.LastProjectNetContribution
                                    : localStorage.getItem(
                                        "LastProjectNetContribution"
                                      )
                                }
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "LastProjectNetContribution",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td>
                              <CurrencyInput
                                type="text"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                name="currentProjectNetContribution"
                                id="currentProjectNetContribution"
                                defaultValue={
                                  formValues.currentProjectNetContribution !== 0
                                    ? formValues.currentProjectNetContribution
                                    : localStorage.getItem(
                                        "currentProjectNetContribution"
                                      )
                                }
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "currentProjectNetContribution",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Promotion spend per hl ($)</td>
                            <td>
                              <CurrencyInput
                                type="text"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                name="LastProjectPromotionSpend"
                                defaultValue={
                                  formValues.LastProjectPromotionSpend !== 0
                                    ? formValues.LastProjectPromotionSpend
                                    : localStorage.getItem(
                                        "LastProjectPromotionSpend"
                                      )
                                }
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "LastProjectPromotionSpend",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") == "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td>
                              <CurrencyInput
                                type="text"
                                onKeyPress={onlyNumber}
                                className="Form-control form-control"
                                name="currentProjectPromotionSpend"
                                defaultValue={
                                  formValues.currentProjectPromotionSpend !== 0
                                    ? formValues.currentProjectPromotionSpend
                                    : localStorage.getItem(
                                        "currentProjectPromotionSpend"
                                      )
                                }
                                onValueChange={(event) => {
                                  handleChangeTotalProfit(
                                    "currentProjectPromotionSpend",
                                    event
                                  );
                                }}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </tr>
                        </Table>
                      </form>
                      {localStorage.getItem("action") !== "view" ? (
                        <button
                          type="button"
                          class="save-btn"
                          onClick={handleSubmitTotalProfit}
                        >
                          Save
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Project Expense File Upload Section */}

                  {/* Project Reviewer And BA  STart*/}
                  {/* <div className="accordion-box">
                    <div class="accordion" id="accordionExample">
                    
                      <form onSubmit={formik.handleSubmit}>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="headingOne">
                            <div className="">
                              <span className="project-reviewers">
                                Project Reviewers <img src={Ilogo}></img>
                              </span>
                            </div>
                            <button
                              class="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne5"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            ></button>
                          </h2>
                          <div
                            id="collapseOne5"
                            class="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            <div class="accordion-body">
                              <Row>
                                <div className="col-md-6">
                                  <div>
                                    <p className="select-reviewer">
                                      Select Reviewer
                                    </p>
                                  </div>

                                  <div className="blue-select ">
                                    <Select
                                      isMulti
                                      defaultValue={defaultVal}
                                      name="userID"
                                      options={data}
                                      className="basic-multi-select select-color"
                                      classNamePrefix="select"
                                      onChange={handleChange}
                                    />

                                    <div className="text-danger">
                                      {formik.errors.userID &&
                                      formik.touched.userID
                                        ? formik.errors.userID
                                        : null}
                                    </div>
                                  </div>
                                </div>
                              </Row>
                            </div>
                          </div>
                        </div>

                        <div className="form-btn justify-content-start">
                        
                          <button type="submit" className="blue-btn">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div> */}

                  {/* Project Reviewer And BA  End*/}
                  <div className="form-btn justify-content-start">
                    <NavLink
                      className="save-btn take-action"
                      to={{
                        pathname: "/project-management/edit-districts",
                      }}
                    >
                      Back
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </>
  );
};

export default FinancialDetails;
