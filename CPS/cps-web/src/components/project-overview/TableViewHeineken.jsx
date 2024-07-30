import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/esm/Table";
import CurrencyInput from "react-currency-input-field";
const TableViewHeineken = (props) => {
  const [inputFields, setInputFields] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Finance Data PID", props.projectID);
  useEffect(() => {
    getAllBrandSKU(props.projectID);
  }, []);
  const getAllBrandSKU = async (id) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + id,
      method: "get",
      params: {
        url: "all-brand-sku",
        userID: localStorage.getItem("authID"),
        projectID: props.projectID,
        role: localStorage.getItem("auth_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        setInputFields(response.data.data);

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

        // setbudgetProjectTotalIncrement(budgetProjectTotalIncrement);
        // //setTotalBudgetIncrease(setTotalBudgetIncrease);
        // setLastbudgetProjectTotalIncrement(lastbudgetProjectTotalIncrement);
        // console.log("lastbugdetIncrement", lastbugdetIncrement);
        // localStorage.setItem("setTotalBudgetIncrease", setTotalBudgetIncrease);
        // localStorage.setItem(
        //   "setTotalLastBudgetIncrease",
        //   setTotalLastBudgetIncrease
        // );
        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  return (
    <>
      <div className="table-responsive-md">
        {inputFields ? (
          inputFields.map((input, index) => (
            <>
              <React.Fragment key={index}>
                <Table responsive className="over-view over-view-section-table cp-table" key={index} >
                  <tr key={index}>
                    <th width="40%">
                      <h5
                        style={{
                          color: "#0f2f81",
                          fontFamily: "HEINEKEN-Bold",
                        }}
                      >
                        {input.Brand ? input.Brand.name : ""}
                        &nbsp; &nbsp;
                        {input.lineExtension ? input.lineExtension.name : ""}
                        &nbsp; &nbsp;
                        {input.SKU ? input.SKU.name : ""}
                        &nbsp; &nbsp;
                        {input.PackType ? input.PackType.name : ""}
                      </h5>
                    </th>
                    <th>Last Project Budget</th>
                    <th>Budget</th>
                  </tr>
                  <tr>
                    <td className="bold-text-finance">
                      Volume without promotion during this period (hl)
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="volumeWithoutLastBudget"
                        value={input.volumeWithoutLastBudget}
                        
                      />
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="volumeWithoutBudget"
                        value={input.volumeWithoutBudget}
                        
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="bold-text-finance">
                      Volume with promotion during this period (hl)
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="volumeWithLastBudget"
                        value={input.volumeWithLastBudget}
                        
                      />
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="volumeWithBudget"
                        value={input.volumeWithBudget}
                        
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="bold-text-finance">
                      Contribution per hl ($)
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="contributeLastBudget"
                        value={input.contributeLastBudget}
                        
                      />
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="contributeBudget"
                        value={input.contributeBudget}
                        
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="bold-text-finance bold-text-finance-overview ">
                      Other Contribution ($)
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="othContributeLastBudget"
                        value={input.othContributeLastBudget}
                        
                      />
                    </td>
                    <td>
                      <CurrencyInput
                        type="text"
                        className="Form-control form-control empty-field"
                        name="othContributeBudget"
                        value={input.othContributeBudget}
                        
                      />
                    </td>
                  </tr>
                  <tr className="content">
                    <td colSpan={3}>
                      {" "}
                      <hr style={{
                        margin : "0px"
                      }}></hr>
                    </td>
                  </tr>
                  <tr key={index}>
                        <td className="bold-text-finance">
                          Volume increase with promotion (hl)
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="lastProjectVolumeInc"
                            value={
                              input.lastProjectVolumeInc
                                ? input.lastProjectVolumeInc.toFixed(2)
                                : input.lastProjectVolumeInc
                            }
                            
                          />
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"

                            name="budgetVolumeIncrease"
                            value={
                              input.budgetVolumeIncrease
                                ? input.budgetVolumeIncrease.toFixed(2)
                                : input.budgetVolumeIncrease
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="bold-text-finance ">
                          Total incremental contribution form promotion ($)
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="lastProjectTotalIncrement"
                            value={
                              input.lastProjectTotalIncrement
                                ? input.lastProjectTotalIncrement.toFixed(2)
                                : input.lastProjectTotalIncrement
                            }
                            
                          />
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="budgetProjectTotalIncrement"
                            value={
                              input.budgetProjectTotalIncrement
                                ? input.budgetProjectTotalIncrement.toFixed(2)
                                : input.budgetProjectTotalIncrement
                            }
                            
                          />
                        </td>
                      </tr>
                </Table>

                <div className="mid-box">
                  <div className="table-responsive-md" >
                    {/* <Table responsive className="cp-table2 over-view-section-table">
                      <tr key={index}>
                        <td className="bold-text-finance">
                          Volume increase with promotion (hl)
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="lastProjectVolumeInc"
                            value={
                              input.lastProjectVolumeInc
                                ? input.lastProjectVolumeInc.toFixed(2)
                                : input.lastProjectVolumeInc
                            }
                            
                          />
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"

                            name="budgetVolumeIncrease"
                            value={
                              input.budgetVolumeIncrease
                                ? input.budgetVolumeIncrease.toFixed(2)
                                : input.budgetVolumeIncrease
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="bold-text-finance ">
                          Total incremental contribution form promotion ($)
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="lastProjectTotalIncrement"
                            value={
                              input.lastProjectTotalIncrement
                                ? input.lastProjectTotalIncrement.toFixed(2)
                                : input.lastProjectTotalIncrement
                            }
                            
                          />
                        </td>
                        <td>
                          <CurrencyInput
                            type="text"
                            className="Form-control form-control empty-field"
                            name="budgetProjectTotalIncrement"
                            value={
                              input.budgetProjectTotalIncrement
                                ? input.budgetProjectTotalIncrement.toFixed(2)
                                : input.budgetProjectTotalIncrement
                            }
                            
                          />
                        </td>
                      </tr>
                    </Table> */}
                  </div>
                </div>
              </React.Fragment>
            </>
          ))
        ) : (
          <span>No Data Found</span>
        )}
      </div>
    </>
  );
};

export default TableViewHeineken;
