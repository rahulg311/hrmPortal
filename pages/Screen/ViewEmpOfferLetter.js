import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import {
  EmailBase,
  GetUserId,
  baseUrl,
  userId,
  nodeBaseurl,
  uploadFileView,
} from "../../src/constants/constants";
import { LoginUserId, stateMasterApi } from "../api/AllApi";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Vaildation from "./Vaildation";
import { publicRuntimeConfig } from "../../next.config";
import imageOffer from "../HRM_Images/offer_letter_logo.png";
import CpmAddress from "../HRM_Images/address.png";
import HrSignature from "../HRM_Images/Signature_DGM_HR.jpg";
import Image from "next/image";

const ViewEmpOfferLetter = (props) => {
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
  const ref = React.createRef();
  const [load, setLoad] = useState(false);
  const ViewEmpOfferLetter = router.query.ViewEmpOfferLetter
    ? JSON.parse(router.query.ViewEmpOfferLetter)
    : "";

  console.log("EmpIdOfferLetter on load---:", ViewEmpOfferLetter);

  //   view offerletter path
  const fileviewOfferletter = uploadFileView + "offerletters/";

  const [showStatus, setShowStatus] = useState("");
  console.log(" revoke and unrevoke showStatus-----", showStatus &&showStatus[0].OfferLetterFileName);

  //   render data in api call
  const [viewLetter, setviewLetter] = useState("");
  console.log("viewLetter.EmpId---------", viewLetter);

  useEffect(() => {
    setviewLetter(ViewEmpOfferLetter.filename);
    setLoad(true);
    // EmpOfferLetterBasicInfo(EmpIdOfferLetter || ViewEmpOfferLetter);
    // EmpOfferTempletes();
    // ShowStatus(ViewEmpOfferLetter.EmpId)
  }, [ViewEmpOfferLetter]);

  useEffect(() => {
    ShowStatus();
  }, [ViewEmpOfferLetter.EmpId]);

  //  revoke and unrevoke status show
  const ShowStatus = async (epmid) => {
    const postdata = {
      EmpId: ViewEmpOfferLetter.EmpId,
    };

    const response = await axios
      .post(baseUrl + MethodNames.EmpOfferLetterBasicInfo, postdata)
      .then((res) => {
        setShowStatus(res.data.EmpOfferLetterBasicInfo);
      })
      .catch((err) => console.log("error setShowStatus", err));
  };

  // Revoke service call
  const EmpRevok = async () => {
    const EmpOfferLetter = {
      EmpId: ViewEmpOfferLetter.EmpId,
    };
    await axios
      .post(baseUrl + MethodNames.EmpOfferRevoke, EmpOfferLetter)
      .then(async (res) => {
        console.log("suceesful Revoke", res.data.EmpOfferRevoke);
        await senMail("revoke");
        ShowStatus(ViewEmpOfferLetter.EmpId);
        // toast.success("Successfully revoke");
        // setEmpOfferDocumentList(res.data.EmpOfferRevoke);
      });
  };

  // Revoke service call
  const EmpUnRevok = async () => {
    const EmpOfferLetter = {
      EmpId: ViewEmpOfferLetter.EmpId,
    };
    await axios
      .post(baseUrl + MethodNames.EmpOfferUnRevoke, EmpOfferLetter)
      .then((res) => {
        console.log("suceesful unRevoke", res.data.EmpOfferUnRevoke);
        // senMail("unrevoke");
        ShowStatus(ViewEmpOfferLetter.EmpId);
        toast.success("Successfully unrevoke");
      });
  };
  //  send mail api node js
  const senMail = async (type) => {
    const userid = await LoginUserId();
    const emailData = {
      EmpId: ViewEmpOfferLetter.EmpId,
      TempleteId: Selectempletes,
      revoke: "revoke",
      flag: type,
      UserId: userid,
    };
    console.log("nodeBaseurl", nodeBaseurl + MethodNames.SendMail, emailData);
    await axios
      .post(nodeBaseurl + MethodNames.SendMail, emailData)
      .then((res) => {
        console.log("suceesful offer letter res", res);
        let { success, Error } = res.data;
        if (success == true) {
          toast.success("Offer letter successfully revoked and employment offer sent via email!");
        } else {
          toast.error(`Request is failed`);
        }
      })
      .catch((e) => {
        toast.error(e);
        console.log("send mail error:", e);
      });
  };
  console.log(
    "fileviewOfferletter+viewLetter",
    fileviewOfferletter + viewLetter
  );

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
{
  showStatus &&showStatus[0].OfferLetterFileName ?
<>
                    {showStatus && showStatus[0].RevokeStatus === "N" ? (
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
                    ) : (
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
                    )}  </>: ""
}

                    {/* <div className=" fw-bold float-start mt-2 ms-5 w_401   fs_12  btn_h_3  ">
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
                    </div> */}
                  </div>
                </div>
              </div>
              {load == true ? (
                <iframe
                  src={fileviewOfferletter + viewLetter}
                  height="600"
                  width="100%"
                  title="Iframe Example"
                ></iframe>
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewEmpOfferLetter);
