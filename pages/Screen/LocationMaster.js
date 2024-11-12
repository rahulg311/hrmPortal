import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import { Spin } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { FaBeer } from "react-icons/fa";
import { AiFillGoogleCircle, AiFillHome, AiFillSignal } from "react-icons/ai";
import { useRouter } from "next/router";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import { Actions } from "../../src/constants/Actions";
import Vaildation from "./Vaildation";
import { LoginUserId } from "../api/AllApi";
import ErrorPage from "./ErrorPage";

const LocationMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterLocation, setViewMasterLocation] = useState("");
  const [ViewMasterState, setViewMasterState] = useState("");
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");


   //  ADD user state on  Locations Master
   const [AddLocation, setAddLocation] = useState({
    LocationName: "",
    StateId: "",
    IsMetro: 0,
  });

  console.log("AddLocation-----------------",AddLocation)

  //  update user on  Locations Master
  const [UpdateLocation, setUpdateLocation] = useState({
    LocationId: "",
    LocationName: "",
    StateId: "",
    IsMetro: 0,
  });

  useEffect(() => {
    ViewMasterLocationsData();
    UpsertMasterStates();
  }, []);

// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);


 

  // onen and close code
  const modalRef1 = useRef();
  const modalRef = useRef();
  // ADD NEW DATA OPEN MODEL
  const addModel = () => {
    setAddLocation({
      LocationName: "",
      StateId: "",
      IsMetro: 0,
    });
    const modalEle = modalRef1.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    
  };
   // EDIT NEW DATA OPEN MODEL
  const openModel = (user) => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    setUpdateLocation(user);
  };
