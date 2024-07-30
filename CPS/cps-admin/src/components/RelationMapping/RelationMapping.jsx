import React from "react";
import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
function RelationMapping() {
  const [status, setStatus] = useState("sales");
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let { action } = useParams();
  console.log(">>", action);
  const validationSchema = Yup.object().shape({
    dept: Yup.string().required("Department is required").max(40),
  });

  const formik = useFormik({
    initialValues: {
      dept: "",
    },

    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);

      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const radioHandler = (status) => {
    setStatus(status);
  };

  const handleChange = () => {
    setChecked(!checked);
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Level Relation Mapping Role</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                {action === "Modify" &&
                localStorage.getItem("user_role") === "sub_admin" ? (
                  <>
                    <div className="custom-control col-md-12 ">
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Department
                      </label>
                      <div className="department">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="sales"
                            id="flexRadioDefault1"
                            onChange={formik.handleChange}
                            defaultChecked
                            onClick={(e) => radioHandler("sales")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Sales
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="marketing"
                            id="flexRadioDefault2"
                            onChange={formik.handleChange}
                            defaultChecked={formik.values.dept === "marketing"}
                            onClick={(e) => radioHandler("marketing")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Marketing
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="trade_marketing"
                            id="flexRadioDefault2"
                            onChange={formik.handleChange}
                            defaultChecked={
                              formik.values.dept === "trade_marketing"
                            }
                            onClick={(e) => radioHandler("trade_marketing")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Trade Marketing
                          </label>
                        </div>
                      </div>
                      <div className="text-danger">
                        {formik.errors.dept ? formik.errors.dept : null}
                      </div>
                    </div>

                    <div className="col-md-12">
                      {status === "sales" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "sales" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "sales" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "sales" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}

                      {status === "trade_marketing" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}
                      {status === "marketing" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "marketing" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "marketing" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "marketing" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                ) : localStorage.getItem("user_role") === "super_admin" ? (
                  <>
                    <div className="custom-control col-md-12 ">
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Department
                      </label>
                      <div className="department">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="sales"
                            id="flexRadioDefault1"
                            onChange={formik.handleChange}
                            defaultChecked
                            onClick={(e) => radioHandler("sales")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Sales
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="marketing"
                            id="flexRadioDefault2"
                            onChange={formik.handleChange}
                            defaultChecked={formik.values.dept === "marketing"}
                            onClick={(e) => radioHandler("marketing")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Marketing
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="dept"
                            value="trade_marketing"
                            id="flexRadioDefault2"
                            onChange={formik.handleChange}
                            defaultChecked={
                              formik.values.dept === "trade_marketing"
                            }
                            onClick={(e) => radioHandler("trade_marketing")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Trade Marketing
                          </label>
                        </div>
                      </div>
                      <div className="text-danger">
                        {formik.errors.dept ? formik.errors.dept : null}
                      </div>
                    </div>

                    <div className="col-md-12">
                      {status === "sales" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "sales" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "sales" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "sales" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}

                      {status === "trade_marketing" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "trade_marketing" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}
                      {status === "marketing" && (
                        <>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping34"
                            state={{ department: "marketing" }}
                          >
                            Level 3 vs Level 4
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping45"
                            state={{ department: "marketing" }}
                          >
                            Level 4 vs Level 5
                          </Link>
                          <Link
                            className="btn btn-info mx-3"
                            to="/relation-mapping/role-mapping56"
                            state={{ department: "marketing" }}
                          >
                            Level 5 vs Level 6
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="col-md-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="inlineFormCheck"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="inlineFormCheck"
                    >
                      Show List
                    </label>
                  </div>
                  {checked ? (
                    <>
                      <Link
                        className="btn btn-info mx-3"
                        to="/relation-mapping/role-mapping34-listing"
                        state={{ department: "marketing", action: action }}
                      >
                        Level 3 vs Level 4 Listing
                      </Link>
                      <Link
                        className="btn btn-info mx-3"
                        to="/relation-mapping/role-mapping45-listing"
                        state={{ department: "marketing", action: action }}
                      >
                        Level 4 vs Level 5 Listing
                      </Link>

                      <Link
                        className="btn btn-info mx-3"
                        to="/relation-mapping/role-mapping56-listing"
                        state={{ department: "marketing", action: action }}
                      >
                        Level 5 vs Level 6 Listing
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RelationMapping;
