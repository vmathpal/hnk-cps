import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import Ilogo from "../../Assests/images/info.svg";
import Binimg from "../../Assests/images/bin.svg";
import Editimg from "../../Assests/images/edit.svg";
import LoadingSpinner from "../Loader/LoadingSpinner";
import {TimeOutPopUp} from "../TimeOut";
import FileUpload from "./FileUpload";
import BrandSelection from "./BrandSelection";
import { NavLink } from "react-router-dom";
function AreaDistrict() {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("created");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [channels, setChannels] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedchannel, setSelectedChannel] = useState("");
  const [selectedarea, setSelectedArea] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [editID, setSetEditID] = useState("");
  const [defValue, setDefValue] = useState("");
  const [inputs, setInputs] = useState({});
  const [selectedinfo, setSelectedAreaDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const [todos, setTodos] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getChannels();
  }, []);

  const getAllCreatedData = async () => {
    setIsLoadData(true);
    await axios
      .get(
        process.env.REACT_APP_API_KEY +
          "project-list/" +
          localStorage.getItem("projectID"),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
          },
        }
      )
      .then(function (response) {
        setStatus(response.data.data.status);
        setIsLoadData(false);
        setTodos(response.data.data);
        localStorage.setItem("isEdit", "false");
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  useEffect(() => {
    getAllCreatedData();
  }, []);

  // function to handle when the "Edit" button is clicked
  const handleEditClick = async (id, pid) => {
    setIsEditing(true);
    setIsEditing(true);
    setSetEditID(id);
    localStorage.setItem("isEdit", "true");
    //setIsLoadData(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "area-district/" + id, {
        params: {
          status: status,
          projectID: localStorage.getItem("projectID"),
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then((res) => {
        console.log("Edit data", res.data.data);
        localStorage.setItem("channel", res.data.data.Channel.name);
        localStorage.setItem("area", res.data.data.Arium.name);
        localStorage.setItem("district", res.data.data.District.name);
        setSelectedChannel(res.data.data.Channel.id);
        setSelectedDistrict(res.data.data.District.id);
        getChannels();
        channelHandel(res.data.data.Channel.id);
        areaHandel(res.data.data.Arium.id);
        // setIsLoadData(false);
      })
      .catch((error) => {
        setIsLoadData(false);

        console.log("error>>>>>", error.message);
      });
  };
  function handleDeleteClick(id, pid) {
    axios
      .delete(process.env.REACT_APP_API_KEY + "delete-area-district/" + id, {
        params: {
          status: status,
          projectID: localStorage.getItem("projectID"),
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then((res) => {
        getAllCreatedData();
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  }
  const area = [];
  const district = [];
  const data = [];

  const getChannels = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-channels-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setChannels(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (channels) {
    channels.forEach((element) => {
      data.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const channelHandel = async (e) => {
    let id = localStorage.getItem("isEdit") === "true" ? e : e.target.value;
    setSelectedArea("");

    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedChannel(id);
    await axios
      .get(process.env.REACT_APP_API_KEY + "getAreaList/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          status: status,
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then((response) => {
        if (response.data.data.length <= 0) {
          setSelectedArea("");
        }
        setAreas(response.data.data);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  if (areas) {
    areas.forEach((element) => {
      area.push({
        value: element.id,
        label: element.name,
      });
    });
  }
  const areaHandel = (e) => {
    let id = localStorage.getItem("isEdit") === "true" ? e : e.target.value;
    setSelectedDistrict("");
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedArea(id);
    axios
      .get(process.env.REACT_APP_API_KEY + "getDistrictList/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.data.length <= 0) {
          setSelectedDistrict("");
        }
        setDistricts(response.data.data);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };
  if (districts) {
    districts.forEach((element) => {
      district.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const districtHandel = (e) => {
    let id = localStorage.getItem("isEdit") === "true" ? e : e.target.value;
    if (typeof e === "object") {
      id = e.target.value;
    }
    setSelectedDistrict(id);
  };
  const validationSchema = Yup.object().shape({
    channelID: Yup.string().required("channel is required"),
    ariaID: Yup.string().required("area is required"),
    districtID: Yup.string().required("district is required"),
  });

  let url =
    localStorage.getItem("isEdit") === "true"
      ? "area-district/" + editID
      : "area-district";

  const initialValues = {
    channelID: selectedchannel,
    ariaID: selectedarea,
    districtID: selectedDistrict,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
                TimeOutPopUp(navigate);
                return;
              }
      setIsEditing(false);
      localStorage.setItem("isEdit", "false");
      setIsLoading(true);
      setSelectedChannel("");
      setSelectedArea("");
      setSelectedDistrict("");
      window.localStorage.removeItem("channel");
      window.localStorage.removeItem("district");
      window.localStorage.removeItem("area");
      await axios
        .post(process.env.REACT_APP_API_KEY + url, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: status,
            projectID:
              status === "created" ? "" : localStorage.getItem("projectID"),
            userID: localStorage.getItem("authID"),
          },
        })
        .then((res) => {
          // eslint-disable-next-line no-unused-expressions
          isEditing
            ? ""
            : localStorage.setItem("projectID", res.data.data[0].projectID);
          getAllCreatedData();
          setSelectedChannel("");
          setSelectedArea("");
          setSelectedDistrict("");
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });

      // console.log(data);
    },
  });

  if (isLoadData) {
    return <div></div>;
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>{localStorage.getItem("action") === "view" ? "" : "Edit"}</h1>
          </div>
        </div>
      </div>
      <div className="back-link " style={{ color: "black", fontSize: 18 }}>
        <NavLink
          to={{
            pathname: "/project-management/edit-basic-info",
          }}
          state={{
            productID: localStorage.getItem("projectID"),
            userID: localStorage.getItem("authID"),
            action: localStorage.getItem("action"),
          }}
        >
          Back
        </NavLink>
      </div>
      <div className="accordion-item sec-acc">
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <span>Region & District</span>
            <img src={Ilogo} alt="" className="ms-3" />
          </div>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne1"
            aria-expanded="true"
            aria-controls="collapseOne"
          ></button>
        </h2>
        <div
          id="collapseOne1"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <div className="">
              <form onSubmit={formik.handleSubmit} id="create-course-form">
                <table className="table admin-table table-striped ">
                  <tr>
                    <th>Region</th>
                    <th>District</th>
                    <th>Sales Region</th>
                    <th></th>
                  </tr>

                  {todos.id ? (
                    todos.ProjectAreaDistricts.map((todo, index) => (
                      <React.Fragment key={++index}>
                        <tr>
                          <td>{todo.Channel?.name}</td>
                          <td>{todo.Arium?.name}</td>
                          <td>{todo.District?.name}</td>
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
                                  onClick={() =>
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
                        <span>Region</span>
                        <select
                          name="channelID"
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => channelHandel(e)}
                          defaultValue={formik.values.channelID}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">--Select Region--</option>
                          {channels.map((channel, index) => (
                            <option
                              key={index}
                              value={channel.id}
                              selected={
                                channel.name === localStorage.getItem("channel")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {channel.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.channelID && formik.touched.channelID
                            ? formik.errors.channelID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td>
                      <fieldset>
                        <span>District</span>
                        <select
                          name="ariaID"
                          value={formik.values.ariaID}
                          className="common-select form-control p-2 form-select"
                          onChange={(e) => areaHandel(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">--Select District--</option>
                          {areas.map((area, index) => (
                            <option
                              key={index}
                              value={area.id}
                              selected={
                                area.name === localStorage.getItem("area")
                                  ? "selected"
                                  : ""
                              }
                            >
                              {area.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.ariaID && formik.touched.ariaID
                            ? formik.errors.ariaID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td>
                      <fieldset>
                        <span>Sales Region</span>
                        <select
                          name="districtID"
                          value={formik.values.districtID}
                          className="common-select form-control p-2   form-select"
                          onChange={(e) => districtHandel(e)}
                          disabled={
                            localStorage.getItem("action") === "view"
                              ? true
                              : false
                          }
                        >
                          <option value="">--Select Sales Region--</option>
                          {districts.map((district, index) => (
                            <option
                              key={index}
                              value={district.id}
                              selected={
                                district.name ===
                                localStorage.getItem("district")
                                  ? "selected"
                                  : ""
                              }
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                            >
                              {district.name}{" "}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {formik.errors.districtID && formik.touched.districtID
                            ? formik.errors.districtID
                            : null}
                        </span>
                      </fieldset>
                    </td>
                    <td className="btn-td">
                      {localStorage.getItem("action") !== "view" ? (
                        <button type="submit" className="save-btn">
                          {localStorage.getItem("isEdit") === "true"
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
      <BrandSelection />
      <br></br>
      <FileUpload />
      <div>
        <button>
          <Link className="save-btn" to="/project-management/edit-financial">
            Next Step
          </Link>
        </button>
      </div>
    </>
  );
}

export default AreaDistrict;
