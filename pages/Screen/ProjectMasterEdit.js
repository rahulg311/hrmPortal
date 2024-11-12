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

  const ProjectMasterEdit = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [CompanyData, setCompanyData] = useState([]);
  const [TransactionModel, setTransactionModel] = useState(false);
  const [UserId, setUserId] = useState("");
  // View Project Master Transaction data
 const [ProjectTransaction, setProjectTransaction] = useState([]);
     // PROJECT MASTER GET EDIT USER DATA IN QUERY
 const EditPrijectId = router.query.UpdateProjectMaster? router.query.UpdateProjectMaster: "";




 //  PROJECT MASTER UPDATED DATA
 const [ProjectMNewUser, setProjectMNewUser] = useState({
  ProjectId: "",
  ProjectName: "",
  CompanyId: "",
  ApprovedStrength: "",
  ApprovedDate: "",
  ContractEndDate: "",
  // setProjectTra
});
console.log("ProjectMNewUser-----------1",ProjectMNewUser)
// PROJECT Transaction UPDATED DATA
const [ProjectTra, setProjectTra] = useState({
  Id: 0,
  ProjectId: 0,
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
  // UserId: "",
});

console.log("ProjectMNewUser--------------",ProjectMNewUser)


// LOGIN USERID GET ON LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      console.log("ChangePassword", UserId);
      setUserId(userid);
    };
    UserId();
  }, {});



  //  RENDER DATA ON REFRESH 
  useEffect(() => {
    ViewProjectMasters(EditPrijectId);
    CompanyList();
    if(EditPrijectId){
      ViewTransactionMasters(EditPrijectId);
    }
 
  }, [EditPrijectId]);



  //VIEW  single edit PROJECT MASTER API CALL 
  const ViewProjectMasters = async (EditPrijectId) => {
    setLoding(true)
    const UsersId = await sessionStorage.getItem("UserDetails");

    const ProjectMastersAll = {
      OperationType: "ViewSingle",
      ProjectId: EditPrijectId,
      UserId:UsersId
    };

    console.log("ProjectMastersAll---",ProjectMastersAll)
    await axios
      .post(baseUrl + MethodNames.ViewMasterProject, ProjectMastersAll)
      .then((res) => {
        console.log("response DATA---- pro", res.data);
        if(res.data.ViewMasterProject[0]){
          setProjectMNewUser(res?.data?.ViewMasterProject[0]);
          setLoding(false);

        }
       
      }).catch(()=>{
        setLoding(false);
      });
  };






  //  GET API CALL COMPANY DATA LIST
  const CompanyList = async () => {
    const datass = await companyMasterApi();
    setCompanyData(datass.data.ViewMasterCompany);
  };

 


