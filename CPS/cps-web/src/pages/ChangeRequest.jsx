import React from "react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { IoCloseSharp } from "react-icons/io5"
import Select from "react-select"
import Ilogo from "../images/info.svg"
import Binimg from "../images/bin.svg"
import Editimg from "../images/edit.svg"
import uploadFileIcon from "../images/upload-file.svg"
import Table from "react-bootstrap/Table"

const ChangeRequest = () => {
  const [isActive, setIsActive] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const options = [
    { value: "front-end", label: "Front-end" },
    { value: "back-end", label: "Back-end" },
    { value: "others", label: "Others" },
  ];

  const brandOptions = [
    { value: "heineken", label: "Heineken" },
    { value: "guinness", label: "Guinness" },
    { value: "others", label: "Others" },
  ];

  const FyOptions = [{ label: "2022" }, { label: "2021" }, { label: "2020" }];

  const centreCodeOptions = [
    { label: "240ANSG" },
    { label: "241ANSG" },
    { label: "242ANSG" },
  ];

  const SCOAoptions = [
    { label: "38906.439" },
    { label: "38906.438" },
    { label: "38906.437" },
  ];

  const reviewerOptions = [
    {label: "Adrian Mah"},
    {label: "Alaina Lim"},
    {label: "Alen Leng"},
    {label: "Alex lim"},
  ];

  function handleChange(event) {
    document.querySelector(
      ".uploadedFilename"
    ).innerHTML = `${event.target.files[0].name}`;
  }

  function appendRow() {
    alert("It Works !");
  }

  const handleClick = (e) => {
    setIsActive((current) => !current);
  };

  return (
    <>
      <div className="content-area changeRequest">
        <div className="top-bar">
          <NavLink to="">
            <div id="backButton"></div>
            <h4>Back</h4>
          </NavLink>
        </div>
        <div className="page-title">
          <h4>Change Request</h4>
        </div>

        <section className="acc-content-wrapper">
          {/* Accordion 01*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <div className="accordian-head-first">
                      <span>Project ID</span>
                      <Form.Control
                        type="text"
                        className="input-disabled"
                        placeholder=""
                        value="REQ001"
                        disabled
                      />
                    </div>
                    <div className="accordian-head-second">
                      <span>Request Status:</span>
                      <button className="custom-badge">Working</button>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div className="acc-contents">
                      <Row>
                        <div className="col-md-6 ps-0">
                          <Row>
                            <div className="col-md-12 ps-0">
                              <Row>
                                <div className="col-md-6 ps-0">
                                  <div className="date-type">
                                    <fieldset>
                                      <div className="ilogo">
                                        <span>Request Date</span>
                                      </div>
                                      <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                      />
                                    </fieldset>
                                  </div>
                                </div>
                                <div className="col-md-6 pe-0">
                                  <fieldset>
                                    <span>Request Type</span>
                                    <Select
                                      options={options}
                                      menuPosition="absolute"
                                      menuPortalTarget={document.body}
                                      closeMenuOnScroll={true}
                                      closeMenuOnSelect={() => true}
                                    />
                                  </fieldset>
                                </div>
                              </Row>
                            </div>
                            <div className="col-md-12 ps-0">
                              <fieldset>
                                <span>Remark</span>
                                <textarea
                                  class="form-control remark-text"
                                  placeholder=""
                                  id="floatingTextarea"
                                >
                                  Lorem ipsum dolor sit amet, consetetur
                                  sadipscing elitr, sed diam nonumy eirmod
                                  tempor invidunt ut labore et dolore magna
                                  aliquyam erat, sed diam voluptua. At vero eos
                                  et accusam et justo duo dolores et ea rebum.
                                  Stet clita kasd gubergren, no sea takimata
                                </textarea>
                              </fieldset>
                            </div>
                          </Row>
                        </div>
                        <div className="col-md-6 ps-0">
                          <Row>
                            <div className="col-md-12 p-0">
                              <Row>
                                <div className="col-md-6 ps-0">
                                  <fieldset>
                                    <div className="ilogo">
                                      <span>Cost Start Date</span>
                                    </div>
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                    />
                                  </fieldset>
                                </div>
                                <div className="col-md-6 pe-0">
                                  <fieldset>
                                    <div className="ilogo">
                                      <span>Cost End Date</span>
                                    </div>
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                    />
                                  </fieldset>
                                </div>
                              </Row>
                            </div>
                            <div className="col-md-12 p-0">
                              <Row>
                                <div className="col-md-6 ps-0">
                                  <fieldset>
                                    <div className="ilogo">
                                      <span>Selling Start Date</span>
                                    </div>
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                    />
                                  </fieldset>
                                </div>
                                <div className="col-md-6 pe-0">
                                  <fieldset>
                                    <div className="ilogo">
                                      <span>Selling End Date</span>
                                    </div>
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                    />
                                  </fieldset>
                                </div>
                              </Row>
                            </div>
                          </Row>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 02*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingTwo">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    <div className="accordian-head-first w-100">
                      <Row className="wrapper">
                        <span className="col-md-2 center">
                          Project Budget <img src={Ilogo}></img>
                        </span>
                        <fieldset className="col-md-4 project-budget-amount">
                          <span className="customize">
                            Total Project Budget Amount
                          </span>
                          <Form.Control
                            type="text"
                            value="S$20000"
                            className="Form-control disabled"
                            disabled
                          />
                        </fieldset>
                        <fieldset className="col-md-4">
                          <span>New Total Budget Amount</span>
                          <Form.Control
                            type="text"
                            value=""
                            className="Form-control"
                          />
                        </fieldset>
                      </Row>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div className="acc-contents">
                      <Row className="mt-3">
                        <div className="col-md-3">
                          <fieldset>
                            <span>Select Brand</span>
                            <Select
                              options={brandOptions}
                              menuPosition="absolute"
                              menuPortalTarget={document.body}
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={() => true}
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset>
                            <span>Allocation (%)</span>
                            <Form.Control
                              type="text"
                              value="90"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset>
                            <span>Allocation ($)</span>
                            <Form.Control
                              type="text"
                              value="27000"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Ref. # ( Optional )</span>
                            <Form.Control
                              type="text"
                              value="1523812"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Amount (S$)</span>
                            <Form.Control
                              type="text"
                              value="34000"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset>
                            <span>FY</span>
                            <Select
                              options={FyOptions}
                              menuPosition="absolute"
                              menuPortalTarget={document.body}
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={() => true}
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <div className="green-badge">Budgeted</div>
                        </div>

                        <div className="col-md-1">
                          <td class="btn-td">
                            <button type="button" class="save-btn btn-blue m-0">
                              Save
                            </button>
                          </td>
                        </div>
                      </Row>

                      <Row className="mt-3">
                        <div className="col-md-3">
                          <fieldset>
                            <span>Select Brand</span>
                            <Select
                              options={brandOptions}
                              menuPosition="absolute"
                              menuPortalTarget={document.body}
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={() => true}
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset>
                            <span>Allocation (%)</span>
                            <Form.Control
                              type="text"
                              value="10"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset>
                            <span>Allocation ($)</span>
                            <Form.Control
                              type="text"
                              value="3000"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-2">
                          <fieldset>
                            <span>Budget Ref. # ( Optional )</span>
                            <Form.Control
                              type="text"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-2">
                          <fieldset className="lowopacity">
                            <span>Budget Amount (S$)</span>
                            <Form.Control
                              type="text"
                              className="Form-control"
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1">
                          <fieldset className="lowopacity">
                            <span>FY</span>
                            <Select
                              options={FyOptions}
                              menuPosition="absolute"
                              menuPortalTarget={document.body}
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={() => true}
                              disabled
                            />
                          </fieldset>
                        </div>

                        <div className="col-md-1 badge-col">
                          <div className="red-badge">Unbudgeted</div>
                        </div>

                        <div className="col-md-1">
                          <td class="btn-td">
                            <button type="button" class="save-btn btn-blue m-0">
                              Save
                            </button>
                          </td>
                        </div>
                      </Row>
                      <div className="w-100 text-end pe-4">
                        <NavLink to="">+ Add</NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 03*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingThree">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    <div className="accordian-head-first center">
                      <span>
                        Project Expenses <img src={Ilogo}></img>
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body p-0">
                    <div className="acc-contents">
                      <Table variant="light" className="table mb-0">
                        <thead>
                          <tr>
                            <th className="blue-bold">Code</th>
                            <th className="blue-bold">Brand</th>
                            <th className="blue-bold">Expenses</th>
                            <th className="blue-bold">Cost Center Code</th>
                            <th className="blue-bold">SCOA</th>
                            <th className="blue-bold">Last Project ($)</th>
                            <th className="blue-bold">Budget ($)</th>
                            <th className="blue-bold"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>254</td>
                            <td>Heineken</td>
                            <td>
                              Expenses - Miscellanous - Outlet Singnages -
                              others
                            </td>
                            <td>240ANSG</td>
                            <td>38906.439</td>
                            <td>10,000.00</td>
                            <td>1800</td>
                            <td>
                              <img src={Editimg} alt="Edit" title="Edit" className="m-16"></img>
                              <img
                                src={Binimg}
                                alt="Delete"
                                title="Delete"
                              ></img>
                            </td>
                          </tr>
                          <tr>
                            <td>254</td>
                            <td>Heineken</td>
                            <td>
                              Roving - Tactical Activation - Brand Development -
                              Others
                            </td>
                            <td>240ANSG</td>
                            <td>38325.622</td>
                            <td>0.00</td>
                            <td>200</td>
                            <td>
                              <img src={Editimg} alt="Edit" title="Edit" className="m-16"></img>
                              <img
                                src={Binimg}
                                alt="Delete"
                                title="Delete"
                              ></img>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <div className="extra-row">
                        <div className="item-wrapper">
                          <div className="row-item">
                            <fieldset>
                              <span>Select Brand</span>
                              <Select
                                options={brandOptions}
                                menuPosition="absolute"
                                menuPortalTarget={document.body}
                                closeMenuOnScroll={true}
                                closeMenuOnSelect={() => true}
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <fieldset>
                              <span>Expenses</span>
                              <Form.Control
                                type="text"
                                className="Form-control"
                                value="Roving"
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <fieldset>
                              <span>Cost Center Code</span>
                              <Select
                                options={centreCodeOptions}
                                menuPosition="absolute"
                                menuPortalTarget={document.body}
                                closeMenuOnScroll={true}
                                closeMenuOnSelect={() => true}
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <fieldset>
                              <span>SCOA</span>
                              <Select
                                options={SCOAoptions}
                                menuPosition="absolute"
                                menuPortalTarget={document.body}
                                closeMenuOnScroll={true}
                                closeMenuOnSelect={() => true}
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <fieldset>
                              <span>Last Project ($)</span>
                              <Form.Control
                                type="text"
                                className="Form-control"
                                value="500"
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <fieldset>
                              <span>Budget ($)</span>
                              <Form.Control
                                type="text"
                                className="Form-control"
                                value="2022"
                              />
                            </fieldset>
                          </div>
                          <div className="row-item">
                            <button type="button" className="save-btn m-0">
                              Save
                            </button>
                          </div>
                        </div>
                      </div>

                      <div id="grand-total">
                        <div className="d-flex align-items-center">
                          <span>Total:</span>
                          <div className="total-num">
                            Last Project ($): 5,000
                          </div>
                          <div className="total-num">
                            Current Project ($): 2000
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="blocks">
            <table className="default-table" width="100%">
              {/* Table 04 */}
              <thead>
                <tr>
                  <th className="table-caption blue-bold font-18" colSpan={3}>
                    Heineken 24 x 500 ml (Optional)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th></th>
                  <th className="black-bold">Last Project Budget</th>
                  <th className="black-bold">Budget</th>
                </tr>
                <tr>
                  <td className="black-bold">
                    Volume without promotion during this period (hl)
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                </tr>
                <tr>
                  <td className="black-bold">
                    Volume with promotion during this period (hl)
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                </tr>
                <tr>
                  <td className="black-bold">Contribution per hl ($)</td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                </tr>
                <tr>
                  <td className="black-bold">Other Contribution ($)</td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            className="Form-control"
                     />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="blocks">
            <table className="default-table" width="100%">
              <tbody>
                <tr>
                  <td className="blue-bold">
                    Volume increase with promotion (hl)
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            disabled
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            disabled
                            className="Form-control"
                     />
                  </td>
                </tr>
                <tr>
                  <td className="blue-bold">
                    Total incremental contribution form promotion ($)
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            disabled
                            className="Form-control"
                     />
                  </td>
                  <td>
                    <Form.Control
                            type="text"
                            value="0"
                            disabled
                            className="Form-control"
                     />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="button-container">
            <button type="reset">Compute</button>
            <button type="submit">Enter Manually</button>
          </section>

          <section className="blocks">
            <table className="default-table" width="100%">
              {/* Table 04 */}
              <thead>
                <tr>
                  <th className="table-caption black-bold" colSpan={3}>
                    Total Profit <img src={Ilogo} className="ms-1"></img>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th className="blue-bold">Total Profit from promotion ($)</th>
                  <th className="blue-bold">
                    <Form.Control
                      type="text"
                      value="-13,900.00"
                      className="Form-control"
                      disabled
                    />
                  </th>
                  <th className="blue-bold">
                    <Form.Control
                      type="text"
                      value="-19,800.00"
                      className="Form-control"
                      disabled
                    />
                  </th>
                </tr>
                <tr>
                  <td className="black-bold">ROI</td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-0.99"
                      className="Form-control"
                      disabled
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-0.99"
                      className="Form-control"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td className="black-bold">Net Contribution per hl ($)</td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-2,780.00"
                      className="Form-control"
                      disabled
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-2,475.00"
                      className="Form-control"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td className="black-bold">Promotion spend per hl ($)</td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-2,800.00"
                      className="Form-control"
                      disabled
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value="-2,500.00"
                      className="Form-control"
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Accordion 04*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingFour">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="true"
                    aria-controls="collapseFour"
                  >
                    <div className="accordian-head-first">
                      <span>File Attachment</span>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingFour"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body py-0 fileuploadpanel">
                    <div className="acc-contents">
                      <Table variant="light mb-0">
                        <tbody className="table-body">
                          <tr className="table-context">
                            <td className="blue-bold">File</td>
                            <td className="blue-bold">Description</td>
                            <td></td>
                          </tr>
                          <tr className="upload-area">
                            <td>
                              <label htmlFor="uploadFile" className="upload">
                                <img
                                  src={uploadFileIcon}
                                  alt="Upload File"
                                ></img>
                              </label>
                              <span
                                id="uploadedFilename"
                                className="uploadedFilename"
                              >
                                File attachment 1.ppt
                              </span>
                              <input
                                type="file"
                                id="uploadFile"
                                onChange={handleChange}
                              ></input>
                            </td>
                            <td>Description 01</td>
                            <td className="text-end">
                              <img src={Binimg}></img>
                            </td>
                          </tr>

                          <tr className="upload-area">
                            <td>
                              <label htmlFor="uploadFile" className="upload">
                                <img
                                  src={uploadFileIcon}
                                  alt="Upload File"
                                ></img>
                              </label>
                              <span
                                id="uploadedFilename"
                                className="uploadedFilename"
                              >
                                File attachment 1.ppt
                              </span>
                              <input
                                type="file"
                                id="uploadFile"
                                onChange={handleChange}
                              ></input>
                            </td>
                            <td>Description 01</td>
                            <td className="text-end">
                              <img src={Binimg}></img>
                            </td>
                          </tr>

                          <tr className="upload-area">
                            <td></td>
                            <td></td>
                            <td className="addRow text-end" onClick={appendRow}>
                              <NavLink to="">+ Add</NavLink>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 05*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingFive">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFive"
                    aria-expanded="true"
                    aria-controls="collapseFive"
                  >
                    <div className="accordian-head-first">
                      <span>
                        Project Reviewers <img src={Ilogo} className="ms-1"></img>
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseFive"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingFive"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div className="acc-contents">
                      <Row>
                        <div className="col-md-6 ps-0">
                          <div>
                            <p className="black-bold mb-2">Select Reviewer</p>
                          </div>
                          <div className="blue-select">
                            <Select
                              options={reviewerOptions}
                              menuPosition="absolute"
                              menuPortalTarget={document.body}
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={() => true}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 pe-0">
                          <div>
                            <p className="black-bold mb-3">Reorder Reviewersr</p>
                          </div>
                          <ul id="sortable">
                            <li class="ui-state-default">
                              <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                              ASM KA
                              <IoCloseSharp />
                            </li>
                            <li class="ui-state-default">
                              <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                              ASM BD
                              <IoCloseSharp />
                            </li>
                            <li class="ui-state-default">
                              <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                              Alaina Lim
                              <IoCloseSharp />
                            </li>
                            <li class="ui-state-default">
                              <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                              Alvin Tham
                              <IoCloseSharp />
                            </li>
                            <li class="ui-state-default">
                              <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
                              Alson Tan
                              <IoCloseSharp />
                            </li>
                          </ul>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 06*/}

          <div className="accordion-box">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item ">
                <h2 class="accordion-header" id="headingSix">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSix"
                    aria-expanded="true"
                    aria-controls="collapseSix"
                  >
                    <div className="accordian-head-first">
                      <span>
                        Last Approver flow <img src={Ilogo} className="ms-1"></img>
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseSix"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingSix"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div className="acc-contents">
                      <div class="accordion-body customTimeline">
                        <ul>
                          <li
                            title="Adrian Mah (Business Analyst Sales)"
                            className={isActive ? "active" : ""}
                            id={1}
                            onClick={handleClick}
                          >
                            <b>Adrian Mah</b>
                            <p>Business Analyst Sales</p>
                          </li>

                          <li
                            title="Alaina Lim (ASM KA, ASM BD)"
                            className={isActive ? "active" : ""}
                            id={2}
                            onClick={handleClick}
                          >
                            <b>Alaina Lim</b>
                            <p>(ASM KA, ASM BD)</p>
                          </li>

                          <li
                            title="Alen Leng (Cost Centre Owner)"
                            className={isActive ? "active" : ""}
                            id={3}
                            onClick={handleClick}
                          >
                            <b>Alen Leng</b>
                            <p>Cost Centre Owner</p>
                          </li>

                          <li
                            title="Alex lim (MOB ASM)"
                            className={isActive ? "active" : ""}
                            id={4}
                            onClick={handleClick}
                          >
                            <b>Alex lim</b>
                            <p>MOB ASM</p>
                          </li>

                          <li
                            title="Adrian Mah (Channel Manager TOP)"
                            className={isActive ? "active" : ""}
                            id={5}
                            onClick={handleClick}
                          >
                            <b>Adrian Mah</b>
                            <p>Channel Manager TOP</p>
                          </li>

                          <li
                            title="Adrian Mah (Channel Head TOP)"
                            className={isActive ? "active" : ""}
                            id={6}
                            onClick={handleClick}
                          >
                            <b>Adrian Mah</b>
                            <p>Channel Head TOP</p>
                          </li>

                          <li
                            title="Adrian Mah (Sales Director)"
                            className={isActive ? "active" : ""}
                            id={7}
                            onClick={handleClick}
                          >
                            <b>Adrian Mah</b>
                            <p>Sales Director</p>
                          </li>

                          <li
                            title="Adrian Mah (General Manager)"
                            className={isActive ? "active" : ""}
                            id={8}
                            onClick={handleClick}
                          >
                            <b>Adrian Mah</b>
                            <p>General Manager</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-btn justify-content-start">
            <button type="button" className="white-btn">
              Cancel
            </button>
            <button type="button" className="blue-btn">
              Request Now
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChangeRequest;
