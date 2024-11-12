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
import Vaildation from "./Vaildation";
import { LoginUserId } from "../api/AllApi";
import ErrorPage from "./ErrorPage";

const StateMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterState, setViewMasterState] = useState("");
  const [UserId, setUserId] = useState("");

  // onen and close code
  const modalRef1 = useRef();
  const modalRef = useRef();

  // ADD NEW DATA OPEN MODEL
  const addModel = () => {
    setAddStateMaster({
      StateName: "",
    });
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
    // EDIT NEW DATA OPEN MODEL
  const openModel = (user) => {
    const modalEle = modalRef1.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    setUpdateStateMaster(user);
  };
  // CLOSE  OPEN MODEL 1
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };
// CLOSE OPEN MODEL 2
  const hideModals = () => {
    const modalEle = modalRef1.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };


// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

  // ADD NEW SATATEMASTER DATA 
  const [AddStateMaster, setAddStateMaster] = useState({
     StateName: "",
  });

    // UPDATE NEW SATATEMASTER DATA 
  const [UpdateStateMaster, setUpdateStateMaster] = useState({
    StateId: "",
    StateName: "",
  });

  useEffect(() => {
    UpsertMasterStates();
  }, []);

  // VIEW SATATEMASTER DATA API CALL
 const UpsertMasterStates = async () =>{
    setLoding(true)
   const StateViewAllUser = {
      OperationType: "ViewAll",
      StateId: 1,
    };
    await axios.post(baseUrl + MethodNames.ViewMasterState, StateViewAllUser)
      .then((res) => {
        setViewMasterState(res.data.ViewMasterState);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      });
    }
    console.log("ViewMasterState-----------,",ViewMasterState)
 // NEW  SATATEMASTER DATA SUMBIT
  const sumbitUser = async (e) => {
    e.preventDefault();
  if (ViewMasterState.some(user => user.StateName.toLowerCase() === AddStateMaster.StateName.toLowerCase())) {
    console.log("State already exists")
    toast.error("State already exists")
      return
    }
    const AddStateData = {
      StateName: AddStateMaster.StateName,
      UserId: UserId,
    };
    console.log("UpdateUserDatas", AddStateData);
    let val = await Vaildation(AddStateData);
    if (!val) {
      return;
    }
    const statemaster = JSON.stringify(AddStateData);
    const StateAddStateMaster = {
      OperationType: "Add",
      JsonData: statemaster,
    };
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterState, StateAddStateMaster)
      .then((res) => {
        if (res.data.UpsertMasterState[0]) {
          toast.success("State added successfully");
          hideModal();
        }
        hideModal();
        UpsertMasterStates();
        // router.push("/Screen/StateMaster");
      });
  };

 // UPDATE SATATEMASTER DATA SUMBIT
  const updateUser = async (e) => {
    e.preventDefault();
    if(ViewMasterState.some((user)=> user.StateName.toLowerCase() === UpdateStateMaster.StateName.toLowerCase() )){
      toast.error("State already exists")
      return
    }
    const UpdateStateData = {
      StateId: UpdateStateMaster.StateId,
      StateName: UpdateStateMaster.StateName,
      UserId: UserId,
    };
    console.log("UpdateUserDatas", UpdateStateData);
    let val = await Vaildation(UpdateStateData);
    if (!val) {
      return;
    }
    const UpsertMasterState = JSON.stringify(UpdateStateData);
    const StateUpdateUser = {
      OperationType: "Update",
      JsonData: UpsertMasterState,
     };
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterState, StateUpdateUser)
      .then((res) => {
        if (res.data.UpsertMasterState[0]) {
          toast.success("State updated successfully");
          hideModals();
        }
        UpsertMasterStates();
      });
    console.log("updateUser", updateUser);
  };

  // serach deoartment master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterState.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item)
            .join("")
            .toLocaleLowerCase()
            .includes(searchValue2.toLocaleLowerCase())
        );
      });
      setSearchFliter(filterDepartment);
      console.log("filterDepartment", filterDepartment);
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
                          State Master Info
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
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New State
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding? null :
                  
                  <div className="table-responsive">
                  {
                    ViewMasterState.length >0 ?
                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center"> State CD</th>
                          <th className="text-center">State</th>
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

                                         
                                        </p>
                                      </td>

                                      <td>{i.StateId}</td>
                                      <td>{i.StateName}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterState &&
                              ViewMasterState.map((i, key) => {
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

                                      <td>{i.StateId}</td>
                                      <td>{i.StateName}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                    :<ErrorPage/> }
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
        ref={modalRef}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-2">
              <h6 class="modal-title" id="exampleModalLabel">
                Add New State Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">State Name</p>
              <input
                value={AddStateMaster.StateName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setAddStateMaster({
                    ...AddStateMaster,
                    StateName: TextInput,
                  })
                }
                  
                }
                type="text "
                className="w-100 mt-1 inputs"
              />
            </div>
            <div class=" w-100 p-2">
              <button
                type="button"
                class="btn w_150 btn-secondary float-end fs_12 ms-2  "
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
        ref={modalRef1}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-2">
              <h6 class="modal-title" id="exampleModalLabel">
                Update State Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">State Name</p>
              <input
                value={UpdateStateMaster.StateName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setUpdateStateMaster({
                    ...UpdateStateMaster,
                    StateName:TextInput,
                  })
                }
                 
                }
                type="text "
                className="w-100 mt-1 inputs"
              />
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
                class="btn w_150 btn-primary float-end fs_12  "
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

export default connect(mapStateToProps, mapDispatchToProps)(StateMaster);