// CLOSE  OPEN MODEL 1
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };
  // CLOSE  OPEN MODEL 2
  const hideModals = () => {
    const modalEle = modalRef1.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };


 
  // View LocationMasterAll code
 const ViewMasterLocationsData = async () =>{
    setLoding(true)
    const LocationMasterAll = {
      OperationType: "ViewAll",
      LocationId: 1,
    };
   await axios.post(baseUrl + MethodNames.ViewMasterLocation, LocationMasterAll)
      .then((res) => {
        console.log("response DATA----", res.data);
        setViewMasterLocation(res.data.ViewMasterLocation);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      });
    }

  //   View state master code
   const UpsertMasterStates = async () =>{
    const statemasterAll = {
    OperationType: "ViewAll",
    StateId: 1,
  }; 
  await axios
      .post(baseUrl + MethodNames.ViewMasterState, statemasterAll)
      .then((res) => {
        console.log("satateee---12345", res.data.ViewMasterState);
        setViewMasterState(res.data.ViewMasterState);
        console.log("satateee---12345", res.data.ViewMasterState);
        setLoding(false);
      });
    }

  // ADD user submit on  Locations Master
 const sumbitUser = async (e) => {
    e.preventDefault();
    if(ViewMasterLocation.some((user)=> user.LocationName.toLowerCase() === AddLocation.LocationName.toLowerCase() )){
      toast.error("Location name already exists")
      
      return
    }
    const AddDataLocation = {
      LocationName: AddLocation.LocationName,
      StateId: AddLocation.StateId,
      IsMetro: AddLocation.IsMetro,
      UserId: UserId,
    };
    // console.log("AddDataLocation",AddDataLocation)
    let val = await Vaildation(AddDataLocation);
    if (!val) {
      return;
    }
    const LocationMaster = JSON.stringify(AddDataLocation);
    const LocationUserData = {
      OperationType: "Add",
      JsonData: LocationMaster,
    };
    console.log("add location master", LocationUserData);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterLocation, LocationUserData)
      .then((res) => {
        if (res.data.UpsertMasterLocation[0]) {
          toast.success("Location name added successfully");
          hideModals();
        }
        ViewMasterLocationsData();
        setAddLocation({
          LocationName: "",
          StateId: "",
          IsMetro: 0,
        });
        
      });
  };

  //  update Location master
  const updateUser = async (e) => {
    e.preventDefault();
    console.log("LocationName",UpdateLocation.LocationName,UpdateLocation)
    if(ViewMasterLocation.some((user)=> user.LocationName.toLowerCase() === UpdateLocation.LocationName.toLowerCase() )){
      toast.error("Location name already exists")
      return
    }

    const UpdateDataLocation = {
      LocationId: UpdateLocation.LocationId,
      LocationName: UpdateLocation.LocationName,
      StateId: UpdateLocation.StateId,
      IsMetro: UpdateLocation.IsMetro,
      UserId: UserId,
    };
    console.log("UpdateDataLocation", UpdateDataLocation);
    let val = await Vaildation(UpdateDataLocation);
    if (!val) {
      return;
    }
    UpdateDataLocation["IsMetro"] =
      UpdateDataLocation["IsMetro"] == true ? 1 : 0;
    const ViewMasterLocations = JSON.stringify(UpdateDataLocation);
    console.log("updateUser------ViewMasterLocations", ViewMasterLocations);
    const LocationUserData = {
      OperationType: "Update",
      JsonData: ViewMasterLocations,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterLocation, LocationUserData)
      .then((res) => {
        console.log("updateUser------000000sucess", res.data);
        if (res.data.UpsertMasterLocation[0]) {
          toast.success("Location name updated successfully");
          hideModal();
        }
        hideModal();
        ViewMasterLocationsData()
      });
  };

  // const DeleteUser = (delterUser) => {
  //   console.log("delterUser", delterUser);
  // };

  // serach deoartment master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterLocation.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item)
            .join("")
            .toLocaleLowerCase()
            .includes(searchValue2.toLocaleLowerCase())
        );
      });
      setSearchFliter(filterDepartment);
    }
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-100" : "content-page"}>
          <div className="content  ">
            <div className="container-fluid">
              <div className="cardd">
                <div className="col-sm-12  p-2   ">
                  <div className=" row ">
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className=" w-100 back-color table_ref_head">
                        <h3 className="fs_15 back-color table_ref_head text-white p-3">
                          Location Master
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15 fw-bold table_ref_head ">
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#exampleModal"
                          // data-bs-whatever="@mdo"
                          onClick={() => addModel()}
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New
                          Location
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding?null :
                  
                  <div className="table-responsive">
                  {ViewMasterLocation.length >0 ? 

                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Location Id</th>
                          <th className="text-center">Location</th>
                          <th className="text-center">State</th>
                          <th className="text-center">Is Metro</th>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175"
                              type="number"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(e.target.value, searchInput2)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                        </tr>

                        {searchInput.length != "" ||
                        searchInput2.length != "" ? (
                          <>
                            {SearchFliter &&
                              SearchFliter.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => openModel(i)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModals"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="edit"
                                          >
                                            <span className="material-icons link-success">
                                              edit
                                            </span>
                                          </a>

                                          {/* <Popconfirm
                                            className="ms-3"
                                            title="Are you sure delete this task?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => DeleteUser(i)}
                                          >
                                            <a
                                              href="#"
                                              className="p-1"
                                              title="delete"
                                            >
                                              <span className="material-icons link-danger">
                                                delete
                                              </span>
                                            </a>
                                          </Popconfirm> */}
                                        </p>
                                      </td>
                                      <td>{i.LocationId}</td>
                                      <td>{i.LocationName}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.IsMetro && String(i.IsMetro)}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterLocation &&
                              ViewMasterLocation.sort((a, b)=>a.LocationName.localeCompare(b.LocationName) ).map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => openModel(i)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModals"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="edit"
                                          >
                                            <span className="material-icons link-success">
                                              edit
                                            </span>
                                          </a>

                                          
                                        </p>
                                      </td>

                                      <td>{i.LocationId}</td>
                                      <td>{i.LocationName}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.IsMetro && String(i.IsMetro)}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                    : <ErrorPage/>
                  }
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>

      {/*  add DepartmentMaster code popup */}
      <div
        class="modal fade"
        // id="exampleModal"
        ref={modalRef1}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-2">
              <h6 class="modal-title" id="exampleModalLabel">
                Add Location Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body pb-0">
              <p className="fw-bold">Location Name</p>
              <input
                value={AddLocation.LocationName}
                onChange={(e) =>
                {
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setAddLocation({
                    ...AddLocation,
                    LocationName: TextInput,
                  })
                }
                 
                }
                type="text "
                className="w-100 mt-1 inputs"
              />
            </div>
            <div class="modal-body  pt-0 mt-1">
              <p className="fw-bold">State</p>
              <select
                class="form-select "
                value={ AddLocation.StateId}
                onChange={(e) =>
                  setAddLocation({ ...AddLocation, StateId: e.target.value })
                }
                aria-label="Default select example"
              >
                <option  value="" disabled>Select State</option>
                {/* {console.log("i.StateName123456787654", ViewMasterState)} */}
                {ViewMasterState &&
                  ViewMasterState.map((i, key) => (
                    <option key={key} value={i.StateId}>{i.StateName}</option>
                  ))}
              </select>
            </div>
            <div class="modal-body  pt-0 mt-1 d-flex">
              <input
                class="form-check-inpu ms-1"
                // value={AddLocation.IsMetro}
                checked={AddLocation.IsMetro === 1}
                onChange={(e) => {
                  // console.log("e.target.value--",e.target.value,e.target.value == 1 ? 1 : 0)
                  setAddLocation({
                    ...AddLocation,
                    // IsMetro: Number(e.target.value) === 0 ? 0 : 1,
                    IsMetro: e.target.checked ? 1 : 0,
                  });
                }}
                type="checkbox"
              />

              <p className="ms-2 ">Is Metro</p>
            </div>
            <div class=" w-100 p-2 ">
              <button
                type="button"
                class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                // data-bs-dismiss="modal"
                onClick={sumbitUser}
                type="button"
                class="btn w_150 btn-primary float-end fs_12 ms-3 "
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  upDate DepartmentMaster code popup */}
      <div
        class="modal fade"
        // id="exampleModals"
        ref={modalRef}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-2">
              <h6 class="modal-title" id="exampleModalLabel">
                Update Location Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Location Name</p>
              <input
                value={UpdateLocation.LocationName}
                onChange={(e) =>
                {
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setUpdateLocation({
                    ...UpdateLocation,
                    LocationName: TextInput,
                  })
                }
                 
                }
                type="text "
                className="w-100 mt-1 inputs"
              />
            </div>
            <div class="modal-body  pt-0 mt-1">
              <p className="fw-bold">State</p>
              <select
                class="form-select "
                value={UpdateLocation.StateId}
                // selected={"2"}
                onChange={(e) =>
                  setUpdateLocation({
                    ...UpdateLocation,
                    StateId: e.target.value,
                  })
                }
                aria-label="Default select example"
              >
                <option  value="" disabled>Select State</option>

                {ViewMasterState &&
                  ViewMasterState.map((i, key) => (
                    <option key={key} value={i.StateId}>{i.StateName}</option>
                  ))}
              </select>
            </div>
            <div class="modal-body  pt-0 mt-1 d-flex">
              <input
                class="form-check-inpu ms-1"
                // value={UpdateLocation.IsMetro && Number(UpdateLocation.IsMetro)}
                checked={ UpdateLocation.IsMetro && Number(UpdateLocation.IsMetro) == 1
                    ? true
                    : false
                }
                onChange={(e) => {
                  // console.log("e.target.value", e.target.value == true ? 1 :0);
                  setUpdateLocation({
                    ...UpdateLocation,
                    IsMetro: e.target.checked ? 1 : 0,
                  });
                }}
                type="checkbox"
              />

              <p className="ms-2 ">Is Metro</p>
            </div>
            <div class=" w-100 p-2">
              <button
                type="button"
                class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                // data-bs-dismiss="modal"
                onClick={updateUser}
                type="button"
                class="btn w_150 btn-primary float-end fs_12  ms-3 "
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(LocationMaster);