// PROJECT MASTER AND Transaction UPDATED DATA SUBMIT 
  const handleSubmit = async (e) => {
    e.preventDefault();
    let val = await Vaildation(ProjectMNewUser);
    if (!val) {
      return;
    }


    let postData = {
      ProjectMaster: [
        {
          ProjectId: ProjectMNewUser.ProjectId,
          ProjectName: ProjectMNewUser.ProjectName,
          CompanyId: Number(ProjectMNewUser.CompanyId),
          ApprovedStrength: Number(ProjectMNewUser.ApprovedStrength),
          ApprovedDate: moment(new Date(ProjectMNewUser.ApprovedDate)).format("MM/DD/YYYY"),
          ContractEndDate: moment(new Date(ProjectMNewUser.ContractEndDate)).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
      ProjectTransaction: [
        {
          Id: ProjectTra.Id,
          ProjectId: ProjectTra.ProjectId,
          PF_MaxLimitApplicable: Number(ProjectTra.PF_MaxLimitApplicable),
          PF_MaxSalary: ProjectTra.PF_MaxSalary,
          PF_MaxLimitAmount: ProjectTra.PF_MaxLimitAmount,
          EPS_MaxSalary: ProjectTra.EPS_MaxSalary,
          PF_DeductionRate: ProjectTra.PF_DeductionRate,
          DLI_MaxSalary: ProjectTra.DLI_MaxSalary,
          EPS_ContributionRate: ProjectTra.EPS_ContributionRate,
          EPF_ContributionRate: ProjectTra.EPF_ContributionRate,
          EDLI_ContributionRate: ProjectTra.EDLI_ContributionRate,
          EPF_AdminChargesRate: ProjectTra.EPF_AdminChargesRate,
          EDLI_AdminChargesRate: ProjectTra.EDLI_AdminChargesRate,
          ESIC_MaxSalary: ProjectTra.ESIC_MaxSalary,
          ESIC_DeductionRate: ProjectTra.ESIC_DeductionRate,
          ESIC_ContributionRate: ProjectTra.ESIC_ContributionRate,
          FromDate: moment(new Date(ProjectTra.FromDate)).format("MM/DD/YYYY"),
          ToDate: moment(new Date(ProjectTra.ToDate)).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };



    console.log("TraValditionData---0",postData)
    //  project Transaction master validation range
    const TraValditionData = {
      ProjectId: ProjectMNewUser.ProjectId,
      FromDate: moment(new Date(ProjectTra.FromDate)).format("MM/DD/YYYY"),
      ToDate:moment(new Date(ProjectTra.ToDate)).format("MM/DD/YYYY")
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
   


  
    let ProjectTransactions = await Vaildation(postData.ProjectTransaction[0]);
    if (!ProjectTransactions) {
      return;
    }
    console.log("ProjectUpdateUser----add",postData)
    const ProjectUpdateUser = JSON.stringify(postData);
    const ProjectMasterUpdate = {
      OperationType: "Update",
      JsonData: ProjectUpdateUser,
    };
 
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterProject, ProjectMasterUpdate)
      .then(async (res) => {
        
        if (res.data.UpsertMasterProject) {
           toast.success("Successful update ");
           setTimeout(()=>{
            router.push("/Screen/ProjectMaster")
           },1500) 
        }
    
        ViewTransactionMasters(ProjectMNewUser.ProjectId);
        setTransactionModel(false);
        setProjectTra({
          Id: 0,
          ProjectId: "",
          PF_MaxLimitApplicable: 0,
          PF_MaxSalary: "",
          PF_MaxLimitAmount: "",
          EPS_MaxSalary: "",
          PF_DeductionRate: "",
          DLI_MaxSalary: "",
          EPS_ContributionRate: "",
          EPF_ContributionRate: "",
          EDLI_ContributionRate: "",
          EPF_AdminChargesRate: "",
          EDLI_AdminChargesRate: "",
          ESIC_MaxSalary: "",
          ESIC_DeductionRate: "",
          ESIC_ContributionRate: "",
          FromDate: "",
          ToDate: "",
          UserId: "",
        });
      }).catch((err)=>{
        toast.error(err)
        console.log("network error")
      })
  };

  //  back button
  const back = () => {
    router.push("/Screen/ProjectMaster");
  };



  const ViewTransactionMasters = async (ProjectId) => {
    const ProjectTransactionAll = {
      OperationType: "ViewAll",
      ProjectId: ProjectId,
    };
     await axios.post( baseUrl + MethodNames.ViewMasterProjectTransaction,ProjectTransactionAll)
      .then((res) => {
        console.log("response DATA----", res.data.ViewMasterProjectTransaction);
        setProjectTransaction(res.data.ViewMasterProjectTransaction);
      });
  };


  // update  ProjectTransaction edit master
  const UserUpdate = (user) => {
    setProjectTra(user);
  };

 // NEW ADD TRANSCATION DATA  SUBMIT
  const TransactionSubmit = async (e) => {
    e.preventDefault();
    let val = await Vaildation(ProjectMNewUser);
    if (!val) {
      return;
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
          Id: ProjectTra.Id,
          ProjectId: ProjectMNewUser.ProjectId,
          PF_MaxLimitApplicable: Number(ProjectTra.PF_MaxLimitApplicable),
          PF_MaxSalary: ProjectTra.PF_MaxSalary,
          PF_MaxLimitAmount: ProjectTra.PF_MaxLimitAmount,
          EPS_MaxSalary: ProjectTra.EPS_MaxSalary,
          PF_DeductionRate: ProjectTra.PF_DeductionRate,
          DLI_MaxSalary: ProjectTra.DLI_MaxSalary,
          EPS_ContributionRate: ProjectTra.EPS_ContributionRate,
          EPF_ContributionRate: ProjectTra.EPF_ContributionRate,
          EDLI_ContributionRate: ProjectTra.EDLI_ContributionRate,
          EPF_AdminChargesRate: ProjectTra.EPF_AdminChargesRate,
          EDLI_AdminChargesRate: ProjectTra.EDLI_AdminChargesRate,
          ESIC_MaxSalary: ProjectTra.ESIC_MaxSalary,
          ESIC_DeductionRate: ProjectTra.ESIC_DeductionRate,
          ESIC_ContributionRate: ProjectTra.ESIC_ContributionRate,
          FromDate: moment(new Date(ProjectTra.FromDate)).format("MM/DD/YYYY"),
          ToDate: moment(new Date(ProjectTra.ToDate)).format("MM/DD/YYYY"),
          UserId: UserId,
        },
      ],
    };



    //  project Transaction add master validation range
    const TraValditionData = {
      ProjectId: ProjectMNewUser.ProjectId,
      FromDate: moment(new Date(ProjectTra.FromDate)).format("MM/DD/YYYY"),
      ToDate:moment(new Date(ProjectTra.ToDate)).format("MM/DD/YYYY")
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

    let ProjectTransactions = await Vaildation(postData.ProjectTransaction[0]);
    if (!ProjectTransactions) {
      return;
    }
    const ProjectTransactionUser = JSON.stringify(postData);

    const ProjectTransactionUpdate = {
      OperationType: "Update",
      JsonData: ProjectTransactionUser,
    };
    console.log("ProjectTransactionUpdate user data", ProjectTransactionUpdate);
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterProject, ProjectTransactionUpdate)
      .then((res) => {
        if (res.data.UpsertMasterProjec) {
          toast.success(
            "sucessfull add Transaction ",
            res.data.UpsertMasterProject
          );
        }
        ViewTransactionMasters(ProjectMNewUser.ProjectId);
        setTransactionModel(false);
        setProjectTra({
          Id: 0,
          ProjectId: "",
          PF_MaxLimitApplicable: 0,
          PF_MaxSalary: "",
          PF_MaxLimitAmount: "",
          EPS_MaxSalary: "",
          PF_DeductionRate: "",
          DLI_MaxSalary: "",
          EPS_ContributionRate: "",
          EPF_ContributionRate: "",
          EDLI_ContributionRate: "",
          EPF_AdminChargesRate: "",
          EDLI_AdminChargesRate: "",
          ESIC_MaxSalary: "",
          ESIC_DeductionRate: "",
          ESIC_ContributionRate: "",
          FromDate: "",
          ToDate: "",
          UserId: "",
        });
        //  router.push("/Screen/ProjectMaster");
      });
  };
  //  open model in add transaction data
  const transactionAdd = () => {
    setProjectTra({
      Id: 0,
      ProjectId: "",
      PF_MaxLimitApplicable: 0,
      PF_MaxSalary: "",
      PF_MaxLimitAmount: "",
      EPS_MaxSalary: "",
      PF_DeductionRate: "",
      DLI_MaxSalary: 0,
      EPS_ContributionRate: "",
      EPF_ContributionRate: "",
      EDLI_ContributionRate: "",
      EPF_AdminChargesRate: "",
      EDLI_AdminChargesRate: "",
      ESIC_MaxSalary: "",
      ESIC_DeductionRate: "",
      ESIC_ContributionRate: "",
      FromDate: "",
      ToDate: "",
      UserId: "",
    });
    setTransactionModel(!TransactionModel);
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
                      <p className="p-2">Edit Project Master Info</p>
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
                    disabled={true}
                      className="w_90 input_field_head no-drop "
                      type="text"
                      value={ProjectMNewUser.ProjectName}
                      onChange={(e) =>
                      {
                        const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                        setProjectMNewUser({
                          ...ProjectMNewUser,
                          ProjectName:TextInput,
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
                      <option selected >Select Company</option>

                      {CompanyData &&
                        CompanyData.map((i, key) => (
                          <option selected key={key} value={i.CompanyId}>{i.CompanyName}</option>
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
                      type="number"
                      value={ProjectMNewUser.ApprovedStrength}
                      onChange={(e) =>{
                      let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                      setProjectMNewUser({
                          ...ProjectMNewUser,
                          ApprovedStrength: TextInput,
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
                      value={moment(ProjectMNewUser.ApprovedDate).format("YYYY-MM-DD")}
                      onChange={(e) =>setProjectMNewUser({
                          ...ProjectMNewUser,
                          ApprovedDate: e.target.value,
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
                      min={ProjectMNewUser?.ApprovedDate}
                      disabled={ProjectMNewUser?.ApprovedDate===""}
                      value={moment(ProjectMNewUser.ContractEndDate).format(
                        "YYYY-MM-DD"
                      )}
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
                <div className="w-100 px-2 m-0 mb-2 ">
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
                      type="number"
                      value={ProjectTra.PF_MaxSalary}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectTra({
                          ...ProjectTra,
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
                      type="number"
                      value={ProjectTra.PF_MaxLimitAmount}
                      onChange={(e) =>{
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectTra({
                          ...ProjectTra,
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
                      mask="99.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}

                      value={ProjectTra.PF_DeductionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          PF_DeductionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          PF_DeductionRate: e.target.value,
                        })
                        }
                        
                      }
                      }
                        // setProjectTra({
                        //   ...ProjectTra,
                        //   PF_DeductionRate: e.target.value,
                        // })
                      // }
                      
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
                      value={ProjectTra.PF_MaxLimitApplicable}
                      onChange={(e) => {
                        setProjectTra({
                          ...ProjectTra,
                          PF_MaxLimitApplicable: e.target.value == 0 ? 1 : 0,
                        });
                      }}
                      checked={ProjectTra.PF_MaxLimitApplicable == true}
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
                      value={ProjectTra.EPF_AdminChargesRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          EPF_AdminChargesRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          EPF_AdminChargesRate: Number(e.target.value),
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
                      value={ProjectTra.EPF_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          EPF_ContributionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          EPF_ContributionRate: Number(e.target.value),
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
                      value={ProjectTra.EDLI_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          EDLI_ContributionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          EDLI_ContributionRate: Number(e.target.value),
                        })
                        }
                        
                      }
                      }
                      // onChange={(e) =>{
                      //  setProjectTra({
                      //     ...ProjectTra,
                      //     EDLI_ContributionRate: e.target.value,
                      //   })
                      // // }
                      // }
                      // }
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
                      value={ProjectTra.EDLI_AdminChargesRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          EDLI_AdminChargesRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          EDLI_AdminChargesRate: Number(e.target.value),
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
                      type="number"
                      value={ProjectTra.DLI_MaxSalary}
                      onChange={(e) =>
                      {
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectTra({
                          ...ProjectTra,
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
                      type="number"
                      value={ProjectTra.EPS_MaxSalary}
                      onChange={(e) =>
                      {
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectTra({
                          ...ProjectTra,
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
                    {/* <input
                      className="w_90 input_field_head"
                      type="number"
                      value={ProjectTra.EPS_ContributionRate}
                      onChange={(e) =>
                        setProjectTra({
                          ...ProjectTra,
                          EPS_ContributionRate: e.target.value,
                        })
                      }
                    /> */}
                    <InputMask
                      className="w_90 input_field_head"
                      mask="9.99" 
                      placeholder="0.00" 
                      alwaysShowMask 
                      maskChar={null}
                      value={ProjectTra.EPS_ContributionRate}
                      onChange={(e) =>{
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          EPS_ContributionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          EPS_ContributionRate: Number(e.target.value),
                        })
                        }
                        
                      }
                      }
    />
                    <br />
                  </div>
                </div>
                <div className="w-100 px-2 m-0 mb-2 ">
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
                      value={ProjectTra.ESIC_MaxSalary}
                      onChange={(e) =>
                      {
                        let TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,6);
                        setProjectTra({
                          ...ProjectTra,
                          ESIC_MaxSalary: Number(TextInput),
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
                      value={ProjectTra.ESIC_DeductionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          ESIC_DeductionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          ESIC_DeductionRate: Number(e.target.value),
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
                      value={ProjectTra.ESIC_ContributionRate}
                      onChange={(e) =>
                      {
                        const value = e.target.value;
                        if (value.length === 2) {
                          setProjectTra({
                          ...ProjectTra,
                          ESIC_ContributionRate: Number(e.target.value+"00"),
                        }) // If one digit is entered, set the default value as "1.00"
                        } else {
                          setProjectTra({
                          ...ProjectTra,
                          ESIC_ContributionRate: Number(e.target.value),
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
                      value={moment(ProjectTra.FromDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setProjectTra({
                          ...ProjectTra,
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
                    min={moment(ProjectTra.FromDate).format("YYYY-MM-DD")}
                    disabled={ProjectTra.FromDate===""}
                      className="w_90 input_field_head"
                      type="date"
                      value={moment(ProjectTra.ToDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setProjectTra({ ...ProjectTra, ToDate: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>

                {TransactionModel == true ? (
                  <div className="w-100 h-100 d-flex justify-content-end p-2">
                    <button
                      className="btn btn-primary h-100 w_101 btn_size_h   ps-4 pe-4"
                      onClick={TransactionSubmit}
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
                      className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                      onClick={handleSubmit}
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
                        <th className="text-center">Project Id</th>
                        <th className="text-center">PF Max Salary</th>
                        <th className="text-center">EPS Max Salary</th>
                        {/* <th className="text-center">DLI Max Salary</th> */}
                        <th className="text-center">PF Deduction Rate</th>
                        <th className="text-center">PF MaxLimit Amount</th>
                        <th className="text-center">From Date</th>
                        <th className="text-center">To Date</th>
                      </tr>

                      {ProjectTransaction &&
                        ProjectTransaction.map((i, key) => {
                          return (
                            <>
                              <tr key={key}>
                              {TransactionModel == true ?
                                <td></td> :   <td>
                                  <p className="m-0 ms-2" disa>
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

                                <td>{i.ProjectId}</td>
                                <td>{i.PF_MaxSalary}</td>
                                <td>{i.EPS_MaxSalary}</td>
                                {/* <td>{i.DLI_MaxSalary}</td> */}
                                <td>{i.PF_DeductionRate}</td>
                                <td>{i.PF_MaxLimitAmount}</td>
                                <td>{i.FromDate}</td>
                                <td>{i.ToDate}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMasterEdit);
