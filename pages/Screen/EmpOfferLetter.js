import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { EmailBase,GetUserId,baseUrl,userId,nodeBaseurl} from "../../src/constants/constants";
import { LoginUserId, stateMasterApi } from "../api/AllApi";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Vaildation from "./Vaildation";
import { publicRuntimeConfig } from "../../next.config";
import imageOffer from "../HRM_Images/offer_letter_logo.png";
import CpmAddress from "../HRM_Images/address.png";
import HrSignature from "../HRM_Images/Signature_DGM_HR.jpg";
import Image from "next/image";

const EmpOfferLetterBasic = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  //  get projectid and emp id on create new employee
  const { EmpIdOfferLetter } = router.query;
  const [EmpOfferList, setEmpOfferList] = useState("");
  const [EmpOfferDocumentList, setEmpOfferDocumentList] = useState("");
  const [EmpOfferDeduction, setEmpOfferDeduction] = useState("");
  const [EmpOfferEarning, setEmpOfferEarning] = useState("");
  const [EmpOfferNetSalary, setEmpOfferNetSalary] = useState("");
  const [EmpOfferContribution, setEmpOfferContribution] = useState("");
  const [EmpOfferLetterTempletes, setEmpOfferLetterTempletes] = useState("");
  const [EmpOfferEarningOthers, setEmpOfferEarningOthers] = useState("");
  const [Selectempletes, setSelectempletes] = useState(1);
  const [PdfDownloadAhow, setPdfDownloadAhow] = useState(false);
  const ref = React.createRef();
  const ViewEmpOfferLetter = router.query.ViewEmpOfferLetter;
  console.log("EmpIdOfferLetter on load---:", EmpIdOfferLetter);

//  window back page clear  code
useEffect(() => {
  const clearHistory = () => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    };
  };

  clearHistory();

  return () => {
    window.onpopstate = null; // Cleanup on component unmount
  };
}, []);

//   render data in api call

  useEffect(() => {
    EmpOfferLetterBasicInfo(EmpIdOfferLetter || ViewEmpOfferLetter);
    EmpOfferTempletes();
 }, [EmpIdOfferLetter, ViewEmpOfferLetter]);

//   useEffect(()=>{
//     ShowStatus(ViewEmpOfferLetter)
// },[ViewEmpOfferLetter])

  // get curreent date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so add 1 to get the actual month (e.g., 8 for August)
  const day = currentDate.getDate();
  const formattedDate = `${day < 10 ? '0' : ''}${day}-${
    month < 10 ? '0' : ''
  }${month}-${year}`;
  console.log(formattedDate);

//  revoke and unrevoke status show
// const ShowStatus = async (epmid)=>{
//   const postdata = {
//       EmpId: epmid,
//     };
  
//   const response = await axios
//   .post(baseUrl + MethodNames.EmpOfferLetterBasicInfo, postdata)
//   .then((res) => {
//     setShowStatus(res.data.EmpOfferLetterBasicInfo);
    
