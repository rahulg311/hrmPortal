import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps}  from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Input, Space } from "antd";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import Vaildation from "./Vaildation";
import { LoginUserId } from "../api/AllApi";

const ChangePassword = () => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [UserIds, setUserIds] = useState("");
  const [isValid, setIsValid] = useState(false);
 // GET USER SINGLE CHANGE PASSWORD  DATA 
  const UserChnagePassword = router.query.UserChnagePassword ? JSON.parse(router.query.UserChnagePassword):{}

  // ADMIN ALL USER ID GET WITH CONDATION
  useEffect(() => {
    if(Object.keys(UserChnagePassword).length>0){
      console.log("UserChnagePassword",UserChnagePassword.UserId)
      setUserIds(UserChnagePassword.UserId);
    }

  // Login admin change password
    const UserId = async () => {
      const userid = await LoginUserId();
      console.log("ChangePassword", UserIds);
      setUserIds(userid);
    };
    UserId();
  }, []);

  //  password validation
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setChangePassword({...ChangePassword,NewPassword: newPassword });
      
    // Regular expression to validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    setIsValid(regex.test(newPassword));
  };



// CHANGE PASSWORD  STATE  CODE
  const [ChangePassword, setChangePassword] = useState({
    OldPassword: "",
    NewPassword: "",
    confirmPassword: "",
  
  });

  
// CHANGE PASSWORD  HANDLE STATE 
  const ChangePasswordHandel = async (e) => {
    e.preventDefault();
  
    if(ChangePassword.OldPassword === ""){
      toast.error("Please enter  current password")
      return;
    }
    if(ChangePassword.NewPassword === ""){
      toast.error("Please enter  new password")
      return;
    }

    if(isValid===false){
      toast.error("Please enter a valid password.")
      return
    }
    if(ChangePassword.confirmPassword === ""){
      toast.error("Please enter confirm password")
      return;
    }
    if (ChangePassword.confirmPassword !== ChangePassword.NewPassword) {
      toast.warning("Password do not match.");
      return;
    }
   

    const UpdatePassword = {
      UserId: UserIds,
      OldPassword: ChangePassword.OldPassword,
      NewPassword: ChangePassword.confirmPassword,
    };

    console.log("change password data", UpdatePassword);

    const UpsertMasterCompany = await axios.post(baseUrl + MethodNames.InsertChangedPassword, UpdatePassword)
   .then(async (res) => {
    if (res.data.InsertChangedPassword[0].RecordStatus === "Success") {
      console.log("response", res.data.InsertChangedPassword);
      toast.success(" Password  successfully updated");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      await router.push("/Screen/CreateUser");
    } else {
      toast.error("The current password provided does not match");
    }
  })
  .catch((error) => {
    // Handle any errors that may occur during the POST request
    console.error("Error:", error);
  });







  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-100" : "content-page"}>
          <div className="content  ">
            <div className="container-flui">
              <div class="modal-content  ">
                <div class="modal-header m-0 p-0 p-3 back-color table_ref_head">
                  <h6 class="modal-title m-0 p-0 fs_14 " id="exampleModalLabel">
                    Change Password
                  </h6>

                  {/* <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button> */}
                </div>

                <div className="row   ">
                  <div className="col-md-12 col-12 d-flex justify-content-center  mb-5 pb-5 ">
                    <div className="cardd  m-2 role_scroo w-50 h-100  mt-4 ">
                      {/* <div className=" row ">
                <div className="col-sm-12 col-12 col-md-12   ">
                  <div className=" w-100 back-color table_ref_head">
                    <h3 className="fs_15 back-color table_ref_head text-white p-3">Create User</h3>
                  </div>
                </div>
              </div> */}
                      <h6 className="p-2 py-2 ps-3 bg_gray m-0 p-0">
                        {" "}
                        Change Password
                      </h6>
                      <div className="d-flex justify-content-center w-100">
                        <div className="row p-3  px-4 ">
                          <div className="col-md-12 col-12">
                            <div class="p-1 mt-2 ">
                              <p className="mb-1">Current Password</p>
                              <Input
                                placeholder="Enter current password"
                                value={ChangePassword.OldPassword}
                                onChange={(e) =>
                                  setChangePassword({
                                    ...ChangePassword,
                                    OldPassword: e.target.value,
                                  })
                                }
                                type="text "
                              />

                              
                            </div>
                          </div>
                          <div className="col-md-12 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1"> New Password</p>
                              {/* <Input.Password placeholder="input password" /> */}
                              <Input.Password
                                placeholder="Enter new password"
                                
                                value={ChangePassword.NewPassword}
                                // onChange={(e) =>
                                //   setChangePassword({
                                //     ...ChangePassword,
                                //     confirmPassword: e.target.value,
                                //   })
                                // }
                                onChange={handlePasswordChange}
                                type="password "
                            
                              />
                              
                               {!isValid &&  ChangePassword.NewPassword != ""?  <p className="text-danger text-center"><span className="fs_15 me-2 text-danger">*</span>Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.</p>:""}
                            </div>
                          </div>
                          <div className="col-md-12 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">Confirm Password</p>
                              <Input.Password
                                value={ChangePassword.confirmPassword}
                                onChange={(e) =>
                                  setChangePassword({
                                    ...ChangePassword,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                type="text "
                                // className="w-100 mt-1 inputs "
                                placeholder="Confirm password"
                              />
                            </div>
                            {(ChangePassword.NewPassword && (ChangePassword.NewPassword !==ChangePassword.confirmPassword) && ChangePassword.confirmPassword !="") ? (
                              <p className="text-danger ms-2 ">
                              Password do not match
                              </p>
                            ) : (
                              ""
                            )}
                            {/* {ChangePassword.confirmPassword &&
                            ChangePassword.confirmPassword !==
                              ChangePassword.NewPassword ? (
                              <p className="text-danger ms-2">
                                Password is not match
                              </p>
                            ) : (
                              ""
                            )} */}
                            
                          </div>
                        </div>
                      </div>
                      <div class=" w-100 p-2  ">
                        <button
                          type="button"
                          class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                          data-bs-dismiss="modal"
                        >
                          <a className="text-white" href="/Screen/CreateUser">
                            {" "}
                            Cancel
                          </a>
                        </button>

                        <button
                          onClick={ChangePasswordHandel}
                          type="button"
                          // disabled={disableBtn == false ? false : true}
                          class="btn  btn-primary float-end fs_12 ms-3 "
                        >
                          Change Password
                        </button>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
      {/*  add project mapping code popup */}
    </div>
  );
};

export default ChangePassword;
