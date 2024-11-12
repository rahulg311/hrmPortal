import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import { LoginUserId, StateMasterApi } from "../api/AllApi";
import moment from "moment/moment";
import Vaildation from "./Vaildation";
import ErrorPage from "./ErrorPage";

const PtaxMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterPtax, setViewMasterPtax] = useState("");
  const [loding, setLoding] = useState(true);
  const [StateData, setStateData] = useState([]);
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
    ViewMasterPtaxs();
  }, []);

  // model open anmd close
  const modalRef = useRef();
  const addModel = () => {
    setAddPtaxMaster({
      Id: 0,
      PtaxId: 0,
      State: "",
      PTAX_RegistrationNo: "",
      Gender: "",
      RangeFrom: "",
      RangeTo: "",
      Amount: "",
      FromDate: "",
      ToDate: "",
    })
    
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };


  // View Ptaxs master code
 const ViewMasterPtaxs = async () => {
    setLoding(true)
    const PtaxsMastersAll = {
      OperationType: "ViewAll",
      PtaxId: 1,
    };
    await axios.post(baseUrl + MethodNames.ViewMasterPtax, PtaxsMastersAll)
      .then((res) => {
        console.log("response ViewMasterPtax DATA----", res.data.ViewMasterPtax);
        setViewMasterPtax(res.data.ViewMasterPtax);
        // setViewMasterPtax([]);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      })
  };

  //  ViewMasterPtaxs click by id edit
  const UserUpdate = (user) => {
    router.push(
      {
        pathname: "/Screen/PtaxTransactionMastersEdit",
        query: { UpdatePtaxsMaster: JSON.stringify(user) },
      },
      undefined,
      { shallow: true }
    );
  };

  // StateList  view company master
  useEffect(() => {
    StateList();
  }, []);

  //  api call statemaster
  const StateList = async () => {
    const data = await StateMasterApi();
    setStateData(data.data.ViewMasterState);
  };

  //  add Ptax Master 
  const [AddPtaxMaster, setAddPtaxMaster] = useState({
    Id: 0,
    PtaxId: 0,
    State: "",
    StateNames: "",
    PTAX_RegistrationNo: "",
    Gender: "",
    RangeFrom: "",
    RangeTo: "",
    Amount: "",
    FromDate: "",
    ToDate: "",
  });
  
 
  //   Sumbit data Ptax master
  const handleSubmit = async (e) => {
    e.preventDefault();
    let val = await Vaildation(AddPtaxMaster);
    if (!val) {
      return;
    }
 
    
    if (Number(AddPtaxMaster.RangeFrom) >Number(AddPtaxMaster.RangeTo)) {
      toast.error("Please enter a  Range To value greater than Range From");
      return;
    }
  
   

    let postData = {
      PtaxMaster: [
        {
          StateId: AddPtaxMaster.State,
          PTAX_RegistrationNo: AddPtaxMaster.PTAX_RegistrationNo,
          UserId: UserId,
        },
      ],
      PtaxTransaction: [
        {
          Id: AddPtaxMaster.Id,
          Gender: AddPtaxMaster.Gender,
          RangeFrom: AddPtaxMaster.RangeFrom,
          RangeTo: AddPtaxMaster.RangeTo,
          Amount: AddPtaxMaster.Amount,
          FromDate: moment(new Date(AddPtaxMaster.FromDate)).format(
            "MM/DD/YYYY"
          ),
          ToDate: moment(new Date(AddPtaxMaster.ToDate)).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };
    




    const PtaxMasterData = JSON.stringify(postData);
    console.log("AddPtaxMaster---- postData", postData);
    const PtaxMasterAdd = {
      OperationType: "Add",
      JsonData: PtaxMasterData,
    };

    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterPtax, PtaxMasterAdd)
      .then((res) => {
        console.log("response-----333", res.data.UpsertMasterPtax[0]);
        if (res.data.UpsertMasterPtax[0]) {
          toast.success("PTAX added successfully");
        }
        hideModal()
        ViewMasterPtaxs();
        setAddPtaxMaster("");
       
        // router.push("/Screen/PtaxMaster");
      });
  };

  // serach ViewMasterPtaxs  user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterPtax.filter((item) => {
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
                          PTAX Master
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15 fw-bold table_ref_head ">
                        
                        <button
                          type="button"
                       onClick={()=>addModel()}
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New PTAX
                          
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding? null :
                  
                  <div className="table-responsive">
                  {
                          ViewMasterPtax.length >0 ?
                        <>
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">PTAX Id</th>
                          <th className="text-center">State Name</th>
                          <th className="text-center">PTAX Registration No</th>
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
                                            onClick={() => UserUpdate(i.PtaxId)}
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
                                      <td>{i.PtaxId}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.PTAX_RegistrationNo}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterPtax &&
                              ViewMasterPtax.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                               onClick={() => UserUpdate(i.PtaxId)}
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

                                      <td>{i.PtaxId}</td>
                                      <td>{i.StateName}</td>
                                      <td>{i.PTAX_RegistrationNo}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                        
                      </tbody>
                    </table>
                    </> :    <ErrorPage  />
                     
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
        ref={modalRef}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class=" modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
              <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                Add Ptax Master
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="cardd m-2">
              <div class="modal-bod pt-2  pb-0">
                <div className="w-100 p-1 my-1  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">Ptax </p>
                  </div>
                </div>
              </div>
              <div class="modal-body pb-0  pt-0 mt-1">
                <p className="fw-bold">State</p>
                <select
                  class="form-select  "
                  placeholder="Select State"
                  // value={AddPtaxMaster?.State}
                  value={AddPtaxMaster.State ? JSON.stringify({ StateId: AddPtaxMaster.State, StateName: AddPtaxMaster.StateNames }) : ""}
                  onChange={(e) =>{
                    if(e.target.value==="Select State"){
                      return
                    }
                  const selectedState = JSON.parse(e.target.value);
                    if(ViewMasterPtax.some((item)=>  item.StateName === selectedState.StateName)){
                      toast.error("State already exists")
                      return
                  }else{
                   
                     setAddPtaxMaster({...AddPtaxMaster,State: selectedState.StateId,StateNames:selectedState.StateName})
                  }}
                  }
                  aria-label="Default select example"
                >
                  <option  value=""  disabled>Select State</option>
                  {StateData &&
                    StateData.map((i, key) => (
                      <option key={key} value={JSON.stringify({StateId:i.StateId,StateName: i.StateName})}>{i.StateName}</option>
                    ))}
                </select>
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">PTAX Registration No</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={AddPtaxMaster.PTAX_RegistrationNo}
                  onChange={(e) =>{

                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"")
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
                      PTAX_RegistrationNo: TextValue,
                    })
                     }
                   
                  }
                />
              </div>
              <div class="modal-bod pt-2  p-0  pb-0">
                <div className="w-100 p- my-3  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                      Ptax Transaction
                    </p>
                  </div>
                </div>
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Gender</p>
                <div class="form-check form-check-inline mt-1">
                  <input
                    class="form-check-input"
                    checked={AddPtaxMaster.Gender === "Male"}
                    onChange={(e) =>
                      setAddPtaxMaster({
                        ...AddPtaxMaster,
                        Gender: e.target.value,
                      })
                    }
                    value="Male"
                    type="radio"
                    name="male"
                    id="inlineRadio1"
                  />
                  Male
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    checked={AddPtaxMaster.Gender === "Female"}
                    onChange={(e) =>
                      setAddPtaxMaster({
                        ...AddPtaxMaster,
                        Gender: e.target.value,
                      })
                    }
                    value="Female"
                    type="radio"
                    name="female"
                    id="inlineRadio2"
                  />
                  Female
                </div>
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Range From</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={AddPtaxMaster.RangeFrom}
                  onChange={(e) =>{
                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
                      RangeFrom: TextValue,
                    })
                  }
                    
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Range To</p>
                <input
                  className=" input_field_head"
                  type="text"
                  value={AddPtaxMaster.RangeTo}
                  onChange={(e) =>{
                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
                      RangeTo: TextValue,
                    })
                  }
                   
                  }
                />
              </div>
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Amount </p>

                <input
                  className=" input_field_head"
                  type="text"
                  value={AddPtaxMaster.Amount}
                  onChange={(e) =>{
                    const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,7)
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
                      Amount: TextValue,
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
                  value={AddPtaxMaster.FromDate}
                  onChange={(e) =>
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
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
                  min={AddPtaxMaster.FromDate} // Set minimum selectable date as the start date
                  disabled={AddPtaxMaster.FromDate === ""} // Disable end date if no start date is selected
                  value={AddPtaxMaster.ToDate}
                  onChange={(e) =>
                    setAddPtaxMaster({
                      ...AddPtaxMaster,
                      ToDate: e.target.value,
                    })
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
                <button
                  // data-bs-dismiss="modal"
                  onClick={handleSubmit}
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
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PtaxMaster);
