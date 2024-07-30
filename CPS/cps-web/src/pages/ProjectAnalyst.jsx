import React from "react";
import Ilogo from "../images/info.svg";
import astrik from "../images/astick-icon.png";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import $ from "jquery";
import * as Yup from "yup";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import ProjectAnalystExpense from "../components/ProjectExpense/ProjectAnalystExpense";

const ProjectAnalyst = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [closureStatus, setClosureStatus] = useState("");
  const [showCalculation, setShowCalculation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [v, setV] = useState(undefined);
  const [inputFields, setInputFields] = useState([{}]);
  const [data, setInputdata] = useState({});
  const [currentbugdetIncrement, setbudgetProjectTotalIncrement] = useState("");
  const [totalActualTotalIncrement, setActualbudgetProjectTotalIncrement] =
    useState("");
  const [lastbugdetIncrement, setLastbudgetProjectTotalIncrement] =
    useState("");
  const [formStatus, setFormStatus] = useState("");
  const Level5UserID = [];
  const Level4UserID = [];
  const Level3UserID = [];
  const [BaIds, setBAIDs] = useState([]);

  const newInitialValues = {
    lastProjectTotalProfit: 0,
    lastProjectRoi: 0,
    LastProjectNetContribution: 0,
    LastProjectPromotionSpend: 0,
    currentProjectTotalProfit: 0,
    currentProjectRoi: 0,
    currentProjectNetContribution: 0,
    currentProjectPromotionSpend: 0,
    actualTotalProfit: 0,
    actualRoi: 0,
    actualNetContribution: 0,
    actualPromotionSpend: 0,
    varianceTotalProfit: 0,
    remarkTotalProfit: "",
  };
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

  useEffect(() => {
    getAllBrandSKU(localStorage.getItem("projectID"));
    // getTotalProfitData();
    SelectedBaList();
    departmentBasedApprover();
    getTotalProfitData();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      getTotalProfitData();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const [formValues, setFormValues] = useState(newInitialValues);
  const [totalProfitValues, setTotalProfitValues] = useState(newInitialValues);

  const handleChangeTotalProfit = (name, value) => {
    // const { name, value } = e.target;
    // setFormValues({ ...formValues, [name]: value });
    setFormValues({ ...formValues, [name]: value });
  };
  const getTotalProfitData = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
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
            "actualRoi",
            response.data.data.actualRoi ? response.data.data.actualRoi : 0
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
          localStorage.setItem(
            "varianceTotalProfit",
            response.data.data.varianceTotalProfit
              ? response.data.data.varianceTotalProfit
              : 0
          );
          localStorage.setItem(
            "actualTotalProfit",
            response.data.data.actualTotalProfit
              ? response.data.data.actualTotalProfit
              : 0
          );
          localStorage.setItem(
            "remarkTotalProfit",
            response.data.data.remarkTotalProfit
              ? response.data.data.remarkTotalProfit
              : ""
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
            actualTotalProfit: response.data.data.actualTotalProfit,
            varianceTotalProfit: response.data.data.varianceTotalProfit,
            remarkTotalProfit: response.data.data.remarkTotalProfit,
            actualRoi: response.data.data.actualRoi,
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
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
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
          getTotalProfitData();
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

  const SaveTotalProfit = async (e) => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    totalProfitValues.lastProjectTotalProfit = parseFloat(
      $("#lastProjectTotalProfit").val()
    );
    totalProfitValues.lastProjectRoi = parseFloat($("#lastProjectRoi").val());
    totalProfitValues.LastProjectNetContribution = parseFloat(
      $("#LastProjectNetContribution").val()
    );
    totalProfitValues.LastProjectPromotionSpend = parseFloat(
      $("#LastProjectPromotionSpend").val()
    );
    totalProfitValues.currentProjectTotalProfit = parseFloat(
      $("#currentProjectTotalProfit").val()
    );
    totalProfitValues.currentProjectRoi = parseFloat(
      $("#currentProjectRoi").val()
    );
    totalProfitValues.currentProjectNetContribution = parseFloat(
      $("#currentProjectNetContribution").val()
    );
    totalProfitValues.currentProjectPromotionSpend = parseFloat(
      $("#currentProjectPromotionSpend").val()
    );
    totalProfitValues.actualTotalProfit = parseFloat(
      $("#actualTotalProfit").val()
    );
    totalProfitValues.actualRoi = parseFloat($("#actualRoi").val());
    totalProfitValues.actualNetContribution = parseFloat(
      $("#actualNetContribution").val()
    );
    totalProfitValues.actualPromotionSpend = parseFloat(
      $("#actualPromotionSpend").val()
    );
    totalProfitValues.varianceTotalProfit = parseFloat(
      $("#varianceTotalProfit").val()
    );
    totalProfitValues.remarkTotalProfit = $("#remarkTotalProfit").val();

    setIsLoading(true);

    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "save-total-profit/" +
          localStorage.getItem("projectID"),
        totalProfitValues,
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
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });
  };

  const selectedBaID = [];
  const SelectedBaList = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "selected-ba-list/" +
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
      .then(function (response) {
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            selectedBaID.push(
              element.delegation
                ? element.delegation.baID
                : element.User?.BusinessAnalyst.id
            );
          });
          setBAIDs(selectedBaID);
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

  const departmentBasedApprover = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "approver-list/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: localStorage.getItem("projectID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(async function (res) {
        if (localStorage.getItem("AuthLevel") === "level6" && res.data.data) {
          if (res.data.data.Users) {
            await res.data.data.Users.forEach((element) => {
              Level5UserID.push(element.id);
            });
            localStorage.setItem("Level5UserID", Level5UserID);
          }

          if (res.data.data.level4And5Mapping.Users) {
            res.data.data.level4And5Mapping.Users.forEach((element) => {
              Level4UserID.push(element.id);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
          }
          if (res.data.data.level4And5Mapping.level3And4Mapping.Users) {
            res.data.data.level4And5Mapping.level3And4Mapping.Users.forEach(
              (element) => {
                Level3UserID.push(element.id);
              }
            );
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }
        if (localStorage.getItem("AuthLevel") === "level5" && res.data.data) {
          if (res.data.data.Users) {
            res.data.data.Users.forEach((element) => {
              Level4UserID.push(element.id);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
          }
          if (res.data.data.level3And4Mapping.Users) {
            res.data.data.level3And4Mapping.Users.forEach((element) => {
              Level3UserID.push(element.id);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }
        if (localStorage.getItem("AuthLevel") === "level4" && res.data.data) {
          if (res.data.data.Users) {
            res.data.data.Users.forEach((element) => {
              Level3UserID.push(element.id);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }

        setIsLoading(false);
      })

      .catch(function (error) {
        console.log(">>>>error", error.response);
        setIsLoading(false);
      });
  };

  const getAllBrandSKU = async (id) => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + id,
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: localStorage.getItem("projectID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        console.log("financial Data", response.data.data);
        if (
          response.data.data[0].lastProjectVolumeInc ||
          response.data.data[0].budgetVolumeIncrease
        ) {
          setShowCalculation(true);
        }
        if (response.data.data && response.data.data.length) {
          setFormStatus(response.data.data[0].Project.status);
          setClosureStatus(response.data.data[0].Project.CloserStatus);
        }
        setInputFields(response.data.data);

        let actualProjectTotalIncrement = response.data.data.reduce(
          (totalHolder, m) =>
            totalHolder + parseFloat(m.actualProjectTotalIncrement),
          0
        );

        let budgetProjectTotalIncrement = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.budgetProjectTotalIncrement,
          0
        );

        let setTotalBudgetIncrease = response.data.data.reduce(
          (totalHolder, m) => totalHolder + m.budgetVolumeIncrease,
          0
        );

        let actualProjectVolumeInc = response.data.data.reduce(
          (totalHolder, m) =>
            totalHolder + parseFloat(m.actualProjectVolumeInc),
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
        setActualbudgetProjectTotalIncrement(actualProjectTotalIncrement);
        //setTotalBudgetIncrease(setTotalBudgetIncrease);
        setLastbudgetProjectTotalIncrement(lastbudgetProjectTotalIncrement);
        localStorage.setItem("setTotalBudgetIncrease", setTotalBudgetIncrease);
        localStorage.setItem(
          "setActualTotalBudgetIncrease",
          actualProjectVolumeInc
        );
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

  // const handleFormChange = (index, event) => {
  //   let data = [...inputFields];
  //   data[index][event.target.name] = event.target.value;
  //   setInputFields(data);
  // };
  const handleFormChange = (index, name, event) => {
    let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    data[index][name] = event;
    setInputFields(data);
    // console.log(">>>Data>>>>>>", data);
  };

  const submit = async (e) => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    e.preventDefault();

    setIsLoading(true);
    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "total-revenue-analyst/" +
          localStorage.getItem("projectID"),
        inputFields,
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
          getAllBrandSKU(localStorage.getItem("projectID"));
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
  const submitCloseRequest = async (e) => {
    data.Level5UserID = localStorage.getItem("Level5UserID");
    data.Level4UserID = localStorage.getItem("Level4UserID");
    data.Level3UserID = localStorage.getItem("Level3UserID");
    data.baID = BaIds;
    e.preventDefault();

    if ($("#currentProjectTotalProfit").val() === "") {
      swal({
        title: "Error",
        text: "Please Fill Total Profit Data",
        icon: "error",
        button: "Okay",
      });
      return;
    }
    setIsLoading(true);

    showCalculation === true ? SaveTotalProfit() : getTotalProfitData();

    //Save Approver Data DB

    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "closer-request/" +
          localStorage.getItem("projectID"),
        data,

        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
            projectID: localStorage.getItem("projectID"),
            role: localStorage.getItem("auth_role"),
          },
        }
      )

      .then(async (res) => {
        if (res.status === 200) {
          swal({
            title: "Success!",
            text: "Close Request Done",
            icon: "success",
            button: "Okay",
          });
        }
        await axios
          .post(
            process.env.REACT_APP_API_KEY + "save-gm-director-reviewers/",
            data,
            {
              headers: {
                "Content-type": "Application/json",
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
              params: {
                userID: localStorage.getItem("authID"),
                projectID: localStorage.getItem("projectID"),
                role: localStorage.getItem("auth_role"),
                requestType: "CloserRequest",
                department: localStorage.getItem("authDepartment"),
              },
            }
          )
          .then((res) => {
            navigate("/my-projects");
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="content-area projectEvaluationWrapper">
      <div className="top-bar">
        <NavLink
          to={{
            pathname: "/my-projects/data-evaluation/",
          }}
          state={{
            projectID: localStorage.getItem("projectID"),
          }}
        >
          <div id="backButton"></div>
          <h4>Back</h4>
        </NavLink>
      </div>
      <div className="page-title">
        <h4>{localStorage.getItem("ProjectName")}</h4>

        {localStorage.getItem("productOwner") === "Approver" ||
        localStorage.getItem("productOwner") === "viewer" ? (
          <b>
            Post By: <span>{localStorage.getItem("ProjectOwnerName")}</span>
          </b>
        ) : (
          ""
        )}
      </div>

      {/* Accordian 01 */}
      <>
        <div className="accordion-box">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item basic">
              <h2 className="accordion-header" id="headingOne">
                <div className="accordian-head-first">
                  <span>Total Revenue</span>
                  <img src={Ilogo} alt="" className="ms-3" />
                </div>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                ></button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <form onSubmit={submit}>
                  <div className="accordion-body">
                    <div className="table-responsive-md">
                      {inputFields ? (
                        inputFields.map((input, index) => (
                          <>
                            {" "}
                            <React.Fragment>
                              <Table
                                responsive
                                className="cp-table"
                                key={index}
                              >
                                <tr>
                                  <th>
                                    <h5
                                      style={{
                                        color: "#0f2f81",
                                        fontFamily: "HEINEKEN-Bold",
                                      }}
                                    >
                                      {input.Brand ? input.Brand.name : ""}
                                      &nbsp; &nbsp;
                                      {input.SKU ? input.SKU.name : ""}
                                    </h5>
                                  </th>
                                  <th>Last Project Budget</th>
                                  <th>Budget</th>
                                  <th>Actual</th>
                                  <th>Variance</th>
                                  <th className="project-remark">Remark</th>
                                </tr>
                                <tr>
                                  <td>
                                    Volume without promotion during this period
                                    (hl)
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="volumeWithoutLastBudget"
                                      value={input.volumeWithoutLastBudget}
                                      onValueChange={(event) => {
                                        input.lastProjectVolumeInc =
                                          input.volumeWithLastBudget - event;

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
                                          input.volumeWithBudget - event;

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
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    Volume with promotion during this period
                                    (hl)
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="volumeWithLastBudget"
                                      value={input.volumeWithLastBudget}
                                      onValueChange={(event) => {
                                        input.lastProjectVolumeInc =
                                          event - input.volumeWithoutLastBudget;

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
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="form-control form-control"
                                      name="volumeWithBudget"
                                      value={input.volumeWithBudget}
                                      onValueChange={(event) => {
                                        input.budgetVolumeIncrease =
                                          event - input.volumeWithoutBudget;

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
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="actualVolumeWithBudget"
                                      value={input.actualVolumeWithBudget}
                                      onValueChange={(event) => {
                                        input.actualProjectVolumeInc =
                                          event - input.volumeWithoutBudget;

                                        input.varianceVolumeWithBudget =
                                          event - input.volumeWithBudget;

                                        input.varianceProjectVolumeInc =
                                          input.actualProjectVolumeInc -
                                          input.budgetVolumeIncrease;

                                        input.actualProjectTotalIncrement =
                                          input.actualContributeBudget *
                                          input.actualProjectVolumeInc;

                                        handleFormChange(
                                          index,
                                          "actualVolumeWithBudget",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="varianceVolumeWithBudget"
                                      value={input.varianceVolumeWithBudget}
                                      onValueChange={(event) => {
                                        input.actualVolumeWithBudget =
                                          event - input.volumeWithBudget;

                                        handleFormChange(
                                          index,
                                          "varianceVolumeWithBudget",
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
                                      name="remarkVolumeWithBudget"
                                      value={input.remarkVolumeWithBudget}
                                      onChange={(event) => {
                                        handleFormChange(
                                          index,
                                          "remarkVolumeWithBudget",
                                          event.target.value
                                        );
                                      }}
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
                                          event * input.lastProjectVolumeInc;

                                        handleFormChange(
                                          index,
                                          "contributeLastBudget",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="form-control"
                                      name="contributeBudget"
                                      value={input.contributeBudget}
                                      onValueChange={(event) => {
                                        input.budgetProjectTotalIncrement =
                                          event * input.budgetVolumeIncrease;

                                        handleFormChange(
                                          index,
                                          "contributeBudget",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="actualContributeBudget"
                                      value={input.actualContributeBudget}
                                      onValueChange={(event) => {
                                        input.actualProjectTotalIncrement =
                                          event * input.actualProjectVolumeInc;

                                        input.varianceProjectTotalIncrement =
                                          input.actualProjectTotalIncrement -
                                          input.budgetProjectTotalIncrement;

                                        handleFormChange(
                                          index,
                                          "actualContributeBudget",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
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
                                      value={input.othContributeLastBudget}
                                      onValueChange={(event) => {
                                        handleFormChange(
                                          index,
                                          "othContributeLastBudget",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
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
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="othContributeActual"
                                      value={input.othContributeActual}
                                      onValueChange={(event) => {
                                        handleFormChange(
                                          index,
                                          "othContributeActual",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                    />
                                  </td>
                                </tr>
                                <tr key={index}>
                                  <td>Volume increase with promotion (hl)</td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="lastProjectVolumeInc"
                                      value={input.lastProjectVolumeInc}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="form-control"
                                      disabled
                                      name="budgetVolumeIncrease"
                                      value={input.budgetVolumeIncrease}
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="actualProjectVolumeInc"
                                      value={input.actualProjectVolumeInc}
                                      onValueChange={(event) => {
                                        input.budgetVolumeIncrease =
                                          event - input.volumeWithoutBudget;

                                        input.budgetProjectTotalIncrement =
                                          input.contributeBudget *
                                          input.budgetVolumeIncrease;

                                        handleFormChange(
                                          index,
                                          "actualProjectVolumeInc",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="varianceProjectVolumeInc"
                                      value={input.varianceProjectVolumeInc}
                                      onValueChange={(event) => {
                                        input.budgetVolumeIncrease =
                                          event - input.volumeWithoutBudget;

                                        input.budgetProjectTotalIncrement =
                                          input.contributeBudget *
                                          input.budgetVolumeIncrease;

                                        handleFormChange(
                                          index,
                                          "varianceProjectVolumeInc",
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
                                      className="Form-control expenseRemark form-control form-control"
                                      name="remarkProjectVolumeInc"
                                      value={input.remarkProjectVolumeInc}
                                      onChange={(event) => {
                                        handleFormChange(
                                          index,
                                          "remarkProjectVolumeInc",
                                          event.target.value
                                        );
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Total incremental contribution form
                                    promotion ($)
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="lastProjectTotalIncrement"
                                      value={input.lastProjectTotalIncrement}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="budgetProjectTotalIncrement"
                                      value={input.budgetProjectTotalIncrement}
                                      disabled={true}
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="form-control"
                                      name="actualProjectTotalIncrement"
                                      value={input.actualProjectTotalIncrement}
                                      onValueChange={(event) => {
                                        input.budgetVolumeIncrease =
                                          event - input.volumeWithoutBudget;

                                        input.budgetProjectTotalIncrement =
                                          input.contributeBudget *
                                          input.budgetVolumeIncrease;

                                        handleFormChange(
                                          index,
                                          "actualProjectTotalIncrement",
                                          event
                                        );
                                      }}
                                      onKeyPress={onlyNumber}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    <CurrencyInput
                                      type="text"
                                      className="Form-control form-control"
                                      name="varianceProjectTotalIncrement"
                                      value={
                                        input.varianceProjectTotalIncrement
                                      }
                                      onValueChange={(event) => {
                                        input.budgetVolumeIncrease =
                                          event - input.volumeWithoutBudget;

                                        input.budgetProjectTotalIncrement =
                                          input.contributeBudget *
                                          input.budgetVolumeIncrease;

                                        handleFormChange(
                                          index,
                                          "varianceProjectTotalIncrement",
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
                                      name="remarkProjectTotalIncrement"
                                      value={input.remarkProjectTotalIncrement}
                                      onChange={(event) => {
                                        handleFormChange(
                                          index,
                                          "remarkProjectTotalIncrement",
                                          event.target.value
                                        );
                                      }}
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
                            </React.Fragment>
                          </>
                        ))
                      ) : (
                        <span></span>
                      )}

                      <button
                        type="button"
                        className="save-btn mt-2"
                        onClick={submit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>

      <ProjectAnalystExpense />

      {/* Accordian 04 */}

      {showCalculation === true ? (
        <div className="accordion-box">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item basic">
              <h2 class="accordion-header" id="headingFour">
                <div className="accordian-head-first">
                  <img src={astrik} alt="" /> <span>Total Profit</span>
                  <img src={Ilogo} alt="" className="ms-3" />
                </div>
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="true"
                  aria-controls="collapseFour"
                >
                  <div className="accordian-head-first"></div>
                </button>
              </h2>
              <div
                id="collapseFour"
                class="accordion-collapse collapse show"
                aria-labelledby="headingFour"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body promotions">
                  <div className="mid-box">
                    <div className="table-responsive-md">
                      <Table responsive className="cp-table3">
                        <tr>
                          <th>
                            <span>Total Profit</span>
                          </th>
                          <th>Last Project Budget</th>
                          <th>Budget</th>
                          <th>Actual</th>
                          <th>Variance</th>
                        </tr>
                        <tr>
                          <td>Total Profit from promotion ($)</td>
                          <td>
                            <CurrencyInput
                              type="text"
                              name="lastProjectTotalProfit"
                              id="lastProjectTotalProfit"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                lastbugdetIncrement !== 0
                                  ? Math.floor(
                                      lastbugdetIncrement -
                                        localStorage.getItem("lastBudget")
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                currentbugdetIncrement !== 0
                                  ? Math.floor(
                                      currentbugdetIncrement -
                                        localStorage.getItem("currentBudget")
                                    ).toFixed(2)
                                  : 0
                              }
                              name="currentProjectTotalProfit"
                              id="currentProjectTotalProfit"
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              name="actualTotalProfit"
                              id="actualTotalProfit"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                totalActualTotalIncrement !== 0
                                  ? Math.floor(
                                      totalActualTotalIncrement -
                                        localStorage.getItem(
                                          "ActualCurrentBudget"
                                        )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                totalActualTotalIncrement !== 0
                                  ? Math.floor(
                                      totalActualTotalIncrement -
                                        localStorage.getItem(
                                          "ActualCurrentBudget"
                                        ) -
                                        Math.floor(
                                          currentbugdetIncrement -
                                            localStorage.getItem(
                                              "currentBudget"
                                            )
                                        ).toFixed(2)
                                    ).toFixed(2)
                                  : 0
                              }
                              name="varianceTotalProfit"
                              id="varianceTotalProfit"
                              disabled
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>ROI</td>
                          <td>
                            <CurrencyInput
                              type="text"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                lastbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        lastbugdetIncrement -
                                          localStorage.getItem("lastBudget")
                                      ) / localStorage.getItem("lastBudget")
                                    ).toFixed(2)
                                  : 0
                              }
                              name="lastProjectRoi"
                              id="lastProjectRoi"
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                currentbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        currentbugdetIncrement -
                                          localStorage.getItem("currentBudget")
                                      ) / localStorage.getItem("currentBudget")
                                    ).toFixed(2)
                                  : 0
                              }
                              name="currentProjectRoi"
                              id="currentProjectRoi"
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              name="actualRoi"
                              id="actualRoi"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                totalActualTotalIncrement !== 0
                                  ? (
                                      Math.floor(
                                        totalActualTotalIncrement -
                                          localStorage.getItem(
                                            "ActualCurrentBudget"
                                          )
                                      ) /
                                      localStorage.getItem(
                                        "ActualCurrentBudget"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
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
                              id="LastProjectNetContribution"
                              onKeyPress={onlyNumber}
                              defaultValue={
                                lastbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        lastbugdetIncrement -
                                          localStorage.getItem("lastBudget")
                                      ) /
                                      localStorage.getItem(
                                        "setTotalLastBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
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
                                currentbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        currentbugdetIncrement -
                                          localStorage.getItem("currentBudget")
                                      ) /
                                      localStorage.getItem(
                                        "setTotalBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              name="actualNetContribution"
                              id="actualNetContribution"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                totalActualTotalIncrement !== 0
                                  ? (
                                      Math.floor(
                                        totalActualTotalIncrement -
                                          localStorage.getItem(
                                            "ActualCurrentBudget"
                                          )
                                      ) /
                                      localStorage.getItem(
                                        "setActualTotalBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
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
                              id="LastProjectPromotionSpend"
                              defaultValue={
                                lastbugdetIncrement && lastbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        localStorage.getItem("lastBudget")
                                      ) /
                                      localStorage.getItem(
                                        "setTotalLastBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              name="currentProjectPromotionSpend"
                              id="currentProjectPromotionSpend"
                              defaultValue={
                                currentbugdetIncrement &&
                                currentbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        localStorage.getItem("currentBudget")
                                      ) /
                                      localStorage.getItem(
                                        "setTotalBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <CurrencyInput
                              type="text"
                              name="actualPromotionSpend"
                              id="actualPromotionSpend"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                totalActualTotalIncrement &&
                                totalActualTotalIncrement !== 0
                                  ? (
                                      Math.floor(
                                        localStorage.getItem(
                                          "ActualCurrentBudget"
                                        )
                                      ) /
                                      localStorage.getItem(
                                        "setActualTotalBudgetIncrease"
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              disabled
                            />
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mid-box">
          <div className="table-responsive-md">
            <form onSubmit={handleSubmitTotalProfit}>
              <Table responsive className="cp-table3">
                <tr>
                  <th>
                    <img src={astrik} alt="" /> <span>Total Profit</span>
                  </th>
                  <th>Last Project Budget</th>
                  <th>Budget</th>
                  <th>Actual</th>
                  <th>Variance</th>
                  <th className="project-remark">Remark</th>
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
                          : localStorage.getItem("lastProjectTotalProfit")
                      }
                      onValueChange={(event) => {
                        handleChangeTotalProfit(
                          "lastProjectTotalProfit",
                          event
                        );
                      }}
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
                          : localStorage.getItem("currentProjectTotalProfit")
                      }
                      name="currentProjectTotalProfit"
                      id="currentProjectTotalProfit"
                      onValueChange={(event) => {
                        handleChangeTotalProfit(
                          "currentProjectTotalProfit",
                          event
                        );
                      }}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      type="text"
                      name="actualTotalProfit"
                      id="actualTotalProfit"
                      onKeyPress={onlyNumber}
                      className="Form-control form-control"
                      defaultValue={
                        formValues.actualTotalProfit !== 0
                          ? formValues.actualTotalProfit
                          : localStorage.getItem("actualTotalProfit")
                      }
                      // onChange={handleChangeTotalProfit}
                      onValueChange={(event) => {
                        setV(
                          parseFloat(event) -
                            parseFloat($("#currentProjectTotalProfit").val())
                        );

                        // $("#varianceTotalProfit").val(
                        //   parseFloat(event.target.value) -
                        //     parseFloat($("#currentProjectTotalProfit").val())
                        // );

                        handleChangeTotalProfit("actualTotalProfit", event);
                      }}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      type="text"
                      name="varianceTotalProfit"
                      id="varianceTotalProfit"
                      onKeyPress={onlyNumber}
                      value={
                        (formValues.varianceTotalProfit =
                          v || localStorage.getItem("varianceTotalProfit"))
                      }
                      className="Form-control form-control"
                      onValueChange={(event) => {
                        handleChangeTotalProfit("varianceTotalProfit", event);
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="remarkTotalProfit"
                      className="Form-control form-control"
                      onChange={(event) => {
                        handleChangeTotalProfit(
                          "remarkTotalProfit",
                          event.target.value
                        );
                      }}
                      defaultValue={
                        formValues.remarkTotalProfit !== ""
                          ? formValues.remarkTotalProfit
                          : localStorage.getItem("remarkTotalProfit")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>ROI</td>
                  <td>
                    <CurrencyInput
                      type="text"
                      onKeyPress={onlyNumber}
                      className="Form-control form-control"
                      defaultValue={
                        formValues.lastProjectRoi !== 0
                          ? formValues.lastProjectRoi
                          : localStorage.getItem("lastProjectRoi")
                      }
                      name="lastProjectRoi"
                      onValueChange={(event) => {
                        handleChangeTotalProfit("lastProjectRoi", event);
                      }}
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
                      onValueChange={(event) => {
                        handleChangeTotalProfit("currentProjectRoi", event);
                      }}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      type="text"
                      onKeyPress={onlyNumber}
                      className="Form-control form-control"
                      defaultValue={
                        formValues.actualRoi !== 0
                          ? formValues.actualRoi
                          : localStorage.getItem("actualRoi")
                      }
                      name="actualRoi"
                      onValueChange={(event) => {
                        handleChangeTotalProfit("actualRoi", event);
                      }}
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
                          : localStorage.getItem("LastProjectNetContribution")
                      }
                      onValueChange={(event) => {
                        handleChangeTotalProfit(
                          "LastProjectNetContribution",
                          event
                        );
                      }}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      type="text"
                      onKeyPress={onlyNumber}
                      className="Form-control form-control"
                      name="currentProjectNetContribution"
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
                          : localStorage.getItem("LastProjectPromotionSpend")
                      }
                      onValueChange={(event) => {
                        handleChangeTotalProfit(
                          "LastProjectPromotionSpend",
                          event
                        );
                      }}
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
                          : localStorage.getItem("currentProjectPromotionSpend")
                      }
                      onValueChange={(event) => {
                        handleChangeTotalProfit(
                          "currentProjectPromotionSpend",
                          event
                        );
                      }}
                    />
                  </td>
                </tr>
              </Table>
            </form>

            {localStorage.getItem("productOwner") === "Approver" ||
            localStorage.getItem("productOwner") === "viewer" ? (
              ""
            ) : (
              <button
                type="button"
                class="save-btn"
                onClick={handleSubmitTotalProfit}
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      <div className="form-btn justify-content-start">
        &nbsp; &nbsp; &nbsp;
        {localStorage.getItem("productOwner") === "creator" &&
        (closureStatus === "rejected" || closureStatus === null) ? (
          <button
            type="button"
            className="blue-btn"
            onClick={submitCloseRequest}
          >
            Close Project
          </button>
        ) : (
          ""
        )}
        {localStorage.getItem("productOwner") === "Approver" ? (
          <NavLink
            className="blue-btn"
            to={{
              pathname: "/add-project-action",
            }}
          >
            <p> Take Action</p>
          </NavLink>
        ) : (
          ""
        )}
        {/* <button type="button" className="disabled">
          Close Project
        </button> */}
      </div>
    </div>
  );
};

export default ProjectAnalyst;
