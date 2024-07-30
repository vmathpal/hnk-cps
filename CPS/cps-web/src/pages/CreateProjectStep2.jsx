import React from "react";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Breadcrumbs from "../components/Breadcrumb";
import Ilogo from "../images/info.svg";
import astick from "../images/astick-icon.png";
import $ from "jquery";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import FileUpload from "../components/FileUpload/FileUpload";
import ProjectExpense from "../components/ProjectExpense/ProjectExpense";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const CreateProjectStep2 = () => {
  const {
    state: { productOwner, projectID },
  } = useLocation();

  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedBaValue, setBaSelectedValue] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [projectUserID, setProjectUserID] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("projectID Page 2", state);
  const [status, setStatus] = useState("draft");
  const [inputFields, setInputFields] = useState([{}]);
  const [channels, setChannels] = useState([]);
  const [baUsers, setbaUsers] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const [isShow, setisShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [defaultVal, setSelectedList] = useState(false);
  const [BadefaultVal, setSelectedBaList] = useState(false);
  const [todos, setTodos] = useState({});
  const [currentbugdetIncrement, setbudgetProjectTotalIncrement] = useState("");
  const [lastbugdetIncrement, setLastbudgetProjectTotalIncrement] =
    useState("");
  const [formStatus, setFormStatus] = useState("");
  const [ids, setIDs] = useState([]);
  const [BaIds, setBAIDs] = useState([]);
  const [baName, setBaName] = useState("");
  const [costUsers, setCostOwnerName] = useState("");
  const [reviewers, setReviewersName] = useState("");
  const [gmApprover, setGmApprover] = useState("");
  const [financeUserID, setFinanceUserID] = useState("");
  const [financeUser, setFinanceUser] = useState("");
  const [gmApproverID, setGmApproverID] = useState("");
  const [deptBasedApprover, setDeptBasedApprover] = useState([]);

  const [level2Approver, setLevel2Approver] = useState("");
  const [oldCalculation, setIsOldTotalCalculation] = useState("no");
  const [inputs, setInputs] = useState({});

  const data = [];
  const ID = [];
  const [isSubmit, setIsSubmit] = useState(false);
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
  const [totalProfitValues, setTotalProfitValues] = useState(newInitialValues);
  const handleChangeTotalProfit = (name, value) => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    // const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(">>>>>>>>>", formValues);
  };
  var lastProjectID = state ? state.id : "";
  // console.log(lastProjectID);
  // var lastProjectID = lastProjectID ? lastProjectID.id : "212";
  // console.log(lastProjectID, "?????");
  // if (lastProjectID) {
  //   oldBudgetProject(lastProjectID);
  // }

  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    const timer = setTimeout(() => {
      oldBudgetProject(lastProjectID);
    }, 1000);
  }, []);
  async function oldBudgetProject(lastProjectID) {
    let projectID = lastProjectID ? lastProjectID : "";
    await axios({
      url: process.env.REACT_APP_API_KEY + "old-project-brand-sku/" + projectID,
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: projectID,
        role: localStorage.getItem("auth_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        // console.log("financial Data", response.data.data);
        // if (response.data.data[0].volumeWithoutBudget) {
        //   setShowCalculation(true);
        // } else {
        //   setShowCalculation(false);
        // }
        // if (response.data.data && response.data.data.length) {
        //   setFormStatus(response.data.data[0].Project.status);
        //   console.log(">>>>>Ddd", response.data.data[0].Project.status);
        // }
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
        console.log("lastbugdetIncrement", lastbugdetIncrement);
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
  }
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
        process.env.REACT_APP_API_KEY + "save-total-profit/" + projectID,
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

  const SaveTotalProfit = async (e) => {
    const removeCommas = (value) => {
      return parseFloat(value.replace(/,/g, ""));
    };

    totalProfitValues.lastProjectTotalProfit = removeCommas(
      $("#lastProjectTotalProfit").val()
    );
    totalProfitValues.lastProjectRoi = removeCommas($("#lastProjectRoi").val());
    totalProfitValues.LastProjectNetContribution = removeCommas(
      $("#LastProjectNetContribution").val()
    );
    totalProfitValues.LastProjectPromotionSpend = removeCommas(
      $("#LastProjectPromotionSpend").val()
    );
    totalProfitValues.currentProjectTotalProfit = removeCommas(
      $("#currentProjectTotalProfit").val()
    );
    totalProfitValues.currentProjectRoi = removeCommas(
      $("#currentProjectRoi").val()
    );
    totalProfitValues.currentProjectNetContribution = removeCommas(
      $("#currentProjectNetContribution").val()
    );
    totalProfitValues.currentProjectPromotionSpend = removeCommas(
      $("#currentProjectPromotionSpend").val()
    );
    await axios
      .post(
        process.env.REACT_APP_API_KEY + "save-total-profit/" + projectID,
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
        // if (res.status === 200) {
        //   swal({
        //     title: "Success!",
        //     text: "Saved Successfully!",
        //     icon: "success",
        //     button: "Okay",
        //   });
        //   //  navigate("/create-project-financial");
        //   setIsLoading(false);
        // }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });

    // Rest of your code for making the API call
  };

  // handle onValueChange event of the dropdown
  const handleChange = (e) => {
    console.log("hello reviewer===>234564565654");
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    setIDs([]);
  };
  const BaHandleChange = (e) => {
    setBaSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    setBAIDs([]);
  };

  useEffect(() => {
    getTotalProfitData();
    SelectedBaList();
    departmentBasedApprover();
    EditReviewer();
    getGmApprover();
    getLevel2Approver();
  }, []);
  console.log("hello reviewer===>down");

  useEffect(() => {
    getAllBrandSKU(projectID);
    // EditReviewer();
    getCommercialUser();
    getFinanceUser();
    getAllCreatedData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getAllReviewers();
      getBAUsersList();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const channelID = [];
  const costCenterID = [];
  const costCenterUserID = [];
  const DirectorUserID = [];
  const Level5UserID = [];
  const Level4UserID = [];
  const Level3UserID = [];
  const Level5UserName = [];
  const Level4UserName = [];
  const Level3UserName = [];
  const Level5RoleName = [];
  const Level4RoleName = [];
  const Level3RoleName = [];
  const AllLevelUserID = [];
  const BaID = [];
  var CostCenterName = "";
  const CancelProjectStatus = async () => {
    confirmAlert({
      title: "Cancelled?",
      message: "Are you sure want to Cancelled?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .get(
                process.env.REACT_APP_API_KEY +
                  "cancelled-project/" +
                  projectID +
                  "?userID=" +
                  localStorage.getItem("authID"),
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Cancelled!",
                  text: "Cancelled Successfully",
                  icon: "success",
                  button: "Okay",
                });
                navigate("/my-projects");
              })
              .catch(function (error) {
                console.log(error);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const getAllCreatedData = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + projectID, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        if (response.data.data) {
          const projectUserID =
            response.data.data.userID == localStorage.getItem("authID")
              ? true
              : false;
          localStorage.setItem("ProjectOwnerStatus", projectUserID);
          setProjectUserID(projectUserID);
          localStorage.setItem(
            "totalProjectBudget",
            response.data.data.totalBudget
          );
        }
        if (response.data.data.ProjectAreaDistricts) {
          response.data.data.ProjectAreaDistricts.forEach((element) => {
            channelID.push(element.Channel.id);
          });
        }
        if (response.data.data.ProjectAreaDistricts) {
          response.data.data.ProjectExpenses.forEach((element) => {
            costCenterID.push(element.costCenterID);
          });
        }
        setTimeout(async () => {
          await axios
            .get(process.env.REACT_APP_API_KEY + "get-cost-owners", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
              params: {
                userID: localStorage.getItem("authID"),
                costCenterID: costCenterID,
                role: localStorage.getItem("auth_role"),
                department: localStorage.getItem("projectDepartment"),
              },
            })
            .then(function (res) {
              console.log("3456789854323456787432345678", res.data.data);
              if (res.data.data.length) {
                res.data.data.forEach((element) => {
                  CostCenterName += element.User.email
                    ? element.User.email.split("@")[0] + "  "
                    : "";
                  // costCenterUserID.push(element.User.id);
                });
              }
              var costCenterUser1 = CostCenterName.replace(
                localStorage.getItem("Level3UserName"),
                ""
              );
              var costCenterUser2 = costCenterUser1.replace(
                localStorage.getItem("Level4UserName"),
                ""
              );
              var costCenterUser3 = costCenterUser2.replace(
                localStorage.getItem("Level5UserName"),
                ""
              );
              setCostOwnerName(costCenterUser3);
            })
            .catch(function (error) {
              console.log(">>>>>>>>>>>error", error);
            });
        }, 100);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + id,
      method: "get",
      params: {
        url: "all-brand-sku",
        userID: localStorage.getItem("authID"),
        projectID: projectID,
        role: localStorage.getItem("auth_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        // console.log("financial Data", response.data.data);
        if (
          response.data.data[0].budgetVolumeIncrease ||
          response.data.data[0].budgetProjectTotalIncrement ||
          response.data.data[0].volumeWithoutBudget
        ) {
          setShowCalculation(true);
        } else {
          setShowCalculation(false);
        }
        if (response.data.data && response.data.data.length) {
          setFormStatus(response.data.data[0].Project.status);
          // console.log(">>>>>Ddd", response.data.data[0].Project.status);
        }
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
        console.log("lastbugdetIncrement", lastbugdetIncrement);
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

  const getGmApprover = async () => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-gm-approver",
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
        setGmApprover(response.data.data.email.split("@")[0]);
        setGmApproverID(response.data.data.id);
      })

      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const getTotalProfitData = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-total-profit-data/" + projectID,
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
          setIsOldTotalCalculation(response.data.data.showCalculation);
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

  const getLevel2Approver = async () => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-level2-approver",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        department: localStorage.getItem("authDepartment"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (res) {
        var level2Approver = "";
        if (res.data.data.length) {
          res.data.data.forEach((element) => {
            level2Approver += element.email
              ? element.email.split("@")[0] + ","
              : "";

            DirectorUserID.push(element.id);
          });
          localStorage.setItem("DirectorUserID", DirectorUserID);
        }
        setLevel2Approver(level2Approver);
      })

      .catch(function (error) {
        console.log(">>>>error", error.response);
      });
  };

  const departmentBasedApprover = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "approver-list/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: projectID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(async function (res) {
        if (localStorage.getItem("AuthLevel") === "level6" && res.data.data) {
          if (res.data.data.Users) {
            Level5RoleName.push(res.data.data.Users[0].roleName.role);
            await res.data.data.Users.forEach((element) => {
              Level5UserID.push(element.id);
              Level5UserName.push(element.email.split("@")[0]);
            });
            localStorage.setItem("Level5UserID", Level5UserID);
            localStorage.setItem("Level5UserName", Level5UserName);
            localStorage.setItem("Level5RoleName", Level5RoleName);
          }

          if (res.data.data.level4And5Mapping.Users) {
            Level4RoleName.push(
              res.data.data.level4And5Mapping.Users[0].roleName.role
            );
            res.data.data.level4And5Mapping.Users.forEach((element) => {
              Level4UserID.push(element.id);
              Level4UserName.push(element.email.split("@")[0]);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
            localStorage.setItem("Level4UserName", Level4UserName);
            localStorage.setItem("Level4RoleName", Level4RoleName);
          }
          if (res.data.data.level4And5Mapping.level3And4Mapping.Users) {
            Level3RoleName.push(
              res.data.data.level4And5Mapping.level3And4Mapping.Users[0]
                .roleName.role
            );
            res.data.data.level4And5Mapping.level3And4Mapping.Users.forEach(
              (element) => {
                Level3UserID.push(element.id);
                Level3UserName.push(element.email.split("@")[0]);
              }
            );
            localStorage.setItem("Level3UserID", Level3UserID);
            localStorage.setItem("Level3RoleName", Level3RoleName);
            localStorage.setItem("Level3UserName", Level3UserName);
          }
          // console.log("Level5UserID", Level5UserID, Level4UserID, Level3UserID);
        }
        if (localStorage.getItem("AuthLevel") === "level5" && res.data.data) {
          if (res.data.data.Users) {
            Level4RoleName.push(res.data.data.Users[0].roleName.role);
            res.data.data.Users.forEach((element) => {
              Level4UserID.push(element.id);
              Level4UserName.push(element.email.split("@")[0]);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
            localStorage.setItem("Level4UserName", Level4UserName);
            localStorage.setItem("Level4RoleName", Level4RoleName);
          }
          if (res.data.data.level3And4Mapping.Users) {
            Level3RoleName.push(
              res.data.data.level3And4Mapping.Users[0].roleName.role
            );
            res.data.data.level3And4Mapping.Users.forEach((element) => {
              Level3UserID.push(element.id);
              Level3UserName.push(element.email.split("@")[0]);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
            localStorage.setItem("Level3RoleName", Level3RoleName);
            localStorage.setItem("Level3UserName", Level3UserName);
          }
        }
        if (localStorage.getItem("AuthLevel") === "level4" && res.data.data) {
          if (res.data.data.Users) {
            Level3RoleName.push(res.data.data.Users[0].roleName.role);
            res.data.data.Users.forEach((element) => {
              Level3UserID.push(element.id);
              Level3UserName.push(element.email.split("@")[0]);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
            localStorage.setItem("Level3UserName", Level3UserName);
            localStorage.setItem("Level3RoleName", Level3RoleName);
          }
        }
        setDeptBasedApprover(res.data.data);
        setIsLoading(false);
      })

      .catch(function (error) {
        console.log(">>>>error", error.response);
        setIsLoading(false);
      });
  };
  const getCommercialUser = async () => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-role-id",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        deptRole: "Commercial Controller",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (res) {
        if (res.data.data.User) {
          localStorage.setItem(
            "CommercialUser",
            res.data.data.User.email.split("@")[0]
          );
        }
      })

      .catch(function (error) {
        console.log(">>>>error", error.response);
      });
  };
  const getFinanceUser = async () => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-role-id",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        deptRole: "Finance Director",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (res) {
        if (res.data.data.User) {
          setFinanceUserID(res.data.data.User.id);
          setFinanceUser(res.data.data.User.email.split("@")[0]);
        }
      })
      .catch(function (error) {
        console.log(">>>>error", error.response);
      });
  };

  const getAllReviewers = async () => {
    // setIsLoading(true);

    const Level3UserID = localStorage.getItem("Level3UserID")
      ? localStorage.getItem("Level3UserID")
      : localStorage.getItem("authID");

    const Level4UserID = localStorage.getItem("Level4UserID")
      ? localStorage.getItem("Level4UserID")
      : localStorage.getItem("authID");
    const Level5UserID = localStorage.getItem("Level5UserID")
      ? localStorage.getItem("Level5UserID")
      : localStorage.getItem("authID");
    const costCenterUserID = localStorage.getItem("costCenterUserID")
      ? localStorage.getItem("costCenterUserID")
      : localStorage.getItem("authID");

    AllLevelUserID.push(localStorage.getItem("authID"));
    await axios({
      url: process.env.REACT_APP_API_KEY + "reviewers-list/",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        Level3UserID: Level3UserID,
        Level4UserID: Level4UserID,
        Level5UserID: Level5UserID,
        costCenterUserID: costCenterUserID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        // console.log("Reviewers Data", response.data.data);
        setChannels(response.data.data);
        // setIsLoading(false);
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
        label: element.email.split("@")[0],
      });
    });
  }

  const list = [];
  const EditReviewer = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "edit-reviewers-list/" + projectID,

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
        var reviewersName = "";
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            list.push({
              value: element.User.id,
              label: element.User.email.split("@")[0],
            });
            reviewersName += element.User.email
              ? element.User.email.split("@")[0] + ","
              : "";
            ID.push(element.User.id);
          });
          setIDs(ID);
          setReviewersName(reviewersName);
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

  const getBAUsersList = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "getbaUsers",
      method: "get",
      params: {
        url: "business-analyst-management",
        userID: localStorage.getItem("authID"),
        role: localStorage.getItem("auth_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log("BA Users", response.data.data);
        setbaUsers(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        if (error.response.status === 423) {
          swal({
            title: "Error!",
            text: "Permission Denied",
            icon: "error",
            button: "Okay",
          });
          navigate("/overview");
          return false;
        }

        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const baData = [];
  if (baUsers) {
    baUsers.forEach((element) => {
      baData.push({
        value: element.id,
        label: element.name,
      });
    });
  }
  const selectedBaList = [];
  const selectedBaID = [];
  const SelectedBaList = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "selected-ba-list/" + projectID,

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
        var BaName = "";
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            selectedBaList.push({
              value: element.User.BusinessAnalyst.id,
              label: element.User.BusinessAnalyst.name,
            });
            BaName += element.User.BusinessAnalyst
              ? element.User.BusinessAnalyst.name + ","
              : "";
            selectedBaID.push(element.User.BusinessAnalyst.id);
          });
          setSelectedBaList(selectedBaList);
          setBAIDs(selectedBaID);
          console.log("selectedBaID", selectedBaID);
          setBaName(BaName);
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
    let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    data[index][name] = event;
    setInputFields(data);
    // console.log(">>>Data>>>>>>", data);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(
        process.env.REACT_APP_API_KEY + "create-project-financial/" + projectID,
        inputFields,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: status,
            projectID: projectID,
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
        getAllBrandSKU(projectID);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
      });
  };

  const validationSchema = Yup.object().shape({
    baID: Yup.array()
      .min(1, "At least one BA is required")
      .of(Yup.string().trim().required("BA is required")),
  });
  const initialValues = {
    userID: selectedValue.length ? selectedValue : ids,
    baID: selectedBaValue.length ? selectedBaValue : BaIds,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      // if (
      //   $("#currentProjectTotalProfit").val() === "0" ||
      //   $("#currentProjectTotalProfit").val() === undefined ||
      //   $("#currentProjectTotalProfit").val() === "" ||
      //   $("#currentProjectRoi").val() === "0" ||
      //   $("#currentProjectRoi").val() === undefined ||
      //   $("#currentProjectRoi").val() === "" ||
      //   $("#currentProjectNetContribution").val() === "0" ||
      //   $("#currentProjectNetContribution").val() === undefined ||
      //   $("#currentProjectNetContribution").val() === ""
      // ) {
      //   swal("Oops", "Please fill total profit section", "error");
      //   return;
      // }
      data.DirectorUserID = localStorage.getItem("DirectorUserID");
      data.GmUserID = gmApproverID;
      data.financeDirector = financeUserID;
      data.Level5UserID = localStorage.getItem("Level5UserID");
      data.Level4UserID = localStorage.getItem("Level4UserID");
      data.Level3UserID = localStorage.getItem("Level3UserID");

      showCalculation == true ? SaveTotalProfit() : getTotalProfitData();

      localStorage.removeItem("lastProjectID");
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "project-reviewers/" + projectID,
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
            params: {
              status: "completed",
              projectID: projectID,
              userID: localStorage.getItem("authID"),
              role: localStorage.getItem("auth_role"),
            },
          }
        )
        .then(async (res) => {
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
                  projectID: projectID,
                  userID: localStorage.getItem("authID"),
                  role: localStorage.getItem("auth_role"),
                  department: localStorage.getItem("authDepartment"),
                  isChangeRequest: "no",
                },
              }
            )
            .then((res) => {
              // console.log(">>>Save Data Approvers", res);
            })
            .catch((error) => {
              console.log("Error", error.response.status);
            });

          await axios
            .get(process.env.REACT_APP_API_KEY + "get-cost-owners-new", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
              params: {
                userID: localStorage.getItem("authID"),
                costCenterID: localStorage.getItem("CenterID"),
                role: localStorage.getItem("auth_role"),
                department: localStorage.getItem("projectDepartment"),
              },
            })
            .then(function (res) {
              if (res.data.data.length) {
                res.data.data.forEach((element) => {
                  costCenterUserID.push(element.User.id);
                });
              }
            })
            .catch(function (error) {
              console.log(">>>>>>>>>>>error", error);
            });

          await axios({
            url: process.env.REACT_APP_API_KEY + "save-costCenter-approvers/",
            method: "post",
            params: {
              projectID: projectID,
              userID: localStorage.getItem("authID"),
              role: localStorage.getItem("auth_role"),
              costCenterUserID: costCenterUserID,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
          })
            .then((res) => {
              // console.log(">>>Save COst approvers", res);
              if (res.status === 200) {
                swal({
                  title: "Success!",
                  text: "Saved Successfully!",
                  icon: "success",
                  button: "Okay",
                });
                setIsLoading(false);
                navigate("/overview");
              }
            })
            .catch((error) => {
              console.log("Error", error.response.status);
            });
        })
        .catch((error) => {
          console.log("Error", error.response.status);
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          if (error.response.status === 423) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });

      //console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="main_wrapper">
        <Row>
          <div className="right-contents p-0">
            <div className="main-box create-project">
              <div className="form-header">
                <Row>
                  <div className="p-0">
                    <div className="back-link">
                      <NavLink
                        to={{
                          pathname: "/create-project/" + projectID,
                        }}
                        state={{
                          productOwner: productOwner,
                        }}
                      >
                        Back
                      </NavLink>
                    </div>
                    <h3>Create Project (Step 2)</h3>
                  </div>
                </Row>
                <>
                  {productOwner === "Approver" ? (
                    <NavLink
                      className="add-action-button take-action"
                      to={{
                        pathname: "/add-project-action",
                      }}
                    >
                      <p> Take Action</p>
                    </NavLink>
                  ) : (
                    ""
                  )}
                </>
                <div className="breadcrumb-container">
                  <Breadcrumbs />
                </div>
              </div>

              <div>
                <div className="accordion-box">
                  <div class="accordion" id="accordionExample">
                    <ProjectExpense
                      projectID={projectID}
                      productOwner={productOwner}
                    />
                    <div class="accordion-item ">
                      <h2 class="accordion-header" id="headingOne">
                        <div className="accordian-head-first">
                          <span>Details</span>
                          {/* <CurrencyInput
                            type="text"
                            placeholder="Project Number"
                           className="Form-control form-control"
                            name="volumeWithoutLastBudget"
                            value={state}
                            onValueChange={oldBudgetProject}
                          /> */}
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                  "ProjectOwnerStatus"
                                                ) == "false"
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
                                                      ? input.lastProjectVolumeInc.toFixed(
                                                          2
                                                        )
                                                      : input.lastProjectVolumeInc
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
                                                      ? input.budgetVolumeIncrease.toFixed(
                                                          2
                                                        )
                                                      : input.budgetVolumeIncrease
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
                                                      ? input.lastProjectTotalIncrement.toFixed(
                                                          2
                                                        )
                                                      : input.lastProjectTotalIncrement
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
                                                      ? input.budgetProjectTotalIncrement.toFixed(
                                                          2
                                                        )
                                                      : input.budgetProjectTotalIncrement
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

                              {formStatus === "completed" ||
                              formStatus === "approved" ||
                              formStatus === "cancelled" ||
                              formStatus === "pending" ||
                              productOwner === "Approver" ||
                              productOwner === "viewer" ? (
                                ""
                              ) : (
                                <button
                                  type="button"
                                  class="save-btn"
                                  onClick={submit}
                                >
                                  Save
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
                {showCalculation === true && oldCalculation !== "yes" ? (
                  <div className="mid-box auto-calculate">
                    <div className="table-responsive-md">
                      <Table responsive className="cp-table3">
                        <tr>
                          <th>
                            {/* <img src={astick} alt="Astric" />{" "} */}
                            <span>Total Profit1</span>
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
                              id="lastProjectTotalProfit"
                              onKeyPress={onlyNumber}
                              className="Form-control form-control"
                              defaultValue={
                                parseFloat(lastbugdetIncrement) !== 0
                                  ? Math.floor(
                                      parseFloat(lastbugdetIncrement) -
                                        parseFloat(
                                          localStorage.getItem("lastBudget")
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
                                currentbugdetIncrement !== 0
                                  ? Math.floor(
                                      parseFloat(
                                        parseFloat(currentbugdetIncrement) -
                                          parseFloat(
                                            localStorage.getItem(
                                              "currentBudget"
                                            )
                                          )
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              name="currentProjectTotalProfit"
                              id="currentProjectTotalProfit"
                              disabled
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>ROI</td>
                          <td>
                            <CurrencyInput
                              type="text"
                              className="Form-control form-control"
                              onKeyPress={onlyNumber}
                              defaultValue={
                                parseFloat(lastbugdetIncrement) !== 0
                                  ? (
                                      Math.floor(
                                        parseFloat(lastbugdetIncrement) -
                                          parseFloat(
                                            localStorage.getItem("lastBudget")
                                          )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem("lastBudget")
                                      )
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
                              defaultValue={
                                currentbugdetIncrement !== 0
                                  ? (
                                      Math.floor(
                                        parseFloat(
                                          currentbugdetIncrement -
                                            localStorage.getItem(
                                              "currentBudget"
                                            )
                                        )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem("currentBudget")
                                      )
                                    ).toFixed(2)
                                  : 0
                              }
                              name="currentProjectRoi"
                              id="currentProjectRoi"
                              className="Form-control form-control"
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
                                parseFloat(lastbugdetIncrement) !== 0
                                  ? (
                                      Math.floor(
                                        parseFloat(lastbugdetIncrement) -
                                          parseFloat(
                                            localStorage.getItem("lastBudget")
                                          )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem(
                                          "setTotalLastBudgetIncrease"
                                        )
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
                                        parseFloat(currentbugdetIncrement) -
                                          parseFloat(
                                            localStorage.getItem(
                                              "currentBudget"
                                            )
                                          )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem(
                                          "setTotalBudgetIncrease"
                                        )
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
                                        parseFloat(
                                          localStorage.getItem("lastBudget")
                                        )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem(
                                          "setTotalLastBudgetIncrease"
                                        )
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
                                        parseFloat(
                                          localStorage.getItem("currentBudget")
                                        )
                                      ) /
                                      parseFloat(
                                        localStorage.getItem(
                                          "setTotalBudgetIncrease"
                                        )
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
                ) : (
                  <div className="mid-box">
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
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
                                  localStorage.getItem("ProjectOwnerStatus") ==
                                  "false"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </tr>
                        </Table>
                      </form>

                      {formStatus === "completed" ||
                      formStatus === "approved" ||
                      formStatus === "cancelled" ||
                      formStatus === "pending" ||
                      productOwner === "Approver" ||
                      productOwner === "viewer" ? (
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

                <div>
                  {/* Project Expense File Upload Section */}

                  <div className="accordion-box">
                    <div className="accordion" id="accordionExample">
                      {/* //components */}
                      <FileUpload
                        projectID={projectID}
                        fileType="new-request"
                        productOwner={productOwner}
                      />
                      <form onSubmit={formik.handleSubmit}>
                        {productOwner === "creator" ? (
                          <div className="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                              <div className="">
                                <span className="project-reviewers">
                                  Project BA & Reviewers <img src={Ilogo}></img>
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
                                  <div className="col-md-4">
                                    <div>
                                      <p className="select-reviewer">
                                        Select Business Analyst
                                        <img
                                          src={astick}
                                          alt="Astric"
                                          className="mx-1"
                                        />{" "}
                                      </p>
                                    </div>

                                    <div className="blue-select ">
                                      <Select
                                        isMulti
                                        defaultValue={BadefaultVal}
                                        name="baID"
                                        options={baData}
                                        className="basic-multi-select select-color"
                                        classNamePrefix="select"
                                        onChange={BaHandleChange}
                                      />
                                      <div className="text-danger">
                                        {formik.errors.baID &&
                                        formik.touched.baID
                                          ? formik.errors.baID
                                          : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div>
                                      <p className="select-reviewer">
                                        Select Reviewer (Optional)
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
                                  {/* <div className="col-md-6">
                                  <div className="reorder-title mb-3">
                                    <p>Selected Reviewer</p>
                                  </div>
                                  {list && (
                                    <div
                                      style={{
                                        marginTop: 20,
                                        lineHeight: "25px",
                                      }}
                                    >
                                      <div>
                                        <b>Selected Value: </b>{" "}
                                        {JSON.stringify(list, null, 2)}
                                      </div>
                                    </div>
                                  )}
                                </div> */}
                                </Row>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {productOwner === "creator" ? (
                          <div className="accordion-item file-attach">
                            <h2 className="accordion-header" id="headingOne">
                              <div className="">
                                <span className="approver-flow">
                                  Approver Flow <img src={Ilogo}></img>
                                </span>
                              </div>
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne6"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                              ></button>
                            </h2>
                            <div
                              id="collapseOne6"
                              className="accordion-collapse collapse show"
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <div className="accordion-body customTimeline">
                                  <ul>
                                    <li>
                                      <b>{baName}</b>
                                      <p>Business Analyst</p>
                                    </li>
                                    {reviewers ? (
                                      <li>
                                        <b>{reviewers}</b>
                                        <p>Reviewer</p>
                                      </li>
                                    ) : (
                                      ""
                                    )}
                                    {costUsers.length > 4 ? (
                                      <li>
                                        <b>{costUsers}</b>
                                        <p>Cost Centre Owner</p>
                                      </li>
                                    ) : (
                                      ""
                                    )}
                                    {localStorage.getItem("AuthLevel") ===
                                    "level6" ? (
                                      <>
                                        {localStorage.getItem(
                                          "Level5UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level5UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level5RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                        {localStorage.getItem(
                                          "Level4UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level4UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level4RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                        {localStorage.getItem(
                                          "Level3UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level3UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level3RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : localStorage.getItem("AuthLevel") ===
                                      "level5" ? (
                                      <>
                                        {localStorage.getItem(
                                          "Level4UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level4UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level4RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}

                                        {localStorage.getItem(
                                          "Level3UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level3UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level3RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : localStorage.getItem("AuthLevel") ===
                                      "level4" ? (
                                      <>
                                        {localStorage.getItem(
                                          "Level3UserName"
                                        ) ? (
                                          <li>
                                            <b>
                                              {localStorage.getItem(
                                                "Level3UserName"
                                              )}
                                            </b>
                                            <p>
                                              {" "}
                                              {localStorage.getItem(
                                                "Level3RoleName"
                                              )}
                                            </p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {localStorage.getItem(
                                      "totalProjectBudget"
                                    ) > 25000 ? (
                                      <>
                                        <li>
                                          <b>{level2Approver}</b>
                                          <p>
                                            {localStorage.getItem(
                                              "authDepartment"
                                            ) === "sales"
                                              ? "Sales Director"
                                              : localStorage.getItem(
                                                  "authDepartment"
                                                ) === "marketing"
                                              ? "Marketing Director"
                                              : "Sales Director"}
                                          </p>
                                        </li>
                                        <li>
                                          <b>
                                            {localStorage.getItem(
                                              "CommercialUser"
                                            )}
                                          </b>
                                          <p>Commercial Controller</p>
                                        </li>
                                        <li>
                                          <b>{financeUser}</b>
                                          <p>Finance Director</p>
                                        </li>
                                        {localStorage.getItem(
                                          "totalProjectBudget"
                                        ) > 250000 ? (
                                          <li>
                                            <b>{gmApprover}</b>
                                            <p>General Manager</p>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      <li>
                                        <b>
                                          {localStorage.getItem(
                                            "CommercialUser"
                                          )}
                                        </b>
                                        <p>Commercial Controller</p>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="form-btn justify-content-start">
                          {formStatus === "completed" ||
                          formStatus === "approved" ||
                          formStatus === "cancelled" ||
                          formStatus === "pending" ||
                          productOwner === "Approver" ||
                          productOwner === "viewer" ? (
                            ""
                          ) : (
                            <button type="submit" className="blue-btn">
                              {formStatus === "rejected"
                                ? "ReSubmit"
                                : "Submit"}
                            </button>
                          )}

                          {formStatus === "draft" && (
                            <button
                              type="button"
                              onClick={CancelProjectStatus}
                              className="blue-btn"
                            >
                              Cancel Draft Project
                            </button>
                          )}

                          {(formStatus == "rejected" && projectUserID) ||
                          (localStorage.getItem("ChangeRequestStatus") ==
                            "rejected" &&
                            projectUserID) ? (
                            <button
                              type="button"
                              onClick={CancelProjectStatus}
                              className="blue-btn"
                            >
                              Cancel Project
                            </button>
                          ) : (
                            projectUserID
                          )}
                          {productOwner === "Approver" ? (
                            <NavLink
                              className="blue-btn"
                              to={{
                                pathname: "/add-project-action",
                              }}
                            >
                              Take Action
                            </NavLink>
                          ) : (
                            ""
                          )}
                        </div>
                      </form>
                    </div>
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

export default CreateProjectStep2;
