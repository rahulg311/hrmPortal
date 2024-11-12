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
import {ViewProjectMasters,ViewMasterPayComponent,LoginUserId} from "../api/AllApi";
import moment from "moment/moment";
import Vaildation from "./Vaildation";
import { Icon } from "@mui/material";

const ComponentMappingMapping = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [searchInputAddMapping, setSearchInputAddMapping] = useState("");
  const [searchInputAddMapping2, setSearchInputAddMapping2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [SearchFliterAddMapping, setSearchFliterAddMapping] = useState("");
  
  const [ViewMasterPayComMapping, setViewMasterPayComMapping] = useState("");
  const [ViewActiveMapping, setViewActiveMapping] = useState("");
  const [EditBtn, setEditBtn] = useState(false);
  const [ProjectCode, setProjectCode] = useState("");
  const [PayComponent, setPayComponent] = useState("");
  const [loding, setLoding] = useState(true);
  const [Render, setRender] = useState(false);
  const [SelectMapping, setSelectMapping] = useState([]);
  const [UserId, setUserId] = useState("");
  const [TilldateShow, setTilldateShow] = useState(false);
  const [UserIdLogin,setUserIdLogin]= useState("")
   //  add project Master
   const [ComponentMapping, setComponentMapping] = useState({
    Id: 0,
    ProjectId: "",
    ConsiderFor_PF: 0,
    ConsiderFor_Ptax: 0,
    ConsiderFor_ESIC: 0,
    // UserId: "testmer",
  });

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  console.log("SearchFliterAddMapping",SearchFliterAddMapping)



// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    UserIds(); 
   }, []);

  const UserIds = async () => {
    const userid = await LoginUserId();
    setUserId(userid);
    ViewMasterMapping(userid)
  setUserIdLogin(userid)
   };

  useEffect(() => {
    // ViewMasterMapping();
    ProjectList();
    ViewDeactiveMapping()
}, []);


// GET CURRENT DATE 
const currentDateToday = moment().format("MM/DD/YYYY")
console.log("moment()--",moment())

