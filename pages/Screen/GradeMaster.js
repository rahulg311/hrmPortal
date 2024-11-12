import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
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

const GradeMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterGrade, setViewMasterGrade] = useState("");
  const [UserId, setUserId] = useState("");

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
    setAddGradeMater({
      GradeName: "",
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
    setUpdateGradeMater(user);
  };
  // CLOSE  OPEN MODEL 1
  const hideModals = () => {
    const modalEle = modalRef1.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };
  // CLOSE  OPEN MODEL 2
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };

  const [AddGradeMater, setAddGradeMater] = useState({
    GradeName: "",
  });
  const [UpdateGradeMater, setUpdateGradeMater] = useState({
    GradeId: "",
    GradeName: "",
  });

  useEffect(() => {
    ViewMasterGradesView();
  }, []);

  //   View user Grade master code

  const ViewMasterGradesView = async () =>{
    setLoding(true)
    const Grademaster = {
      OperationType: "ViewAll",
      GradeId: 1,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterGrade, Grademaster)
      .then((res) => {
        console.log("response DATA----", res.data);
        setViewMasterGrade(res.data.ViewMasterGrade);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  };

  //  sumbit add user Grade master code

  const sumbitUser = async (e) => {
    e.preventDefault();
    console.log("ViewMasterGrade---1",ViewMasterGrade)
       if(ViewMasterGrade.some((user)=> user.GradeName.toLowerCase() === AddGradeMater.GradeName.toLowerCase() )){
      toast.error("Grade name already exists")
      return
    }
    const AddGradedata = {
      GradeName: AddGradeMater.GradeName,
      UserId: UserId,
    };
    let val = await Vaildation(AddGradedata);
    if (!val) {
      return;
    }
    const Grademaster = JSON.stringify(AddGradedata);
    const GrademasterAdd = {
      OperationType: "Add",
      JsonData: Grademaster,
    };
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterGrade, GrademasterAdd)
      .then((res) => {
        if (res.data.UpsertMasterGrade[0]) {
          toast.success("Grade added successfully");
          hideModals();
        }
        ViewMasterGradesView();
       
      });
  };
  // console.log("ViewMasterGrade---0",ViewMasterGrade)
  //    update Grade master

  const updateUser = async (e) => {
    e.preventDefault();
 
     if(ViewMasterGrade && ViewMasterGrade.some((user)=> user.GradeName.toLowerCase() === UpdateGradeMater.GradeName.toLowerCase())){
      toast.error(" Grade name already exists")
      return
    }
    const UpdateGradedata = {
      GradeId: UpdateGradeMater.GradeId,
      GradeName: UpdateGradeMater.GradeName,
      UserId: UserId,
    };
    console.log("UpdateGradedata", UpdateGradedata);
    let val = await Vaildation(UpdateGradedata);
    if (!val) {
      return;
    }
    const ViewMasterGrades = JSON.stringify(UpdateGradedata);
    const GradeMasterUpdate = {
      OperationType: "Update",
      JsonData: ViewMasterGrades,
    };
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterGrade, GradeMasterUpdate)
      .then((res) => {
        if (res.data.UpsertMasterGrade[0]) {
          toast.success("Grade updated successfully ");
          hideModal();
        }
        ViewMasterGradesView();
      });
    console.log("updateUser", updateUser);
  };

  // serach deoartment master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterGrade.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item).join("").toLocaleLowerCase().includes(searchValue2.toLocaleLowerCase())
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
                          Grade Master Info
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
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New Grade
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding?null :
                  
                  <div className="table-responsive">
                  {
                    ViewMasterGrade.length>0 ?
                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Grade CD</th>
                          <th className="text-center">Grade</th>
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

                                      <td>{i.GradeId}</td>
                                      <td>{i.GradeName}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterGrade &&
                              ViewMasterGrade.map((i, key) => {
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

                                      <td>{i.GradeId}</td>
                                      <td>{i.GradeName}</td>
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
                Add New Grade
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Grade Name </p>
              <input
                value={AddGradeMater.GradeName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                  setAddGradeMater({
                    ...AddGradeMater,
                    GradeName: TextInput,
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
                class="btn w_150 btn-secondary float-end fs_12  "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                // data-bs-dismiss="modal"
                onClick={sumbitUser}
                type="button"
                class="btn w_150 btn-primary float-end fs_12  me-2 "
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  upDate Grade Master code popup */}
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
                Update New Grade
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Grade Name </p>
              <input
                value={UpdateGradeMater.GradeName}
                onChange={(e) =>{
                  const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                  setUpdateGradeMater({
                    ...UpdateGradeMater,
                    GradeName: TextInput,
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
                class="btn w_150 btn-primary float-end fs_12 ms-3  "
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
export default connect(mapStateToProps, mapDispatchToProps)(GradeMaster);
