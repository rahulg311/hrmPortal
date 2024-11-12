import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
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

const BankMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewBankMaster, setViewBankMaster] = useState([]);
  const [ViewMasterState, setViewMasterState] = useState("");
  const dispatch = useDispatch();
  const sampleListData = useSelector((state) => state.projectR.sample);
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");
  // onen and close code
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
  //  ADD user state on  BankMaster Master
  const [AddBankMaster, setAddBankMaster] = useState({
    // BankId: 0,
    BankName: "",
    // Address: "",
    // City: "",
    // State: "",
    // Pincode: "",
    // Branch: "",
  });

  //  update user on  BankMaster Master
  const [UpdateBankMaster, setUpdateBankMaster] = useState({
    BankId: 0,
    BankName: "",
  
  });

    // ADD NEW DATA OPEN MODEL
  const addModel = () => {
    setAddBankMaster({
      // BankId: 0,
      BankName: "",
  

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
    setUpdateBankMaster(user);
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



  useEffect(() => {
    ViewBankMasters();
  }, []);

  // View BankMasterAll user code
  const ViewBankMasters = async () =>{
    setLoding(true)
    const BankMasterAll = {
      OperationType: "ViewAll",
      BankId: 0,
    };
    await axios.post(baseUrl + MethodNames.ViewMasterBank, BankMasterAll)
      .then((res) => {
        console.log("response DATA----", res.data);
        setViewBankMaster(res.data.ViewMasterBank);
         setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  };

  // ADD user submit on  bank Master
 const sumbitUser = async (e) => {
    e.preventDefault();
    if (ViewBankMaster.some(user => user.BankName.toLowerCase() === AddBankMaster.BankName.toLowerCase())) {
      console.log("BankName is already exit")
      toast.error("Bank name already exits")
        return
      }
    const AddBankMasterdata = {
      BankName: AddBankMaster.BankName,
   
      UserId: UserId,
    };
    console.log("AddBankMasterdata", AddBankMasterdata);
    let val = await Vaildation(AddBankMasterdata);
    if (!val) {
      return;
    }
    const BankMasterAddBankMaster = JSON.stringify(AddBankMasterdata);
    const BankMasterAdd = {
      OperationType: "Add",
      JsonData: BankMasterAddBankMaster,
    };
    console.log("BankMasterAdd", BankMasterAdd);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterBank, BankMasterAdd)
      .then((res) => {
        if (res.data.UpsertMasterBank[0]) {
          toast.success("Bank added successfully");
          hideModals();
        }
        ViewBankMasters();
       
      });
  };

  //    update bank master
  const updateUser = async (e) => {
    e.preventDefault();
    if(ViewBankMaster.some((user)=>user.BankName.toLowerCase() === UpdateBankMaster.BankName.toLowerCase())){
      console.log("BankName is already exit")
      toast.error("Bank name already exits")
      return
    }
    const UpdateBankMasterdata = {
      BankId: UpdateBankMaster.BankId,
      BankName: UpdateBankMaster.BankName,
     
      UserId: UserId,
    };
    console.log("UpdateBankMasterdata", UpdateBankMasterdata);
    let val = await Vaildation(UpdateBankMasterdata);
    if (!val) {
      return;
    }
    const ViewBankMasterData = JSON.stringify(UpdateBankMasterdata);
    const BankMasterUpdateUser = {
      OperationType: "Update",
      JsonData: ViewBankMasterData,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterBank, BankMasterUpdateUser)
      .then((res) => {
        console.log("Update User------ViewBankMaster", res.data);
        if (res.data.UpsertMasterBank[0]) {
          toast.success("Bank updated successfully ");
          hideModal();
        }
        ViewBankMasters();
      });
  };

  // serach bank  master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewBankMaster.filter((item) => {
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
                          Bank Master
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
                          Bank
                        </button>
                      </div>
                    </div>
                  </div>
                  {loding?null:
                  <div className="table-responsive">
                  {
                    ViewBankMaster.length>0 ? 
                  
                    <table className="">
                      <tr>
                        <th className="text-center">Action</th>
                        <th className="text-center">Bank Id</th>
                        <th className="text-center">Bank Name</th>
                      
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

                      {searchInput.length != "" || searchInput2.length != "" ? (
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
                                    <td>{i.BankId}</td>
                                    <td>{i.BankName}</td>
                                 
                                  </tr>
                                </>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          {ViewBankMaster &&
                            ViewBankMaster.map((i, key) => {
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
                                        {/* 
                                        <Popconfirm
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

                                    <td>{i.BankId}</td>
                                    <td>{i.BankName}</td>
                                
                                  </tr>
                                </>
                              );
                            })}
                        </>
                      )}
                    </table>
                    :<ErrorPage/>
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
        <div class=" modal-dialog modal-dialog-centere">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
              <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                Add Bank Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          

            <div className="cardd m-2">
              <div class="modal-body pb-0  pt-0 mt-1">
                <p className="fw-bold">Bank Name</p>
                <input
                  class="input_field_head"
                  value={AddBankMaster.BankName}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                    setAddBankMaster({
                      ...AddBankMaster,
                      BankName: TextInput,
                    })
                  }
                   
                  }
                  type="text "
                  className="w-100 mt-1 inputs"
                />
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
            <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
              <h6 class="modal-title m-0 p-0 fs_14  " id="exampleModalLabel">
                Update Bank Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            
            <div className="cardd m-2">
              <div class="modal-body pb-0  pt-0 mt-1">
                <p className="fw-bold">Bank Name</p>
                <input
                  class="input_field_head"
                  value={UpdateBankMaster.BankName}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                    setUpdateBankMaster({
                      ...UpdateBankMaster,
                      BankName: TextInput,
                    })
                  }
                   
                  }
                  type="text "
                  className="w-100 mt-1 inputs"
                />
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
                  onClick={updateUser}
                  type="button"
                  class="btn w_150 btn-primary float-end fs_12 ms-3 "
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(BankMaster);
