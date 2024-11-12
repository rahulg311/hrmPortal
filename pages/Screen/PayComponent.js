import React, { useEffect, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import { LoginUserId, stateMasterApi } from "../api/AllApi";
import moment from "moment/moment";
import Vaildation from "./Vaildation";
import { useRef } from "react";
import ErrorPage from "./ErrorPage";

const PayComponent = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [VieViewPayComponent, setVieViewPayComponent] = useState("");
  const [ViewPayComponentType, setViewPayComponentType] = useState("");
  const [EditBtn, setEditBtn] = useState(false);
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");


// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

  useEffect(() => {
    PayComponentType();
    ViewMasterPayComponent();
  }, []);

  //  model onen and close code
  const modalRef = useRef();
  //  ViewMasterLwfs click by id edit
  const openModel = (user) => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();

    setEditBtn(true);

    setPayComponent(user);
  };

   const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };

  //   View PayComponent Type
  const PayComponentType = async () => {
    const PayComponentsAll = {
      OperationType: "ViewAll",
    };
    await axios.post(
        baseUrl + MethodNames.UpsertMasterPayComponentType,PayComponentsAll )
      .then((res) => {
        console.log( "View PayComponent type DATA----",res.data.UpsertMasterPayComponentType);
        setViewPayComponentType(res.data.UpsertMasterPayComponentType);
        setLoding(false);
      }).catch((error)=>{
        console.log(error)
      })
  };



  const openModelAdd = () => {
    setPayComponent({
      PayCompCode: "",
      PayCompName: "",
      PayCompDescription: "",
      PayCompType: "",
      Display: 0,
      PayCompOrder: "",
      UserId: "",
    });
    setEditBtn(false);
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };

  //  add Pay Component
  const [PayComponent, setPayComponent] = useState({
    PayCompCode: "",
    PayCompName: "",
    PayCompDescription: "",
    PayCompType: "",
    Display: 0,
    PayCompOrder: "",
 
  });
     // UserId: "testmer",

  // View Master PayComponent

  const ViewMasterPayComponent = async () => {
    setLoding(true)
    const PayComponent = {
      OperationType: "ViewAll",
      PayCompCode: 1,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterPayComponent, PayComponent)
      .then((res) => {
        console.log(
          "response VieViewPayComponent DATA----",
          res.data.ViewMasterPayComponent
        );
        setVieViewPayComponent(res.data.ViewMasterPayComponent);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  
  };

  //   sumbit data project master
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    console.log("PayComponent----", PayComponent);
    let postData = {
      PayCompCode: PayComponent.PayCompCode,
      PayCompName: PayComponent.PayCompName,
      PayCompDescription: PayComponent.PayCompDescription,
      PayCompType: PayComponent.PayCompType == "Select Pay Component Type"? "":PayComponent.PayCompType,
      Display: PayComponent.Display,
      PayCompOrder: PayComponent.PayCompOrder,
      UserId: UserId,
    };

    // console.log("PayComponent---000000",PayComponent)
    let val = await Vaildation(postData);
    if (!val) {
      return;
    }

    const PayComponentData = JSON.stringify(postData);

    const PayComponentAdd = {
      OperationType: "Add",
      JsonData: PayComponentData,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterPayComponent, PayComponentAdd)
      .then((res) => {
        console.log("response-----333", res.data.UpsertMasterPayComponent);
        if (res.data.UpsertMasterPayComponent) {
          toast.success("Pay component added successfully");
          hideModal();
        }
        ViewMasterPayComponent();
      });
  };

  //  update lwf slab code
  const UpdateSubmit = async () => {
    let val = await Vaildation(PayComponent);
    if (!val) {
      return;
    }
    console.log("sucreess")

    PayComponent["Display"] = PayComponent["Display"] == true ? 1 : 0;
    let postData = {
      PayCompCode: PayComponent.PayCompCode,
      PayCompName: PayComponent.PayCompName,
      PayCompDescription: PayComponent.PayCompDescription,
      PayCompType: PayComponent.PayCompType,
      Display: PayComponent.Display,
      PayCompOrder: PayComponent.PayCompOrder,
      UserId: UserId,
    };

    const PayComponentData = JSON.stringify(postData);
    const PayComponentUpdate = {
      OperationType: "Update",
      JsonData: PayComponentData,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterPayComponent, PayComponentUpdate)
      .then((res) => {
        console.log(
          "update UpsertMasterPayComponent",
          res.data.UpsertMasterPayComponent
        );
        if (res.data.UpsertMasterPayComponent) {
          toast.success("Pay component updated successfully");
          hideModal();
        }
        ViewMasterPayComponent();
      });
  };

  // serach PayComponentType  user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = VieViewPayComponent.filter((item) => {
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
                          Pay Component Master
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15 fw-bold table_ref_head ">
                        {/* <button
                          type="button"
                          data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                        <a className="link_name text-white"
                              // href="./PtaxMasterAdd"
                            >
                              <i className="bx bx-plus ms-1 mt-1"></i> Add New
                                Master
                            </a>
                       
                        </button> */}
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          data-bs-whatever="@mdo"
                          onClick={() => openModelAdd()}
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <i className="bx bx-plus ms-1 mt-1"></i> Add
                          Pay Component
                        </button>
                        <button className="btn btn-primary float-end mt-1 me-1 btn_size1 fs_12  btn_h_36 ">
                          <a
                            className="link_name text-white"
                            href="./PayComponentMapping"
                          >
                            {" "}
                            <i className="bx bx-plus ms-1 mt-1"></i>Pay
                            Component 
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding?null :
                  
                  <div className="table-responsive">
                  { VieViewPayComponent.length >0 ?

                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Pay Comp Code</th>
                          <th className="text-center"> Pay Comp Name</th>
                          {/* <th className="text-center">PayCompDescription </th> */}
                          <th className="text-center">Pay Comp Type </th>
                          <th className="text-center">Pay Comp Order </th>
                          <th className="text-center">Display </th>
                        </tr>

                        <tr>
                          <td></td>
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
                          {/* <td>
                            <input
                              class="input-grey-rounded fs_10 w_175"
                              type="number"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(e.target.value, searchInput2)
                              }
                            ></input>
                          </td> */}
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
                              class="input-grey-rounded fs_10 w_175"
                              type="number"
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
                                        </p>
                                      </td>
                                      <td>{i.PayCompCode}</td>
                                      <td>{i.PayCompName}</td>
                                      {/* <td>{i.PayCompDescription}</td> */}
                                      <td>{i.PayCompType}</td>
                                      <td>{i.PayCompOrder}</td>

                                      <td>{i.Display && String(i.Display)}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {VieViewPayComponent &&
                              VieViewPayComponent.map((i, key) => {
                                return (
                                  <>
                                  
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => openModel(i)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
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
                                      <td>{i.PayCompCode}</td>
                                      <td>{i.PayCompName}</td>
                                      {/* <td>{i.PayCompDescription}</td> */}
                                      <td>{i.PayCompType}</td>
                                      <td>{i.PayCompOrder}</td>
                                      <td>{i.Display && String(i.Display)}</td>
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
      {/*  add Lwf code popup */}
      <div
        class="modal fade"
        // id="exampleModal"
        ref={modalRef}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class=" modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
              {EditBtn == false ? (
                <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                  Add Pay Component Master
                </h6>
              ) : (
                <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                  Edit Pay Component Master
                </h6>
              )}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="cardd m-2 py-2">
             

              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Pay Component Code</p>
                
                <input
                disabled={EditBtn == true}
                 
                  className={EditBtn === true? " no-drop input_field_head no-drop": " input_field_head  "}
                  style={{  background: EditBtn === true ?"#dee2e659" : ""}}
                  type="text"
                  value={PayComponent.PayCompCode}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^A-Z0-9]/g,"");
                    setPayComponent({
                      ...PayComponent,
                      PayCompCode: TextInput,
                    })
                  }
                   
                  }
                />
              </div>

              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Pay Component Name</p>
                <input
                  className="input_field_head"
                  type="text"
                  value={PayComponent.PayCompName}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                    setPayComponent({
                      ...PayComponent,
                      PayCompName: TextInput,
                    })
                  }
                    
                  }
                />
              </div>

              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Pay Component Description</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={PayComponent.PayCompDescription}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                    setPayComponent({
                      ...PayComponent,
                      PayCompDescription: TextInput,
                    })
                  }
                    
                  }
                />
              </div>

              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Payment Type</p>
                <select
                  class="form-select  "
                  value={PayComponent.PayCompType}
                  onChange={(e) =>
                    setPayComponent({
                      ...PayComponent,
                      PayCompType: e.target.value,
                    })
                  }
                  aria-label="Default select example"
                >
                  <option  value="" disabled>Select Pay Component Type</option>
                  {ViewPayComponentType &&
                    ViewPayComponentType.map((i, key) => (
                      <option key={key} value={i.PayCompType}>{i.PayCompType}</option>
                    ))}
                </select>
              </div>

              <div class="modal-body  pt-0 mt-2 d-flex ">
                <p className=" ">Display</p>
                <input
                  class="form-check-inpu ms-1"
                  value={PayComponent.Display}
                  onChange={(e) => {
                    setPayComponent({
                      ...PayComponent,
                      Display: e.target.value == 0 ? 1 : 0,
                    });
                  }}
                  checked={
                    PayComponent.Display && Number(PayComponent.Display) == 1
                      ? true
                      : false
                  }
                  // checked={PayComponent.Display && Number(PayComponent.Display) == 1? true:false}
                  // onChange={(e) => {
                  //   // console.log("e.target.value", e.target.value == true ? 1 :0);
                  //   setUpDatesUser({
                  //     ...PayComponent,
                  //     Display: e.target.value == true ? 1 : 0,
                  //   });
                  // }}
                  type="checkbox"
                />
              </div>

              <div class="modal-body  pt-1  pb-0">
                <p className="fw-bold">Pay Component Order</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={PayComponent.PayCompOrder}
                  onChange={(e) =>{
                    const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,30);
                    setPayComponent({
                      ...PayComponent,
                      PayCompOrder: TextInput,
                    })
                  }
                    
                  }
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
                {EditBtn == false ? (
                  <button
                    // data-bs-dismiss="modal"
                    onClick={handleSubmit}
                    type="button"
                    class="btn w_150 btn-primary float-end fs_12 ms-3 "
                  >
                    Insert
                  </button>
                ) : (
                  <button
                    // data-bs-dismiss="modal"
                    onClick={UpdateSubmit}
                    type="button"
                    class="btn w_150 btn-primary float-end fs_12 ms-3 "
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PayComponent);
