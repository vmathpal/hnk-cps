import { useState, useEffect } from "react";
import axios from "axios";
function DynamicForm() {
  const [todos, setTodos] = useState({});

  const [inputFields, setInputFields] = useState([
    { allocation: "", allocationPercent: "" },
  ]);
  useEffect(() => {
    getAllBrandSKU();
  }, []);
  // let id = 1;
  const getAllBrandSKU = async (id) => {
    axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/1",
      method: "get",
      params: {
        url: "all-brand-sku",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        console.log(">>>ALL Data", response.data.data);
        setInputFields(response.data.data);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          // navigate("/sign-in");
        }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(">>>>DAta submit", inputFields);
  };
  return (
    <div className="App">
      <form onSubmit={submit}>
        {inputFields.map((input, index) => {
          return (
            <div key={index}>
              <input
                name="allocation"
                placeholder="Name"
                value={input.allocation}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="allocationPercent"
                placeholder="Age"
                value={input.allocationPercent}
                onChange={(event) => handleFormChange(index, event)}
              />
            </div>
          );
        })}
      </form>

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default DynamicForm;
