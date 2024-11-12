import React, { useEffect, useState } from "react";
import Sidebaar from "./Sidebaar";
import {mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { EmailBase, UpdatedOfferLetterView, baseUrl, uploadFileBaeUrl, uploadFileView } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import moment from "moment/moment";
import { Designationmaster, companyMasterApi, StateMasterApi, MasterIDProof, ViewMasterBank, ViewLocationMaster, ViewProjectMasters, ViewReportingManager, LoginUserId } from "../api/AllApi";
import Vaildation from "./Vaildation";
import mime from "mime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const NewEmployeeAdd = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [CompanyData, setCompanyData] = useState([]);
  const [DesignationmasterData, setDesignationmasterData] = useState([]);
  const [stateMasterApiData, setstateMasterApiData] = useState([]);
  const [MasterIDProofsData, setMasterIDProofsData] = useState([]);
  const [MasterBankData, setMasterBankData] = useState([]);
  const [LocationMasterData, setLocationMasterData] = useState([]);
  const [ViewProjectMastersData, setViewProjectMastersData] = useState([]);
  const [ViewReportingManagerData, setViewReportingManagerData] = useState([]);
  const [AadharValid, setAadharValid] = useState("");
  const [MobileValid, setMobileValid] = useState("");
  const [ViewNoticePeriod, setViewNoticePeriod] = useState("");
  const [ViewProvisionPeriod, setViewProvisionPeriod] = useState("");
  
  const [isEmailValid, setIsEmailValid] = useState(false);
  var UpdateNewEmployee = router.query.UpdateNewEmployee ? JSON.parse(router.query.EmpId) : {};
  var EditEmpId = router.query.EmpId ? router.query.EmpId : "";
  var EditProjectId = router.query.ProjectId ? router.query.ProjectId : "";

  console.log("ViewProvisionPeriod",ViewProvisionPeriod)


    //  ADD NEW EMPLOYEE INPUT DATA
    const [NewEmployee, setNewEmployee] = useState({
      EmpId: "0",
      EmpName: "",
      Gender: "",
      FatherName: "",
      DOB: "",
      MaritalStatus: "",
      PerAddress: "",
      PerStateId: "",
      PerCity: "",
      PerPincode: "",
      CurrentAddress: "",
      CurrentStateId: "",
      CurrentCity: "",
      CurrentPincode: "",
      BankId: "",
      BankBranchName: "",
      BankAccountNo: "",
      IFSCCode: "",
      BankPhoto:"",
      BankFile:"",
      Email: "",
      // Phone: "",
      Mobile: "",
      DesignationId: "",
      ReportingManagerId: "",
      Pancard: "",
      PancardPhoto:"",
      PancardPhotoFile:"",
      // IDProof: "",
      // // IDProofFileName: "",
      // IDProofFile:"",
       AadharPhoto:"",
      AadharNo: "",
      AadharFile:"",
      LocationId: "",
      ProjectId: "",
      ProjectedDOJ: "",
      OfferLetterDate: "",
      // OfferLetterFileName: "",
      // OfferLetterFile: "",
      NoticePeriod: "",
      ProbationPeriod: "",
      Remark: "",
     
    });
    
    useEffect(()=>{
      console.log("NewEmployee---hjjh",NewEmployee)
    },[NewEmployee])
    const [checkedAddress,setCheckedAddress] = useState(false)
  
//  view fileUplode URl 
  const fileviewOfferletter = uploadFileView + "offerletters/"
  const fileviewdocuments = uploadFileView + "documents/"

  useEffect(() => {
    if (EditEmpId !== "" && EditEmpId !== null && EditProjectId !== "" && EditProjectId !== null) {
      // setNewEmployee(UpdateNewEmployee);
      setIsUpdateForm(true);
      MasterEmployeeDatas(EditEmpId, EditProjectId)
    }
  }, [EditEmpId, EditProjectId]); // Runs only once when the component mounts

  useEffect(() => {
    AadharNoValidate()
    ProvisionPeriod()

  }, [])


  const [UserId, setUserId] = useState("");
  // user id get in login
  const { pathname } = router;
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      console.log("ChangePassword", UserId);
      setUserId(userid);
    };
    UserId();
    // company list view company master
    AllApiCall();

  }, []);


//  viewProvisionPeriod Methpod call 
const ProvisionPeriod = async ()=>{
  const data = {
    ProjectId:""
}
try {
  await axios.post(baseUrl + MethodNames.viewNoticePeriod,data).then(async(res)=>{
    setViewNoticePeriod(res.data.viewNoticePeriod)
    await axios.post(baseUrl + MethodNames.viewProvisionPeriod,data).then((res)=>{
      setViewProvisionPeriod(res.data.viewProvisionPeriod)
    })
  })
 
} catch (error) {
  toast.error("Network error viewNoticePeriod ")
  console.log("error", error)
  }}


  const MasterEmployeeDatas = async (EditEmpId, EditProjectId) => {
    const LOginUserId= await sessionStorage.getItem("UserDetails")
    
    let MasterEmployeeDatas = {
      OperationType: "ViewSingle",
      EmpId: EditEmpId,
      ProjectId: EditProjectId,
      UserId:LOginUserId
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterEmployee, MasterEmployeeDatas)
      .then((res) => {
        console.log(
          "View PayComponent type DATA",
          res.data.ViewMasterEmployee
        );
        if (!res == "" && !res.data == "" && !res.data.ViewMasterEmployee == "") {
          setNewEmployee(res.data.ViewMasterEmployee[0])
          setIsEmailValid(true)
        } else (
          console.log("not found ViewMasterEmployee ")
        )

      });
  };


  // all project master api call
  const AllApiCall = async () => {
    const data = await companyMasterApi();
    const Designationmasters = await Designationmaster();
    const stateMasterApi = await StateMasterApi();
    const MasterIDProofs = await MasterIDProof();
    const ViewMasterBanks = await ViewMasterBank();
    const LocationMastes = await ViewLocationMaster();
    const ViewProjectMasterss = await ViewProjectMasters();
    const ViewReportingManagers = await ViewReportingManager();
    setViewReportingManagerData(
      ViewReportingManagers.data.ViewReportingManager
    );
    setViewProjectMastersData(ViewProjectMasterss.data.ViewMasterProject);
    setLocationMasterData(LocationMastes.data.ViewMasterLocation);
    setMasterBankData(ViewMasterBanks.data.ViewMasterBank);
    setMasterIDProofsData(MasterIDProofs.data.ViewMasterIDProof);
    setstateMasterApiData(stateMasterApi.data.ViewMasterState);
    setDesignationmasterData(Designationmasters.data.ViewMasterDesignation);
    setCompanyData(data.data.ViewMasterCompany);
  };

  //   idproofkey key save state
  const [idproofkey, setidproofkey] = useState(0)

  // Aadhar no validation exit or not exit
  const AadharNoValidate = async (inputAadhar,ProofType) => {
    console.log("inputAadhar", inputAadhar,String(ProofType))
    var AadharData = {
      FieldType: String(ProofType),
      FieldValue: inputAadhar || 0
    }
    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.ViewValidateData, AadharData)
      .then((res) => {
        console.log("ViewValidateData-----2", res.data.ViewValidateData);
        // const prof =String(ProofType)
        if(String(ProofType) === "MOBILE"){
          setMobileValid(res.data.ViewValidateData[0].RecordStatus)
          }else{
            setAadharValid(res.data.ViewValidateData[0].RecordStatus)
          }
        
        // RecordStatus
      })
  }


