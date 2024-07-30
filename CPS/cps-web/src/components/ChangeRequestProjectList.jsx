import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";

import LoadingSpinner from "./Loader/LoadingSpinner";
import { Link } from "react-router-dom";

const ChangeRequestProjectList = () => {
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getListProject();
  }, []);

  const getListProject = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "get-change-request-list/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        role: "user",
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log("Change Request List", response.data.data);
        setProject(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
    <>
      <section className="blocks padding-0">
        <Table stripped className="blocks table-responsive change-request">
          {/* Table 08 */}

          <tbody>
            <tr>
              <th className="blue-bold">Request ID</th>
              <th className="blue-bold">Project Name</th>
              <th className="blue-bold">Requested On</th>
              <th className="blue-bold">Type</th>
              <th className="blue-bold">Project Status</th>
              <th className="blue-bold">Details</th>
              <th className="blue-bold">Approval Status</th>
            </tr>

            {project.length > 0 ? (
              <>
                {project.map((pro, index) => (
                  <tr key={index}>
                    <td>REQ{pro.id}</td>
                    <td>{pro.name}</td>
                    <td>{dateFormat(pro.updatedAt, "dd mmm yyyy")}</td>
                    <td>{pro.projectType}</td>
                    <td>
                      <button className={`table-btn ${pro.ChangeStatus}`}>
                        {pro.ChangeStatus === "approved"
                          ? "Approved"
                          : "Pending"}
                      </button>
                    </td>

                    <td>
                      <NavLink
                        className="add-action-button take-action"
                        to={{
                          pathname: "/create-project/" + pro.id,
                        }}
                        state={{
                          productOwner: "creator",
                        }}
                      >
                        View
                      </NavLink>
                    </td>

                    <td>
                      <NavLink
                        className="add-action-button take-action"
                        to={{
                          pathname: "/project-runtime-status/" + pro.id,
                        }}
                      >
                        Check
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <div>
                <p style={{ color: "#0f2f81", marginLeft: 20 }}>
                  Project Not Found
                </p>
              </div>
            )}
          </tbody>
        </Table>
      </section>
    </>
  );
};

export default ChangeRequestProjectList;
