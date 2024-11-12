import React, { useEffect, useState } from "react";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import moment from "moment/moment";
import { LoginUserId, companyMasterApi } from "../api/AllApi";
import Vaildation from "./Vaildation";
import InputMask from 'react-input-mask';

const ProjectMasterProjectMNewUser = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [CompanyData, setCompanyData] = useState([]);
  const [UserId, setUserId] = useState("");

  const [ViewProjectMaster, setViewProjectMaster] = useState("");



   //  PROJECT MASTER INPUT DATA  STATE
   const [ProjectMNewUser, setProjectMNewUser] = useState({
    ProjectId: 0,
    ProjectName: "",
    CompanyId: "",
    ApprovedStrength: "",
    ApprovedDate: "",
    ContractEndDate: "",
    PF_MaxSalary: "",
    PF_MaxLimitAmount: "",
    PF_DeductionRate: "",
    PF_MaxLimitApplicable: 0,
    EPF_AdminChargesRate: "",
    EPF_ContributionRate: "",
    EDLI_ContributionRate: "",
    EDLI_AdminChargesRate: "",
    DLI_MaxSalary: 0,
    EPS_MaxSalary: "",
    EPS_ContributionRate: "",
    ESIC_MaxSalary: "",
    ESIC_DeductionRate: "",
    ESIC_ContributionRate: "",
    FromDate: "",
    ToDate: "",
    // UserId: "testmer",
  });
  // company list view company master
  useEffect(() => {
    CompanyList();
  }, []);