//  create a function uniqe name 
  function generateUniqueFilename(EmpName, proofaname  ,keyname) {
   if ( !EmpName || !proofaname) {
        throw new Error('Invalid input: NewEmployee must contain EmpName and proofaname properties');
    }
    let currentDate = moment().format('DDMMYYYYHHmmss');
    const uniqNo = Math.floor(Math.random() * 100);
    let fileParts = proofaname.split('.');
    let ext = fileParts.length > 0 ? fileParts[fileParts.length - 1] : '';
    let EmpNames = EmpName;
    let EmpNamecharacterValues = EmpNames.match(/[a-zA-Z]/g).join('');
    const uniqFilename = `${EmpNamecharacterValues}_${keyname}_${currentDate}_${uniqNo}.${ext}`;
    // Return the unique filename
    return uniqFilename;
}



  // Sumbit employee data project master
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("NewEmployee------------444444444 edit", NewEmployee)


    let val = await Vaildation(NewEmployee);
    if (!val) {
      return;
    }

    // validation aadhar carad  & mobile no field
    if (MobileValid === "Already Exist") {
      toast.error("Mobile No is already exists ");
      return;
    }
        
    if (AadharValid === "Already Exist") {
      toast.error("Aadhar Card is already exists ");
      return;
    }

    if (NewEmployee.DOB === "Invalid date" || "") {
      toast.error("Please insert the DOB");
      return;
    }
    if (NewEmployee.IDProof === "Select ID Proof") {
      toast.error("Please insert the id proof");
      return;
    }
    if (NewEmployee.EmpName == "") {
      toast.error("Please insert the EmpName");
      return;
    }

    let uniq_filenameAadharPhoto
    let uniq_filenameBankPhoto
    let uniq_filenamepancardPhoto
    //  aadhar photo uplode
    if(NewEmployee.AadharFile){
    const uniq_filenameAadhar=  generateUniqueFilename(NewEmployee.EmpName,NewEmployee.AadharPhoto, "AadharPhoto")
     let isFileUploadedAadhar = await uploadFile(NewEmployee.AadharFile, uniq_filenameAadhar, "documents");
     uniq_filenameAadharPhoto=uniq_filenameAadhar
     console.log("dattttt------------1",uniq_filenameAadhar)
     console.log("dattttt-------------2",isFileUploadedAadhar)
     if (!isFileUploadedAadhar) {
      toast.error("Cannot upload Aadhar Photo!");
      return;
    }}
     if(NewEmployee.BankFile){
        // aadhar photo uplode
      const uniq_filenameBank= generateUniqueFilename(NewEmployee.EmpName,NewEmployee.BankPhoto, "BankPhoto")
      let isFileUploadedBank = await uploadFile(NewEmployee.BankFile, uniq_filenameBank, "documents");
      uniq_filenameBankPhoto=uniq_filenameBank
       console.log("dattttt------------3",uniq_filenameBank)
       console.log("dattttt-------------4",isFileUploadedBank)
       if (!isFileUploadedBank) {
        toast.error("Cannot upload Bank Photo!");
        return;
      }}
       if(NewEmployee.PancardPhotoFile){
      //  pancard photo uplode
      const uniq_filenamePanCard= generateUniqueFilename(NewEmployee.EmpName,NewEmployee.PancardPhoto, "PancardPhoto")
      let isFileUploadedPancard = await uploadFile(NewEmployee.PancardPhotoFile, uniq_filenamePanCard, "documents");

      uniq_filenamepancardPhoto=uniq_filenamePanCard
         console.log("dattttt------------5",uniq_filenamePanCard)
         console.log("dattttt-------------6",isFileUploadedPancard)
         if (!isFileUploadedPancard) {
          toast.error("Cannot upload Pancard Photo!");
          return;
        }}
      console.log("dattttt------------ uniq name-3",uniq_filenameAadharPhoto, uniq_filenameBankPhoto,uniq_filenamepancardPhoto)

    



    let postData = [
      {
        EmpName: NewEmployee.EmpName,
        Gender: NewEmployee.Gender,
        FatherName: NewEmployee.FatherName,
        DOB: moment(new Date(NewEmployee.DOB)).format("MM/DD/YYYY"),
        MaritalStatus: NewEmployee.MaritalStatus,
        PerAddress: NewEmployee.PerAddress,
        PerStateId: NewEmployee.PerStateId,
        PerCity: NewEmployee.PerCity,
        PerPincode: NewEmployee.PerPincode,
        CurrentAddress: NewEmployee.CurrentAddress,
        CurrentStateId: NewEmployee.CurrentStateId,
        CurrentCity: NewEmployee.CurrentCity,
        CurrentPincode: NewEmployee.CurrentPincode,
        Email: NewEmployee.Email,
        // Phone: NewEmployee.Phone,
        Mobile: NewEmployee.Mobile,
        AadharNo: NewEmployee.AadharNo,
        Pancard: NewEmployee.Pancard,
        IDProof: NewEmployee.IDProof,
        AadharPhoto:uniq_filenameAadharPhoto,
        BankPhoto:uniq_filenameBankPhoto,
        PancardPhoto:uniq_filenamepancardPhoto,
        BankId: NewEmployee.BankId,
        BankBranchName: NewEmployee.BankBranchName,
        BankAccountNo: NewEmployee.BankAccountNo,
        IFSCCode: NewEmployee.IFSCCode,
        DesignationId: NewEmployee.DesignationId,
        ReportingManagerId: NewEmployee.ReportingManagerId,
        LocationId: NewEmployee.LocationId,
        ProjectId: NewEmployee.ProjectId,
        ProjectedDOJ: moment(new Date(NewEmployee.ProjectedDOJ)).format("MM/DD/YYYY"),
        OfferLetterDate: moment(new Date(NewEmployee.OfferLetterDate)).format("MM/DD/YYYY"),
        // OfferLetterFileName: NewEmployee.OfferLetterFileName,
        NoticePeriod: NewEmployee.NoticePeriod,
        ProbationPeriod: NewEmployee.ProbationPeriod,
        Remark: NewEmployee.Remark,
        UserId: UserId,
      },
    ];
    // validation input field
    for (let i = 0; i < postData.length; i++) {
      let val = await Vaildation(postData[i]);
      if (!val) {
        return;
      }
    }
    console.log("updated emp;pye data----", postData)


    const UpsertMaster = JSON.stringify(postData);
    const MasterEmployeeAdd = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };
    console.log("NewEmployee-----2", MasterEmployeeAdd);
    
    try {
      const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.UpsertMasterEmployee, MasterEmployeeAdd);
      console.log("res.data--------", UpsertMasterCompany.data);
    
      if (UpsertMasterCompany.data.UpsertMasterEmployee) {
        console.log("result employee", UpsertMasterCompany.data.UpsertMasterEmployee);
        toast.success("User added successfully.");
    
        router.push(
          {
            pathname: "/Screen/SalaryBreakup",
            query: {
              SalaryBreakupData: JSON.stringify(UpsertMasterCompany.data.UpsertMasterEmployee[0].RecordStatus),
              ProjectId: NewEmployee.ProjectId,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    
    } catch (err) {
      console.log("err:", err);
      toast.error("Cannot update data!");
    }
    

        
    
  };

  //  send user data in view salary str
  const ViewSalary = (user) => {
    console.log("employe data------", user)
    router.push(
      {
        pathname: "/Screen/SalaryBreakup",
        query: {
          EditSalaryBreakup: JSON.stringify(user),
          // SingleIsPFDeducted: user.IsPFDeducted,
          // SingleIsESIDeducted: user.IsESIDeducted,
          // SingleEmpId: user.EmpId,
          // SingleProjectId: user.ProjectId
        },
      },
      undefined,
      { shallow: true }
    );
  };


  //   update  employee  data project master
  const handleUpdate = async (e) => {
    e.preventDefault();
    // validation input field
    let val = await Vaildation(NewEmployee);
    if (!val) {
      return;
    }
      // validation aadhar carad & mobile no  field
      if (MobileValid === "Already Exist") {
        toast.error("Mobile No is already exists ");
        return;
      }
      if (AadharValid === "Already Exist") {
        toast.error("Aadhar Card is already exists ");
        return;
      }
      
     if (NewEmployee.DOB === "Invalid date") {
      toast.error("Please insert the DOB");
      return;
    }

// Updated Aadhar photo filename
let uniq_filename_UpdatedAadhar;
let uniq_filename_UpdatedBank;
let uniq_filename_UpdatedPancard;

// Check if new files are uploaded or existing filenames should be used

const isFileUploadRequired = NewEmployee.AadharFile || NewEmployee.BankFile || NewEmployee.PancardPhotoFile;
console.log("valueiiii-----3:", isFileUploadRequired);

if (isFileUploadRequired) {
    const uniq_filenameAadhar = generateUniqueFilename(NewEmployee.EmpName, NewEmployee.AadharPhoto, "AadharPhoto");
    const uniq_filenameBank = generateUniqueFilename(NewEmployee.EmpName, NewEmployee.BankPhoto, "BankPhoto");
    const uniq_filenamePanCard = generateUniqueFilename(NewEmployee.EmpName, NewEmployee.PancardPhoto, "PancardPhoto");


    console.log("Generated unique filenames update image:", uniq_filenameAadhar, uniq_filenameBank, uniq_filenamePanCard);

    // Upload Aadhar File
    if (NewEmployee.AadharFile) {
      uniq_filename_UpdatedAadhar = uniq_filenameAadhar;
        const isAadharUploaded = await uploadFile(NewEmployee.AadharFile, uniq_filenameAadhar, "documents");
        if (!isAadharUploaded) {
            toast.error("Cannot upload Aadhar file!");
            return;
        }
    }else{
      uniq_filename_UpdatedAadhar = NewEmployee.AadharPhoto;
    }

    // Upload Bank File
    if (NewEmployee.BankFile) {
      uniq_filename_UpdatedBank = uniq_filenameBank;
        const isBankUploaded = await uploadFile(NewEmployee.BankFile, uniq_filenameBank, "documents");
        if (!isBankUploaded) {
            toast.error("Cannot upload Bank file!");
            return;
        }
    }else{
      uniq_filename_UpdatedBank = NewEmployee.BankPhoto;
    }

    // Upload Pancard File
    if (NewEmployee.PancardPhotoFile) {
      uniq_filename_UpdatedPancard = uniq_filenamePanCard;
        const isPanCardUploaded = await uploadFile(NewEmployee.PancardPhotoFile, uniq_filenamePanCard, "documents");
        if (!isPanCardUploaded) {
            toast.error("Cannot upload Pancard file!");
            return;
        }
    }else{
      uniq_filename_UpdatedPancard = NewEmployee.PancardPhoto;

    }
} else {
    uniq_filename_UpdatedAadhar = NewEmployee.AadharPhoto;
    uniq_filename_UpdatedBank = NewEmployee.BankPhoto;
    uniq_filename_UpdatedPancard = NewEmployee.PancardPhoto;
    console.log("can not change id proof name without file upload:", NewEmployee.AadharPhoto,NewEmployee.BankPhoto, NewEmployee.PancardPhoto);
}
 let postData = [
      {
        EmpId: NewEmployee.EmpId,
        EmpName: NewEmployee.EmpName,
        Gender: NewEmployee.Gender,
        FatherName: NewEmployee.FatherName,
        DOB: moment(new Date(NewEmployee.DOB)).format("MM/DD/YYYY"),
        MaritalStatus: NewEmployee.MaritalStatus,
        PerAddress: NewEmployee.PerAddress,
        PerStateId: NewEmployee.PerStateId,
        PerCity: NewEmployee.PerCity,
        PerPincode: NewEmployee.PerPincode,
        CurrentAddress: NewEmployee.CurrentAddress,
        CurrentStateId: NewEmployee.CurrentStateId,
        CurrentCity: NewEmployee.CurrentCity,
        CurrentPincode: NewEmployee.CurrentPincode,
        Email: NewEmployee.Email,
        // Phone: NewEmployee.Phone,
        Mobile: NewEmployee.Mobile,
        AadharNo: NewEmployee.AadharNo,
        Pancard: NewEmployee.Pancard,
        IDProof: NewEmployee.IDProof,
        AadharPhoto: uniq_filename_UpdatedAadhar,
        BankPhoto:uniq_filename_UpdatedBank,
        PancardPhoto:uniq_filename_UpdatedPancard,
        BankId: NewEmployee.BankId,
        BankBranchName: NewEmployee.BankBranchName,
        BankAccountNo: NewEmployee.BankAccountNo,
        IFSCCode: NewEmployee.IFSCCode,
        DesignationId: NewEmployee.DesignationId,
        ReportingManagerId: NewEmployee.ReportingManagerId,
        LocationId: NewEmployee.LocationId,
        ProjectId: NewEmployee.ProjectId,
        ProjectedDOJ: moment(NewEmployee.ProjectedDOJ).format("MM/DD/YYYY"),
        OfferLetterDate: moment(NewEmployee.OfferLetterDate).format("MM/DD/YYYY"),
        // OfferLetterFileName: NewEmployee.OfferLetterFileName,
        NoticePeriod: NewEmployee.NoticePeriod,
        ProbationPeriod: NewEmployee.ProbationPeriod,
        Remark: NewEmployee.Remark,
        UserId: UserId,
      },
    ];
    console.log("UpdateNewEmployee-------------1---post", postData);
    // return
    const UpsertMaster = JSON.stringify(postData);
    const MasterEmployeeAUpdate = {
      OperationType: "Update",
      JsonData: UpsertMaster,
    };
    
      try {
        const response = await axios.post(baseUrl + MethodNames.UpsertMasterEmployee, MasterEmployeeAUpdate);
        console.log("NewEmployee-----3", response.data);
        
        if (response.data.UpsertMasterEmployee[0]) {
          toast.success("Emp details updated successfully");
          // await router.push("/Screen/EmployeeDetails");
        }
      } catch (error) {
        console.log("err:", error);
        toast.error("Cannot update data!");
      }
    }


  //  upload file 
  async function uploadFile(file, filename, folderName) {
    console.log("id proof file name------ ", file, filename, folderName)
    try {
      console.log("uploadFile filename:", filename);

      const formData = new FormData();

      formData.append('filename', filename);
      formData.append('folderName', folderName);
      formData.append('file', file);
      console.log("formData:", JSON.stringify(formData));

      return await axios({
        method: 'post',
        // url: uploadFileBaeUrl + 'uploadFile',
        url:uploadFileBaeUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
          return res.status == 200;
        }).catch((err) => {
          console.log('err:', err);
          return false;
        });
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error);
      return false;
    }
  }

// If checkbox is checked, set CurrentAddress to PerAddress
const handleCheckboxChange =(e)=>{
const isChecked =  e.target.checked
setCheckedAddress({...checkedAddress , isChecked})
setNewEmployee({...NewEmployee , 
   CurrentAddress: isChecked ? NewEmployee.PerAddress : '',
   CurrentStateId: isChecked ? NewEmployee.PerStateId : '',
   CurrentCity: isChecked ? NewEmployee.PerCity : '',
   CurrentPincode: isChecked ? NewEmployee.PerPincode : '',
  })


  }

  //  back button
  const back = () => {
    router.push("/Screen/EmployeeDetails");
  };
  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-10" : "content-page vh-10"}>
          <div className="content  ">
            <div className="container-fluid ">
              <div className="cardd pb-4">
                <div className="p- row ">
                  <div className="col-sm-12 col-12 col-md-12  ">
                    <div
                      className="fs_15 back-color table_ref_head text-white "
                      colSpan={7}
                    >
                      <p className="p-2">{isUpdateForm ? "Update New Joining" : 'New Joining'}</p>
                    </div>
                  </div>
                  <div className="col-sm-12 col-12 col-md-12   ">
                    <div
                      className="fs_15 back-colo table_ref_Main h-0 text-white  "
                      colSpan={7}
                    >
                      <p className="p-1 ps-3 text-dark fw-bold fs_15 ">
                        Personal Information
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row mt-3 ms-1 me-1  ">
                  <ToastContainer />
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Employee Name</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head "
                      type="text"
                      value={NewEmployee.EmpName}
                      
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^A-Za-z\s\t]/g,"");
                        setNewEmployee({...NewEmployee,EmpName: TextInput}) }}/>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Gender</p>
                  </div>
                  {/* 
                  <div class="form-check form-check-inline mt-1">
                     <input class="form-check-input"   checked={NewEmployee.Gender === "male" } onChange={(e) =>setNewEmployee({...NewEmployee,Gender: e.target.value}) } value="male" type="radio" name="male" id="inlineRadio1" />
                     male
                  </div>
                  <div class="form-check form-check-inline">
                     <input class="form-check-input"  checked={NewEmployee.Gender === "female" } onChange={(e) =>setNewEmployee({...NewEmployee,Gender: e.target.value})} value="female" type="radio" name="female" id="inlineRadio2" />
                     female
                  </div>
                  */}
                  <div className="col-md_3 col-6 mb-1">
                    <div class="form-check form-check-inline mt-1 m-0">
                      <div class="checkbox-wrapper-31">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={NewEmployee.Gender === "male"}
                          onChange={(e) =>
                            setNewEmployee({
                              ...NewEmployee,
                              Gender: e.target.value,
                            })
                          }
                          value="male"
                          name="male"
                        />
                        Male
                        <svg className="ms-3 imgss" viewBox="0 0 35.6 35.6">
                          <circle
                            class="background"
                            cx="17.8"
                            cy="17.8"
                            r="17.8"
                          ></circle>
                          <circle
                            class="stroke"
                            cx="17.8"
                            cy="17.8"
                            r="14.37"
                          ></circle>
                          <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                          ></polyline>
                        </svg>
                      </div>
                    </div>
                    <div class="form-check form-check-inline m-0 mt-1 ps-1">
                      <div class="checkbox-wrapper-31">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={NewEmployee.Gender === "female"}
                          onChange={(e) =>
                            setNewEmployee({
                              ...NewEmployee,
                              Gender: e.target.value,
                            })
                          }
                          value="female"
                          name="female"
                        />
                        Female{" "}
                        <svg className="ms-2 imgss" viewBox="0 0 35.6 35.6">
                          <circle
                            class="background"
                            cx="17.8"
                            cy="17.8"
                            r="17.8"
                          ></circle>
                          <circle
                            class="stroke"
                            cx="17.8"
                            cy="17.8"
                            r="14.37"
                          ></circle>
                          <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                          ></polyline>
                        </svg>
                      </div>
                    </div>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Father Name </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      name="FatherName"
                      value={NewEmployee.FatherName}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^A-Za-z\s\t]/g,"");
                        setNewEmployee({
                                    ...NewEmployee,
                                    FatherName: TextInput,
                                  })
                                }}

                                />
                    <br />
                  </div>
                </div>
                <div className="row mt-2 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> DOB </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      value={moment(NewEmployee.DOB, "MM-DD-YYYY").format(
                        "YYYY-MM-DD"
                      )}
                      // value={moment(NewEmployee.DOB).format("YYYY/MM/DD")}
                      // moment(NewEmployee.DOB,"MM/DD/YYYY").format("MM/DD/YYYY")
                      onChange={(e) =>{
                        
                        if(e.target.value === "" ){
                          // toast.error("please enter dob")
                          setNewEmployee({
                          ...NewEmployee,
                          DOB: ""
                        })
                        }else{
                          setNewEmployee({
                          ...NewEmployee,
                          DOB: moment(e.target.value, "YYYY-MM-DD").format(
                            "MM-DD-YYYY"
                          ),
                        })

                        }
                        
                       
                      }
                        
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Marital Status </p>
                  </div>
                  {/* 
                  <div className="col-md_3 col-6 mb-1">
                     <input
                        className="w_90 input_field_head"
                        type="date"
                        value={NewEmployee.MaritalStatus}
                        onChange={(e) =>
                     setNewEmployee({
                     ...NewEmployee,
                     MaritalStatus: e.target.value,
                     })
                     }
                     />
                     <br />
                  </div>
                  */}
                  <div className="col-md_3 col-6 mb-1">
                    <div class="form-check form-check-inline mt-1 m-0">
                      <div class="checkbox-wrapper-31">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={NewEmployee.MaritalStatus === "Marrid"}
                          onChange={(e) =>
                            setNewEmployee({
                              ...NewEmployee,
                              MaritalStatus: e.target.value,
                            })
                          }
                          value="Marrid"
                          name="Marrid"
                        />
                        Married
                        <svg className="ms-2 imgss" viewBox="0 0 35.6 35.6">
                          <circle
                            class="background"
                            cx="17.8"
                            cy="17.8"
                            r="17.8"
                          ></circle>
                          <circle
                            class="stroke"
                            cx="17.8"
                            cy="17.8"
                            r="14.37"
                          ></circle>
                          <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                          ></polyline>
                        </svg>
                      </div>
                    </div>
                    <div class="form-check form-check-inline m-0 mt-1 p-0">
                      <div class="checkbox-wrapper-31">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={NewEmployee.MaritalStatus === "UnMarrid"}
                          onChange={(e) =>
                            setNewEmployee({
                              ...NewEmployee,
                              MaritalStatus: e.target.value,
                            })
                          }
                          value="UnMarrid"
                          name="UnMarrid"
                        />
                        UnMarried{" "}
                        <svg className="ms-1 imgss" viewBox="0 0 35.6 35.6">
                          <circle
                            class="background"
                            cx="17.8"
                            cy="17.8"
                            r="17.8"
                          ></circle>
                          <circle
                            class="stroke"
                            cx="17.8"
                            cy="17.8"
                            r="14.37"
                          ></circle>
                          <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                          ></polyline>
                        </svg>
                      </div>
                    </div>
                    <br />
                  </div>
                  
                </div>
                <div className=" fieldsetss pb-2 m-2">
                  <legend className="fieldsets">Permanent </legend>
                  <div className="row  ms-1 me-1 ">
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Address </p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                  
                      <input
                        class="w_90 input_field_head input"

                        type="text"
                        value={NewEmployee.PerAddress}
                        onChange={(e) =>{
                          // const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                          setNewEmployee({
                            ...NewEmployee,
                            PerAddress: e.target.value,
                          })
                        }
                         
                        }
                      />
                      {/* <input
                           className="w_90 input_field_head"
                           type="textarea"
                           value={NewEmployee.PerAddress}
                           onChange={(e) =>
                        setNewEmployee({ ...NewEmployee, PerAddress: e.target.value })
                        }
                        /> */}
                      <br />
                    </div>
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> State</p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <select
                        class="form-select w_90 "
                        value={NewEmployee.PerStateId}
                        onChange={(e) =>
                          setNewEmployee({
                            ...NewEmployee,
                            PerStateId: e.target.value,
                          })
                        }
                        aria-label="Default select example"
                      >
                        <option  value="" disabled>Select State</option>
                        {stateMasterApiData &&
                          stateMasterApiData.map((i, key) => (
                            <option key={key} value={i.StateId}>{i.StateName}</option>
                          ))}
                      </select>
                      <br />
                    </div>
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> City </p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.PerCity}
                        onChange={(e) =>
                        {
                          const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                          setNewEmployee({
                            ...NewEmployee,
                            PerCity:TextInput ,
                          })
                        }
                          
                        }
                      />
                      <br />
                    </div>
                  </div>
                  <div className="row mt-1  ms-1 me-1 ">
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Pin Code </p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.PerPincode}
                        onChange={(e) =>{
                          const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 6);
                          setNewEmployee({
                            ...NewEmployee,
                            PerPincode: TextInput,
                          })
                        }
                          
                        }
                      />
                      <br />
                    </div>
                  </div>
                </div>
                
                <div className=" fieldsetss pb-2 m-2">
                  <legend className="fieldsets"> <input  checked={ NewEmployee.checkeds}
                 onChange={handleCheckboxChange}
                 type="checkbox"/> Current </legend>
                  <div className="row  ms-1 me-1 ">
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Address </p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.CurrentAddress}
                        onChange={(e) =>{
                          // const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"");
                          setNewEmployee({
                            ...NewEmployee,
                            CurrentAddress: e.target.value,
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
                      <select
                        class="form-select w_90 "
                        value={NewEmployee.CurrentStateId}
                        onChange={(e) =>
                          setNewEmployee({
                            ...NewEmployee,
                            CurrentStateId: e.target.value,
                          })
                        }
                        aria-label="Default select example"
                      >
                        <option  value="" disabled>Select State</option>
                        {stateMasterApiData &&
                          stateMasterApiData.map((i, key) => (
                            <option key={key} value={i.StateId}>{i.StateName}</option>
                          ))}
                      </select>
                      <br />
                    </div>
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> City</p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.CurrentCity}
                        onChange={(e) =>{
                          const TextInput = e.target.value.replace(/[^a-zA-Z\s]/g,"");
                          setNewEmployee({
                            ...NewEmployee,
                            CurrentCity: TextInput,
                          })
                        }
                         
                        }
                      />
                      <br />
                    </div>
                  </div>
                  <div className="row mt-1  ms-1 me-1 ">
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Pin Code </p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.CurrentPincode}
                        onChange={(e) =>{
                          const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 6);
                          setNewEmployee({
                            ...NewEmployee,
                            CurrentPincode: TextInput,
                          })
                        }
                        
                        }
                      />
                      <br />
                    </div>
                  </div>
                </div>
                <div className=" fieldsetss pb-2 m-2 pb-3">
                  <legend className="fieldsets">Bank </legend>
                  <div className="row mt-2 ms-1 me-1 ">
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Name</p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <select
                        class="form-select w_90 "
                        value={NewEmployee.BankId}
                        onChange={(e) =>
                          setNewEmployee({
                            ...NewEmployee,
                            BankId: e.target.value,
                          })
                        }
                        aria-label="Default select example"
                      >
                        <option  value="" disabled>Select Bank Name </option>
                        {MasterBankData &&
                          MasterBankData.map((i, key) => (
                            <option key={key} value={i.BankId}>{i.BankName}</option>
                          ))}
                      </select>
                      <br />
                    </div>
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Branch Name</p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.BankBranchName}
                        onChange={(e) =>
                          setNewEmployee({
                            ...NewEmployee,
                            BankBranchName: e.target.value,
                          })
                        }
                      />
                      <br />
                    </div>
                    <div className="col-md_2 col-6 mb-1">
                      <p className=""> Account No</p>
                    </div>
                    <div className="col-md_3 col-6 mb-1">
                      <input
                        class=" w_90 input_field_head"
                        value={NewEmployee.BankAccountNo}
                        onChange={(e) => {
                          const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,14);
                          setNewEmployee({
                            ...NewEmployee,
                            BankAccountNo: TextInput
                          });
                        }}
                        type="text"
                      />
                    </div>
                    <div className="col-md_2 mt-2 col-6 mb-1">
                      <p className=""> IFSC Code</p>
                    </div>
                    <div className="col-md_3  mt-2 col-6 mb-1">
                      <input
                        className="w_90 input_field_head"
                        type="text"
                        value={NewEmployee.IFSCCode}
                        onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"").slice(0, 11);
                        setNewEmployee({
                            ...NewEmployee,
                            IFSCCode: TextInput,
                          })
                        }
                         
                        }
                      />
                      <br />
                    </div>
                      {/*  bank card  input*/}
                      <div className="col-md_2 col-6 mb-1">
                  <p className=""> Bank Photo</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1 h_0">
                    <input
                      className="w_90 input_field_head file-label custom-file-input "
                      type="file"
                      name="img"
                      accept=".jpg, .jpeg, .png, .pdf" 
                       onChange={(e) => {
                        const file = e.target.files[0];
                        const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
                        const fileExtension = file.name.split(".").pop().toLowerCase()
                        console.log("fileExtension",fileExtension)
                        if (!allowedExtensions.includes("." + fileExtension)) {
                          toast.error("Only JPG, JPEG, PNG, and PDF files are allowed.")
                          e.target.value = null;
                       return;
                       }
                        
                       setNewEmployee({
                          ...NewEmployee,
                          BankFile: file,
                          BankPhoto: file.name,

                        });
                      }}
                    />
                    <p>   {EditEmpId !== "" && EditEmpId !== null && EditProjectId !== "" && EditProjectId !== null ? (
                      <a className="mx-2 float-end me-3" target="_blank" rel="noopener noreferrer" href={fileviewdocuments + NewEmployee.BankPhoto}> View ID Proof File </a>
                    ) : ("")}</p>

                    {NewEmployee.BankPhoto ? (
                       <>
                        <div className="d-flex input_file_name">
                          <div class="scrollable-container   " id="custom-scrollbar">
                            <p>{NewEmployee.BankPhoto.name || NewEmployee.BankPhoto}</p>

                          </div>
                        </div>

                      </> ) : (
                      <div id="custom-scrollbar" class="scrollable-container input_file_name">
                        <p className="">No Choose file</p>
                      </div>
                    )}
                    <br />
                  </div>
                  </div>
                </div>
                <div className="row mt-2 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Email</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="email"
                      value={NewEmployee.Email}
                      onChange={(e) =>{
                        setNewEmployee({
                          ...NewEmployee,
                          Email: e.target.value,
                        })
                        let emailrejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                         let emailVal = emailrejex.test(String(e.target.value || NewEmployee.Email).toLocaleLowerCase());
                         setIsEmailValid(emailVal);
                      }
                       
                      }
                    />
                     {isEmailValid == false &&
                      NewEmployee?.Email != "" ? (
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
                  {/* <div className="col-md_2 col-6 mb-1">
                    <p className=""> Phone Number</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input

                      className="w_90 input_field_head"
                      type="text"
                      value={NewEmployee.Phone}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 10);
                        setNewEmployee({
                          ...NewEmployee,
                          Phone: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div> */}
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Mobile Number</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                   <input
                      className="w_90 input_field_head"
                      // maxlength="10"
                      type="text"
                      value={NewEmployee.Mobile}
                      onChange={(e) => {
                        AadharNoValidate(e.target.value, "MOBILE")
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 10);
                        // const newValue = e.target.value.slice(0, 10); // Limit the input to 10 characters
                        setNewEmployee({
                          ...NewEmployee,
                          Mobile: TextInput,
                        });
                      }}
                    /> <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Designation</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                   
                    <select
                      class="form-select w_90 "
                      value={NewEmployee.DesignationId}
                      onChange={(e) =>
                        setNewEmployee({
                          ...NewEmployee,
                          DesignationId: e.target.value,
                        })
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select Designation </option>
                      {DesignationmasterData &&
                        DesignationmasterData.map((i, key) => (
                          <option key={key} value={i.DesignationId}>
                            {i.DesignationName}
                          </option>
                        ))}
                    </select>
                    <br />
                  </div>
                </div>

                <div className="row mt-2 ms-1 me-1 ">
                 
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Reporting Manager</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    {/* <input
                        className="w_90 input_field_head"
                        type="number"
                        value={NewEmployee.ReportingManagerId}
                        onChange={(e) =>
                     setNewEmployee({
                     ...NewEmployee,
                     ReportingManagerId: e.target.value,
                     })
                     }
                     /> */}
                    <select
                      class="form-select w_90 "
                      value={NewEmployee.ReportingManagerId}
                      onChange={(e) =>
                        setNewEmployee({
                          ...NewEmployee,
                          ReportingManagerId: e.target.value,
                        })
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select Reporting Manager </option>
                      {ViewReportingManagerData &&
                        ViewReportingManagerData.map((i, key) => (
                          <option key={key} value={i.EmpId}>{i.EmpName}</option>
                        ))}
                    </select>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Pan card </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      
                      type="text"
                      value={NewEmployee.Pancard}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^a-zA-Z0-9\s]/g,"").slice(0, 10);
                        setNewEmployee({
                          ...NewEmployee,
                          Pancard: TextInput,
                        })
                      }
                       
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                  <p className=""> Pancard Photo</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1 h_0">
                    <input
                      className="w_90 input_field_head file-label custom-file-input "
                      type="file"
                      name="img"
                      accept=".jpg, .jpeg, .png, .pdf" 
                       onChange={(e) => {
                        const file = e.target.files[0];
                        const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
                        const fileExtension = file.name.split(".").pop().toLowerCase()
                        console.log("fileExtension",fileExtension)
                        if (!allowedExtensions.includes("." + fileExtension)) {
                          toast.error("Only JPG, JPEG, PNG, and PDF files are allowed.")
                          e.target.value = null;
                       return;
                       }
                       setNewEmployee({
                          ...NewEmployee,
                          PancardPhotoFile: file,
                          PancardPhoto: file.name,

                        });
                      }}
                    />
                    <p>   {EditEmpId !== "" && EditEmpId !== null && EditProjectId !== "" && EditProjectId !== null ? (
                      <a className="mx-2 float-end me-3" target="_blank" rel="noopener noreferrer" href={fileviewdocuments + NewEmployee.PancardPhoto}> View ID Proof File </a>
                    ) : ("")}</p>

                    {NewEmployee.PancardPhoto ? (
                       <>
                        <div className="d-flex input_file_name">
                          <div class="scrollable-container   " id="custom-scrollbar">
                            <p>{NewEmployee.PancardPhoto.name || NewEmployee.PancardPhoto}</p>

                          </div>
                        </div>

                      </> ) : (
                      <div id="custom-scrollbar" class="scrollable-container input_file_name">
                        <p className="">No Choose file</p>
                      </div>
                    )}
                    <br />
                  </div>
                </div>
                <div className="row mt-2 ms-1 me-1 ">

                  {/* <div className="col-md_2 col-6 mb-1">
                    <p className=""> ID Proof </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <select
                      class="form-select w_90 "
                      value={NewEmployee.IDProof}
                      onChange={(e) => {
                        setidproofkey(e.target.selectedIndex)
                        setNewEmployee({
                          ...NewEmployee,
                          IDProof: e.target.value,
                        })
                      }
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select ID Proof </option>
                      {MasterIDProofsData &&
                        MasterIDProofsData.map((i, key) => (
                          <option data-key={key} key={key} value={i.IDProof}>{i.IDProof}</option>
                        ))}
                    </select>
                    <br />
                  </div> */}

                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Aadhar No</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={NewEmployee.AadharNo}
                      onChange={(e) => {
                        AadharNoValidate(e.target.value, "AADHARNO")
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0, 12);
                        setNewEmployee({
                          ...NewEmployee,
                          AadharNo: TextInput,
                        })
                      }
                      }

                    />
                    <br />
                  </div>
                  {/*  Aadhar card  input*/}
                  <div className="col-md_2 col-6 mb-1">
                  <p className=""> Aadhar Photo</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1 h_0">
                    <input
                      className="w_90 input_field_head file-label custom-file-input "
                      type="file"
                      name="img"
                      accept=".jpg, .jpeg, .png, .pdf" 
                       onChange={(e) => {
                        const file = e.target.files[0];
                        const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
                        const fileExtension = file.name.split(".").pop().toLowerCase()
                        console.log("fileExtension",fileExtension)
                        if (!allowedExtensions.includes("." + fileExtension)) {
                          toast.error("Only JPG, JPEG, PNG, and PDF files are allowed.")
                          e.target.value = null;
                       return;
                       }
                       setNewEmployee({
                          ...NewEmployee,
                          AadharFile: file,
                          AadharPhoto: file.name,

                        });
                      }}
                    />
                    <p>   {EditEmpId !== "" && EditEmpId !== null && EditProjectId !== "" && EditProjectId !== null ? (
                      <a className="mx-2 float-end me-3" target="_blank" rel="noopener noreferrer" href={fileviewdocuments + NewEmployee.AadharPhoto}> View ID Proof File </a>
                    ) : ("")}</p>

                    {NewEmployee.AadharPhoto ? (
                       <>
                        <div className="d-flex input_file_name">
                          <div class="scrollable-container   " id="custom-scrollbar">
                            <p>{NewEmployee.AadharPhoto.name || NewEmployee.AadharPhoto}</p>

                          </div>
                        </div>

                      </> ) : (
                      <div id="custom-scrollbar" class="scrollable-container input_file_name">
                        <p className="">No Choose file</p>
                      </div>
                    )}
                    <br />
                  </div>
                  
                 
                </div>
              </div>
              <div className="cardd pb-4">
                <div className="w-100  mb-2  ">
                  <div
                    className="fs_15 back-colo table_ref_Main h-0  text-white  "
                    colSpan={7}
                  >
                    <p className="p-1 ps-3 pt-2 text-dark fw-bold fs_15 ">Other Details</p>
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Deploy Location </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <select
                      class="form-select w_90 "
                      value={NewEmployee.LocationId}
                      onChange={(e) =>
                        setNewEmployee({
                          ...NewEmployee,
                          LocationId: e.target.value,
                        })
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select Deploy Location </option>
                      {LocationMasterData &&
                        LocationMasterData.map((i, key) => (
                          <option key={key} value={i.LocationId}>{i.LocationName}</option>
                        ))}
                    </select>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Project Name  </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <select
                      class="form-select w_90 "
                      value={NewEmployee.ProjectId}
                      onChange={(e) =>
                        setNewEmployee({
                          ...NewEmployee,
                          ProjectId: e.target.value,
                        })
                      }
                      aria-label="Default select example"
                    >
                      <option  value="" disabled>Select Project </option>
                      {ViewProjectMastersData &&
                        ViewProjectMastersData.map((i, key) => (
                          <option key={key} value={i.ProjectId}>{i.ProjectName}</option>
                        ))}
                    </select>
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Projected DOJ </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      value={moment( NewEmployee.ProjectedDOJ,"MM-DD-YYYY").format("YYYY-MM-DD")}
                      // value={NewEmployee.ApprovedDate}
                      // value={moment(NewEmployee.ApprovedDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        {
                   
                        if(e.target.value == "" ){
                          // toast.error("please enter dob")
                          setNewEmployee({
                          ...NewEmployee,
                          ProjectedDOJ: ""
                        })
                        }else{
                        setNewEmployee({
                          ...NewEmployee,
                          ProjectedDOJ: moment(
                            e.target.value,
                            "YYYY-MM-DD"
                          ).format("MM-DD-YYYY"),
                        })
                      }
                        }}
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-2 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Offer Letter Date </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="date"
                      value={moment(
                        NewEmployee.OfferLetterDate,
                        "MM-DD-YYYY"
                      ).format("YYYY-MM-DD")}
                      // value={ moment(NewEmployee.OfferLetterDate).format("YYYY-MM-DD")}
                      onChange={(e) =>{
                        if(e.target.value === "" ){
                          // toast.error("please enter dob")
                          setNewEmployee({
                          ...NewEmployee,
                          OfferLetterDate: ""
                        })
                        }else{
                          setNewEmployee({
                          ...NewEmployee,
                          OfferLetterDate: moment(
                            e.target.value,
                            "YYYY-MM-DD"
                          ).format("MM-DD-YYYY"),
                        })
                      }
                        
                      }}
                    />
                    <br />
                  </div>
                  {EditEmpId && EditProjectId ? (
                    <>
                      <div className="col-md_2 col-6 mb-1 ">
                        <p className=""> Offer Letter FileName </p>
                      </div>
                      <div className="col-md_3 col-6 mb-2   ">
                      <a className="mx-2 mt-1" target="_blank" rel="noopener noreferrer" href={UpdatedOfferLetterView + NewEmployee.OfferLetterFileName}> View Offer Letter File  </a>
                      

                      
                        <br />
                      </div>
                    </>
                  ) : ""}
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Notice Period</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                  <select  value={NewEmployee.NoticePeriod}  onChange={(e)=>{
                     setNewEmployee({...NewEmployee,NoticePeriod: e.target.value})}}  class="form-select w_90 ">
                  <option value=""  disabled >Select Notice Period</option>
                  {ViewNoticePeriod && ViewNoticePeriod.map((i, key)=>{
                    return (
                      <option  key={key} value={i.NoticePeriod}>{i.NoticePeriod}</option>
                      )
                  })}
                  </select>
                  
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Probation Period </p>
                  </div>

                  <div className="col-md_3 col-6 mb-1">
                  <select  value={NewEmployee.ProbationPeriod}  onChange={(e)=>{
                     setNewEmployee({...NewEmployee,ProbationPeriod: e.target.value})}}  class="form-select w_90 ">
                  <option value=""  disabled >Select Probation Period</option>
                  {ViewProvisionPeriod&&  ViewProvisionPeriod.map((i, key)=>{
                    return (
                      <option key={key} value={i.ProvisionPeriod}>{i.ProvisionPeriod}</option>
                      )
                  })}
                  </select>
                  
                    <br />
                  </div>
                  {/* <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={NewEmployee.ProbationPeriod}
                      onChange={(e) =>{
                        const TextInput = e.target.value.replace(/[^0-9\s]/g,"").slice(0,4);
                        setNewEmployee({
                          ...NewEmployee,
                          ProbationPeriod: TextInput,
                        })
                      }
                        
                      }
                    />
                    <br />
                  </div> */}
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Remark </p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90 input_field_head"
                      type="text"
                      value={NewEmployee.Remark}
                      onChange={(e) =>
                        setNewEmployee({
                          ...NewEmployee,
                          Remark: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                  {/* 
                  <div className="col-md_2 col-6 mb-1">
                     <p className=""> ESIC Contribution Rate</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                     <input
                        className="w_90 input_field_head"
                        type="number"
                        value={NewEmployee.ESIC_ContributionRate}
                        onChange={(e) =>
                     setNewEmployee({
                     ...NewEmployee,
                     ESIC_ContributionRate: e.target.value,
                     })
                     }
                     />
                     <br />
                  </div>
                  */}
                </div>
              </div>
              <div className="w-100 h-100 d-flex justify-content-end p-2">
                {EditEmpId !== "" && EditEmpId !== null && EditProjectId !== "" && EditProjectId !== null ? (
                  <>
                    <button
                      className="btn btn-primary h-100 w_100 btn_size_h  fs_12  ps-4 pe-4"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-primary h-100 w_1 fs_12 mx-3 w_101  px-3 btn_size_h  ms-3  ps-4 pe-4"
                      onClick={(e) => ViewSalary({ EmpId: NewEmployee.EmpId, Projectid: NewEmployee.ProjectId, IsPFDeducted: NewEmployee.IsPFDeducted, IsESIDeducted: NewEmployee.IsESIDeducted })}
                    >
                      View Salary Breakup
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary h-100 w_100 btn_size_h fs_12  ps-4 pe-4"
                    onClick={handleSubmit}
                  >
                    Insert
                  </button>
                )}

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
      </MainContainer>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(NewEmployeeAdd);
