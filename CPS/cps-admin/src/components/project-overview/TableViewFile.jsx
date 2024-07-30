import React from "react";
import fileIcon from "../../Assests/images/file.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
const TableViewFile = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getFilesList();
  }, []);
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
  const getFilesList = async () => {
    if (!localStorage.getItem("token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "file-list/" + props.projectID, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          fileType: "new-request",
        },
      })
      .then(function (response) {
        setFiles(response.data.data);
        console.log("Project File", response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  return (
    <>
      <table className="classic stripped">
        <thead>
          <tr>
            <th>File</th>
            <th>Description</th>
          </tr>
          {files.length > 0 ? (
            files.map((data, index) => (
              <React.Fragment key={++index}>
                <tr>
                  {" "}
                  <td>
                    <div className="upload-area">
                      <label htmlFor="choose-file">
                        <span className="file-icon">
                          <img src={fileIcon} alt="Choose File"></img>
                        </span>
                      </label>
                      <span
                        className="file-span"
                        onClick={() =>
                          (window.location.href =
                            process.env.REACT_APP_CLIENT_URL + data.file)
                        }
                      >
                        <span className="file-name">{data.file}</span>
                      </span>
                    </div>
                  </td>
                  <td>{data?.description}</td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <span></span>
          )}
        </thead>
      </table>
    </>
  );
};

export default TableViewFile;
