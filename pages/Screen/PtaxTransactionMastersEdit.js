import React, { useEffect, useState } from "react";
import Sidebaar from "./Sidebaar";
import {mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import moment from "moment/moment";
import { companyMasterApi, LoginUserId, StateMasterApi } from "../api/AllApi";
import Vaildation from "./Vaildation";

const PtaxTransactionMastersEdit = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [StateData, setStateData] = useState([]);
  const [TransactionModel, setTransactionModel] = useState(false);
  const [PtaxTransaction, setPtaxTransaction] = useState([]);
  const [UserId, setUserId] = useState("");

// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

  //  get edit user in ptax master
  const EditPtaxIdGet = router.query.UpdatePtaxsMaster ? router.query.UpdatePtaxsMaster: "";

  // render data api call
  useEffect(() => {
    // setPtaxNewUser(EditPtaxIdGet);
    StateList();
    if(EditPtaxIdGet){
      ViewMasterPtaxs(EditPtaxIdGet)
      ViewTransactionMasters(EditPtaxIdGet);
    }else(
      console.log("not found ptx master" )
    )
   
    console.log("PtaxTransaction", PtaxTransaction);
  }, [EditPtaxIdGet]);







    // Get single data ptax View master code
 const ViewMasterPtaxs = async EditPtaxIdGet => {
  setLoding(true)
  const PtaxsMastersAll = {
    OperationType: "ViewSingle",
    PtaxId: EditPtaxIdGet,
  };
  await axios.post(baseUrl + MethodNames.ViewMasterPtax, PtaxsMastersAll)
    .then((res) => {
 
      if( res&& res.data && res.data.ViewMasterPtax[0]){
        console.log("response ViewMasterPtax DATA----", res.data.ViewMasterPtax[0]);
        setPtaxNewUser(res.data.ViewMasterPtax[0]);
      }
      
      // setViewMasterPtax([]);
      setLoding(false);
    }).catch(()=>{
      setLoding(false);
    })
};

  // update  PtaxTransaction edit master
  const UserUpdate = (user) => {
    setPtaxUpdate(user);
  };
  
 //  state master api call data
  const StateList = async () => {
    const data = await StateMasterApi();
    setStateData(data.data.ViewMasterState);
  };

  //  ptax user data
  const [PtaxNewUser, setPtaxNewUser] = useState({
    PtaxId: "",
    StateId: "",
    PTAX_RegistrationNo: "",
  });
 
//  ptax Transaction user data
  const [PtaxUpdate, setPtaxUpdate] = useState({
    Id: "0",
    Gender: "",
    RangeFrom: "",
    RangeTo: "",
    Amount: "",
    FromDate: "",
    ToDate: "",
    // UserId:"testmer"
  });
  console.log("PtaxUpdate----",PtaxUpdate)

  //   upadte all  ptax master  data
  const UpdateSubmit = async (e) => {
    e.preventDefault();
    let values = await Vaildation(PtaxNewUser);
    if (!values) {
      return;
    }
    if (PtaxNewUser.StateId === "Select State") {
      toast.error("Please Select State.");
      return;
    }
    let val = await Vaildation(PtaxUpdate);
    if (!val) {
      return;
    }
    if(PtaxUpdate.RangeFrom >= PtaxUpdate.RangeTo) {
      toast.error("Please enter a  Range To value greater than Range From");
      return;
    }

    let postData = {
      PtaxMaster: [
        {
          PtaxId: PtaxNewUser.PtaxId,
          StateId: PtaxNewUser.StateId,
          PTAX_RegistrationNo: PtaxNewUser.PTAX_RegistrationNo,
          UserId: UserId,
        },
      ],
      PtaxTransaction: [
        {
          Id: PtaxUpdate.Id,
          PtaxId: PtaxNewUser.PtaxId,
          Gender: PtaxUpdate.Gender,
          RangeFrom: PtaxUpdate.RangeFrom,
          RangeTo: PtaxUpdate.RangeTo,
          Amount: PtaxUpdate.Amount,
          FromDate: moment(PtaxUpdate.FromDate).format("MM/DD/YYYY"),
          ToDate: moment(PtaxUpdate.ToDate).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };



    //  ptax Transaction master validation range
    const TraValditionData = {
      StateId: PtaxNewUser.PtaxId,
      Gender: PtaxUpdate.Gender,
      RangeFrom: PtaxUpdate.RangeFrom,
      RangeTo: PtaxUpdate.RangeTo,
      FromDate: moment(new Date(PtaxUpdate.FromDate)).format("MM/DD/YYYY"),
      ToDate:moment(new Date(PtaxUpdate.ToDate)).format("MM/DD/YYYY")
      };
  
      console.log("TraValditionDataPtax---1",TraValditionData)
      try {
        const res = await axios.post(baseUrl + MethodNames.ValidatePtax, TraValditionData);
        console.log("TraValditionDataPtax---2",res.data)
        if (res.data.ValidatePtax[0].RecStatus === "Exist") {
          toast.error(`This combination Gender,Range from & Range to already exists `);
          console.log("TraValditionDataPtax---3",res.data.ValidatePtax[0])
          return; // Stop execution if any item fails validation
        }
      } catch (error) {
       
        console.error("Error while validating mapping:", error);
        return; // Stop execution if any error occurs
      }
   
    const PtaxMasterData = JSON.stringify(postData);

    const PtaxMasterUpdate = {
      OperationType: "Update",
      JsonData: PtaxMasterData,
    };
  

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterPtax, PtaxMasterUpdate)
      .then((res) => {
        console.log("Response--PtaxMaster-Update ", res.data.UpsertMasterPtax);
        if (res.data.UpsertMasterPtax) {
          toast.success("PTAX updated successfully");
        }
        ViewTransactionMasters(PtaxNewUser.PtaxId);
        setTimeout(()=>{
          router.push("/Screen/PtaxMaster");
        },1000)
       
      });
  };

  //   View Ptax Master Transaction data
  const ViewTransactionMasters = async (PtaxId) => {
    const PtaxTransactionAll = {
      OperationType: "ViewAll",
      PtaxId: PtaxId,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterPtaxTransaction, PtaxTransactionAll)
      .then((res) => {
        console.log(
          "response data ViewMasterPtaxTransaction----",
          res.data.ViewMasterPtaxTransaction
        );
        setPtaxTransaction(res.data.ViewMasterPtaxTransaction);
      });
  };

  //  open model in add transaction data
  const transactionAdd = () => {
    setPtaxUpdate({
      Id: "0",
      Gender: "",
      RangeFrom: "",
      RangeTo: "",
      Amount: "",
      FromDate: "",
      ToDate: "",
    });
    setTransactionModel(!TransactionModel);
  };

  //  add Ptax Transaction  master

  const TransactionAddSubmit = async (e) => {
    e.preventDefault();
    if (PtaxNewUser.StateId === "Select State") {
      toast.error("Please Select State.");
      return;
    }
    let val = await Vaildation(PtaxUpdate);
    if (!val) {
      return;
    }
    let values = await Vaildation(PtaxNewUser);
    if (!values) {
      return;
    }
    if (PtaxNewUser.StateId === "Select State") {
      toast.error("Please Select State.");
      return;
    }
    if (PtaxUpdate.RangeFrom >= PtaxUpdate.RangeTo) {
      toast.error("Please enter a  Range To value greater than Range From")
      return;
    }

    let postData = {
      PtaxMaster: [
        {
          PtaxId: PtaxNewUser.PtaxId,
          StateId: PtaxNewUser.StateId,
          PTAX_RegistrationNo: PtaxNewUser.PTAX_RegistrationNo,
          UserId: UserId,
        },
      ],
      PtaxTransaction: [
        {
          Id: PtaxUpdate.Id,
          PtaxId: PtaxNewUser.PtaxId,
          Gender: PtaxUpdate.Gender,
          RangeFrom: PtaxUpdate.RangeFrom,
          RangeTo: PtaxUpdate.RangeTo,
          Amount: PtaxUpdate.Amount,
          FromDate: moment(new Date(PtaxUpdate.FromDate)).format("MM/DD/YYYY"),
          ToDate: moment(new Date(PtaxUpdate.ToDate)).format("MM/DD/YYYY"),
          //  FromDate: moment(new Date(PtaxUpdate.FromDate[1])).format("MM/DD/YYYY"),
          //  ToDate: moment(new Date(PtaxUpdate.ToDate[1])).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };
//  ptax Transaction master validation range
    const TraValditionData = {
      StateId: PtaxNewUser.PtaxId,
      Gender: PtaxUpdate.Gender,
      RangeFrom: PtaxUpdate.RangeFrom,
      RangeTo: PtaxUpdate.RangeTo,
      FromDate: moment(new Date(PtaxUpdate.FromDate)).format("MM/DD/YYYY"),
      ToDate:moment(new Date(PtaxUpdate.ToDate)).format("MM/DD/YYYY")
      };
  
      console.log("TraValditionData---12",TraValditionData)
      try {
        const res = await axios.post(baseUrl + MethodNames.ValidatePtax, TraValditionData);
        console.log("TraValditionData---22",res.data)
        if (res.data.ValidatePtax[0].RecStatus === "Exist") {
          toast.error(`This combination Gender,Range from & Range to already exists `);
          console.log("TraValditionData---3",res.data.ValidatePtax[0])
          return; // Stop execution if any item fails validation
        }
      } catch (error) {
       
        console.error("Error while validating mapping:", error);
        return; // Stop execution if any error occurs
      }
    
    


    const ProjectTransactionUser = JSON.stringify(postData);
    const PtaxTransactionUpdate = {
      OperationType: "Update",
      JsonData: ProjectTransactionUser,
    };
    console.log("PtaxTransactionUpdate user data", PtaxTransactionUpdate);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterPtax, PtaxTransactionUpdate)
      .then((res) => {
        if (res.data.UpsertMasterPtax) {
          toast.success(
            "Transaction added successfully ",
            res.data.UpsertMasterPtax
          );
        }
        ViewTransactionMasters(PtaxNewUser.PtaxId);
        setTransactionModel(false);
        setPtaxUpdate({
          Id: "0",
          Gender: "",
          RangeFrom: "",
          RangeTo: "",
          Amount: "",
          FromDate: "",
          ToDate: "",
        });
      });
  };

  //  back button
  const back = () => {
    router.push("/Screen/PtaxMaster");
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />

        <div className={open ? "content-page2 vh-10" : "content-page vh-10"}>
          <div className="content  ">
            <div className="container-fluid ">
              <div className="cardd">
                <div className="p-2 row ">
                  <div className="col-sm-12 col-12 col-md-12  ">
                    <div
                      className="fs_15 back-color table_ref_head text-white "
                      colSpan={7}
                    >
                      <p className="p-2">Ptax Master Info</p>
                    </div>
                  </div>
                  <div className="col-sm-12 col-12 col-md-12   ">
                    <div
                      className="fs_15 back-colo table_ref_Main text-white  "
                      colSpan={7}
                    >
                      <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                        Basic Info
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row my-2 ms-1 me-1 ">
                  <ToastContainer />

                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> State </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <select
                      class="form-select w_90 no-drop "
                      disabled={true}
                      value={PtaxNewUser.StateId}
                      onChange={(e) =>
                        setPtaxNewUser({
                          ...PtaxNewUser,
                          StateId: e.target.value,
                        })
                      }
                      aria-label="Default select example"
                    >
                      <option selected>Select State</option>
                      {StateData &&
                        StateData.map((i, key) => (
                          <option key={key} value={i.StateId}>{i.StateName}</option>
                        ))}
                    </select>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PTAX Registration No</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                          disabled={true}
                      className="w_90 input_field_head no-drop"
                      type="text"
                      value={PtaxNewUser.PTAX_RegistrationNo}
                      onChange={(e) =>{
                        const TextValue= e.target.value.replace(/[^0-9\s]/g,"")
                        setPtaxNewUser({
                          ...PtaxNewUser,
                          PTAX_RegistrationNo: TextValue,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>

                {TransactionModel == true ? (
                  <div className="w-100 px-2 p-0 mt-4  ">
                    <div
                      className="fs_15 back-colo table_ref_head  text-white back-color float-start w-100 d-flex justify-content-between "
                      colSpan={7}
                    >
                      <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                        Add Transaction
                      </p>
                      <button
                        type="button"
                        class="btn-close m-2"
                        // data-bs-dismiss="modal"
                        onClick={() => setTransactionModel(false)}
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="w-100 p-1 my-1  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                      Ptax Transaction
                    </p>
                  </div>
                </div>
                <div className="row mt-3 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Gender </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <div class="form-check form-check-inline">
                      {console.log("PtaxUpdate.Gender--", PtaxUpdate.Gender)}
                      <input
                        class="form-check-input"
                        checked={PtaxUpdate.Gender == "Male"}
                        onChange={(e) =>
                          setPtaxUpdate({
                            ...PtaxUpdate,
                            Gender: e.target.value,
                          })
                        }
                        value="Male"
                        type="radio"
                        name="male"
                        id="inlineRadio1"
                      />
                      male
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        checked={PtaxUpdate.Gender == "Female"}
                        onChange={(e) =>
                          setPtaxUpdate({
                            ...PtaxUpdate,
                            Gender: e.target.value,
                          })
                        }
                        value="Female"
                        type="radio"
                        name="female"
                        id="inlineRadio2"
                      />
                      female
                    </div>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Range From </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={PtaxUpdate.RangeFrom}
                      min={PtaxUpdate.RangeFrom}
                      onChange={(e) =>{
                        const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,6)
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          RangeFrom: TextValue,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Range To</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={PtaxUpdate.RangeTo}
                      onChange={(e) =>{
                        const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,6)
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          RangeTo: TextValue,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Amount</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={PtaxUpdate.Amount}
                      onChange={(e) =>{
                        const TextValue= e.target.value.replace(/[^0-9\s]/g,"").slice(0,6)
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          Amount: TextValue,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> From Date</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    {/* <input
                      className="w_90 input_field_head"
                      type="date"
                    
                      value={PtaxUpdate && PtaxUpdate.FromDate[1] ? moment(PtaxUpdate.FromDate[1]).format("YYYY-MM-DD"):null}
                      onChange={(e) =>
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          FromDate: e.target.value,
                        })
                      }
                    /> */}

                    <input
                      className="w_90 input_field_head"
                      type="date"
                      min={moment(PtaxUpdate.FromDate).format("YYYY-MM-DD")}
                      value={moment(PtaxUpdate.FromDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          FromDate: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> To Date </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      disabled={PtaxUpdate.FromDate === ""}
                      min={PtaxUpdate.FromDate}
                      value={moment(PtaxUpdate.ToDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setPtaxUpdate({
                          ...PtaxUpdate,
                          ToDate: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                </div>
                {TransactionModel == true ? (
                  <div className="w-100 h-100 d-flex justify-content-end p-2">
                    <button
                      className="btn btn-primary h-100 w_101 btn_size_h   ps-4 pe-4"
                      onClick={TransactionAddSubmit}
                    >
                      Add Transaction
                    </button>
                    <button
                      onClick={back}
                      className="btn btn-primary bg-danger border-0 h-100 w_100 btn_size_h  ms-2  ps-4 pe-4"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="w-100 h-100 d-flex justify-content-end p-2">
                    <button
                    // disabled={TransactionModel == false ? true: false}
                      className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                      onClick={UpdateSubmit}
                    >
                      Update
                    </button>
                    <button
                      onClick={back}
                      className="btn btn-primary bg-danger border-0 h-100 w_100 btn_size_h  ms-2  ps-4 pe-4"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* <div className="w-100 h-100 d-flex justify-content-end p-2  my-4">
                  <button
                    className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                    onClick={UpdateSubmit}
                  >
                    Save
                  </button>
                  <button
                    onClick={back}
                    className="btn btn-primary bg-danger border-0 h-100 w_100 btn_size_h  ms-2  ps-4 pe-4"
                  >
                    Cancel
                  </button>
                </div> */}
              </div>
              <div className="cardd mt-2">
                <div className="col-sm-12 col-12 col-md-12   ">
                  {TransactionModel == false ? (
                    <div className="fs_15 fw-bold  table_ref_head ">
                      <button
                        type="button"
                        // data-bs-toggle="modal"
                        // data-bs-target="#exampleModal"
                        // data-bs-whatever="@mdo"
                        onClick={transactionAdd}
                        className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                      >
                        <i className="bx bx-plus ms-1 mt-1"></i> Add New Record
                      </button>
                    </div>
                  ) : (
                    ""
                  )}{" "}
                </div>
                <div className="table-responsive">
                  <table className="">
                    <tbody>
                      <tr>
                        <th className="text-center">Edit</th>
                        <th className="text-center">PTAX Id</th>
                        <th className="text-center">Gender</th>
                        <th className="text-center">Range From</th>
                        <th className="text-center">Range To</th>
                        <th className="text-center"> Amount</th>
                        <th className="text-center">From Date</th>
                        <th className="text-center">To Date</th>
                      </tr>

                      {PtaxTransaction &&
                        PtaxTransaction.map((i, key) => {
                          return (
                            <>
                              <tr key={key}>
                              {TransactionModel == true ? <td></td> :
                                <td className="text-center">
                                  <p className="m-0 ms-2">
                                    <a
                                      onClick={() => UserUpdate(i)}
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
                              }

                                <td className="text-center">{i.PtaxId}</td>
                                <td className="text-center">{i.Gender}</td>
                                <td className="text-center">{i.RangeFrom}</td>
                                <td className="text-center">{i.RangeTo}</td>
                                <td className="text-center">{i.Amount}</td>
                                <td className="text-center">{i.FromDate}</td>
                                <td className="text-center">{i.ToDate}</td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PtaxTransactionMastersEdit);
