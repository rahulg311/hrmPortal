import { toast } from "react-toastify";


//  all data key name chnage in statice
const JsonValue = {
  EmpName: " employee name",
  Gender: " gender",
  FatherName: " father name",
  MaritalStatus: " martial status",
  AadharNo: " aadhar no",
  PerAddress: "perm address",
  PerStateId: "perm state",
  PerCity: "perm city",
  PerPincode: "perm pincode",
  CurrentAddress: "current address",
  CurrentStateId: "current state",
  CurrentCity: "current city",
  CurrentPincode: "current pincode",
  BankId: "bank name",
  Phone: " phone number",
  Mobile: "mobile number",
  DesignationId: "Designation",
  ReportingManagerId: "reporting manager",
  LocationId: "deploy location",
  ProjectId: "Project name",
  TDS_Circle:"td circle",
  ESIC_EmployerCode:"esic emp code",
  CompanyId:"company",
  IFSCCode:"ifsc code",
  Pancard: "pan card",
  IDProof: "id proof",
  NoticePeriod: "notice period",
  ProbationPeriod: "probation period",
  StateId:"State",
  IDProofFile:"id proof file name"
  
 

}


 const Vaildation = (data) => {
  // validation input field
  console.log("data is empaty in validation", data);
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key] === "") {
     const formattedString = key.replace(/[_\s]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
      const spl2 = JsonValue[key] || formattedString
      const spl3 = spl2.toLowerCase();
     toast.error(`Please enter ${spl3}`);
      console.log("key", key);
      return false;
    }
  }
  return true;
};
export default Vaildation
   // const spls= spl2.replace(/Id$/, "");