//   })
//   .catch(() => console.log("error setShowStatus"));
// }

  // total count EmpOfferEarningTotal
  const EmpOfferEarningTotal =EmpOfferEarning && EmpOfferEarning.reduce((acc, curr) => acc + curr.PayCompValue, 0);
  const EmpOfferDeductionTotal =EmpOfferDeduction && EmpOfferDeduction.reduce((acc, curr) => acc + curr.PayCompValue, 0);



  //  Get Empid on view offerLettar
  const EmpOfferLetterBasicInfo = async (Empids) => {
    console.log("Empids", Empids);
    if(Empids==null || Empids==''){
      return;
    }

    
    console.log("offerletter file name",Empids)
    const postdata = {
      EmpId: Empids,
    };

    console.log("EmpOfferLetterBasicInfo postdata:",postdata);
    // EmpOfferDocumentList api call
    await axios
      .post(baseUrl + MethodNames.EmpOfferDocumentList, postdata)
      .then((res) => {
        setEmpOfferDocumentList(res.data.EmpOfferDocumentList);
      })
      .catch(() => console.log("error EmpOfferDocumentList"));
    // EmpOfferLetterBasicInfo api call
    const response = await axios
      .post(baseUrl + MethodNames.EmpOfferLetterBasicInfo, postdata)
      .then((res) => {
        setEmpOfferList(res.data.EmpOfferLetterBasicInfo);
      })
      .catch(() => console.log("error EmpOfferLetterBasicInfo"));
    // EmpOfferLetterDeduction api call
    await axios.post(baseUrl + MethodNames.EmpOfferLetterDeduction, postdata)
      .then((res) => {
        setEmpOfferDeduction(res.data.EmpOfferLetterDeduction);
      })
      .catch(() => console.log("error EmpOfferLetterDeduction"));
    // EmpOfferLetterEarning
    await axios
      .post(baseUrl + MethodNames.EmpOfferLetterEarning, postdata)
      .then((res) => {
        setEmpOfferEarning(res.data.EmpOfferLetterEarning);
      })
      .catch(() => console.log("error EmpOfferLetterEarning"));
    // EmpOfferLetterGrossAndNetSalary
    await axios
      .post(
        baseUrl + MethodNames.EmpOfferLetterGrossAndNetSalary,
        postdata
      )
      .then((res) => {
        setEmpOfferNetSalary(res.data.EmpOfferLetterGrossAndNetSalary);
      })
      .catch(() => console.log("error EmpOfferLetterGrossAndNetSalary"));
    //  EmpOfferLetterEmployerContribution
    await axios
      .post(
        baseUrl + MethodNames.EmpOfferLetterEmployerContribution,
        postdata
      )
      .then((res) => {
        setEmpOfferContribution(res.data.EmpOfferLetterEmployerContribution);
      })
      .catch(() => console.log("error EmpOfferLetterGrossAndNetSalary"));

    //  EmpOfferLetterEarningOthers
    await axios.post(baseUrl + MethodNames.EmpOfferLetterEarningOthers, postdata)
      .then((res) => {
        setEmpOfferEarningOthers(res.data.EmpOfferLetterEarningOthers);
      })
      .catch(() => console.log("error EmpOfferLetterEarningOthers"));
  };

  //  select offerletterTemplate change
  const EmpOfferTempletes = async () => {
    const EmpOfferLetter = {
      EmpId: 0,
    };
    // EmpOfferLetterTempletes api call
    await axios
      .post(baseUrl + MethodNames.EmpOfferLetterTempletes, EmpOfferLetter)
      .then((res) => {
        setEmpOfferLetterTempletes(res.data.EmpOfferLetterTempletes);
      })
      .catch(() => console.log("error EmpOfferLetterTempletes"));
  };

  // Downloade pdf click on node js service
  const handleClick = async (e) => {
    e.preventDefault();
      const userid = await LoginUserId();
    const EmpOfferLetter = {
      // EmpId: 4,
      EmpId: EmpIdOfferLetter,
    };
    console.log("EmpIdOfferLetter id ", EmpIdOfferLetter || ViewEmpOfferLetter);
    window.open(`${nodeBaseurl}createPdf?empId=${EmpIdOfferLetter || ViewEmpOfferLetter}&UserId=${userid}`);
    // window.open(`http://localhost:3000/OfferLetters/Nishant_Rajput_3_08-10-2023.PDF`);
  };

  // Revoke service call
  // const EmpRevok = async () => {
  //   const EmpOfferLetter = {
  //     EmpId: EmpIdOfferLetter || ViewEmpOfferLetter,
  //   };
  //   await axios
  //     .post(baseUrl + MethodNames.EmpOfferRevoke, EmpOfferLetter)
  //     .then(async(res) => {
  //       console.log(
  //         "suceesful Revoke",
  //         res.data.EmpOfferRevoke,
  //         EmpIdOfferLetter || ViewEmpOfferLetter
  //       );
  //       await senMail("revoke");
  //       ShowStatus(ViewEmpOfferLetter)
  //       toast.success("Successfull Revoke");
  //       // setEmpOfferDocumentList(res.data.EmpOfferRevoke);
  //     });
  // };

  // Revoke service call
  // const EmpUnRevok = async () => {
  //   const EmpOfferLetter = {
  //     EmpId: EmpIdOfferLetter || ViewEmpOfferLetter,
  //   };
  //   await axios
  //     .post(baseUrl + MethodNames.EmpOfferUnRevoke, EmpOfferLetter)
  //     .then((res) => {
  //       console.log(
  //         "suceesful unRevoke",
  //         res.data.EmpOfferUnRevoke,
  //         EmpIdOfferLetter || ViewEmpOfferLetter
  //       );
  //       // senMail("unrevoke");
  //       ShowStatus(ViewEmpOfferLetter)
  //       toast.success("Successfully unrevoke");

  //     });
  // };

  //  send mail api node js
  const senMail = async (type) => {
    const userid = await LoginUserId();
    const emailData = {
      EmpId: EmpIdOfferLetter || ViewEmpOfferLetter,
      TempleteId: Selectempletes,
      revoke: "revoke",
      flag:type,
      UserId:userid
    };
    console.log("nodeBaseurl", nodeBaseurl + MethodNames.SendMail, emailData);
    await axios
      .post(nodeBaseurl + MethodNames.SendMail, emailData)
      .then((res) => {
        console.log("suceesful offer letter res", res);
        let { success, Error } = res.data;
        if (success == true) {
          toast.success("Emp offer letter sent successfully via email");
        } else {
          toast.error(`Emp offer letter is failed`);
        }
      })
      .catch((e) => {
        toast.error(e);
        console.log("send mail error:", e);
      });
  };

  return (
    <div className="h100 ">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-100" : "content-page"}>
          <div className="content  ">
            <div className="container-flui">
              <div class="modal-content border-0  ">
                <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
                  <div className="w-100">
                    <h3 className="float-start  fs_15 back-  text-whitea p-3">
                      Offer Letter
                    </h3>
                    {/* {EmpIdOfferLetter > 0 ? (
                      <> */}
                        <div className="float-end  mt-1 me-1">
                          <Popconfirm
                            title="Are you sure Send Emp Offer Letter?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => senMail("sendmail")}
                          >
                            <button className="p-1   bt mt-2 btn-primary btn_size fs_12 fw-none ">
                              Send Mail
                            </button>
                          </Popconfirm>
                        </div>
                        <div className="fs_15  ">
                        
                        <div className="  float-end mt-1 me-1 btn_size me-2 fs_12  btn_h_3 ">
                            <button
                              onClick={handleClick}
                              className=" p-1 bt mt-2 me-1 btn-primary btn_size fs_12 fw-none  "
                            >
                              Download
                            </button>
                          </div>
                  </div>

                      {/* </>
                    ) : (
                      <> */}
                      {/* {
                        showStatus && showStatus[0].RevokeStatus === "N" ?
                      
                        <div className="float-end  mt-2 me-1">
                          <Popconfirm
                            title="Are you sure Send Emp Offer Letter?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => EmpRevok()}
                             >
                            <button
                              className="p-1   bt mt-1 btn-primary btn_size fs_12 fw-none "
                              // onClick={() => EmpRevok()}
                            >
                              Revoke
                            </button>
                          </Popconfirm>
                        </div>
                        :
                        <div className="float-end  mt-2 me-1">
                          <Popconfirm
                            title="Are you sure Send Emp Offer Letter?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => EmpUnRevok()}
                          >
                            <button
                              className="p-1   bt mt-1 btn-primary btn_size fs_12 fw-none "
                              // onClick={() => EmpRevok()}
                            >
                              UnRevoke
                            </button>
                          </Popconfirm>
                        </div>
                      }
                      </>
                    )} */}
                    <div className=" fw-bold float-start mt-2 ms-5 w_401   fs_12  btn_h_3  ">
                      Report Type
                      <select
                        class="form-select w-50 ms-3 "
                        value={Selectempletes}
                        onChange={(e) => {
                          setSelectempletes(e.target.value);
                    }}
                        aria-label="Default select example"
                      >
                        <option value={1} selected>
                          Select Templates
                        </option>
                        {EmpOfferLetterTempletes &&
                          EmpOfferLetterTempletes.map((i, key) => (
                            <option key={key} value={i.OfferTempleteId}>
                              {i.OfferTemplete}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
               
              </div>
              {Selectempletes == 1 ? (
                <div
                  className="d-flex justify-content-center w-100 pt-3 mt-3"
                  style={{
                    fontWeight: "500",
                    height: "480px",
                    backgroundColor: '#fff',
                    backgroundClip: 'border-box',
                    border: '1px solid rgba(0, 0, 0, 0.125)',
                    borderRadius: '0.25rem',
                  }}
                >
                  <div className="row   ">
                    <div
                      className="col-md-12 col-12  h-100"
                      style={{ fontWeight: "500", overflowY: "scroll" }}
                    >
                      <div
                        className=""
                        style={{
                          fontWeight: "500",
                          width: "100%",
                          height: "530px",
                          overflowY: "overlay",
                        }}
                      >
                        <div
                          id="page1-div"
                          style={{
                            fontWeight: "500",
                            position: 'relative',
                            width: '810px',
                            height: '1080px',
                            margin: '0% 0%',
                            border: '2px solid gray',
                          }}
                        >
                          <div>
                            <div
                              id="page1-div"
                              style={{
                                fontWeight: "500",
                                backgroundColor: '#e4e3e3',
                                borderBottom: '0px solid gray',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '5px 0px',
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginTop: '1%',
                                  marginBottom: '0%',
                                }}
                              >
                                <Image
                                  width={200}
                                  height={65}
                                  src={imageOffer}
                                  alt="background image"
                                />
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginTop: '1%',
                                  marginBottom: '0%',
                                }}
                              >
                                <Image
                                  height={62}
                                  src={CpmAddress}
                                  alt="background image"
                                />
                                {/* <p> CPM INDIA SALES & MARKETING PVT. LTD <br/>B-227, UPPER GROUND FLOOR, OKHLA PHASE </p> */}
                              </div>
                            </div>
                            <div
                              style={{
                                fontWeight: "500",
                                backgroundColor: 'rgb(238, 237, 237)',
                                borderBottom: '1px solid gray',
                                height: '20px',
                                width: '100%',
                              }}
                            ></div>
                            <div style={{ fontWeight: "500", padding: "30px" }}>
                              <div style={{ height: "100%" }}>
                                {EmpOfferList &&
                                  EmpOfferList.map((item) => {
                                    return (
                                      <>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {" "}
                                          <b style={{ fontWeight: "800" }}>
                                            Date:
                                          </b>{" "}
                                          <b style={{ fontWeight: "400" }}>
                                            {" "}
                                            {formattedDate}
                                          </b>{" "}
                                        </p>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            marginTop: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {item.EmpName}{" "}
                                        </p>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {item.CurrentAddress} &nbsp;
                                          {item.CurrentCity} {item.CurState}
                                          &nbsp; Pin Code {item.CurrentPincode}
                                        </p>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            marginTop: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Re : Offer for the post of&nbsp;
                                          <b>
                                            {item.DesignationName}
                                            <br />
                                          </b>
                                          Dear&nbsp;<b>{item.EmpName} </b>
                                          <br />
                                        </p>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            marginTop: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          We are pleased to make an offer to you
                                          on behalf of CPM India Sales &
                                          Marketing Pvt Ltd.
                                        </p>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            marginTop: "5px",
                                          }}
                                        >
                                          for the position of&nbsp;
                                          <b>{item.DesignationName}</b>
                                        </p>
                                        {EmpOfferNetSalary &&
                                          EmpOfferNetSalary.map((i, key) => {
                                            return (
                                              <p
                                                key={key}
                                                style={{
                                                  fontWeight: "500",
                                                  fontSize: "14px",
                                                  marginTop: "5px",
                                                }}
                                              >
                                                The Position carries CTC salary
                                                of Rs.<b>{i.Yctc} Per Annum.</b>{" "}
                                              </p>
                                            );
                                          })}
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          In event of your resignation or
                                          termination of services, either side
                                          will have to give{" "}
                                          <b style={{ fontWeight: "800" }}>
                                            {item.NoticePeriod}
                                          </b>{" "}
                                          <br />
                                          notice or salary in lieu thereof.{" "}
                                        </p>
                                      </>
                                    );
                                  })}
                                <div
                                  style={{
                                    fontWeight: "500",
                                    paddingLeft: "0px",
                                    paddingRight: "20px",
                                    marginTop: "10px",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "14px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    Your appointment will be subject to your
                                    furnishing the following documents and
                                    verification of the same{" "}
                                  </p>
                                </div>
                                {EmpOfferDocumentList &&
                                  EmpOfferDocumentList.map((item) => {
                                   
                                    return (
                                      <>
                                        <p
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {item.DocName}
                                        </p>
                                      </>
                                    );
                                  })}
                              </div>
                              <p
                                style={{
                                  fontWeight: "500",
                                  fontSize: "14px",
                                  marginTop: "15px",
                                }}
                              >
                                Kindly sign and return the duplicate copy of
                                this letter.
                              </p>
                              {EmpOfferList &&
                                EmpOfferList.map((item) => {
                                  return (
                                    <>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          fontSize: "14px",
                                          marginTop: "5px",
                                        }}
                                      >
                                        We expect you to join your duties on{" "}
                                        <b style={{ fontWeight: "800" }}>
                                          {item.ProjectedDOJ}
                                        </b>
                                      </p>

                                      {/* <p style={{fontWeight:"500", fontSize:"14px",marginTop:"10px"}}>You shall be on a probation period of <b>{item.ProbationPeriod}</b> day’s with the Company. </p> */}
                                    </>
                                  );
                                })}
                              <div>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: "250px",
                                    height: "200px",
                                    marginTop: "25px",
                                    marginLeft: "23px",
                                    width: "250px",
                                    height: "62px",
                                  }}
                                >
                                  <Image
                                    style={{
                                      fontWeight: "500",
                                      backgroundColor: 'rgb(211, 211, 211)',
                                    }}
                                    width={140}
                                    height={53}
                                    src={HrSignature}
                                    alt="background image"
                                  />
                                </div>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    marginTop: "15px",
                                  }}
                                  className="ft13"
                                >
                                  With best wishes&nbsp;
                                  <br />
                                  For CPM India Sales &amp; Marketing Pvt Ltd.
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    marginTop: "15px",
                                  }}
                                  className="ft16"
                                >
                                  Acceptance of the offer letter:
                                  <br />I will be able to join from
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    position: 'absolute',
                                    top: '982px',
                                    left: '646px',
                                    whiteSpace: 'nowrap',
                                  }}
                                  className="ft11"
                                >
                                  Signature
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    position: 'absolute',
                                    top: '1015px',
                                    left: '38px',
                                    whiteSpace: 'nowrap',
                                  }}
                                  className="ft11"
                                >
                                  Name
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    position: 'absolute',
                                    top: '1015px',
                                    left: '646px',
                                    whiteSpace: 'nowrap',
                                  }}
                                  className="ft11"
                                >
                                  Date
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div
                          id="page1-div"
                          style={{
                            fontWeight: "500",
                            position: 'relative',
                            width: '810px',
                            height: '1080px',
                            marginTop: "20px",
                            margin: '0% 0%',
                            border: '1px solid gray',
                          }}
                        >
                          <div>
                            <div
                              id="page1-div"
                              style={{
                                fontWeight: "500",
                                backgroundColor: '#e4e3e3',
                                borderBottom: '0px solid gray',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '5px 0px',
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginTop: '1%',
                                  marginBottom: '0%',
                                }}
                              >
                                <Image
                                  width={200}
                                  height={65}
                                  src={imageOffer}
                                  alt="background image"
                                />
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginTop: '1%',
                                  marginBottom: '0%',
                                }}
                              >
                                <Image
                                  height={62}
                                  src={CpmAddress}
                                  alt="background image"
                                />
                              </div>
                            </div>
                            <div
                              style={{
                                fontWeight: "500",
                                backgroundColor: 'rgb(238, 237, 237)',
                                borderBottom: '1px solid gray',
                                height: '20px',
                                width: '100%',
                              }}
                            ></div>
                            {EmpOfferList &&
                              EmpOfferList.map((item) => {
                                return (
                                  <>
                                    <div>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '125px',
                                          left: '68px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>Name</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '125px',
                                          left: '192px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>{item.EmpName}</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '154px',
                                          left: '68px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>Designation</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '153px',
                                          left: '192px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>{item.DesignationName}</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '180px',
                                          left: '68px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>Location</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '180px',
                                          left: '192px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>{item.DeployLocation}</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '210px',
                                          left: '68px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>W.E.F</b>
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "500",
                                          position: 'absolute',
                                          top: '210px',
                                          left: '192px',
                                          whiteSpace: 'nowrap',
                                        }}
                                        className="ft20"
                                      >
                                        <b>{item.ProjectedDOJ}</b>
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            <div
                              style={{ fontWeight: "500", marginTop: "-20px" }}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  width: '93%',
                                  display: 'flex',
                                }}
                                className="div_table"
                              >
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: '50%',
                                    margin: '0% 1%',
                                  }}
                                >
                                  <table>
                                    <tbody>
                                      <tr>
                                        <td
                                          style={{
                                            fontWeight: "800",
                                            paddingLeft: "40%",
                                            backgroundColor: "#dddddd",
                                          }}
                                          colSpan={2}
                                          className="ft21 border_table"
                                        >
                                          Earning
                                        </td>
                                      </tr>
                                      {EmpOfferEarning &&
                                        EmpOfferEarning.map((i) => {
                                          return (
                                            <>
                                              <tr className="border_table">
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child ft22"
                                                >
                                                  {" "}
                                                  {i.PayCompName}
                                                </td>
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child th_center ft22"
                                                >
                                                  {i.PayCompValue}
                                                </td>
                                                {/* <td style={{fontWeight:"600"}} className="border_table nth_child th_center ft22">totel </td> */}
                                              </tr>
                                            </>
                                          );
                                        })}
                                      <tr>
                                        <td
                                          style={{ fontWeight: "800" }}
                                          className="border_table nth_child ft22"
                                        >
                                          Total Earning
                                        </td>
                                        <td
                                          style={{ fontWeight: "800" }}
                                          className="border_table nth_child th_center ft22"
                                        >
                                          {EmpOfferEarningTotal}
                                        </td>
                                      </tr>
                                      {/* <tr className="border_table nth_child">
<td className="border_table nth_child ft22">HRA</td>
<td className="border_table nth_child th_center ft22">3879.00</td>
</tr>
<tr className="border_table nth_child">
<td className="border_table nth_child ft22">Stat Bonus</td>
<td className="border_table nth_child th_center ft22">897.00</td>
</tr>
<tr className="border_table nth_child">
<td className="border_table nth_child ft22"> <b style={{fontWeight:"800"}}>Gross Monthly Salary</b></td>
<td className="border_table nth_child th_center ft22"> <b style={{fontWeight:"800"}}>15539.00</b></td>
</tr> */}
                                    </tbody>
                                  </table>
                                </div>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: '50%',
                                    margin: '0% 1%',
                                  }}
                                >
                                  <table>
                                    <tbody>
                                      <tr className="border_table nth_child">
                                        <td
                                          colSpan={2}
                                          style={{
                                            fontWeight: "800",
                                            paddingLeft: '40%',
                                            backgroundColor: "#dddddd",
                                          }}
                                          className="ft21"
                                        >
                                          Deduction
                                        </td>
                                      </tr>
                                      {EmpOfferDeduction &&
                                        EmpOfferDeduction.map((i) => {
                                          return (
                                            <>
                                              <tr className="border_table nth_child">
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child ft22"
                                                >
                                                  {i.PayCompCode}
                                                </td>
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child th_center  ft22"
                                                >
                                                  {i.PayCompValue}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      <tr>
                                        <td
                                          style={{ fontWeight: "800" }}
                                          className="border_table nth_child ft22"
                                        >
                                          Total Deduction
                                        </td>
                                        <td
                                          style={{ fontWeight: "800" }}
                                          className="border_table nth_child th_center ft22"
                                        >
                                          {EmpOfferDeductionTotal}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  width: '93%',
                                  marginTop: '2px',
                                  display: 'flex',
                                }}
                                className="div_table"
                              >
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: '100%',
                                    margin: '0% 1%',
                                  }}
                                >
                                  <table>
                                    <tbody>
                                      <tr className="border_table nth_child">
                                        {EmpOfferNetSalary &&
                                          EmpOfferNetSalary.map((i) => {
                                            return (
                                              <>
                                                <td className="border_table nth_child ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    Net Take Home
                                                  </b>
                                                </td>
                                                <td
                                                  className="border_table nth_child th_center ft22"
                                                  style={{
                                                    fontWeight: "800",
                                                    width: '14.5%',
                                                  }}
                                                >
                                                  <b>{i.NetSalary}</b>
                                                </td>
                                              </>
                                            );
                                          })}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  width: '93%',
                                  display: 'flex',
                                }}
                                className="div_table"
                              >
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: '48%',
                                    margin: '0.5% 1%',
                                  }}
                                >
                                  <table>
                                    <tbody>
                                      <tr className="border_table nth_child">
                                        <td
                                          style={{
                                            fontWeight: "800",
                                            paddingLeft: '40%',
                                            backgroundColor: "#dddddd",
                                          }}
                                          colSpan={2}
                                          className="ft21"
                                        >
                                          Statutory Benefit
                                        </td>
                                      </tr>
                                      {EmpOfferContribution &&
                                        EmpOfferContribution.map((i) => {
                                          console.log("hghghg", i);
                                          return (
                                            <>
                                              <tr className="border_table nth_child">
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child ft22"
                                                >
                                                  {i.CompName}
                                                </td>
                                                <td
                                                  style={{ fontWeight: "600" }}
                                                  className="border_table nth_child th_center ft22"
                                                >
                                                  {i.CompValue}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      {EmpOfferNetSalary &&
                                        EmpOfferNetSalary.map((i) => {
                                          return (
                                            <>
                                              <tr className="border_table nth_child">
                                                <td className="border_table nth_child ft22">
                                                  {" "}
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    Gross Monthly Salary
                                                  </b>
                                                </td>
                                                <td className="border_table nth_child th_center ft22">
                                                  {" "}
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    {i.GrossSalary}
                                                  </b>
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  width: '93%',
                                  marginTop: '2px',
                                  display: 'flex',
                                }}
                                className="div_table"
                              >
                                <div
                                  style={{
                                    fontWeight: "500",
                                    width: '48%',
                                    margin: '0% 1%',
                                  }}
                                >
                                  <table>
                                    <tbody>
                                      {EmpOfferNetSalary &&
                                        EmpOfferNetSalary.map((i) => {
                                          return (
                                            <>
                                              <tr>
                                                <td className="border_table nth_child ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    Cost to the Company
                                                  </b>
                                                </td>
                                                <td className="border_table nth_child th_center ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    {i.Mctc}
                                                  </b>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td className="border_table nth_child ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    Annual Cost to the Company
                                                  </b>
                                                </td>
                                                <td className="border_table nth_child th_center ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    {i.Yctc}
                                                  </b>
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                  <table className="mt-2">
                                    <tbody>
                                      {EmpOfferEarningOthers &&
                                        EmpOfferEarningOthers.map((i) => {
                                          return (
                                            <>
                                              <tr>
                                                <td className="border_table nth_child ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    {i.PayCompName}
                                                  </b>
                                                </td>
                                                <td className="border_table nth_child th_center ft22">
                                                  <b
                                                    style={{
                                                      fontWeight: "800",
                                                    }}
                                                  >
                                                    {i.PayCompValue}
                                                  </b>
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  position: 'absolute',
                                  bottom: '100px',
                                  left: '65px',
                                }}
                              >
                                <Image
                                  style={{
                                    fontWeight: "500",
                                    backgroundColor: 'rgb(211, 211, 211)',
                                  }}
                                  width={140}
                                  height={53}
                                  src={HrSignature}
                                  alt="background image"
                                />
                              </div>
                              <p
                                style={{
                                  fontWeight: "500",
                                  position: 'absolute',
                                  bottom: '65px',
                                  left: '87px',
                                  whiteSpace: 'nowrap',
                                }}
                                className="ft20"
                              >
                                <b style={{ fontWeight: "800" }}>
                                  Sheetal Mahajan
                                </b>
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  position: 'absolute',
                                  bottom: '45px',
                                  left: '67px',
                                  whiteSpace: 'nowrap',
                                }}
                                className="ft22"
                              >
                                Deputy General Manager – HR
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  position: 'absolute',
                                  bottom: '65px',
                                  left: '572px',
                                  whiteSpace: 'nowrap',
                                }}
                                className="ft20"
                              >
                                {/* <b style={{fontWeight:"800"}}>Debprosad &nbsp;Ghorami</b> */}
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  position: 'absolute',
                                  bottom: '45px',
                                  left: '582px',
                                  whiteSpace: 'nowrap',
                                }}
                                className="ft22"
                              >
                                Employee Signature
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* </div> */}
      </MainContainer>
      {/*  add project mapping code popup */}
    </div>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmpOfferLetterBasic);
