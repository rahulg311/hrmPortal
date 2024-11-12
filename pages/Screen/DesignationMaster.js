import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
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
import { Modal, Button } from "react-bootstrap";
import ErrorPage from "./ErrorPage";

const DesignationMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterDesignation, setViewMasterDesignation] = useState("");
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

  // onen and close code
  const openModel = (user) => {
    const modalEle = modalRef.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    setUpdateDesignation(user);
  };
  
  // add open and close code
  const addModel = () => {
    setAddDesignation({
      DesignationName: "",
    });
    const modalEle = modalRef1.current;
    const bsModal = new bootstrap.Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  
  //  CLOSE OPEN MODEL 1
  const hideModals = () => {
    const modalEle = modalRef1.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };
    //  CLOSE OPEN MODEL2
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = bootstrap.Modal.getInstance(modalEle);
    bsModal.hide();
  };

    //  ADD NEW DESIGNATION
  const [AddDesignation, setAddDesignation] = useState({
    // DesignationId: "",
    DesignationName: "",
  });

   //  UPDATE NEW DESIGNATION
  const [UpdateDesignation, setUpdateDesignation] = useState({
    // DesignationId: "",
    DesignationName: "",
  });

  //  submit add data  Designation master
 const sumbitUser = async (e) => {
    e.preventDefault();
    if(ViewMasterDesignation.some((user)=> user.DesignationName.toLowerCase() === AddDesignation.DesignationName.toLowerCase() )){
      toast.error("Designation name already exists")
      return
    }
    const AddUserData = {
      // DesignationId: "",
      DesignationName: AddDesignation.DesignationName,
      UserId: UserId,
    };
    let val = await Vaildation(AddUserData);
    if (!val) {
      return;
    }
   
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterDesignation, MasterDesignation)
      .then((res) => {
        console.log("response", res.data.UpsertMasterDesignation[0]);
        if (res.data.UpsertMasterDesignation[0]) {
          toast.success("Designation added successfully");
        }
        hideModals()
        UpsertMasterDesignation();
     
      });
    console.log("AddDesignation", AddDesignation);
  };

  useEffect(() => {
    UpsertMasterDesignation();
    // UserUpdate()
  }, []);

  //  VIEW DATA Designationmaster 
  const Designationmaster = {
    OperationType: "ViewAll",
    DesignationId: 1,
  };
  const UpsertMasterDesignation = async () =>{
    setLoding(true);
    await axios
      .post(baseUrl + MethodNames.ViewMasterDesignation, Designationmaster)
      .then((res) => {
        console.log("response DATA----", res.data.ViewMasterDesignation);
        setViewMasterDesignation(res.data.ViewMasterDesignation);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      }) }

  //  update DesignationMaster user deta
  const updateUser = async (e) => {
    e.preventDefault();
    if(ViewMasterDesignation.some((user)=> user.DesignationName.toLowerCase() === UpdateDesignation.DesignationName.toLowerCase() )){
      toast.error("Designation name already exists")
      return
    }

    const UpdateUserDatas = {
      DesignationId: UpdateDesignation.DesignationId,
      DesignationName: UpdateDesignation.DesignationName,
      UserId: UserId,
    };

    console.log("UpdateUserDatas", UpdateUserDatas);
    let val = await Vaildation(UpdateUserDatas);
    if (!val) {
      return;
    }
    const UpsertMasterDep = JSON.stringify(UpdateUserDatas);
    const UpdateDesignationMaster = {
      OperationType: "Update",
      JsonData: UpsertMasterDep,
    };
    const DesignationMaster = await axios
      .post(
        baseUrl + MethodNames.UpsertMasterDesignation,
        UpdateDesignationMaster
      )
      .then((res) => {
        console.log("response", res.data.UpsertMasterDesignation[0]);
        if (res.data.UpsertMasterDesignation[0]) {
          toast.success("Designation updated successfully");
        }
        hideModal()
        UpsertMasterDesignation();
      });
  };


  // serach deoartment master user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
    const filterDesignation = ViewMasterDesignation.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item)
            .join("")
            .toLocaleLowerCase()
            .includes(searchValue2.toLocaleLowerCase())
        );
      });
      console.log("filterDesignation0-----", filterDesignation);
      setSearchFliter(filterDesignation);
   
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
                          Designation Master Info
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
                          className="btn btn-primary btn_siz px-3 fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <i className="bx bx-plus ms-1 mt-1"></i> Add New Designation
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    loding ?null :
                  
                  <div className="table-responsive">
                  { ViewMasterDesignation.length >0  ?

                  
                    <table >
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center"> Designation CD</th>
                          <th className="text-center">Designation</th>
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

                                      <td>{i.DesignationId}</td>
                                      <td>{i.DesignationName}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterDesignation &&
                              ViewMasterDesignation.map((i, key) => {
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
                                            className="p-1"
                                            title="edit"
                                          >
                                            <span className="material-icons link-success">
                                              edit
                                            </span>
                                          </a>

                                         
                                        </p>
                                      </td>

                                      <td>{i.DesignationId}</td>
                                      <td>{i.DesignationName}</td>
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

      {/*  add DesignationMaster code popup */}
      <div
        class="modal fade"
        // id="exampleModal"
        ref={modalRef1}
        // tabindex="-1"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header m-0 p-0 p-2">
              <h6 class="modal-title" id="exampleModalLabel">
                Add New Designation
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Designation</p>
              <input
                value={AddDesignation.DesignationName}
                onChange={(e) =>
                {
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setAddDesignation({
                    ...AddDesignation,
                    DesignationName: TextInput,
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
                class="btn w_150 btn-primary float-end fs_12 me-2  "
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  upDate DesignationMaster code popup */}
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
                Update New Designation
              </h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p className="fw-bold">Designation Name</p>
              <input
                value={UpdateDesignation.DesignationName}
                onChange={(e) =>
                {
                  const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                  setUpdateDesignation({
                    ...UpdateDesignation,
                    DesignationName: TextInput,
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
                class="btn w_150 btn-primary float-end fs_12 ms-3 ms-3 "
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
export default connect(mapStateToProps, mapDispatchToProps)(DesignationMaster);








// import React, { useEffect, useRef, useState } from "react";
// import Footer from "../footer";
// import Sidebaar from "./Sidebaar";
// import {
//   mapStateToProps,
//   mapDispatchToProps,
// } from "../../src/constants/contextProvider";
// import { ToastContainer, toast } from "react-toastify";
// import { Pagination, Popconfirm } from "antd";
// import { Spin } from "antd";
// import MainContainer from "../components/Container";
// import { connect, useDispatch, useSelector } from "react-redux";
// import { FaBeer } from "react-icons/fa";
// import { AiFillGoogleCircle, AiFillHome, AiFillSignal } from "react-icons/ai";
// import { useRouter } from "next/router";
// import makeAnimated from "react-select/animated";
// import axios from "axios";
// import { MethodNames } from "../../src/constants/methodNames";
// import { baseUrl } from "../../src/constants/constants";
// import Vaildation from "./Vaildation";
// import { LoginUserId } from "../api/AllApi";
// import { Modal, Button } from "react-bootstrap";
// import ErrorPage from "./ErrorPage";

// const DesignationMaster = (props) => {
//   const open = useSelector((state) => state.projectR.sideClick);
//   const show = useSelector((state) => state.projectR.showProject);
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [loding, setLoding] = useState(true);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchInput2, setSearchInput2] = useState("");
//   const [SearchFliter, setSearchFliter] = useState("");
//   const [ViewMasterDesignation, setViewMasterDesignation] = useState("");
//   const [UserId, setUserId] = useState("");
//   const modalRef1 = useRef();
//   const modalRef = useRef();

// // LOGIN USERID GET BY LOGIN USER
//   useEffect(() => {
//     const UserId = async () => {
//       const userid = await LoginUserId();
//       setUserId(userid);
//     };
//     UserId();
//   }, []);



//  // Pagination state
//  const [currentPage, setCurrentPage] = useState(1);
//  const [pageSize, setPageSize] = useState(10); // Number of items per page

 




//   // onen and close code
//   const openModel = (user) => {
//     const modalEle = modalRef.current;
//     const bsModal = new bootstrap.Modal(modalEle, {
//       backdrop: "static",
//       keyboard: false,
//     });
//     bsModal.show();
//     setUpdateDesignation(user);
//   };
  
//   // add open and close code
//   const addModel = () => {
//     setAddDesignation({
//       DesignationName: "",
//     });
//     const modalEle = modalRef1.current;
//     const bsModal = new bootstrap.Modal(modalEle, {
//       backdrop: "static",
//       keyboard: false,
//     });
//     bsModal.show();
//   };
  
//   //  CLOSE OPEN MODEL 1
//   const hideModals = () => {
//     const modalEle = modalRef1.current;
//     const bsModal = bootstrap.Modal.getInstance(modalEle);
//     bsModal.hide();
//   };
//     //  CLOSE OPEN MODEL2
//   const hideModal = () => {
//     const modalEle = modalRef.current;
//     const bsModal = bootstrap.Modal.getInstance(modalEle);
//     bsModal.hide();
//   };

//     //  ADD NEW DESIGNATION
//   const [AddDesignation, setAddDesignation] = useState({
//     // DesignationId: "",
//     DesignationName: "",
//   });

//    //  UPDATE NEW DESIGNATION
//   const [UpdateDesignation, setUpdateDesignation] = useState({
//     // DesignationId: "",
//     DesignationName: "",
//   });

//   //  submit add data  Designation master
//  const sumbitUser = async (e) => {
//     e.preventDefault();
//     if(ViewMasterDesignation.some((user)=> user.DesignationName.toLowerCase() === AddDesignation.DesignationName.toLowerCase() )){
//       toast.error("Designation name already exists”")
//       return
//     }
//     const AddUserData = {
//       // DesignationId: "",
//       DesignationName: AddDesignation.DesignationName,
//       UserId: UserId,
//     };
//     let val = await Vaildation(AddUserData);
//     if (!val) {
//       return;
//     }
//     const UserMasterDesignation = JSON.stringify(AddUserData);
//     const MasterDesignation = {
//       OperationType: "Add",
//       JsonData: UserMasterDesignation,
//     };
//     const UpsertMasterCompany = await axios
//       .post(baseUrl + MethodNames.UpsertMasterDesignation, MasterDesignation)
//       .then((res) => {
//         console.log("response", res.data.UpsertMasterDesignation[0]);
//         if (res.data.UpsertMasterDesignation[0]) {
//           toast.success("Designation added successfully");
//         }
//         hideModals()
//         UpsertMasterDesignation();
     
//       });
//     console.log("AddDesignation", AddDesignation);
//   };

//   useEffect(() => {
//     UpsertMasterDesignation();
//     // UserUpdate()
//   }, []);

//   //  VIEW DATA Designationmaster 
//   const Designationmaster = {
//     OperationType: "ViewAll",
//     DesignationId: 1,
//   };
//   const UpsertMasterDesignation = async () =>{
//     setLoding(true);
//     await axios
//       .post(baseUrl + MethodNames.ViewMasterDesignation, Designationmaster)
//       .then((res) => {
//         console.log("response DATA----", res.data.ViewMasterDesignation);
//         setViewMasterDesignation(res.data.ViewMasterDesignation);
//         setLoding(false);
//       }).catch(()=>{
//         setLoding(false);
//       }) }

//   //  update DesignationMaster user deta
//   const updateUser = async (e) => {
//     e.preventDefault();
//     if(ViewMasterDesignation.some((user)=> user.DesignationName.toLowerCase() === UpdateDesignation.DesignationName.toLowerCase() )){
//       toast.error("Designation name already exists”")
//       return
//     }

//     const UpdateUserDatas = {
//       DesignationId: UpdateDesignation.DesignationId,
//       DesignationName: UpdateDesignation.DesignationName,
//       UserId: UserId,
//     };

//     console.log("UpdateUserDatas", UpdateUserDatas);
//     let val = await Vaildation(UpdateUserDatas);
//     if (!val) {
//       return;
//     }
//     const UpsertMasterDep = JSON.stringify(UpdateUserDatas);
//     const UpdateDesignationMaster = {
//       OperationType: "Update",
//       JsonData: UpsertMasterDep,
//     };
//     const DesignationMaster = await axios
//       .post(
//         baseUrl + MethodNames.UpsertMasterDesignation,
//         UpdateDesignationMaster
//       )
//       .then((res) => {
//         console.log("response", res.data.UpsertMasterDesignation[0]);
//         if (res.data.UpsertMasterDesignation[0]) {
//           toast.success("Designation updated successfully");
//         }
//         hideModal()
//         UpsertMasterDesignation();
//       });
//   };






//   // Pagination change handler
//  const handlePaginationChange = (page, pageSize) => {
//   setCurrentPage(page);
// };

// // Calculate start and end index for pagination
// const startIndex = (currentPage - 1) * pageSize;
// const endIndex = startIndex + pageSize;

// // Slice the data array to get current page data
// const currentPageData = ViewMasterDesignation.slice(startIndex, endIndex);


// useEffect(()=>{
//   console.log("currentPageData",currentPageData)
// },[])


//   // serach deoartment master user
//   const searchItems = (searchValue1, searchValue2) => {
//     console.log("searchValue1", searchValue1, searchValue2);
//     setSearchInput(searchValue1);
//     setSearchInput2(searchValue2);
//     if (searchValue1 !== "" || searchValue2 !== "") {
//       // const filterDesignation = ViewMasterDesignation.filter((item) => {
//       //  return (
//       //     Object.values(item).splice(0,1).join("").includes(searchValue)
//       //   );
//       // });

//       const filterDesignation = ViewMasterDesignation.filter((item) => {
//         return (
//           Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
//           Object.values(item)
//             .join("")
//             .toLocaleLowerCase()
//             .includes(searchValue2.toLocaleLowerCase())
//         );
//       });
//       // const filterDesignation = ViewMasterDesignation.findIndex((i) =>i.DesignationId==searchValue )
//       // let filterData = filterDesignation>=0? ViewMasterDesignation[filterDesignation] : [];
//       console.log("filterDesignation0-----", filterDesignation);
//       setSearchFliter(filterDesignation);
//       // setSearchFliterVal(filterDesignationVal);
//     }
//   };

//   return (
//     <div className="h100">
//       <ToastContainer />
//       <MainContainer>
//         <Sidebaar show={show} />
//         <div className={open ? "content-page2 vh-100" : "content-page"}>
//           <div className="content  ">
//             <div className="container-fluid">
//               <div className="cardd">
//                 <div className="col-sm-12  p-2   ">
//                   <div className=" row ">
//                     <div className="col-sm-12 col-12 col-md-12   ">
//                       <div className=" w-100 back-color table_ref_head">
//                         <h3 className="fs_15 back-color table_ref_head text-white p-3">
//                           Designation Master Info
//                         </h3>
//                       </div>
//                     </div>
//                     <div className="col-sm-12 col-12 col-md-12   ">
//                       <div className="fs_15 fw-bold table_ref_head ">
//                         <button
//                           type="button"
//                           // data-bs-toggle="modal"
//                           // data-bs-target="#exampleModal"
//                           // data-bs-whatever="@mdo"
//                           onClick={() => addModel()}
//                           className="btn btn-primary btn_siz px-3 fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
//                         >
//                           <i className="bx bx-plus ms-1 mt-1"></i> Add New Designation
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   {
//                   loding ?null :
                  
//                   <div className=" h-none">
//                   { ViewMasterDesignation.length >0  ?
// <>
                  
//                     <table  className="table-responsive">
//                       <tbody>
//                         <tr>
//                           <th className="text-center">Action</th>
//                           <th className="text-center"> Designation CD</th>
//                           <th className="text-center">Designation</th>
//                         </tr>

//                         <tr>
//                           <td></td>
//                           <td>
//                             <input
//                               class="input-grey-rounded fs_10 w_175"
//                               type="number"
//                               placeholder="Search ......."
//                               onChange={(e) =>
//                                 searchItems(e.target.value, searchInput2)
//                               }
//                             ></input>
//                           </td>
//                           <td>
//                             <input
//                               class="input-grey-rounded fs_10 w_175 "
//                               type="text"
//                               placeholder="Search ......."
//                               onChange={(e) =>
//                                 searchItems(searchInput, e.target.value)
//                               }
//                             ></input>
//                           </td>
//                         </tr>

//                         {searchInput.length != "" ||
//                         searchInput2.length != "" ? (
//                           <>
//                             {SearchFliter &&
//                               SearchFliter.map((i, key) => {
//                                 return (
//                                   <>
//                                     <tr key={key}>
//                                       <td>
//                                         <p className="m-0 ms-2">
//                                           <a
//                                             onClick={() => openModel(i)}
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#exampleModals"
//                                             data-bs-whatever="@mdo"
//                                             href="#"
//                                             className=" p-1"
//                                             title="edit"
//                                           >
//                                             <span className="material-icons link-success">
//                                               edit
//                                             </span>
//                                           </a>

                                        
//                                         </p>
//                                       </td>

//                                       <td>{i.DesignationId}</td>
//                                       <td>{i.DesignationName}</td>
//                                     </tr>
//                                   </>
//                                 );
//                               })}
//                           </>
//                         ) : (
//                           <>
//                             {currentPageData &&
//                               currentPageData.map((i, key) => {
//                                 return (
//                                   <>
//                                     <tr key={key}>
//                                       <td>
//                                         <p className="m-0 ms-2">
//                                           <a
//                                             onClick={() => openModel(i)}
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#exampleModals"
//                                             data-bs-whatever="@mdo"
//                                             href="#"
//                                             className="p-1"
//                                             title="edit"
//                                           >
//                                             <span className="material-icons link-success">
//                                               edit
//                                             </span>
//                                           </a>

                                         
//                                         </p>
//                                       </td>

//                                       <td>{i.DesignationId}</td>
//                                       <td>{i.DesignationName}</td>
//                                     </tr>
//                                   </>
//                                 );
//                               })}
                 
//                           </>
//                         )}
//                       </tbody>
//                     </table>
//                     <div className="my-2 d-flex justify-content-end me-3 ">
//                                      {/* Pagination component */}
//                     <Pagination
//                     showSizeChanger
//                     onShowSizeChange={(current, size) => {
//                     setCurrentPage(1); // Reset to first page when changing page size
//                     setPageSize(size);
//                     }}
//                     onChange={handlePaginationChange}
//                     defaultCurrent={1}
//                     total={ViewMasterDesignation.length}
//                     />
//                     </div>
//                     </>
//                     : <ErrorPage/> }

                  
//                   </div>
//                   }
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </MainContainer>

//       {/*  add DesignationMaster code popup */}
//       <div
//         class="modal fade"
//         // id="exampleModal"
//         ref={modalRef1}
//         // tabindex="-1"
//         // aria-labelledby="exampleModalLabel"
//         // aria-hidden="true"
//       >
//         <div class="modal-dialog">
//           <div class="modal-content">
//             <div class="modal-header m-0 p-0 p-2">
//               <h6 class="modal-title" id="exampleModalLabel">
//                 Add New Designation
//               </h6>
//               <button
//                 type="button"
//                 class="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div class="modal-body">
//               <p className="fw-bold">Designation</p>
//               <input
//                 value={AddDesignation.DesignationName}
//                 onChange={(e) =>
//                   setAddDesignation({
//                     ...AddDesignation,
//                     DesignationName: e.target.value,
//                   })
//                 }
//                 type="text "
//                 className="w-100 mt-1 inputs"
//               />
//             </div>
//             <div class=" w-100 p-2">
//               <button
//                 type="button"
//                 class="btn w_150 btn-secondary float-end fs_12  "
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button
//                 // data-bs-dismiss="modal"
//                 onClick={sumbitUser}
//                 type="button"
//                 class="btn w_150 btn-primary float-end fs_12 me-2  "
//               >
//                 Insert
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/*  upDate DesignationMaster code popup */}
//       <div
//         class="modal fade"
//         // id="exampleModals"
//         ref={modalRef}
//         tabindex="-1"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div class="modal-dialog">
//           <div class="modal-content">
//             <div class="modal-header m-0 p-0 p-2">
//               <h6 class="modal-title" id="exampleModalLabel">
//                 Update New Designation
//               </h6>
//               <button
//                 type="button"
//                 class="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div class="modal-body">
//               <p className="fw-bold">Designation Name</p>
//               <input
//                 value={UpdateDesignation.DesignationName}
//                 onChange={(e) =>
//                   setUpdateDesignation({
//                     ...UpdateDesignation,
//                     DesignationName: e.target.value,
//                   })
//                 }
//                 type="text "
//                 className="w-100 mt-1 inputs"
//               />
//             </div>
//             <div class=" w-100 p-2">
//               <button
//                 type="button"
//                 class="btn w_150 btn-secondary float-end fs_12 ms-2 "
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button
//                 // data-bs-dismiss="modal"
//                 onClick={updateUser}
//                 type="button"
//                 class="btn w_150 btn-primary float-end fs_12 ms-3 ms-3 "
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default connect(mapStateToProps, mapDispatchToProps)(DesignationMaster);

