import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";

import sessionstorage from "sessionstorage";
import { useEffect } from "react";

// export const companyMasterApi = async () => await axios.post(baseUrl + MethodNames.ViewMasterCompany, ViewSingle)




export async function companyMasterApi() {
  const ViewSingle = {
    OperationType: "ViewSingle",
    CompanyId: 1,
  };
  const response = await axios.post(
    baseUrl + MethodNames.ViewMasterCompany,
    ViewSingle
  );

  return response;
}
export async function StateMasterApi() {
  const StateViewAllUser = {
    OperationType: "ViewAll",
    StateId: 1,
  };
  const response = await axios.post(
    baseUrl + MethodNames.ViewMasterState,
    StateViewAllUser
  );

  return response;
}
export async function ViewProjectMasters() {
  const userId = await sessionStorage.getItem("UserDetails")
  const ProjectMastersAll = {
    OperationType: "ViewAll",
    ProjectId: 1,
    UserId:userId
  };
  const response = await axios.post(
    baseUrl + MethodNames.ViewMasterProject,
    ProjectMastersAll
  );

  return response;
}
export async function ViewMasterPayComponent() {
  const PayComponent = {
    OperationType: "ViewAll",
    PayCompCode: 1,
  };
  const response = await axios.post(
    baseUrl + MethodNames.ViewMasterPayComponent,
    PayComponent
  );

  return response;
}
 //  get Designationmaster user deta
export async function Designationmaster() {
  const Designationmaster = {
    OperationType: "ViewAll",
    DesignationId: 1,
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterDesignation, Designationmaster)
  

  return response;
}
export async function Departmentmaster() {
  const Departmentmaster = {
    OperationType: "ViewAll",
    DepartmentId: 1,
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterDepartment, Departmentmaster)
  

  return response;
}
export async function MasterIDProof() {
  const MasterIDProofs = {
    OperationType: "ViewAll",
    MasterIDProofId: 1,
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterIDProof, MasterIDProofs)
  

  return response;
}
export async function ViewMasterBank() {
  const ViewMasterBanks = {
    OperationType: "ViewAll",
    BankId: 0,
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterBank, ViewMasterBanks)
  

  return response;
}
export async function ViewLocationMaster() {
  const ViewMasterLocation = {
    OperationType: "ViewAll",
    LocationId: 1,
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterLocation, ViewMasterLocation)
   return response;
}
export async function ViewMasterEmployee() {
  const ViewMasterEmployee = {
    OperationType: "ViewAll",
    EmpId:0,
    ProjectId:1
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterEmployee, ViewMasterEmployee)
   return response;
}
export async function ViewReportingManager() {
  const ViewReportingManagers = {
    OperationType: "ViewAll",
  
  };
  const response = await axios.post(baseUrl + MethodNames.ViewReportingManager, ViewReportingManagers)
   return response;
}
export async function ViewMasterMenu() {
  const userId = await sessionStorage.getItem("UserDetails")
  const ViewMasterMenus = {
    OperationType: "ViewAll",
    UserId:userId
  
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterMenu, ViewMasterMenus)
   return response;
}
export async function MasterEmployeeData() {
  const MasterEmployeeDatas = {
    OperationType: "Viewall",
    EmpId: 0,
    ProjectId: ""
  
  };
  const response = await axios.post(baseUrl + MethodNames.ViewMasterEmployee, MasterEmployeeDatas)
   return response;
}

export async function LoginUserId() {
  
  const userId = await sessionStorage.getItem("UserDetails")

   return userId;
}






















 //  get Designationmaster user deta
//  const Designationmaster = {
//   OperationType: "ViewAll",
//   DesignationId: 1,
// };
// const UpsertMasterDesignation = async () =>
//   await axios
//     .post(baseUrl + MethodNames.ViewMasterDesignation, Designationmaster)
//     .then((res) => {
//       console.log("response DATA----", res.data.ViewMasterDesignation);
//       setViewMasterDesignation(res.data.ViewMasterDesignation);
//       setLoding(false);
//     });

// const ViewMasterPayment = async () =>{
//   const PaymentType = {
//     OperationType: "ViewAll",
//     PayCompCode:1
//   };
//   await axios.post(baseUrl + MethodNames.ViewMasterPayComponent, PaymentType)
//     .then((res) => {
//       console.log("response VieViewPayComponent DATA----", res.data.ViewMasterPayComponent);
//       setVieViewPayComponent(res.data.ViewMasterPayComponent);
//       setLoding(false);
//     }); 
//   }