// LOGIN USERID GET ON LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
      ViewProjectMasterss(userid)
    };
    UserId();
  }, []);

  //  GET API CALL COMPANY DATA LIST
  const CompanyList = async () => {
    const data = await companyMasterApi();
    setCompanyData(data.data.ViewMasterCompany);
  };

    //VIEW  PROJECT MASTER API CALL 
    const ViewProjectMasterss = async (userid) => {
      setLoding(true)
      const ProjectMastersAll = {
        OperationType: "ViewAll",
        ProjectId: 0,
        UserId:userid
      };
      await axios
        .post(baseUrl + MethodNames.ViewMasterProject, ProjectMastersAll)
        .then((res) => {
          console.log("response DATA----", res.data);
          setViewProjectMaster(res.data.ViewMasterProject);
          setLoding(false);
        }).catch(()=>{
          setLoding(false);
        });
    };
 

  // NEW DATA ADD SUBMIT  PROJECT MASTER
  const handleSubmit = async (e) => {
    e.preventDefault();
     let val = await Vaildation(ProjectMNewUser);
   
    if (!val) {
      return;
    }
    // if (ViewProjectMaster.filter(item => item.ProjectName === ProjectMNewUser.ProjectName)) {
    //   toast.error("Project name already exists");
    //   return;
    // }
    if(ViewProjectMaster.some((user)=> user.ProjectName.toLowerCase() === ProjectMNewUser.ProjectName.toLowerCase() )){
      toast.error("Project name already exists")
      return
    }


    let postData = {
      ProjectMaster: [
        {
          ProjectId: ProjectMNewUser.ProjectId,
          ProjectName: ProjectMNewUser.ProjectName,
          CompanyId: Number(ProjectMNewUser.CompanyId),
          ApprovedStrength: Number(ProjectMNewUser.ApprovedStrength),
          ApprovedDate: moment(new Date(ProjectMNewUser.ApprovedDate)).format(
            "MM/DD/YYYY"
          ),
          ContractEndDate: moment(
            new Date(ProjectMNewUser.ContractEndDate)
          ).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
      ProjectTransaction: [
        {
          Id: 0,
          ProjectId: ProjectMNewUser.ProjectId,
          PF_MaxLimitApplicable: Number(ProjectMNewUser.PF_MaxLimitApplicable),
          PF_MaxSalary: ProjectMNewUser.PF_MaxSalary,
          PF_MaxLimitAmount: ProjectMNewUser.PF_MaxLimitAmount,
          EPS_MaxSalary: ProjectMNewUser.EPS_MaxSalary,
          PF_DeductionRate: ProjectMNewUser.PF_DeductionRate,
          DLI_MaxSalary: ProjectMNewUser.DLI_MaxSalary,
          EPS_ContributionRate: ProjectMNewUser.EPS_ContributionRate,
          EPF_ContributionRate: ProjectMNewUser.EPF_ContributionRate,
          EDLI_ContributionRate: ProjectMNewUser.EDLI_ContributionRate,
          EPF_AdminChargesRate: ProjectMNewUser.EPF_AdminChargesRate,
          EDLI_AdminChargesRate: ProjectMNewUser.EDLI_AdminChargesRate,
          ESIC_MaxSalary: ProjectMNewUser.ESIC_MaxSalary,
          ESIC_DeductionRate: ProjectMNewUser.ESIC_DeductionRate,
          ESIC_ContributionRate: ProjectMNewUser.ESIC_ContributionRate,
          FromDate: moment(new Date(ProjectMNewUser.FromDate)).format("MM/DD/YYYY"),
          ToDate: moment(new Date(ProjectMNewUser.ToDate)).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };




      //  project Transaction master validation range
      const TraValditionData = {
        ProjectId: ProjectMNewUser.ProjectId,
        FromDate: moment(new Date(ProjectMNewUser.FromDate)).format("MM/DD/YYYY"),
        ToDate: moment(new Date(ProjectMNewUser.ToDate)).format("MM/DD/YYYY")
        };
    
        console.log("TraValditionData---1",TraValditionData)
        try {
          const res = await axios.post(baseUrl + MethodNames.ValidateProject, TraValditionData);
          console.log("TraValditionData---2",res.data)
          if (res.data.ValidateProject[0].RecStatus === "Exist") {
            toast.error(`This combination Range from & Range to already exists `);
            console.log("TraValditionData---3",res.data.ValidateProject[0])
            return; // Stop execution if any item fails validation
          }
        } catch (error) {
         
          console.error("Error while validating mapping:", error);
          return; // Stop execution if any error occurs
        }
        
    const UpsertMaster = JSON.stringify(postData);
    const ProjectMasterAdd = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };
    console.log("UpsertMaster", UpsertMaster);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterProject, ProjectMasterAdd)
      .then((res) => {
        console.log("response-----333", res.data.UpsertMasterProject[0]);
        if (res.data.UpsertMasterProject[0]) {
          toast.success("User added successfully.");
        }
    setTimeout(() => {
      router.push("/Screen/ProjectMaster");
    }, 1000);
        
      }).catch((error)=>console.log(" PROJECT MASTER  ADD DATA ERROR",error))
  };

  //  back button
  const back = () => {
    router.push("/Screen/ProjectMaster");
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />

        <div className={open ? "content-page2 vh-10" : "content-page vh-10"}>
          <div className="content  ">
            <div className="container-fluid ">
              <div className="cardd pb-3">
                <div className="p-2 row ">
                  <div className="col-sm-12 col-12 col-md-12  ">
                    <div
                      className="fs_15 back-color table_ref_head text-white "
                      colSpan={7}
                    >
                      <p className="p-2">Project Master Info</p>
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
                  <ToastContainer />
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Project Name</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head "
                      type="text"
                      value={ProjectMNewUser.ProjectName}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ProjectName: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Company </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <select
                      class="form-select w_90 "
                      value={ProjectMNewUser.CompanyId}
                      onChange={(e) =>
                      {
                        if(e.target.value !=="Select Company"){
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          CompanyId: e.target.value,
                        })
                        }
                      }
                     
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select Company</option>
                      {CompanyData &&
                        CompanyData.map((i, key) => (
                          <option key={key} value={i.CompanyId}>{i.CompanyName}</option>
                        ))}
                    </select>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Approved Strength </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.ApprovedStrength}
                      onChange={(e) =>{
                      
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ApprovedStrength:TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Approved Date </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      value={ProjectMNewUser.ApprovedDate}
                      onChange={(e) =>
                      
                        setProjectMNewUser({...ProjectMNewUser,ApprovedDate: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>

                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Contract EndDate </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      min={ProjectMNewUser.ApprovedDate}
                      disabled={ProjectMNewUser.ApprovedDate === ""}
                      value={ProjectMNewUser.ContractEndDate}
                      onChange={(e) =>
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ContractEndDate: e.target.value,
                        })
                      }
                    />

                    <br />
                  </div>
                </div>
                </div>
                </div>
                <div className="cardd m-2  pb-3">
                <div className="w-100 p-1 my-1  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">PF</p>
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Max Salary </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.PF_MaxSalary}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          PF_MaxSalary: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Max Limit</p>
                  </div>

                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.PF_MaxLimitAmount}
                      onChange={(e) =>
                      {
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          PF_MaxLimitAmount: TextInput,
                        })
                      }
                    
                      }
                    />
                    <br />
                  </div>

                  <div className="col-md_2 col-6 mb-1">
                    <p className="">PF Deduction Rate(%)</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="99.00" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.PF_DeductionRate}
                      // onChange={(e) =>
                      //   setProjectMNewUser({
                      //     ...ProjectMNewUser,
                      //     PF_DeductionRate: e.target.value,
                      //   })
                      // }
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          PF_DeductionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          PF_DeductionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                 
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                
                
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Max Limit Applicable</p>
                  </div>

                  <div className="col-md_3 col-6 mb-1">
                    <input
                      class="form-check-inpu ms-1"
                      value={ProjectMNewUser.PF_MaxLimitApplicable}
                      onChange={(e) => {
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          PF_MaxLimitApplicable: e.target.value == 0 ? 1 : 0,
                        });
                      }}
                      type="checkbox"
                    />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> EPF Admin Charges(%)</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.EPF_AdminChargesRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPF_AdminChargesRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPF_AdminChargesRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> EPF Contribution Rate(%)</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.EPF_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPF_ContributionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPF_ContributionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                 

               
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">EDLI Contribution Rate</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.EDLI_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EDLI_ContributionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EDLI_ContributionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">EDLI Admin Charges Rate</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.EDLI_AdminChargesRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EDLI_AdminChargesRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EDLI_AdminChargesRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                  {/* <div className="col-md_2 col-6 mb-1">
                    <p className=""> DLI Max Salary</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.DLI_MaxSalary}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          DLI_MaxSalary: TextInput,
                        })
                      }
                     
                      }
                    />
                    <br />
                  </div> */}
               
                
                </div>

                <div className="row mt-1 ms-1 me-1 ">
              
                <div className="col-md_2 col-6 mb-1">
                    <p className=""> EPS Max Salary </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.EPS_MaxSalary}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPS_MaxSalary: TextInput,
                        })
                      }
                      
                      }
                    />
                    <br />
                  </div>
                  
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">EPS Contribution Rate</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.EPS_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPS_ContributionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          EPS_ContributionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
              
                </div>
                <div className="w-100 p-1 my-1 ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">ESIC</p>
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> ESIC Max Salary </p>
                  </div>

                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={ProjectMNewUser.ESIC_MaxSalary}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ESIC_MaxSalary: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> ESIC Deduction Rate </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.ESIC_DeductionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          ESIC_DeductionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          ESIC_DeductionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> ESIC Contribution Rate</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectMNewUser.ESIC_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          ESIC_ContributionRate: e.target.value+"00",
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectMNewUser({
                          ...ProjectMNewUser,
                          ESIC_ContributionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Deduction From Date</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      value={ProjectMNewUser.FromDate}
                      onChange={(e) =>
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          FromDate: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Deduction To Date </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      min={ProjectMNewUser.FromDate}
                      disabled={ProjectMNewUser.FromDate=== ""}
                      value={ProjectMNewUser.ToDate}
                      onChange={(e) =>
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ToDate: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                </div>
                </div>
               

                <div className="w-100 h-100 d-flex justify-content-end p-2">
                  <button
                    className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                    onClick={handleSubmit}
                  >
                    Save
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
      </MainContainer>
    </div>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMasterProjectMNewUser);
