import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import astick from "../../src/images/astick-icon.png";
import * as Yup from "yup";
import Ilogo from "../../src/images/info.svg";
import CurrencyInput from "react-currency-input-field";
import $ from "jquery";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "./Loader/LoadingSpinner";
import Badge from "react-bootstrap/Badge";
import ChangeRequestExpense from "./ProjectExpense/ChangeRequestExpense";
function AmountChangeRequestForm(props) {
  const navigate = useNavigate();
  const [todos, setTodos] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // const [isAmountBudget, setIsAmountBudget] = useState(false);
  const [budgetAmount, SetbudgetAmount] = useState("");
  const [oldAmount, SetoldAmount] = useState("");
  const [newbudgetAmount, SetNewbudgetAmount] = useState("");
  const [totalOldAmount, SetOlDTotalAmount] = useState("");
  const [gmApproverID, setGmApproverID] = useState("");
  const [financeUserID, setFinanceUserID] = useState("");
  const [BaIds, setBAIDs] = useState([]);
  const [ids, setIDs] = useState([]);
  const costCenterID = [];
  const costCenterUserID = [];
  const DirectorUserID = [];
  const Level5UserID = [];
  const Level4UserID = [];
  const Level3UserID = [];
  const ID = [];
  const [inputFields, setInputFields] = useState([{}]);
  const [desc, setDesc] = useState("");
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
    getAllCreatedData();
    getAllBrandSKU();
    departmentBasedApprover();
    getLevel2Approver();
    SelectedBaList();
    getGmApprover();
    EditReviewer();
    getFinanceUser();
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

  const getAllCreatedData = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + props.projectID, {
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
        localStorage.setItem(
          "projectDepartment",
          response.data.data.department
        );
        if (response.data.data.ProjectAreaDistricts) {
          response.data.data.ProjectExpenses.forEach((element) => {
            costCenterID.push(element.costCenterID);
          });
          localStorage.setItem("CenterID", costCenterID);
        }
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getGmApprover = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
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
        setGmApproverID(response.data.data.id);
      })

      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error.response);
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
        projectID: props.projectID,
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
        if (res.data.data.length) {
          res.data.data.forEach((element) => {
            DirectorUserID.push(element.id);
          });
          localStorage.setItem("DirectorUserID", DirectorUserID);
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
        }
      })
      .catch(function (error) {
        console.log(">>>>error", error.response);
      });
  };

  const EditReviewer = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "edit-reviewers-list/" +
        props.projectID,

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
            ID.push(element.User.id);
          });
          setIDs(ID);
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

  const selectedBaID = [];
  const SelectedBaList = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "selected-ba-list/" + props.projectID,

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

  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + props.projectID,
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
        console.log("response.data.data>>>>", response.data.data);
        setTodos(response.data.data);
        setInputFields(response.data.data);

        if (response.data.data && response.data.data.length) {
          setDesc(response.data.data[0].Project.description);
          //  SetbudgetAmount(response.data.data[0].Project.OldTotalBudget);
          // setFormStatus(response.data.data[0].Project.status);
          SetNewbudgetAmount(response.data.data[0].Project.totalBudget);

          SetOlDTotalAmount(response.data.data[0].Project.OldTotalBudget);
        }

        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
        setIsLoading(false);
      });
  };

  const MAX_TEXT_LENGTH = 2000;
  const [description, setText] = useState("");

  function handleTextAreaChange(event) {
    const value = event.target.value;
    if (value.length <= MAX_TEXT_LENGTH) {
      setText(value);
    }
  }

  const validationSchema = Yup.object().shape({
    // budgetAmount: Yup.string().required("Field Required"),
  });

  const initialValues = {
    budgetAmount: newbudgetAmount,
    description: description ? description : desc,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      $("#SaveExpense").trigger("click");

      setTimeout(async () => {
        data.DirectorUserID = localStorage.getItem("DirectorUserID");
        data.GmUserID = gmApproverID;
        data.financeDirector = financeUserID;
        data.Level5UserID = localStorage.getItem("Level5UserID");
        data.Level4UserID = localStorage.getItem("Level4UserID");
        data.Level3UserID = localStorage.getItem("Level3UserID");
        data.baID = BaIds;
        data.userID = ids;
        let totalAllocation = 0;
        if (!$("#budgetAmount").val()) {
          swal("Oops", "Total Budget Amount Is Required", "error");
          return;
        }
        for (var i = 0; i < inputFields.length; i++) {
          totalAllocation = totalAllocation + inputFields[i].allocation;
          if (inputFields[i].budgetRef !== null) {
            if (
              inputFields[i].budgetAmount === null ||
              inputFields[i].budgetAmount === 0
            ) {
              swal(
                "Oops",
                "BudgetAmount required in case of budget ref",
                "error"
              );
              return;
            }
          }
        }
        if (parseFloat(totalAllocation) !== parseFloat(newbudgetAmount)) {
          swal(
            "Oops",
            "Please reinitialize allocation(%) for each brand.",
            "error"
          );
          return;
        }

        setIsLoading(true);
        await axios
          .post(
            process.env.REACT_APP_API_KEY + "change-request/" + props.projectID,
            inputFields,
            {
              headers: {
                "Content-type": "Application/json",
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
              params: {
                amount: newbudgetAmount,
                description: description ? description : desc,
                oldAmount: totalOldAmount ? totalOldAmount : newbudgetAmount,
                projectID: props.projectID,
                userID: localStorage.getItem("authID"),
                role: localStorage.getItem("auth_role"),
              },
            }
          )
          .then((res) => {
            getAllBrandSKU(props.projectID);
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 422) {
              swal("Oops", error.response.data.message, "error");
            }
          });

        //Change Status
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
                projectID: props.projectID,
                role: localStorage.getItem("auth_role"),
                department: localStorage.getItem("authDepartment"),
                isChangeRequest: "yes",
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              swal({
                title: "Success!",
                text: "Change Request is submitted successfully",
                icon: "success",
                button: "Okay",
              });

              navigate("/my-projects");
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 422) {
              swal("Oops", error.response.data.message, "error");
              setIsLoading(false);
            }
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
            // console.log("costCenterUserID>>>>", costCenterUserID);
          })
          .catch(function (error) {
            console.log(">>>>>>>>>>>error", error);
          });

        await axios({
          url: process.env.REACT_APP_API_KEY + "save-costCenter-approvers/",
          method: "post",
          params: {
            projectID: props.projectID,
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
          })
          .catch((error) => {
            console.log("Error", error.response.status);
          });
      }, 1500);
    },
  });

  const handleFormChange = (index, name, event) => {
    // let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    // setInputFields(data);
    let data = [...inputFields];
    // data[index][event.target.name] = event.target.value;
    data[index][name] = event;
    setInputFields(data);
  };
  const handleChangeBudget = (event) => {
    SetNewbudgetAmount(event);
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
      <div className="accordion-item change-request">
        <form onSubmit={formik.handleSubmit} name="budget">
          <div className="accordian-head-first w-100">
            <Row className="wrapper">
              <span className="col-md-2 center">
                <img src={astick} alt=""></img> Project Budget{" "}
                <img src={Ilogo} alt="" className="mx-2"></img>
              </span>
              {/* <fieldset className="col-md-4 project-budget-amount">
                <span className="customize">Original Total Budget Amount</span>
                <CurrencyInput
                  type="text"
                  className="form-control"
                  value={totalOldAmount}
                  disabled
                />
              </fieldset> */}
              <fieldset className="col-md-4 mt-1">
                <span>Modify Total Budget Amount</span>
                <CurrencyInput
                  type="text"
                  className="form-control"
                  name="budgetAmount"
                  id="budgetAmount"
                  onValueChange={(event) => {
                    handleChangeBudget(event);
                  }}
                  value={formik.values.budgetAmount || newbudgetAmount}
                  onKeyPress={onlyNumber}
                />
                <p className="text-danger">
                  {formik.errors.budgetAmount && formik.touched.budgetAmount
                    ? formik.errors.budgetAmount
                    : null}
                </p>
              </fieldset>
            </Row>
          </div>
          <div
            id="collapseOne4"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body project-budget">
              <div className="amount  table-responsive">
                {inputFields && inputFields.length > 0 ? (
                  inputFields.map((input, index) => (
                    <div className="budget-amount-container" key={index}>
                      <Row className="budget-amount">
                        <div className="col-md-3">
                          <fieldset>
                            <span>Brand</span>
                            <Form.Control
                              type="text"
                              defaultValue={input.Brand ? input.Brand.name : ""}
                              className="form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-3">
                          <fieldset>
                            <span>Line Extension</span>
                            <Form.Control
                              type="text"
                              defaultValue={
                                input.lineExtension
                                  ? input.lineExtension.name
                                  : ""
                              }
                              className="form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2 w100">
                          <fieldset>
                            <span>Allocation (%)</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mt-1"
                              name="allocationPercent"
                              maxLength={3}
                              min="1"
                              max="100"
                              value={input.allocationPercent}
                              onValueChange={(event) => {
                                input.allocation =
                                  (newbudgetAmount * event) / 100;

                                //  handleFormChange(index, event);
                                handleFormChange(
                                  index,
                                  "allocationPercent",
                                  event
                                );
                              }}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              // disabled={budgetAmount ? false : true}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2 w100">
                          <fieldset className="disabled">
                            <span>Allocation ($)</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="allocation"
                              value={input.allocation}
                              onValueChange={(event) =>
                                handleFormChange(index, "allocation", event)
                              }
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Ref. # ( Optional )</span>
                            <Form.Control
                              type="text"
                              className="form-control mt-1"
                              name="budgetRef"
                              value={input.budgetRef}
                              onChange={(event) => {
                                handleFormChange(index, event);
                              }}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Amount (S$)</span>

                            <CurrencyInput
                              type="text"
                              className="form-control mt-1"
                              name="budgetAmount"
                              value={input.budgetAmount}
                              onValueChange={(event) => {
                                handleFormChange(index, "budgetAmount", event);
                              }}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-1 w100">
                          <fieldset>
                            <span>FY</span>
                            <Form.Control
                              type="text"
                              className="form-control mt-1"
                              name="fy"
                              min="4"
                              max="4"
                              value={input.fy}
                              onChange={(event) =>
                                handleFormChange(index, event)
                              }
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              maxLength={4}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-1 centered">
                          <div
                            className={`${
                              input.budgetAmount !== null &&
                              input.budgetAmount > 0
                                ? "green"
                                : "red"
                            }-badge `}
                          >
                            {input.budgetAmount !== null &&
                            input.budgetAmount > 0
                              ? "Budgeted"
                              : "Unbudgeted"}
                          </div>
                        </div>
                      </Row>
                    </div>
                  ))
                ) : (
                  <span></span>
                )}
              </div>
              <div className="col-md-12 mt-3">
                <fieldset>
                  <span>Description</span>
                  <textarea
                    className="form-control mb-3"
                    placeholder=""
                    id="description"
                    name="description"
                    maxlength="2000"
                    onChange={handleTextAreaChange}
                    defaultValue={desc}
                  ></textarea>
                </fieldset>
                <Badge
                  className="counter-description"
                  style={{
                    marginLeft: 988,
                    marginBottom: 18,
                    fontSize: 10,
                    color: "white",
                    padding: 5,
                  }}
                >{`${
                  description ? description.length : 0 || desc ? desc.length : 0
                } / ${MAX_TEXT_LENGTH}`}</Badge>
              </div>

              <ChangeRequestExpense
                projectID={props.projectID}
                newPeojectAmt={newbudgetAmount}
              />
              <div className="actions-btn mb-3 mt-2">
                {inputFields && inputFields.length ? (
                  <>
                    {" "}
                    <div>
                      {" "}
                      <NavLink
                        type="button"
                        className="next-btn save-btn mx-3"
                        to={{
                          pathname: "/my-projects",
                        }}
                      >
                        Go Back
                      </NavLink>
                    </div>
                    <div className="col-md-1 w100">
                      <button type="submit" class="save-btn">
                        Submit
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AmountChangeRequestForm;
