import React, { useEffect, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import Vaildation from "./Vaildation";
import { LoginUserId } from "../api/AllApi";

const CompanyMasterUpdateUser = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");
  const  userIdss  = router.query.CompanyMasterUpdateUser;
  console.log("userIdss===",isEmailValid)

  // user id get in login
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

  // GET EDIT  COMPANY MASTER DATA GET IN QUARY
  const EditCompanyId = router.query.CompanyId ? router.query.CompanyId: "";
  console.log("COMPANYUserMaster", EditCompanyId);


  // useEffect(() => {
  //   setupdateUser(CompanyUserMaster);
  // }, []);
  // useEffect(() => {
  //   // setupdateUser(CompanyUserMaster);
  //   CompanySingledata(EditCompanyId)
  // }, [EditCompanyId]);
  
  useEffect(() => {
    if (EditCompanyId !== "" && EditCompanyId !== null ) {
    
      
      CompanySingledata(EditCompanyId)
     
    }
  }, [EditCompanyId]); // Runs only once when the component mounts


  // Get single company data in api 
 
  const CompanySingledata = async (EditCompanyId) =>{
    console.log("EditCompanyId----3",EditCompanyId)

   

  let CompanyViewSingle = {
    
    OperationType: "ViewSingle",
    CompanyId: EditCompanyId,
  };

    await axios
      .post(baseUrl + MethodNames.ViewMasterCompany, CompanyViewSingle)
      .then((res) => {
        console.log("response DATA----", res &&res.data && res.data.ViewMasterCompany[0]);

        if(res &&res.data && res.data.ViewMasterCompany[0] && Object.keys(res.data.ViewMasterCompany).length>0){
          setIsEmailValid(true);
          setupdateUser(res.data.ViewMasterCompany[0]);
          setLoding(false)
       
      
        }else {
          // setLoding(true)
          // toast.error("Not found ViewMasterCompany data ");
          console.log("ViewMasterCompany data is not found")
        }
         
        // setLoding(false);
      }).catch((error)=>console.log(" COMPANY DATA  IN API SERVICES ERROR", error));
    
  }

  

  // COMPANY MASTER UPDATE  INPUT DATA
  const [updateUser, setupdateUser] = useState({
    CompanyId: "",
    CompanyName: "",
    Address: "",
    State: "",
    City: "",
    Pincode: "",
    Email: "",
    Phone: "",
    Fax: "",
    PF_StatusCode: "",
    PF_Prefix: "",
    PF_EstCode: "",
    ESIC_EmployerCode: "",
    PAN: "",
    TAN: "",
    Person: "",
    FatherName: "",
    Designation: "",
    TDS_Circle: "",
    // UserId: "",
  });

  console.log("updateUse-----------r",updateUser)

// COMPANY MASTER UPDATE  DATA SUBMIT
  const UpdateUserInfo = async (e) => {
    e.preventDefault();
    const UpdateData = {
      CompanyId: updateUser.CompanyId,
      CompanyName: updateUser.CompanyName,
      Address: updateUser.Address,
      State: updateUser.State,
      City: updateUser.City,
      Pincode: updateUser.Pincode,
      Email: updateUser.Email,
      Phone: updateUser.Phone,
      Fax: updateUser.Fax,
      PF_StatusCode: updateUser.PF_StatusCode,
      PF_Prefix: updateUser.PF_Prefix,
      PF_EstCode: updateUser.PF_EstCode,
      ESIC_EmployerCode: updateUser.ESIC_EmployerCode,
      PAN: updateUser.PAN,
      TAN: updateUser.TAN,
      Person: updateUser.Person,
      FatherName: updateUser.FatherName,
      Designation: updateUser.Designation,
      TDS_Circle: updateUser.TDS_Circle,
      UserId: UserId,
    };

    console.log("updateUse-----------rUpdateData",UpdateData)
    let val = await Vaildation(UpdateData);
    if (!val) {
      return;
    }
    if (isEmailValid === false) {
      toast.error("Please insert a valid email address");
      return;
    }
    const CompanyMasterUser = JSON.stringify(UpdateData);
    const CompanyMasterUpdate = {
      OperationType: "Update",
      JsonData: CompanyMasterUser,
    };
    const UpsertMasterCompanys = await axios
      .post(baseUrl + MethodNames.UpsertMasterCompany, CompanyMasterUpdate)
      .then((res) => {
        console.log("response", res.data.UpsertMasterCompany[0]);
        if (res.data.UpsertMasterCompany[0]) {
          toast.success("Company updated successfully");
        }
        setTimeout(()=>{
          router.push("/Screen/CompanyMaster");

        },1000)
        //  toast.success("User added successfully.")
     
      }).catch((error)=>console.log("COMPANY MASTER UPDATE  DATA",error))
  };

  const back = () => {
    router.push("/Screen/CompanyMaster");
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-100" : "content-page vh-100"}>
          <div className="content  ">
            <div className="container-fluid ">
              <div className="cardd">
                <div className="p-2 row ">
                  <div className="col-sm-12 col-12 col-md-12  ">
                    <div
                      className="fs_15 back-color table_ref_head text-white "
                      colSpan={7}
                    >
                      <p className="p-2">Company Master Update Info</p>
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

                <div className="row mt-1 ms-1 me-1 ">
                  {/* <div className="col-md_2 col-6 mb-1">
                    <p className=""> Company Id </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="number"
                      value={updateUser.CompanyId}
                      onChange={(e) =>{
                        const newValue = e.target.value.slice(0, 6); 
                        setupdateUser({
                          ...updateUser,
                          CompanyId: newValue,
                        })
                      }
                        
                      }
                      maxLength={6}
                    />
                    <br />
                  </div> */}
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Company Name</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.CompanyName}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                        setupdateUser({
                          ...updateUser,
                          CompanyName: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Address </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Address}
                      onChange={(e) =>{
                        // const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                        setupdateUser({
                          ...updateUser, Address: e.target.value,
                        })
                      }
                        
                      }
                    />
                    <br />
                    
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> State</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.State}
                      onChange={(e) =>
                     
                      {
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                         setupdateUser({ ...updateUser, State: TextInput });
                        // Only update if the input matches the regex pattern or is empty
                        // if (/^[a-zA-Z]*$/.test(newValue) || newValue === '') {
                        //   setupdateUser({ ...updateUser, State: newValue });
                        // }
                       
                      }
                       
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  

                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> City </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.City}
                      onChange={(e) =>
                      {
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                          setupdateUser({ ...updateUser, City: TextInput });
                        
                       
                      }
                      
                        
                      }
                    />

                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Pin code</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Pincode}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setupdateUser({
                          ...updateUser,
                          Pincode: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Email</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="email"
                      value={updateUser.Email}
                      onChange={(e) =>{
                        setupdateUser({ ...updateUser, Email: e.target.value })
                        let emailrejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                  let emailVal = emailrejex.test(String(e.target.value || updateUser.Email).toLocaleLowerCase());

                                  setIsEmailValid(emailVal);
                      }
                      
                      }
                    />
                       {isEmailValid === false &&
                        updateUser.Email != "" ? (
                                <p className="text-danger ">
                                  <span className="fs_15 me-2 text-danger ">
                                    *
                                  </span>
                                  Please enter a vaild Email
                                </p>
                              ) : (
                                ""
                              )}
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                 
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Phone</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Phone}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 10);
                        setupdateUser({ ...updateUser, Phone:  TextInput})
                      }
                      
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Fax</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Fax}
                      onChange={(e) =>{
                       
                        setupdateUser({ ...updateUser, Fax: e.target.value.slice(0, 14) })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>
               
                <div className="w-100 p-2 my-3  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">PF</p>
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Status Code </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.PF_StatusCode}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"")
                         setupdateUser({
                          ...updateUser,
                          PF_StatusCode: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Prefix </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.PF_Prefix}
                      onChange={(e) =>
                      {
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"")
                        setupdateUser({
                          ...updateUser,
                          PF_Prefix: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Est Code</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.PF_EstCode}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"")
                        setupdateUser({
                          ...updateUser,
                          PF_EstCode: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">ESIC Emp Code</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.ESIC_EmployerCode}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                        setupdateUser({
                          ...updateUser,
                          ESIC_EmployerCode: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PAN</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.PAN}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"").slice(0, 10);
                        // let TextInput  = e.target.value.replace(/[^a-zA-z0-9\s]/g, '');
                        setupdateUser({ ...updateUser, PAN: TextInput })
                      }
                     
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> TAN</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.TAN}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^a-zA-z0-9\s]/g,'')
                        setupdateUser({ ...updateUser, TAN: TextInput.slice(0,10) })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Person</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Person}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                        setupdateUser({ ...updateUser, Person: TextInput })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Father Name</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.FatherName}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                        setupdateUser({
                          ...updateUser,
                          FatherName: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Designation</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.Designation}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        setupdateUser({
                          ...updateUser,
                          Designation: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> TD Circle</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={updateUser.TDS_Circle}
                      onChange={(e) =>
                        setupdateUser({
                          ...updateUser,
                          TDS_Circle: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                
                </div>

                <div className="w-100 h-100 d-flex justify-content-end p-2">
                  <button
                    className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                    onClick={UpdateUserInfo}
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
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default connect( mapStateToProps,mapDispatchToProps)(CompanyMasterUpdateUser);
