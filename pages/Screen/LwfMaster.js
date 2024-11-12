import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import { LoginUserId, StateMasterApi } from "../api/AllApi";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Vaildation from "./Vaildation";
import ErrorPage from "./ErrorPage";

const LwfMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const modalRef = useRef();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterLwf, setViewMasterLwf] = useState("");
  const [ViewPaymentType, setViewPaymentType] = useState("");
  const [EditBtn, setEditBtn] = useState(false);
  const [loding, setLoding] = useState(true);
  const [StateData, setStateData] = useState([]);
  const [UserId, setUserId] = useState("");
  const [AddLwfMaster, setAddLwfMaster] = useState({
    Id: 0,
    State: "",
    PaymentType: "",
    PaymentPeriod: "",
    EmployeeContribution: "",
    EmployerContribution: "",
    FromDate: "",
    ToDate: "",
  });
  useEffect(()=>{
    console.log("AddLwfMaster----",AddLwfMaster)
  },[AddLwfMaster])


  
// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);


  useEffect(() => {
    ViewMasterLwfs();
  }, []);

  //   View Lwf Masters All code
  const ViewMasterLwfs = async () => {
    const LwfMastersAll = {
      OperationType: "ViewAll",
      Id: 1,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterLWF, LwfMastersAll)
      .then((res) => {
        console.log("response ViewMasterLwf DATA----", res.data.ViewMasterLWF);
        setViewMasterLwf(res.data.ViewMasterLWF);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  };

  //  ViewMasterLwfs click by id edit
  const openModel = (user) => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();

    setEditBtn(true);

    setAddLwfMaster({...user,State:user.StateId})
  };

  // StateList view list render data
  useEffect(() => {
    StateList();
    ViewMasterPaymentType();
  }, []);

  // StateList  get data api call 
  const StateList = async () => {
    const data = await StateMasterApi();
    setStateData(data.data.ViewMasterState);
  };

  // ADD LWF  MASTER

  console.log("AddLwfMasterAddLwfMaster",AddLwfMaster)

  //  API CALL  PaymentType IN LWF DROPDOWN DATA
  const ViewMasterPaymentType = async () => {
    setLoding(true);
    const PaymentType = {
      OperationType: "ViewAll",
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterPaymentType, PaymentType)
      .then((res) => {
        console.log(
          "response ViewMasterLwf DATA----",
          res.data.ViewMasterPaymentType
        );
        setViewPaymentType(res.data.ViewMasterPaymentType);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  
  };


  // console.log("AddLwfMaster0000",AddLwfMaster)
//   sumbit data project master
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("AddLwfMaster0000",AddLwfMaster)
    // validation
    if (AddLwfMaster.State === "Select State") {
      toast.error("Please enter state.");
      return;
    }
    if (AddLwfMaster.PaymentType === "Select PaymentType") {
      toast.error("Please enter payment type.");
      return;
    }
    let val = await Vaildation(AddLwfMaster);
    if (!val) {
      return;
    }

    let postData = {
      Id: AddLwfMaster.Id,
      StateId: AddLwfMaster.State,
      PaymentType: AddLwfMaster.PaymentType,
      PaymentPeriod: AddLwfMaster.PaymentPeriod,
      EmployeeContribution: AddLwfMaster.EmployeeContribution,
      EmployerContribution: AddLwfMaster.EmployerContribution,
      FromDate: moment(new Date(AddLwfMaster.FromDate)).format("MM/DD/YYYY"),
      ToDate: moment(new Date(AddLwfMaster.ToDate)).format("MM/DD/YYYY"),
      UserId: UserId,
    };





     //  lwf  master validation range
     const TraValditionData = {
      StateId: AddLwfMaster.State,
      FromDate: moment(new Date(AddLwfMaster.FromDate)).format("MM/DD/YYYY"),
      ToDate: moment(new Date(AddLwfMaster.ToDate)).format("MM/DD/YYYY"),
      };
  
      console.log("TraValditionData---1",TraValditionData)
      try {
        const res = await axios.post(baseUrl + MethodNames.ValidateLWF, TraValditionData);
        console.log("TraValditionData---2",res.data)
        if (res.data.ValidateLWF[0].RecStatus === "Exist") {
          toast.error(`This combination Range from & Range to already exists `);
          console.log("TraValditionData---3",res.data.ValidateLWF[0])
          return; // Stop execution if any item fails validation
        }
      } catch (error) {
       
        console.error("Error while validating mapping:", error);
        return; // Stop execution if any error occurs
      }

    const LwfMasterData = JSON.stringify(postData);
    console.log("AddLwfMaster---- postData", postData);
    const LwfMasterAdd = {
      OperationType: "Add",
      JsonData: LwfMasterData,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterLWF, LwfMasterAdd)
      .then((res) => {
        console.log("response-----333", res.data);
        if (res.data.UpsertMasterLWF[0].RecordStatus) {
          toast.success("LWF added successfully");
          ViewMasterLwfs();
          hideModal();
        }
      });
  };

//  update lwf slab code
  const UpdateSubmit = async () => {
    //  validation form date and to date
    if (AddLwfMaster.State === "Select State") {
      toast.error("Please enter state.");
      return;
    }
    if (AddLwfMaster.PaymentType === "Select PaymentType") {
      toast.error("Please enter payment type.");
      return;
    }

    let val = await Vaildation(AddLwfMaster);
    if (!val) {
      return;
    }



    let postData = {
      Id: AddLwfMaster.Id,
      StateId: AddLwfMaster.State,
      PaymentType: AddLwfMaster.PaymentType,
      PaymentPeriod: AddLwfMaster.PaymentPeriod,
      EmployeeContribution: AddLwfMaster.EmployeeContribution,
      EmployerContribution: AddLwfMaster.EmployerContribution,
      FromDate: moment(new Date(AddLwfMaster.FromDate)).format("MM/DD/YYYY"),
      ToDate: moment(new Date(AddLwfMaster.ToDate)).format("MM/DD/YYYY"),
      UserId: UserId,
    };

        //  lwf edit  master validation range
        const TraValditionData = {
          StateId: AddLwfMaster.State,
          FromDate: moment(new Date(AddLwfMaster.FromDate)).format("MM/DD/YYYY"),
          ToDate: moment(new Date(AddLwfMaster.ToDate)).format("MM/DD/YYYY"),
          };
      
          console.log("TraValditionData---1",TraValditionData)
          try {
            const res = await axios.post(baseUrl + MethodNames.ValidateLWF, TraValditionData);
            console.log("TraValditionData---2",res.data)
            if (res.data.ValidateLWF[0].RecStatus === "Exist") {
              toast.error(`This combination Range from & Range to already exists`);
              console.log("TraValditionData---3",res.data.ValidateLWF[0])
              return; // Stop execution if any item fails validation
            }
          } catch (error) {
           
            console.error("Error while validating mapping:", error);
            return; // Stop execution if any error occurs
          }



    
    console.log("update user---- postData", postData);
    const LwfMasterData = JSON.stringify(postData);
  
    const LwfMasterUpdate = {
      OperationType: "Update",
      JsonData: LwfMasterData,
    };
    console.log("update user---- LwfMasterUpdate", LwfMasterUpdate);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterLWF, LwfMasterUpdate)
      .then((res) => {
        console.log("response-----333", res.data.UpsertMasterLWF);
        if (res.data.UpsertMasterLWF[0]) {
          toast.success("LWF updated successfully");
          hideModal();
        }
        ViewMasterLwfs();

        // router.push("/Screen/PtaxMaster");
      });
    // }
  };

  // OPEN POPUP  MODEL ADD USER
  const addModel = () => {
    setEditBtn(false);
    setAddLwfMaster({
      Id: 0,
      State: "",
      PaymentType: "",
      PaymentPeriod: "",
      EmployeeContribution: "",
      EmployerContribution: "",
      FromDate: "",
      ToDate: "",
   
    });
    
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };

    // CLOSE POPUP  MODEL ADD USER
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };

  // serach ViewMasterLwfs  user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterLwf.filter((item) => {
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
                          LWF Master
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
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New LWF
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding?null :
                  
                  <div className="table-responsive">
                  {
                    ViewMasterLwf.length>0 ?
                  
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Id</th>
                          <th className="text-center">State Name</th>
                          <th className="text-center">Payment Type </th>
                          <th className="text-center">
                            Employee Contribution{" "}
                          </th>
                          <th className="text-center">
                            Employer Contribution{" "}
                          </th>
                          <th className="text-center">From Date </th>
                          <th className="text-center">To Date</th>
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
                            {/* <input
                            class="input-grey-rounded fs_10 w_175 "
                            type="text"
                            placeholder="Search ......."
                            onChange={(e) =>
                              searchItems(searchInput, e.target.value)
                            }
                          ></input> */}
                          </td>
                          <td>
                            {/* <input
                            class="input-grey-rounded fs_10 w_175 "
                            type="text"
                            placeholder="Search ......."
                            onChange={(e) =>
                              searchItems(searchInput, e.target.value)
                            }
                          ></input> */}
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
                                            // data-bs-toggle="modal"
                                            // data-bs-target="#exampleModals"
                                            // data-bs-whatever="@mdo"
                                            // href="#"
                                            className=" p-1"
                                            title="edit"
                                          >
                                            <span className="material-icons link-success">
                                              edit
                                            </span>
                                          </a>
                                        </p>
                                      </td>
                                      <td>{i.Id}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.PaymentType}</td>
                                      <td>{i.EmployeeContribution}</td>
                                      <td>{i.EmployerContribution}</td>
                                      <td>
                                        {moment(new Date(i.FromDate)).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {moment(new Date(i.ToDate)).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterLwf &&
                              ViewMasterLwf.map((i, key) => {
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

                                      <td>{i.Id}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.PaymentType}</td>
                                      <td>{i.EmployeeContribution}</td>
                                      <td>{i.EmployerContribution}</td>
                                      <td>
                                        {moment(new Date(i.FromDate)).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {moment(new Date(i.ToDate)).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                    : <ErrorPage/> }
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
                Add LWF Slab
              </h6>): (<h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                Edit LWF Slab
              </h6> )}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="cardd m-2 mt-3 mb-3 py-2">
              {/* <div class="modal-bod pt-2  pb-0">
                <div className="w-100 p-1 my-1  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">LWF Slab </p>
                  </div>
                </div>
              </div> */}

              <div class="modal-body pb-0  pt-0 mt-1">
                <p className="fw-bold">State</p>
                <select
                  class= {EditBtn == true ? "form-select  no-drop" : "form-select " }
                  disabled={EditBtn == true ? true : false}
                  value={AddLwfMaster.State}
                  onChange={(e) =>setAddLwfMaster({...AddLwfMaster,State: e.target.value})
                  }
                  aria-label="Default select example"
                >
                  <option  value="" disabled>Select State</option>
                  {StateData && StateData.map((i, key) => (
                      <option key={key} value={i.StateId}>{i.StateName}</option>
                    ))}
                </select>
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Payment Type</p>
                <select
                  class="form-select  "
                  value={AddLwfMaster.PaymentType}
                  onChange={(e) =>
                    setAddLwfMaster({
                      ...AddLwfMaster,
                      PaymentType: e.target.value,
                    })
                  }
                  aria-label="Default select example"
                >
                  <option  value="" disabled>Select PaymentType</option>
                  {ViewPaymentType &&  ViewPaymentType.map((i, key) => (
                      <option key={key} value={i.PaymentType}>{i.PaymentType}</option>
                    ))}
                </select>
              </div>

              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Payment Period</p>
                <input
                  className="input_field_head "
                  type="text"
                  value={AddLwfMaster.PaymentPeriod}
                  onChange={(e) =>{
                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddLwfMaster({
                      ...AddLwfMaster,
                      PaymentPeriod: TextValue,
                    })
                  }
                    
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Employee Contribution</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={AddLwfMaster.EmployeeContribution}
                  onChange={(e) =>{
                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddLwfMaster({
                      ...AddLwfMaster,
                      EmployeeContribution: TextValue,
                    })
                  }
                  
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Employer Contribution </p>
                 <input
                  className=" input_field_head"
                  type="text"
                  value={AddLwfMaster.EmployerContribution}
                  onChange={(e) =>{
                    const TextValue = e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddLwfMaster({
                      ...AddLwfMaster,
                      EmployerContribution: TextValue,
                    })
                  }
                   
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">From Date </p>

                <input
                  className=" input_field_head"
                  type="date"
                  // value={AddLwfMaster.FromDate}
                  value={moment(AddLwfMaster.FromDate).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setAddLwfMaster({
                      ...AddLwfMaster,
                      FromDate: e.target.value,
                    })
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">To Date </p>

                <input
                  className=" input_field_head"
                  type="date"
                  
                  disabled={AddLwfMaster.FromDate === ""}
                  min={AddLwfMaster.FromDate}
                  value={moment(AddLwfMaster.ToDate).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setAddLwfMaster({ ...AddLwfMaster, ToDate: e.target.value })
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

export default connect(mapStateToProps, mapDispatchToProps)(LwfMaster);

