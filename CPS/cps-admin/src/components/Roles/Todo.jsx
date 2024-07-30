import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const getLocalItmes = () => {
  let list = localStorage.getItem("lists");
  console.log(list);

  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};

const Todo = () => {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItmes());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [status, setStatus] = useState(0);
//   const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    dept: Yup.string().required("Department is required"),
    role: Yup.string().required("Role is required"),
    
  });
  const formik = useFormik({
    initialValues: {
      role:"",
      dept: "",
      inputState:""
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      // console.log('input data',process.env.REACT_APP_API_KEY+"login")
    //   await axios
    //     .post(process.env.REACT_APP_API_KEY + "add-role", data)
        
    //     .then((res) => {
    //       if (res.status === 200) {
    //         swal({
    //           title: "Wow!",
    //           text: "Login Successfully!",
    //           icon: "success",
    //           button: "Okay",
    //         });
    //         localStorage.setItem("token", res.data.accessToken);
    //         localStorage.setItem("userID", res.data.id);
    //         localStorage.setItem("email", res.data.email);
    //         navigate("/dashboard");
    //       } 
    //     }).catch(error => {
    //       if(error.response.status === 422) {
    //         swal("Oops", "Unauthorized User", "error");
    //       }
    //       //console.log('aya',error.response);
    //   });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const radioHandler = (status) => {
    setStatus(status);
  };
  const addItem = () => {
    if (!inputData) {
      alert("plzz fill data");
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, name: inputData };
          }
          return elem;
        })
      );
      setToggleSubmit(true);

      setInputData("");

      setIsEditItem(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");
    }
  };

  // delete the items
  const deleteItem = (index) => {
    const updateditems = items.filter((elem) => {
      return index !== elem.id;
    });

    setItems(updateditems);
  };

  // edit the item
  //     When user clikc on edit button

  // 1: get the id and name of the data which user clicked to edit
  // 2: set the toggle mode to change the submit button into edit button
  // 3: Now update the value of the setInput with the new updated value to edit.
  // 4: To pass the current element Id to new state variable for reference

  const editItem = (id) => {
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });
    console.log(newEditItem);

    setToggleSubmit(false);

    setInputData(newEditItem.name);

    setIsEditItem(id);
  };

  // remove all
  const removeAll = () => {
    setItems([]);
  };

  // add data to localStorage
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
  }, [items]);

  return (
    <>
     <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Role</h1>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
            

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
                        defaultChecked={formik.values.dept === "sales"}
                        onClick={(e) => radioHandler(1)}
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
                        onClick={(e) => radioHandler(2)}
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
                        value="trade_market"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.dept === "trade_market"}
                        onClick={(e) => radioHandler(2)}
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
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Role Name
                  </label>
            <input
              type="text"
              placeholder="Add Items..."
              value={inputData}
              className="form-control"
              onChange={(e) => setInputData(e.target.value)}
            />
            {toggleSubmit ? (
              <i
                className="fa fa-plus add-btn"
                title="Add Item"
                onClick={addItem}
              ></i>
            ) : (
              <i
                className="far fa-edit add-btn"
                title="Update Item"
                onClick={addItem}
              ></i>
            )}
          </div>

          <div className="showItems">
            {items.map((elem) => {
              return (
                  
                <div className="alert alert-primary alert-style-light" key={elem.id}>
                  <p>{elem.name}</p>
                  <div className="todo-btn">
                    <i
                      className="far fa-edit add-btn"
                      title="Edit Item"
                      onClick={() => editItem(elem.id)}
                    ></i>
                    <i
                      className="fa fa-trash" aria-hidden="true"
                      title="Delete Item"
                      onClick={() => deleteItem(elem.id)}
                    >dddd</i>
                  </div>
                </div>
              );
            })}
          </div>

          {/* clear all button  */}
          <div className="showItems">
            <button
              className="btn btn-primary"
              data-sm-link-text="Remove All"
              onClick={removeAll}
            >
              <span> Create </span>{" "}
            </button>
          </div>
        </div>
      </div>
      </div>
       
      </div>
    </>
  );
};

export default Todo;
