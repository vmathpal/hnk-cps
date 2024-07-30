import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Ilogo from "../../Assests/images/info.svg";
import Binimg from "../../Assests/images/bin.svg";
import Editimg from "../../Assests/images/edit.svg";
import CurrencyInput from "react-currency-input-field";
function BrandSelection() {
  const token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState("");
  const [packtypes, setPackType] = useState([]);
  const [categorys, setCategory] = useState([]);
  const [lineExts, setLineExt] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPacktype, setSelectedPackType] = useState("");
  const [selectedLineExt, setSelectedLineExt] = useState("");
  const [selectedSku, setSelectedSKU] = useState("");
  const [selectedCat, setSelectedCategory] = useState("");
  const [editID, setSetEditID] = useState("");
  const [skus, setSKU] = useState([]);
  const navigate = useNavigate();
  const [todos, setTodos] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [totalOldAmt, SetOldTotalAmount] = useState("");

  const initialValue = { budgetAmount: "" };
  const [formValues, setFormValues] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  // const [isAmountBudget, setIsAmountBudget] = useState(false);
  const [budgetAmount, SetbudgetAmount] = useState("");
  const [totalAmount, SetTotalAmount] = useState("");

  const [inputFields, setInputFields] = useState([{}]);

  useEffect(() => {
    getBrands();
    getAllBrandSKU();
    getCategory();
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

  const getCategory = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-categories-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setCategory(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getAllBrandSKU = async (id) => {
    setIsLoadData(true);
    axios({
      url:
        process.env.REACT_APP_API_KEY +
        "all-brand-sku/" +
        localStorage.getItem("projectID"),
      method: "get",
      params: {
        url: "all-brand-sku",
        userID: localStorage.getItem("authID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        setTodos(response.data.data);
        setInputFields(response.data.data);
        localStorage.setItem("isEditBrand", "false");
        if (response.data.data && response.data.data.length) {
          setStatus(
            response.data.data[0].Project.status === "draft"
              ? "draft"
              : "created"
          );

          localStorage.setItem(
            "ChangeRequestStatus",
            response.data.data[0].Project.ChangeStatus
          );
          localStorage.setItem(
            "ChangeRequestType",
            response.data.data[0].Project.ChangeRequestType
          );

          SetOldTotalAmount(response.data.data[0].Project.OldTotalBudget);

          SetTotalAmount(response.data.data[0].Project.totalBudget);
        }

        setIsLoadData(false);
        console.log("Input Data", response.data.data);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        //   navigate("/sign-in");
        // }
        console.log(">>>>>>>>>>>error", error);
        setIsLoadData(false);
      });
  };

  const getAllPackTypes = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "size-based-packtype-list/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "pack-type-list",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("user_role"),
        },
      })
      .then((response) => {
        if (response.data.data.length <= 0) {
          setSelectedPackType("");
        }
        setPackType(response.data.data);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const getAllLineExtension = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "brand-based-line-extension/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
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

  const getAllSKU = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "line-based-size-list/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((response) => {
        console.log("SKU ", response.data.data);
        if (response.data.data.length <= 0) {
          setSelectedSKU("");
        }
        setSKU(response.data.data);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };
  // function to handle when the "Edit" button is clicked
  const handleEditClick = async (id, pid) => {
    setIsEditing(true);
    setSetEditID(id);
    localStorage.setItem("isEditBrand", "true");
    //setIsLoadData(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "choose-brand/" + id)
      .then((res) => {
        // console.log("Edit Brand", res.data.data);
        localStorage.setItem("admin-brand", res.data.data.Brand.name);
        localStorage.setItem(
          "admin-lineExtension",
          res.data.data.lineExtension.name
        );
        localStorage.setItem("admin-packtype", res.data.data.PackType.name);
        localStorage.setItem("admin-sku", res.data.data.SKU.name);
        localStorage.setItem("admin-category", res.data.data.Category.name);
        setSelectedBrand(res.data.data.Brand.id);
        setSelectedSKU(res.data.data.SKU.id);
        setSelectedPackType(res.data.data.PackType.id);
        setSelectedCategory(res.data.data.Category.id);
        handleBrand(res.data.data.Brand.id);
        handleLineExt(res.data.data.lineExtension.id);
        handleSKU(res.data.data.SKU.id);
        //handleCategory(res.data.data.Category.id);
        // setIsLoadData(false);
      })
      .catch((error) => {
        setIsLoadData(false);

        console.log("error>>>>>aya", error);
      });
  };
  function handleDeleteClick(id, pid) {
    axios
      .delete(process.env.REACT_APP_API_KEY + "delete-choose-brand/" + id)
      .then((res) => {
        getAllBrandSKU(pid);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });

    // console.log(">>single data", currentTodo);
    // setSelectedBrand(currentTodo.brandID );
    // setSelectedBrand(currentTodo.Channel.name);
    // console.log("chanel", selectedBrand);
  }

  const area = [];
  const district = [];
  const data = [];

  const getBrands = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-brands-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log("<>Data>>", response.data.data);
        setBrands(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (brands) {
    brands.forEach((element) => {
      data.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const handleBrand = async (e) => {
    let id =
      localStorage.getItem("isEditBrand") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    getAllLineExtension(id);
    setSelectedBrand(id);
    //getAllPackTypes(id);
    // getAllSKU(id);
  };
  const handleLineExt = async (e) => {
    let id =
      localStorage.getItem("isEditBrand") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    getAllSKU(id);
    setSelectedLineExt(id);
  };
  if (packtypes) {
    packtypes.forEach((element) => {
      area.push({
        value: element.id,
        label: element.name,
      });
    });
  }
  const handlePackType = (e) => {
    let id =
      localStorage.getItem("isEditBrand") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedPackType(id);
  };
  if (skus) {
    skus.forEach((element) => {
      district.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const handleSKU = (e) => {
    let id =
      localStorage.getItem("isEditBrand") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedSKU(id);
    getAllPackTypes(id);
  };

  const handleCategory = (e) => {
    let id =
      localStorage.getItem("isEditBrand") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedCategory(id);
  };
  const validationSchema = Yup.object().shape({
    brandID: Yup.string().required("Brand is required"),
    pack_type: Yup.string().required("PackType is required"),
    skuID: Yup.string().required("SKU is required"),
    lineExtID: Yup.string().required("Line is required"),
    catID: Yup.string().required("Category is required"),
  });

  let url = isEditing ? "choose-brand/" + editID : "choose-brand";

  const initialValues = {
    brandID: selectedBrand,
    pack_type: selectedPacktype,
    skuID: selectedSku,
    lineExtID: selectedLineExt,
    catID: selectedCat,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsEditing(false);
      localStorage.setItem("isEditBrand", "false");
      setIsLoading(true);
      setSelectedBrand("");
      setSelectedPackType("");
      setSelectedSKU("");
      setSelectedCategory("");
      setSelectedLineExt("");
      window.localStorage.removeItem("admin-brand");
      window.localStorage.removeItem("admin-sku");
      window.localStorage.removeItem("admin-packtype");
      window.localStorage.removeItem("admin-category");
      window.localStorage.removeItem("admin-lineExtension");

      await axios
        .post(process.env.REACT_APP_API_KEY + url, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
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
          setSelectedPackType("");
          setSelectedSKU("");
          setSelectedCategory("");
          setSelectedLineExt("");
          // localStorage.removeItem("brand");
          // localStorage.removeItem("packtype");
          // localStorage.removeItem("sku");
          // localStorage.removeItem("category");

          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
            setIsLoading(false);
            return;
          }
        });
    },
  });

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
  const handleChangeBudget = (event) => {
    SetbudgetAmount(event);
  };

  const submit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "create-project-budget/" +
          localStorage.getItem("projectID"),
        inputFields,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: status,
            amount: budgetAmount,
            projectID: localStorage.getItem("projectID"),
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("user_role"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Success!",
            text: "Data Saved",
            icon: "success",
            button: "Okay",
          });
        }
        getAllBrandSKU(localStorage.getItem("projectID"));
        // setSelectedBrand("");
        // setSelectedPackType("");
        // setSelectedSKU("");
        // setSelectedCategory("");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
        setIsLoading(false);
      });
  };

  if (isLoadData) {
    return <div></div>;
  }
  return (
    <>
      <div className="accordion-item third-acc">
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <span>Choose Brand</span>
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
            <div className="">
              <form onSubmit={formik.handleSubmit} id="create-course-form">
                <table className="table admin-table table-striped ">
                  {todos.length > 0 && (
                    <>
                      <tr>
                        <th>Brand Code</th>
                        <th>Brand</th>
                        <th>Line Extension</th>
                        <th>Pack Size</th>
                        <th>Pack Type</th>
                        <th>Category</th>
                        <th></th>
                      </tr>
                    </>
                  )}
                  {todos.length > 0 ? (
                    todos.map((todo, index) => (
                      <React.Fragment key={++index}>
                        <tr>
                          <td>
                            {todo.Brand?.brandCode}
                            {todo.lineExtension?.lineExtCode}
                          </td>
                          <td>{todo.Brand?.name}</td>
                          <td>{todo.lineExtension?.name}</td>
                          <td>{todo.SKU?.name}</td>
                          <td>{todo.PackType?.name}</td>
                          <td>{todo.Category?.name}</td>
                          {localStorage.getItem("action") !== "view" ? (
                            <td className="icon-td">
                              <div>
                                <img
                                  src={Binimg}
                                  alt=""
                                  onClick={() =>
                                    handleDeleteClick(todo.id, todo.Project.id)
                                  }
                                />

                                <img
                                  src={Editimg}
                                  alt=""
                                  onClick={(e) =>
                                    handleEditClick(todo.id, todo.Project.id)
                                  }
                                />
                              </div>
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
                  <tr>
                    <td>
                      <fieldset>
                        <span>Choose Brand</span>
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
                          {brands.map((brand, index) => (
                            <option
                              key={index}
                              value={brand.id}
                              selected={
                                brand.name ===
                                localStorage.getItem("admin-brand")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {brand.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.brandID && formik.touched.brandID
                            ? formik.errors.brandID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td>
                      <fieldset>
                        <span>Line Extension</span>
                        <select
                          name="lineExtID "
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handleLineExt(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                          defaultValue={formik.values.lineExtID}
                        >
                          <option value="">-- Select Line Extension --</option>
                          {lineExts.map((lineExt, index) => (
                            <option
                              key={index}
                              value={lineExt.id}
                              selected={
                                lineExt.name ===
                                localStorage.getItem("admin-lineExtension")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {lineExt.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.lineExtID && formik.touched.lineExtID
                            ? formik.errors.lineExtID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td>
                      <fieldset>
                        <span>Pack Size</span>
                        <select
                          name="skuID"
                          defaultValue={formik.values.skuID}
                          className="common-select form-control p-2   form-select"
                          onChange={(e) => handleSKU(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Select Pack Size --</option>
                          {skus.map((sku, index) => (
                            <option
                              key={index}
                              value={sku.id}
                              selected={
                                sku.name === localStorage.getItem("admin-sku")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {sku.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.skuID && formik.touched.skuID
                            ? formik.errors.skuID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td>
                      <fieldset>
                        <span>Pack Type</span>
                        <select
                          name="pack_type"
                          defaultValue={formik.values.pack_type}
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handlePackType(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">--Select PackType--</option>
                          {packtypes.map((packtype, index) => (
                            <option
                              key={index}
                              value={packtype.id}
                              selected={
                                packtype.name ===
                                localStorage.getItem("admin-packtype")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {packtype.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.pack_type && formik.touched.pack_type
                            ? formik.errors.pack_type
                            : null}
                        </span>
                      </fieldset>
                    </td>

                    <td>
                      <fieldset>
                        <span>Category</span>
                        <select
                          name="catID"
                          defaultValue={formik.values.catID}
                          className="common-select form-control p-2   form-select"
                          onChange={(e) => handleCategory(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">-- Select Category --</option>
                          {categorys.map((category, index) => (
                            <option
                              key={index}
                              value={category.id}
                              selected={
                                category.name ===
                                localStorage.getItem("admin-category")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.catID && formik.touched.catID
                            ? formik.errors.catID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td></td>

                    <td className="btn-td">
                      {localStorage.getItem("action") !== "view" ? (
                        <button type="submit" className="save-btn">
                          {localStorage.getItem("isEditBrand") === "true"
                            ? "Update"
                            : "Save"}
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion-item fourth-acc">
        <form onSubmit={submit} name="budget">
          {(localStorage.getItem("ChangeRequestStatus") === "pending" ||
            localStorage.getItem("ChangeRequestStatus") === "approved") &&
          localStorage.getItem("OldTotalBudget") !== null ? (
            <>
              <h2 className="accordion-header input-boxtabing" id="headingOne">
                <fieldset className="accordingtab-inputbox">
                  <span>Old Total Project Budget Amount</span>
                  <CurrencyInput
                    type="text"
                    className="Form-control form-control"
                    id="budgetAmount"
                    defaultValue={totalAmount}
                    onValueChange={(event) => {
                      handleChangeBudget(event);
                    }}
                    onKeyPress={onlyNumber}
                    disabled
                  />
                </fieldset>
              </h2>
              <h2
                className="accordion-header input-boxtabing mt-3"
                id="headingOne"
              >
                <fieldset className="accordingtab-inputbox mt-3">
                  <span>New Total Project Budget Amount</span>
                  <CurrencyInput
                    type="text"
                    className="Form-control form-control"
                    name="budgetAmount"
                    id="newBudgetAmount"
                    defaultValue={totalOldAmt}
                    onValueChange={(event) => {
                      handleChangeBudget(event);
                    }}
                    onKeyPress={onlyNumber}
                    disabled={
                      localStorage.getItem("action") === "view" ? true : false
                    }
                  />
                </fieldset>

                <div className="accordian-head-first">
                  <span>Project Budget</span>
                  <img src={Ilogo} alt="" className="ms-3" />
                </div>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne4"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                ></button>
              </h2>
            </>
          ) : (
            <h2 className="accordion-header input-boxtabing" id="headingOne">
              <fieldset className="accordingtab-inputbox">
                <span>Total Project Budget Amount</span>
                <CurrencyInput
                  type="text"
                  className="Form-control form-control"
                  name="budgetAmount"
                  id="budgetAmount"
                  defaultValue={totalAmount}
                  onValueChange={(event) => {
                    handleChangeBudget(event);
                  }}
                  onKeyPress={onlyNumber}
                  disabled={
                    localStorage.getItem("action") === "view" ? true : false
                  }
                />
              </fieldset>

              <div className="accordian-head-first">
                <span>Project Budget</span>
                <img src={Ilogo} alt="" className="ms-3" />
              </div>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne4"
                aria-expanded="true"
                aria-controls="collapseOne"
              ></button>
            </h2>
          )}

          <div
            id="collapseOne4"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body project-budget  ">
              <div>
                {inputFields.length > 0 ? (
                  inputFields.map((input, index) => (
                    <div key={index}>
                      <Row className="mb-3">
                        <Col className="col-md-3 editcolumn">
                          <fieldset>
                            <span>Brand</span>
                            <Form.Control
                              type="text"
                              defaultValue={input.Brand ? input.Brand.name : ""}
                              className="form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </Col>
                        <Col className="col-md-2 editcolumn">
                          <fieldset>
                            <span>Line Ext</span>
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
                        </Col>
                        <Col className="col-md-2 editcolumn">
                          <fieldset>
                            <span>Pack Size</span>
                            <Form.Control
                              type="text"
                              defaultValue={input.SKU ? input.SKU.name : ""}
                              className="form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </Col>
                        <Col className="col-md-2 editcolumn">
                          <fieldset>
                            <span>Pack Type</span>
                            <Form.Control
                              type="text"
                              defaultValue={
                                input.PackType ? input.PackType.name : ""
                              }
                              className="form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </Col>

                        <Col className="col-md-1 editcolumn">
                          <fieldset>
                            <span>Allocation (%)</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="allocationPercent"
                              maxLength={3}
                              min="1"
                              max="100"
                              value={input.allocationPercent}
                              onValueChange={(event) => {
                                input.allocation = (budgetAmount * event) / 100;

                                // handleFormChange(index, event);
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
                              disabled={budgetAmount ? false : true}
                            />
                          </fieldset>
                        </Col>

                        <Col className="col-md-2 editcolumn">
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
                        </Col>
                        <Col className="col-md-1 editcolumn">
                          <fieldset>
                            <span>Budget Ref</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="budgetRef"
                              value={input.budgetRef}
                              onValueChange={(event) =>
                                handleFormChange(index, "budgetRef", event)
                              }
                              disableGroupSeparators={true}
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                            />
                          </fieldset>
                        </Col>
                        <Col className="col-md-2 editcolumn">
                          <fieldset>
                            <span>Budget Amount (S$)</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="budgetAmount"
                              value={input.budgetAmount}
                              onValueChange={(event) => {
                                // handleFormChange(index, event);
                                handleFormChange(index, "budgetAmount", event);
                              }}
                              onKeyPress={onlyNumber}
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                            />
                          </fieldset>
                        </Col>
                        <Col className="col-md-1  editcolumn">
                          <fieldset>
                            <span>FY</span>
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="fy"
                              min="4"
                              max="4"
                              value={input.fy}
                              onValueChange={(event) =>
                                handleFormChange(index, "fy", event)
                              }
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              disableGroupSeparators={true}
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                              maxLength={4}
                            />
                          </fieldset>
                        </Col>
                        <Col className="col-md-1 editcolumn mt-1">
                          <div className="green-badge">Budgeted</div>
                        </Col>
                      </Row>
                    </div>
                  ))
                ) : (
                  <span></span>
                )}
                <div className="col-md-1 w100">
                  <td class="btn-td">
                    {inputFields &&
                    inputFields.length &&
                    localStorage.getItem("action") !== "view" ? (
                      <button type="submit" class="save-btn" onClick={submit}>
                        Save
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default BrandSelection;
