import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Ilogo from "../../images/info.svg";
import astick from "../../images/astick-icon.png";
import Binimg from "../../images/bin.svg";
import Editimg from "../../images/edit.svg";
import LoadingSpinner from "../Loader/LoadingSpinner";
import CurrencyInput from "react-currency-input-field";
function BrandSelection(props) {
  console.log("Brand Selection", props.projectID);
  const token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [changeRequestStatus, setChangeRequestStatus] = useState("");
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

  const initialValue = { budgetAmount: "" };
  const [formValues, setFormValues] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [budgetAmount, SetbudgetAmount] = useState("");
  const [totalAmount, SetTotalAmount] = useState("");
  const [totalOldAmt, SetOldTotalAmount] = useState("");

  const [inputFields, setInputFields] = useState([{}]);
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
    getBrands();
    getAllBrandSKU();
    getCategory();
  }, [props.projectID]);

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
        params: {
          url: "get-categories-list",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
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
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoadData(true);
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
       let tAllocation = response.data?.data?.reduce(
        (totalHolder, m) => totalHolder + m.allocation,
        0
      );  
       props.sendBudgetData({
        'totalBudget':parseFloat(response.data?.data[0].Project.totalBudget),
        'tAllocation':tAllocation
       })
        setTodos(response.data.data);
        setInputFields(response.data.data);
         localStorage.setItem("isEditBrand", "false");
        if (response.data.data && response.data.data.length) {
          setStatus(
            response.data.data[0].Project.status === "draft"
              ? "draft"
              : "created"
          );
          SetbudgetAmount(response.data.data[0].Project.totalBudget);
          setFormStatus(response.data.data[0].Project.status);
          setChangeRequestStatus(response.data.data[0].Project.ChangeStatus);
          localStorage.setItem(
            "ChangeRequestStatus",
            response.data.data[0].Project.ChangeStatus
          );
          SetTotalAmount(response.data.data[0].Project.totalBudget);
          SetOldTotalAmount(response.data.data[0].Project.OldTotalBudget);
        }
        if (response.data.data.length) {
          const BrandID = [];
          const LineExtID = [];
          response.data.data.forEach((element) => {
            BrandID.push(element.Brand.id);
            LineExtID.push(element.lineExtension.id);
          });
          console.log("BrandID>>>>BrandID",BrandID)
          localStorage.setItem("BrandID", BrandID);
          localStorage.setItem("LineExtID", LineExtID);
        }
        setIsLoadData(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
        setIsLoadData(false);
      });
  };

  const getAllPackTypes = async (id) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "size-based-packtype-list/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "pack-type-list",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
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
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "brand-based-line-extension/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "line-extension",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
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
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "line-based-size-list/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((response) => {
        // console.log("SKU ", response.data.data);
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
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }

    setIsEditing(true);
    setSetEditID(id);
    localStorage.setItem("isEditBrand", "true");
    //setIsLoadData(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "choose-brand/" + id)
      .then((res) => {
        localStorage.setItem("brand", res.data.data.Brand.name);
        localStorage.setItem("lineExtension", res.data.data.lineExtension.name);
        localStorage.setItem("packtype", res.data.data.PackType.name);
        localStorage.setItem("sku", res.data.data.SKU.name);
        localStorage.setItem("category", res.data.data.Category.name);
        setSelectedBrand(res.data.data.Brand.id);
        setSelectedSKU(res.data.data.SKU.id);
        setSelectedPackType(res.data.data.PackType.id);
        setSelectedCategory(res.data.data.Category.id);
        handleBrand(res.data.data.Brand.id);
        handleLineExt(res.data.data.lineExtension.id);
        handleSKU(res.data.data.SKU.id);
      })
      .catch((error) => {
        setIsLoadData(false);

        console.log("error>>>>>", error);
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
    setSelectedBrand("");
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
    setSelectedPackType("");
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
    setSelectedSKU("");
    getAllPackTypes("");
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
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      }
      setIsEditing(false);
      localStorage.setItem("isEditBrand", "false");
      setIsLoading(true);
      setSelectedBrand("");
      setSelectedPackType("");
      setSelectedSKU("");
      setSelectedCategory("");
      setSelectedLineExt("");
      window.localStorage.removeItem("brand");
      window.localStorage.removeItem("sku");
      window.localStorage.removeItem("packtype");
      window.localStorage.removeItem("category");
      window.localStorage.removeItem("lineExtension");

      await axios
        .post(process.env.REACT_APP_API_KEY + url, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: "draft",
            projectID: props.projectID,
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
          },
        })
        .then((res) => {
          getAllBrandSKU(props.projectID);
          setSelectedBrand("");
          setSelectedPackType("");
          setSelectedSKU("");
          setSelectedCategory("");
          setSelectedLineExt("");

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

  const handleFormChangeAllocation = () => {

    let data = [...inputFields]; 

  const values = Array.from(document.querySelectorAll('input[name="allocationPercent"]'))
  .map((input, index) => {  
            
      console.log('VAL: ', index, input.value);
      data[index]['allocationPercent'] = input.value;
      data[index]['allocation']  = (budgetAmount *  input.value) / 100;
      setInputFields(data);

   }); 

   };

  const handleFormChange = (index, name, event) => {
      handleFormChangeAllocation();
    let data = [...inputFields];
    if(name == "fy"){
      data[index][name] = event.target.value;
    }else{
      data[index][name] = event;
    }
    setInputFields(data);
    console.log("inputFields",inputFields)
  };

  // const handleChangeBudget = (event) => {
  //   SetbudgetAmount(event);
  // };

  const handleChangeBudget = (value) => {
    SetbudgetAmount(value);
    console.log();
    let data = [...inputFields];
    Array.from(
      document.querySelectorAll('input[name="allocationPercent"]')
    ).map((input, index) => {
      console.log("VAL: ", index, input.value);
      data[index]["allocationPercent"] = input.value;
      data[index]["allocation"] = (value * input.value) / 100;
      
      return true;
    });
    setInputFields(data);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    setIsLoadData(true);
    e.preventDefault();

    
    //Start loop to validate.
    for (var i = 0; i < inputFields.length; i++) {
      if (inputFields[i].budgetRef !== null) {
        if (
          inputFields[i].budgetAmount === null ||
          inputFields[i].budgetAmount === 0
        ) {
          swal("Oops", "BudgetAmount required in case of budget ref", "error");
          return;
        }
      }
    }

    await axios
      .post(
        process.env.REACT_APP_API_KEY +
          "create-project-budget/" +
          props.projectID,
        inputFields,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: status,
            amount: budgetAmount,
            projectID: props.projectID,
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
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
          setIsLoadData(false);
        }
        getAllBrandSKU(props.projectID);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
        setIsLoadData(false);
      });
  };

  if (isLoadData) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <div className="accordion-item third-acc">
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <img src={astick} alt="" /> <span>Choose Brand</span>
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
                          {(status === "draft" ||
                            status === "rejected" ||
                            status === "created" ||
                            status === "" ||
                            status === undefined) &&
                          props.productOwner === "creator" ? (
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
                          value={formik.values.brandID}
                          disabled={
                            (status === "draft" ||
                              status === "rejected" ||
                              status === "created" ||
                              status === "" ||
                              status === undefined) &&
                            props.productOwner === "creator"
                              ? false
                              : true
                          }
                        >
                          <option value="">-- Select Brand --</option>
                          {brands.map((brand, index) => (
                            <option
                              key={index}
                              value={brand.id}
                              selected={
                                brand.name === localStorage.getItem("brand")
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
                          value={formik.values.lineExtID}
                          disabled={
                            (status === "draft" ||
                              status === "rejected" ||
                              status === "created" ||
                              status === "" ||
                              status === undefined) &&
                            props.productOwner === "creator"
                              ? false
                              : true
                          }
                        >
                          <option value="">-- Select Line Extension --</option>
                          {lineExts.map((lineExt, index) => (
                            <option
                              key={index}
                              value={lineExt.id}
                              selected={
                                lineExt.name ===
                                localStorage.getItem("lineExtension")
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
                          value={formik.values.skuID}
                          className="common-select form-control p-2   form-select"
                          onChange={(e) => handleSKU(e)}
                          disabled={
                            (status === "draft" ||
                              status === "rejected" ||
                              status === "created" ||
                              status === "" ||
                              status === undefined) &&
                            props.productOwner === "creator"
                              ? false
                              : true
                          }
                        >
                          <option value="">-- Select Pack Size --</option>
                          {skus.map((sku, index) => (
                            <option
                              key={index}
                              value={sku.id}
                              selected={
                                sku.name === localStorage.getItem("sku")
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
                          value={formik.values.pack_type}
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => handlePackType(e)}
                          disabled={
                            (status === "draft" ||
                              status === "rejected" ||
                              status === "created" ||
                              status === "" ||
                              status === undefined) &&
                            props.productOwner === "creator"
                              ? false
                              : true
                          }
                        >
                          <option value="">--Select PackType--</option>
                          {packtypes.map((packtype, index) => (
                            <option
                              key={index}
                              value={packtype.id}
                              selected={
                                packtype.name ===
                                localStorage.getItem("packtype")
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
                          value={formik.values.catID}
                          className="common-select form-control p-2   form-select"
                          onChange={(e) => handleCategory(e)}
                          disabled={
                            (status === "draft" ||
                              status === "rejected" ||
                              status === "created" ||
                              status === "" ||
                              status === undefined) &&
                            props.productOwner === "creator"
                              ? false
                              : true
                          }
                        >
                          <option value="">-- Select Category --</option>
                          {categorys.map((category, index) => (
                            <option
                              key={index}
                              value={category.id}
                              selected={
                                category.name ===
                                localStorage.getItem("category")
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
                      {formStatus === "completed" ||
                      formStatus === "approved" ||
                      formStatus === "cancelled" ||
                      formStatus === "pending" ||
                      props.productOwner === "Approver" ||
                      props.productOwner === "viewer" ? (
                        ""
                      ) : (
                        <button type="submit" className="save-btn">
                          {localStorage.getItem("isEditBrand") === "true"
                            ? "Update"
                            : "Save"}
                        </button>
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
          <h2 className="accordion-header input-boxtabing" id="headingOne">
            <fieldset className="accordingtab-inputbox">
              <span>Total Project Budget Amount</span>
              <CurrencyInput
                type="text"
                className="Form-control form-control"
                name="budgetAmount"
                id={`${
                  localStorage.getItem("OldTotalBudget") === "null"
                    ? ""
                    : "newBudgetAmount"
                }`}
               
                defaultValue={totalAmount}
                onValueChange={(event) => {
                  handleChangeBudget(event)
                  // handleFormChangeAllocation();
                }}
                onKeyPress={onlyNumber}
                disabled={
                  formStatus === "draft" ||
                  formStatus === "rejected" ||
                  status === "created" ||
                  formStatus === "" ||
                  formStatus === undefined
                    ? false
                    : true
                }
              />
            </fieldset>

            <div className="accordian-head-first">
              <img src={astick} alt="" /> <span>Project Budget</span>
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

          <div
            id="collapseOne4"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body project-budget">
              <div>
                {inputFields && inputFields.length > 0 ? (
                  inputFields.map((input, index) => (
                    <div key={index}>
                      <Row className="mb-3">
                        <div className="col-md-3">
                          <fieldset>
                            <span>Brand</span>
                            <Form.Control
                              type="text"
                              defaultValue={input.Brand ? input.Brand.name : ""}
                              className="Form-control mb-0"
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
                              className="Form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2">
                          <fieldset>
                            <span>PackSize</span>
                            <Form.Control
                              type="text"
                              defaultValue={input.SKU ? input.SKU.name : ""}
                              className="Form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2">
                          <fieldset>
                            <span>PackType</span>
                            <Form.Control
                              type="text"
                              defaultValue={
                                input.PackType ? input.PackType.name : ""
                              }
                              className="Form-control mb-0"
                              disabled
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2 w100">
                          <fieldset>
                            <span>Allocation (%)</span>
                            <CurrencyInput
                              type="text"
                              className="Form-control form-control mb-0"
                              name="allocationPercent"
                              maxLength={3}
                              min="1"
                              max="100"
                              value={input.allocationPercent}
                              onValueChange={(event) => {
                                input.allocation = (budgetAmount * event) / 100;
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
                              disabled={
                                formStatus === "draft" ||
                                formStatus === "rejected" ||
                                status === "created" ||
                                formStatus === "" ||
                                formStatus === undefined
                                  ? false
                                  : true
                              }
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2 w100">
                          <fieldset className="disabled">
                            <span>Allocation ($)</span>
                            <CurrencyInput
                              type="text"
                              className="Form-control form-control mb-0"
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
                            <CurrencyInput
                              type="text"
                              className="form-control mb-0"
                              name="budgetRef"
                              value={input.budgetRef}
                              disableGroupSeparators={true}
                              onValueChange={(event) => {
                                handleFormChange(index, "budgetRef", event);
                              }}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Amount (S$)</span>

                            <CurrencyInput
                              type="text"
                              className="Form-control form-control mb-0"
                              name="budgetAmount"
                              value={input.budgetAmount}
                              onValueChange={(event) => {
                                handleFormChange(index, "budgetAmount", event);
                              }}
                              onKeyPress={onlyNumber}
                            />
                          </fieldset>
                        </div>
                        <div className="col-md-1 w100">
                          <fieldset>
                            <span>FY</span>
                            <Form.Control
                              type="text"
                              className="Form-control mb-0"
                              name="fy"
                              min="4"
                              max="4"
                              value={input.fy}
                              onChange={(event) =>
                                handleFormChange(index,"fy",event)
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
                        <div className="col-md-1 w100">
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
                <div className="col-md-1 w100">
                  {formStatus === "completed" ||
                  formStatus === "approved" ||
                  formStatus === "cancelled" ||
                  formStatus === "pending" ||
                  props.productOwner === "Approver" ||
                  props.productOwner === "viewer" ? (
                    ""
                  ) : (
                    <td class="btn-td">
                      {inputFields && inputFields.length ? (
                        <button
                          type="submit"
                          className="save-btn"
                          onClick={submit}
                        >
                          Save
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  )}
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
