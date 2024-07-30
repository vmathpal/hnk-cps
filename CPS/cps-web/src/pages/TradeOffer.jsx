import React from "react"
import { NavLink } from "react-router-dom"
import Ilogo from "../images/info.svg"
import Table from "react-bootstrap/Table"
import { useFormik } from "formik"
import uploadFileIcon from "../images/upload-file.svg"

const TradeOffer = () => {
  const formik = useFormik({
    initialValues: {
      scopeofevaluation: "",
      explanation: "",
      whatweworked: "",
      whatwedidnotwork: "",
      eventhighlights: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

//   Getting Uploaded Filename

  function handleChange(event) {
      document.querySelector('.uploadedFilename').innerHTML = `${event.target.files[0].name}`;
  }

  function appendRow() {
      alert("It Works !")
  }
  return (
    <>
      <div className="content-area tradeOfferWrapper">
        <div className="top-bar">
          <NavLink to="">
            <div id="backButton"></div>
            <h4>Back</h4>
          </NavLink>
        </div>
        <div className="page-title">
          <h4>Tekka Hawker Trade Offer</h4>
          <b>
            Post By: <span>eddys / 08-Jul-2022</span>
          </b>
        </div>

        <section className="form-holder">
          <div className="form-wrapper">
            <form onSubmit={formik.handleSubmit}>
              <section className="containers">
                <b className="form-title">
                    Project Evaluation <img src={Ilogo}></img>
                </b>
                <div className="form-group">
                  <div>
                    <label htmlFor="scopeofevaluation">
                      Scope Of Evaluation
                    </label>
                    <input
                      id="scopeofevaluation"
                      name="scopeofevaluation"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.scopeofevaluation}
                      placeholder="Type here..."
                    />
                  </div>
                  <div>
                    <label htmlFor="explanation">Please Explain</label>
                    <input
                      id="explanation"
                      name="explanation"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.explanation}
                      placeholder="Type here..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div>
                    <label htmlFor="whatweworked">
                      What worked and we should continue Executing
                    </label>
                    <input
                      id="whatweworked"
                      name="whatweworked"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.whatweworked}
                      placeholder="Type here..."
                    />
                  </div>
                  <div>
                    <label htmlFor="whatwedidnotwork">
                      What did NOT worked and we should stop?
                    </label>
                    <input
                      id="whatwedidnotwork"
                      name="whatwedidnotwork"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.whatwedidnotwork}
                      placeholder="Type here..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div>
                    <label htmlFor="eventhighlights">Event Highlights</label>
                    <input
                      id="eventhighlights"
                      name="eventhighlights"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.eventhighlights}
                      placeholder="Type here..."
                    />
                  </div>
                  <div>
                    <label htmlFor="objective" className="radio-btn">Was Objective Achieved?</label>
                        <div className="radio-wrapper">
                            <div>
                                <input type="radio" name="r" id="yes" value="yes"></input>
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div>
                                <input type="radio" name="r" id="no" value="no"></input>
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                  </div>
                </div>
              </section>

              <section className="containers">
                <Table variant="light">
                  <thead>
                    <tr>
                      <th className="form-title" colSpan={3}>
                        File Attachment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    <tr className="table-context">
                      <td>File</td>
                      <td>Description</td>
                      <td></td>
                    </tr>
                    <tr className="upload-area">
                      <td>
                        <label htmlFor="uploadFile" className="upload">
                            <img src={uploadFileIcon} alt="Upload File"></img>
                        </label>
                        <span
                          id="uploadedFilename"
                          className="uploadedFilename"
                        >
                          File attachment 1.ppt
                        </span>
                        <input type="file" id="uploadFile" onChange={handleChange}></input>
                      </td>
                      <td>Description 01</td>
                      <td className="addRow" onClick={appendRow}>+ Add</td>
                    </tr>
                  </tbody>
                </Table>
              </section>
              <div className="button-container">
                <button type="reset">Cancel</button>
                <button type="submit">Save &amp; Next</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default TradeOffer;