//  project code get
  const ProjectList = async () => {
    const datass = await ViewProjectMasters();
    // console.log("ProjectList000000000",datass)
    const data = await ViewMasterPayComponent();
    setProjectCode(datass.data.ViewMasterProject);
    setPayComponent(data.data.ViewMasterPayComponent);
  };


    // Function to refresh the page
    // const refreshPage = () => {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 50);
    // };

 //  View componentMapping click by id edit
  const openModel = (user) => {
    setEditBtn(true);
    console.log("open model ", user);
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
 
    setSelectMapping([user]);
  };

  // open model popup
  const modalRef = useRef();
  const openModelAdd = () => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    setEditBtn(false);
    setSelectMapping([]);
  };
  //  close popup model
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
    // window.location.reload(); // Refresh the page
  };

  // active and deactive show data 
  const ViewDeactiveMapping = async (id) => {
   
    if(id!=""&& id !=null && id!=undefined){
    const ProjectPayComponent = {
      OperationType: "ViewSingle",
      ProjectId: id,
      UserId:UserIdLogin
    };
    console.log("ProjectPayComponen000000-------",ProjectPayComponent)
    try {
      const response = await axios.post( baseUrl + MethodNames.ViewMasterProjectPayComponent,ProjectPayComponent)
      setViewActiveMapping(response.data.ViewMasterProjectPayComponent);
    } catch (error) {
      
      console.log("error ViewMasterProjectPayComponent",error)
    }
  }
  };


  // function refreshPage() {
  //   // Close the modal
  //   $('#modal').modal('hide');
  //   // Refresh the page after a short delay
  //   setTimeout(function(){
  //     window.location.reload();
  //   }, 500);
  // }


 


  // View Master ProjectPayComponent
  const ViewMasterMapping = async (userId) => {
    const userIdLogin = await sessionStorage.getItem("UserDetails")
    const ProjectPayComponent = {
      OperationType: "ViewAll",
      ProjectId: 0,
      UserId:userIdLogin
    };
    console.log("ViewMasterMapping-------0000",ProjectPayComponent)
    await axios.post( baseUrl + MethodNames.ViewMasterProjectPayComponent,ProjectPayComponent)
      .then((res) => {
        setViewMasterPayComMapping(res.data.ViewMasterProjectPayComponent);
        setLoding(false);
      });
  };

  //   sumbit data Master PayComMapping
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ComponentMapping.ProjectId == 0 || null || "") {
      toast.warning("Please select project id");
      return;
    }

    console.log("SelectMapping", SelectMapping);

    // let val = await Vaildation(SelectMapping);
    if (SelectMapping.length === 0) {
      toast.warning(" Please select pay component code");
      return;
    }
    const StartDate = SelectMapping.some((item) => item.FromDate.trim() === "");
    const Enddate = SelectMapping.some((item) => item.ToDate.trim() === "");
    // console.log("hasEmptyName",hasEmptyName)
    if (StartDate) {
      toast.warning("Please select from date");
      return;
    }
    if (Enddate) {
      toast.warning("Please select end date");
      return;
    }




  console.log("datasss---",SelectMapping)
  for (const item of SelectMapping) {
    const datasss = {
      ProjectId: item.ProjectId,
      PayCompCode: item.PayCompCode,
      FromDate: item.FromDate,
      ToDate: item.ToDate
    };

    console.log("datasss---2",datasss)
    try {
      const res = await axios.post(baseUrl + MethodNames.ValidateMappingPayComponent, datasss);
      console.log("datasss---4",res.data)
      if (res.data.ValidateMappingPayComponent[0].RecStatus === "Exist") {
        toast.error(`${item.PayCompName} already exists`);
        console.log("datasss---3",res.data.ValidateMappingPayComponent[0])
        return; // Stop execution if any item fails validation
      }
    } catch (error) {
     
      console.error("Error while validating mapping:", error);
      return; // Stop execution if any error occurs
    }
  }

   const MappingProjectData = JSON.stringify(SelectMapping);
    const MappingProjectPayAdd = {
      OperationType: "Add",
      JsonData: MappingProjectData,
    };
    console.log("MappingProjectPayAdd", MappingProjectPayAdd);
  
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMappingProjectPayComponent, MappingProjectPayAdd )
      .then((res) => {
        if (res.data.UpsertMappingProjectPayComponent) {
          toast.success("Pay comp mapping added successfully");
          setTimeout(() => {
            hideModal();
          }, 1000);
         
          ViewMasterMapping();
        }
       
      });
  };

  //  update data Master PayComMapping
  const UpdateSubmit = async (closeMappingKey) => {

    let val = await Vaildation(SelectMapping);
    if (SelectMapping.length === 0) {
      toast.warning("Selected pay component code");
      return;
    }
    const StartDate = SelectMapping.some((item) => item.FromDate.trim() === "");
    const Enddate = SelectMapping.some((item) => item.ToDate.trim() === "");
 
    if (StartDate) {
      toast.warning("Please select from date");
      return;
    }
    if (Enddate) {
      toast.warning("Please select end date");
      return;
    }
    let SelectMappingEdit = SelectMapping;
    SelectMappingEdit[0]["ConsiderFor_PF"] = SelectMapping[0]["ConsiderFor_PF"] == true ? 1 : 0;
    SelectMappingEdit[0]["ConsiderFor_Ptax"] =SelectMapping[0]["ConsiderFor_Ptax"] == true ? 1 : 0;
    SelectMappingEdit[0]["ConsiderFor_ESIC"] =SelectMapping[0]["ConsiderFor_ESIC"] == true ? 1 : 0;

    let MappingProjectData = JSON.stringify(SelectMappingEdit);
    console.log("all data update code-------1", MappingProjectData);
    console.log("all data update code-----------2",  SelectMapping);
    const MappingProjectPayUpdate = {
      OperationType: "Update",
      JsonData: MappingProjectData,
    };

    console.log("MappingProjectPayUpdate", MappingProjectPayUpdate);
    const UpsertMasterCompany = await axios
      .post(
        baseUrl + MethodNames.UpsertMappingProjectPayComponent,
        MappingProjectPayUpdate
      )
      .then((res) => {
        // if (res.data.UpsertMappingProjectPayComponent ) {
          
      
         if(closeMappingKey=="closeMappingKey"){
          openModelAdd()
          toast.success("Pay comp mapping closed successfully");

        }else(
          toast.success("Pay comp mapping updated successfully")
        )
        ViewMasterMapping();
      });
  };

  // serach ViewMasterPayComMappings  user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterPayComMapping.filter((item) => {
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
    // serach bank  master user
    const searchItemsAddMapping = (searchValue1, searchValue2) => {
      console.log("searchValue1", searchValue1, searchValue2);
      setSearchInputAddMapping(searchValue1);
      setSearchInputAddMapping2(searchValue2);
      if (searchValue1 !== "" || searchValue2 !== "") {
        const filterDepartment = PayComponent && PayComponent.filter((item) => {
          return (
            Object.values(item).splice(1, 2).join("").toLocaleLowerCase().includes(searchValue1) &&
            Object.values(item).join("").toLocaleLowerCase().includes(searchValue2.toLocaleLowerCase())
          );
        });
        setSearchFliterAddMapping(filterDepartment);
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
                          Pay Component Mapping
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
                          onClick={() => openModelAdd()}
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 ">
                          <i className="bx bx-plus ms-1 mt-1"></i> Add Mapping
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Project Name</th>
                          <th className="text-center">Pay Comp Name</th>
                          
                          {/* <th className="text-center">PayCompCode</th> */}
                          <th className="text-center">Pay Comp Type</th>
                          <th className="text-center">Consider For PF </th>
                          <th className="text-center">Consider For Ptax </th>
                          <th className="text-center">Consider For ESIC </th>
                        </tr>

                        <tr>
                          <td></td>
                          <td >
                            {/* <input
                              class="input-grey-rounded fs_10 w_175"
                              type="number"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(e.target.value, searchInput2)
                              }
                            /> */}
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td >
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          
                          {/* 
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td> */}
                        </tr>

                        {searchInput.length != "" ||
                        searchInput2.length != "" ? (
                          <>
                            {SearchFliter &&
                              SearchFliter.filter((i)=>i.CurrentDayActive===1).map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            // onClick={() => openModel(i)}
                                            onClick={() => { ViewDeactiveMapping(i.ProjectId),openModel(i)}}
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
                                      <td>{i.ProjectName}</td>
                                      <td>{i.PayCompName}</td>
                                      
                                      {/* <td>{i.PayCompCode}</td> */}
                                      <td>{i.PayCompType}</td>
                                      <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_PF)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_PF)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                    <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_Ptax)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_Ptax)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                    <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_ESIC)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_ESIC)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterPayComMapping &&
                              ViewMasterPayComMapping.filter((i)=>i.CurrentDayActive===1).map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => { ViewDeactiveMapping(i.ProjectId),openModel(i)}}
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
                                      <td>{i.ProjectName}</td>
                                      <td>{i.PayCompName}</td>
                                      {/* <td>{i.PayCompCode}</td> */}
                                      <td>{i.PayCompType}</td>
                                      <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_PF)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_PF)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                    <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_Ptax)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_Ptax)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                    <td style={{ textAlign:"center" }}>
                                      <Icon
                                      className={`material-icons ${String(i.ConsiderFor_ESIC)==="true" ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {String(i.ConsiderFor_ESIC)==="true" ? 'check_circle' : 'cancel'}
                                    </Icon>
                                    </td>
                                      {/* <td>{String(i.ConsiderFor_PF)}</td> */}
                                      {/* <td>{String(i.ConsiderFor_Ptax)}</td>
                                      <td>{String(i.ConsiderFor_ESIC)}</td> */}
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
      {/*  add project mapping code popup */}

      <div
        class="modal fade"
        ref={modalRef}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialogg  w-100 modal-fullscreen-xxl-down modal-fullscreen-md-down modal-fullscreen-sm-down">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
              {EditBtn == false ? (
                <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                  Add Mapping
                </h6>
              ) : (
                <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                  Edit Mapping
                </h6>
              )}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                // onClick={refreshPage}
                aria-label="Close"
              ></button>
            </div>

            <div className="cardd m-2">
              <div class="modal-body  pt-2  pb-0">
                <p className="fw-bold">Project Id</p>
                <select
                  class="form-select w-25  "
                  value={(SelectMapping && SelectMapping[0] &&SelectMapping[0].ProjectId) || ComponentMapping.ProjectId}
                  onChange={(e) =>
                    setComponentMapping({ ...ComponentMapping, ProjectId: e.target.value})
                  }
                  aria-label="Default select example"
                >
                  <option  value="" disabled>Select Project Id</option>
                  {ProjectCode && ProjectCode.map((i, key) => (
                      <option key={key} value={i.ProjectId}>{i.ProjectName}</option>
                    ))}
                </select>
              </div>
              <hr />
              <div>
              {EditBtn == false ?  (<div className="row m-0 p-0"> 
                  <div className="col-md-2 d-flex mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> Pay Comp Code</p> 
                  </div> 
                  <div className="col-md-1 d-flex mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> Pay Comp Type</p> 
                  </div> 
                  <div className="col-md-1 d-flex  justify-content-center mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> Consider For PF</p> 
                  </div>    
                  <div className="col-md-2 d-flex  justify-content-center mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> Consider For Ptax</p> 
                  </div>
                  <div className="col-md-2 d-flex  justify-content-center mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> Consider For ESIC</p> 
                  </div> 
                  <div className="col-md-2 d-flex  justify-content-center mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> From Date</p> 
                  </div> 
                  <div className="col-md-2 d-flex  justify-content-center mt-1 "> 
                    <p className=" ms-1 mt-1 fw-bold"> To Date</p> 
                  </div> 
                  <div className="col-md-12 col-12">
                  <div className="row m-0 p-0">
                  <div className="col-md-2 d-flex mt-1 ">
                  <input
                    class="input-grey-rounded fs_10 w_175 "
                    type="text"
                    placeholder="Search ......."
                    onChange={(e) =>
                      searchItemsAddMapping(e.target.value, searchInputAddMapping2)
                  }
                  ></input>
                  </div>
                  <div className="col-md-2 d-flex mt-1 ">
                  <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItemsAddMapping(searchInputAddMapping, e.target.value)
                            } />
                  </div>
                  <div className="col-md-2 d-flex  justify-content-center mt-1 ">
                   
                  </div>   
                
                 
                  
                  <div className="col-md-10 d-flex mt-1"></div>
                </div>
                   
                  </div>
                   
                  <div className="col-md-10 d-flex mt-1"></div> 
                </div>):( 
                <div className="row m-0 p-0">
                  <div className="col-md-2 d-flex mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> Pay Comp Name</p>
                  </div>
                  <div className="col-md-1 d-flex mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> Pay Comp Type</p>
                  </div>
                  <div className="col-md-1 d-flex  justify-content-center mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> Consider For PF</p>
                  </div>   
                  <div className="col-md-2 d-flex  justify-content-center mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> Consider For Ptax</p>
                  </div>
                  <div className="col-md-2 d-flex  justify-content-center mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> Consider For ESIC</p>
                  </div>
                  <div className="col-md-2 d-flex  justify-content-center mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> From Date</p>
                  </div>
                  <div className="col-md-1 d-flex  justify-content-center mt-1 ">
                    <p className=" ms-1 mt-1 fw-bold"> To Date</p>
                  </div>
                  <div className=" col-md-1 justify-content-center d-flex p-0">
                    
                    <p className=" ms-1 mt-1 fw-bold"> Action</p>
                  </div>
                  
                  <div className="col-md-10 d-flex mt-1"></div>
                </div> )}

              </div>
              <div className="" style={{height:"350px", overflowY:"auto"}}>
             
                {Render == Render &&
                  PayComponent &&
                  (EditBtn == false ? 
                    (  searchInputAddMapping.length != "" || searchInputAddMapping2.length != "" ? SearchFliterAddMapping : PayComponent ): SelectMapping)?.sort((a, b) => a.PayCompName.localeCompare(b.PayCompName)).map((item) => {

                      console.log("itemitemitem",item)
                      let SelectMappingVar = SelectMapping;
                      const StartDate = SelectMapping.find((it) => it.PayCompCode == item.PayCompCode);
                      var startdate = StartDate && StartDate.FromDate != "" && StartDate.FromDate != null ? StartDate.FromDate : null;
                       console.log("StartDatesss", startdate);
                      let isSpecificMapIndex = SelectMappingVar.findIndex((i) => i.PayCompCode == item.PayCompCode);
                      let isSpecificMapKPIObj =isSpecificMapIndex >= 0? SelectMappingVar[isSpecificMapIndex] : {};

                      let checkedValue = isSpecificMapIndex >= 0 ? true : false;
                      let ProjectIdSelect = isSpecificMapIndex >= 0 && isSpecificMapKPIObj.ProjectId != ""? isSpecificMapKPIObj.ProjectId: "";
                      let PFCheckValue =isSpecificMapIndex >= 0 && isSpecificMapKPIObj.ConsiderFor_PF == 1? true: false;
                      let PtaxCheckValue =isSpecificMapIndex >= 0 && isSpecificMapKPIObj.ConsiderFor_Ptax == 1? true: false;
                      let ESIC_CheckValue =isSpecificMapIndex >= 0 && isSpecificMapKPIObj.ConsiderFor_ESIC == 1 ? true: false;
                      let ToDateCheckValue = isSpecificMapIndex >= 0 && isSpecificMapKPIObj.ToDate != "" ? isSpecificMapKPIObj.ToDate : "";
                      let FromDateCheckValue = isSpecificMapIndex >= 0 && isSpecificMapKPIObj.FromDate != ""? isSpecificMapKPIObj.FromDate: "";
                      console.log("vfs/hdfkhsk-------",SelectMapping.ProjectId );
                      var checkCurrentDate=false;
                      var checkCurrentToDate=true;
                      var TillDate=false;
                       if(SelectMapping && SelectMapping[0] && SelectMapping[0].FromDate!=""){
                        const dateB = moment(currentDateToday);
                        console.log("SelectMapping[0].FromDate---",SelectMapping[0].FromDate,currentDateToday)
                        const dateC = moment(SelectMapping[0].FromDate,"MM/DD/YYYY");
                        checkCurrentDate=dateC.diff(dateB, 'days') < 0 ? true:false
                        console.log("checkDate---", checkCurrentDate) 
                       };
                       if(SelectMapping && SelectMapping[0] && SelectMapping[0].FromDate!=""){
                        const dateB = moment(currentDateToday);
                        {/* console.log("SelectMapping[0].FromDate---",SelectMapping[0].FromDate,currentDateToday) */}
                        const dateC = moment(SelectMapping[0].ToDate,"MM/DD/YYYY");
                        checkCurrentToDate=dateC.diff(dateB, 'days') < 0 ? false: true
                        console.log("checkDate---todate", checkCurrentToDate) 
                       }
                      {
                        /* let showComp=(EditBtn==true && PayComponent.projectId==SelectMapping[0].ProjectId && PayComponent.PayCompCode==SelectMapping[0].PayCompCode ) || EditBtn==false;
                if(!showComp){
                  return null;
                  }  */
                      }
                      return (
                        <>
                        {EditBtn == false ? ( 
                          
                          <div className="row mb-2 m-0 p-0 ">
                            <div className="col-md-2 d-flex  mt-1">
                             
                                <input
                                  className="form-check-inpu ms-1"
                                  value={item.PayCompCode} // Use the unique identifier of the item as the value
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const isChecked = e.target.checked;
                                    console.log("isCheckedd",isChecked && !checkedValue);

                                    if (isChecked && !checkedValue) {
                                      // Add the item to SelectMappingVar if it's checked and not already selected
                                      let selData = {
                                        ProjectId: ComponentMapping.ProjectId,
                                        PayCompCode: item.PayCompCode,
                                        PayCompName: item.PayCompName,
                                        ConsiderFor_PF: 0,
                                        ConsiderFor_Ptax: 0,
                                        ConsiderFor_ESIC: 0,
                                        FromDate: "",
                                        ToDate: "01-01-2099",
                                        UserId: UserId,
                                        Id: 0,
                                      };
                                      SelectMappingVar.push(selData);
                                      setSelectMapping(SelectMappingVar);
                                    } else if (!isChecked && checkedValue) {
                                      // Remove the item from SelectMappingVar if it's unchecked and currently selected
                                      // SelectMappingVar.splice(isSpecificMapIndex, 1);
                                      SelectMappingVar = SelectMappingVar.filter((i) => i.PayCompCode !== value );
                                      setSelectMapping(SelectMappingVar);
                                    }
                                    setRender(!Render);
                                  }}
                                  checked={checkedValue}
                                  type="checkbox"
                                />
                              

                              <p className=" ms-2 mt-1 ">{item.PayCompName}</p>
                            </div>
                            <div className=" col-md-1 d-flex justify-content-center">
                            
                            <p className=" ms-2 mt-1 ">{item.PayCompType}</p>
                            </div>


                            <div className=" col-md-1 d-flex justify-content-center">
                              <input
                                class="form-check-inpu ms-1"
                                value={ComponentMapping.ConsiderFor_PF} // Use the unique identifier of the item as the value
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  console.log("isCheckedd----",isChecked,value);

                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_PF"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    // SelectMappingVar.push(item);
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                               
                                disabled={isSpecificMapIndex >= 0 ? false : true}
                                checked={PFCheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For PF</p> */}
                            </div>
                            <div className=" col-md-2 d-flex justify-content-center">
                              <input
                                class="form-check-inpu ms-1"
                                value={ComponentMapping.ConsiderFor_Ptax}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_Ptax"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                                disabled={
                                  isSpecificMapIndex >= 0 ? false : true
                                }
                                checked={PtaxCheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For Ptax</p> */}
                            </div>
                            <div className=" col-md-2 d-flex justify-content-center">
                              <input
                                class="form-check-inpu ms-1"
                                // value={ComponentMapping.ConsiderFor_ESIC}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_ESIC"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                                disabled={
                                  isSpecificMapIndex >= 0 ? false : true
                                }
                                checked={ESIC_CheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For ESIC</p> */}
                            </div>

                            <div className=" col-md-2 justify-content-center d-flex p-0">
                              {/* <p className="mt-1"> From Date :</p> */}
                              {/* value={moment(ComponentMapping.FromDate).format("YYYY-MM-DD")} */}
                              <input
                                className="w_60 ms-2  input_field_head"
                                type="date"
                                min={currentDate}

                                disabled={
                                  isSpecificMapIndex >= 0 ? false : true
                                }
                                // value={FromDateCheckValue}
                                value={moment(FromDateCheckValue,"MM-DD-YYYY" ).format("YYYY-MM-DD")}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["FromDate"] = moment(value,"YYYY-MM-DD").format("MM-DD-YYYY");
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    console.log("SelectMappingVar---------", SelectMappingVar,value);
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                              />
                            </div>
                            {console.log("ToDateCheckValue------",ToDateCheckValue,ToDateCheckValue=="01/01/2099" )}
                            <div   disabled={isSpecificMapIndex >= 0 ? false : true } className=" col-md-2 justify-content-center d-flex p-0">
                            
                            { (ToDateCheckValue=="01-01-2099" || ToDateCheckValue=="")  ?
                             <p  className="tillDate btn-primary" onClick={()=> {

                            //  till date show and hide condation --------

                              if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ToDate"] = moment("01-01-2098").format("MM-DD-YYYY");
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                              }

                          
                            }}>Till Date</p> :
                              <input
                                className="w_60 ms-2  input_field_head inputssss"
                                type="date"
                                 defaultValue={moment("01/02/2024", "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                min={moment(startdate, "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                value={ToDateCheckValue != ""&&  ToDateCheckValue !=null ? moment(ToDateCheckValue,"MM-DD-YYYY" ).format("YYYY-MM-DD"):moment("01/01/2099", "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                disabled={
                                  isSpecificMapIndex >= 0 ? false : true
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ToDate"] = moment(value, "YYYY-MM-DD" ).format("MM-DD-YYYY");
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                              />
                            }
                            </div>
                          </div>
                          ) : (
                            
                            <>
                       
                                <div className="row mb-2 m-0 p-0">
                            <div className="col-md-2 d-flex col-12  mt-1">
                             
                               <input
                                  className="form-check-inpu ms-1"
                                  value={item.PayCompCode} // Use the unique identifier of the item as the value
                                  checked={checkedValue}
                                  type="checkbox"
                                /> 
                              

                              <p className=" ms-2 mt-1 ">{item.PayCompName}</p>
                            </div>
                            <div className=" col-md-1 d-flex col-12 justify-content-center">
                            
                            <p className=" ms-2 mt-1 ">{item.PayCompType}</p>
                            </div> <div className=" col-md-1 d-flex col-12 justify-content-center">
                              <input
                                class="form-check-inpu ms-1"
                                value={ComponentMapping.ConsiderFor_PF} // Use the unique identifier of the item as the value
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  console.log("isCheckedd----",isChecked,value);

                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_PF"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    // SelectMappingVar.push(item);
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                                // disabled={
                                //   isSpecificMapIndex >= 0 ? false : true
                                // }
                                disabled={checkCurrentDate}
                                checked={PFCheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For PF</p> */}
                            </div>
                            <div className=" col-md-2 d-flex col-12 justify-content-center">
                      
                              <input
                                class="form-check-inpu ms-1"
                                value={ComponentMapping.ConsiderFor_Ptax}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_Ptax"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;

                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                                disabled={checkCurrentDate}
                                checked={PtaxCheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For Ptax</p> */}
                            </div>
                            <div className=" col-md-2 d-flex col-12 justify-content-center">
                              <input
                                class="form-check-inpu ms-1"
                                // value={ComponentMapping.ConsiderFor_ESIC}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ConsiderFor_ESIC"] = isChecked ? 1 : 0;
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                                // disabled={
                                //   isSpecificMapIndex >= 0 ? false : true
                                // }

                                disabled={checkCurrentDate}
                                checked={ESIC_CheckValue}
                                type="checkbox"
                              />
                              {/* <p className=" ms-2 mt-1 ">Consider For ESIC</p> */}
                            </div>

                            <div className=" col-md-2 justify-content-center d-flex col-12 p-0">
                         

                            
                              
                              <input
                                className="w_60 ms-2  input_field_head"
                                type="date"
                                disabled={checkCurrentDate}
                                // disabled={
                                //   isSpecificMapIndex >= 0 ? false : true
                                // }
                                // value={FromDateCheckValue}
                                value={moment(FromDateCheckValue,"MM-DD-YYYY" ).format("YYYY-MM-DD")}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["FromDate"] = moment(value,"YYYY-MM-DD").format("MM-DD-YYYY");
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    console.log("SelectMappingVar---------", SelectMappingVar,value);
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                              />
                            
                            </div>
                            <div className=" col-md-1 justify-content-center d-flex col-12 p-0">
                            {TilldateShow === false ? <p className="tillDate btn-primary" onClick={()=> setTilldateShow(true)}>Till date</p> :
                              <input
                                className="  input_field_head inputssss"
                                type="date"
                                // placeholder="Date"
                                defaultValue={moment("01/02/2024", "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                min={moment(startdate, "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                // value={ToDateCheckValue}
                                value={ToDateCheckValue != ""&&  ToDateCheckValue !=null ? moment(ToDateCheckValue,"MM-DD-YYYY" ).format("YYYY-MM-DD"):moment("01/01/2099", "MM-DD-YYYY").format("YYYY-MM-DD" )}
                                disabled={
                                  isSpecificMapIndex >= 0 ? false : true
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (isSpecificMapIndex >= 0) {
                                    isSpecificMapKPIObj["ToDate"] = moment(value, "YYYY-MM-DD" ).format("MM-DD-YYYY");
                                    SelectMappingVar[isSpecificMapIndex] = isSpecificMapKPIObj;
                                    setSelectMapping(SelectMappingVar);
                                    setRender(!Render);
                                  }
                                }}
                              />
                            }
                            
                            </div>
                            <div className=" col-md-1 justify-content-center d-flex col-12 p-0">
                            
                            <button disabled={ checkCurrentToDate }  onClick={()=>{hideModal(),UpdateSubmit('closeMappingKey')}} className="btn btn-danger fs_10 ">Close</button>
                          
                          {/* <button   onClick={() => openModelAdd()} className="btn btn-primary ms-2 fs_10">add</button> */}
                           
                            </div>
                            <div className="col-md-12  col-12 mappingdata  mt-5">
                            <div className="row">

                            
                            <div className="col-md-12 d-flex col-12   ">
                            <table className="">
                       <tbody>
                        <tr>
                     
                          <th className="text-center">Project Name</th>
                          <th className="text-center">Pay Comp Name</th>
                          <th className="text-center">Pay Comp Type</th>
                          <th className="text-center">Active/Deactive</th>
                          <th className="text-center">From Date </th>
                          <th className="text-center">To Date </th>
                       
                        </tr>

                        

                       
                            {ViewActiveMapping &&
                              ViewActiveMapping.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                     
                                      <td className="text-center">{i.ProjectName}</td>
                                      <td className="text-center">{i.PayCompName}</td>
                                      <td className="text-center">{i.PayCompType}</td>
                                     
                                      
                                      <td className="text-center">{
                                        <Icon className={`material-icons ${i.CurrentDayActive===1 ? 'link-success' : 'link-error'}`}
                                      style={{ fontSize: '17px' }}>
                                      {i.CurrentDayActive === 1 ? 'check_circle' : 'cancel'}
                                    </Icon>
                                      } </td>
                                      <td className="text-center">{i.FromDate}</td>
                                      <td className="text-center">{i.ToDate} </td>
                                  
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
                          <div class=" w-100 p-2 " style={{position:'absolute', bottom:"10px" ,bottom:"-50px"}}>
                          <button
                            type="button"
                            class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                            data-bs-dismiss="modal"
                            onClick={()=>hideModal()}
                          > Cancel
                          </button>
                           <button
                            data-bs-dismiss="modal"
                              disabled={checkCurrentDate}
                            onClick={UpdateSubmit}
                            type="button"
                            class="btn w_150 btn-primary float-end fs_12 ms-3 "
                          >
                            Update
                          </button>
           
              </div>
                         </>
                              )}
                          <hr className="my-2" />
                        </>
                      );
                    }
                  
                  
                  )}
              </div>
              <div class=" w-100 p-2 ">
            
                {EditBtn == false ? (
                  <>
                  <button
                  type="button"
                  class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                  data-bs-dismiss="modal"
                  onClick={()=>hideModal()}
                >
                  Cancel
                </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    class="btn w_150 btn-primary float-end fs_12 ms-3 "
                  >
                    Insert
                  </button>
                  </>
                ) : ( 
                  
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)(ComponentMappingMapping);
