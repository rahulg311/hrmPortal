import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
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

const DepartmentMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterDepartment, setViewMasterDepartment] = useState("");
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");
  const modalRef1 = useRef();
  const modalRef = useRef();


// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

  //  ADD NEW DEPARTMENT 
  const [AddDepartment, setAddDepartment] = useState({
     DepartmentName: "",
  });

  //  EDIT DATA  DEPARTMENT 
  const [UpdateDepartment, setUpdateDepartment] = useState({
    DepartmentId: "",
    DepartmentName: "",
  });

  // add open and close code
   const addModel = () => {
    setAddDepartment({
      DepartmentName: "",
    });
    const modalEle = modalRef1.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  // update  open and close code
  const Editmodel = (user) => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    setUpdateDepartment(user);
  };

   //   close model code 1
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };
     //   close model code 2
  const hideModals = () => {
    const modalEle = modalRef1.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };

  
  //  get Department master user details
  useEffect(() => {
    UpsertMasterDepartment();
  }, []);

  // VIEW   DATA  USER DEPARTMENTMASTER
  const UpsertMasterDepartment = async() =>{
    setLoding(true);
    const DepartmentViewAll = {
     OperationType: "ViewAll",
      DepartmentId: 1,
    };
      await  axios.post(baseUrl + MethodNames.ViewMasterDepartment, DepartmentViewAll)
      .then((res) => {
        console.log("response DATA----", res.data.ViewMasterDepartment);
        setViewMasterDepartment(res.data.ViewMasterDepartment);
        setLoding(false)
        })
        .catch(()=>{
          setLoding(false);
        });}

  // SUBMIT DATA USER DEPARTMENTMASTER
 const sumbitUser = async (e) => {
  e.preventDefault();
  if(ViewMasterDepartment.some((user)=> user.DepartmentName.toLowerCase() === AddDepartment.DepartmentName.toLowerCase() )){
    toast.error("Department name already exists")
    return
  }
    const DepartmentData = {
      DepartmentName: AddDepartment.DepartmentName,
      UserId: UserId,
    };
    console.log("UpdateUserDatas", DepartmentData);
    let val = await Vaildation(DepartmentData);
    if (!val) {
      return;
    }
    
    const UpsertMaster = JSON.stringify(DepartmentData);
    const MasterDepartmentAdd = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterDepartment, MasterDepartmentAdd)
      .then((res) => {
        console.log("response", res.data.UpsertMasterDepartment[0]);
        if (res.data.UpsertMasterDepartment[0]) {
          toast.success("Department added successfully");
          
        }
        hideModals()
        UpsertMasterDepartment();
       
      });
  };

  // UPDATED  DATA SUBMIT USER DEPARTMENTMASTER
const updateUser = async (e) => {
    e.preventDefault();
    if(ViewMasterDepartment.some((user)=> user.DepartmentName.toLowerCase() === UpdateDepartment.DepartmentName.toLowerCase() )){
      toast.error("Department name already exists")
      return
    }

    const DepartmentData = {
      DepartmentId: UpdateDepartment.DepartmentId,
      DepartmentName: UpdateDepartment.DepartmentName,
      UserId: UserId,
    };
    console.log("UpdateUserDatas", DepartmentData);
    let val = await Vaildation(DepartmentData);
    if (!val) {
      return;
    }
    const UpsertMasterDep = JSON.stringify(DepartmentData);
    const DepartmentUpdate = {
      OperationType: "Update",
      JsonData: UpsertMasterDep,
    };
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterDepartment, DepartmentUpdate)
      .then((res) => {
        console.log("response", res.data.UpsertMasterDepartment[0]);
        if (res.data.UpsertMasterDepartment[0]) {
          toast.success("Department updated successfully  ");
          hideModal();
        }
        UpsertMasterDepartment();
      });
  };


  // serach deoartment master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterDepartment.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item)
            .join("")
            .toLocaleLowerCase()
            .includes(searchValue2.toLocaleLowerCase())
        );
      });
      setSearchFliter(filterDepartment);
      console.log("filterDepartment0-----", filterDepartment);
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
                          Department Master Info
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
                          className="btn btn-primary btn_siz fs_12 px-4  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New Department
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding?null :
                  
                  <div className="table-responsive">
                  {
                    ViewMasterDepartment.length>0 ?
                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center"> Department CD</th>
                          <th className="text-center">Department</th>
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
                                            onClick={() => Editmodel(i)}
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

                                      <td>{i.DepartmentId}</td>
                                      <td>{i.DepartmentName}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterDepartment &&
                              ViewMasterDepartment.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => Editmodel(i)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModals"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className="p-1"
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

                                      <td>{i.DepartmentId}</td>
                                      <td>{i.DepartmentName}</td>
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
                Add New Department
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Department</p>
              <input
                value={AddDepartment.DepartmentName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setAddDepartment({
                    ...AddDepartment,
                    DepartmentName: TextInput,
                  })
                }}
                type="text "
                className="w-100 mt-1 inputs"
              />
            </div>
            <div class=" w-100 p-2">
              <button
                type="button"
                class="btn w_150 btn-secondary float-end fs_12 ms-3  "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                // data-bs-dismiss="modal"
                onClick={sumbitUser}
                type="button"
                class="btn w_150 btn-primary float-end fs_12  "
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
                Update New Department
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Department</p>
              <input
                value={UpdateDepartment.DepartmentName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setUpdateDepartment({
                    ...UpdateDepartment,
                    DepartmentName: TextInput,
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
                class="btn w_150 btn-primary float-end fs_12  ms-3"
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


export default connect(mapStateToProps, mapDispatchToProps)(DepartmentMaster);
