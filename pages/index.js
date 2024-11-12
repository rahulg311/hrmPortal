import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import MainContainer from "./components/Container";
import sessionstorage from "sessionstorage";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { MethodNames } from "../src/constants/methodNames";
import { baseUrl } from "../src/constants/constants";
import Vaildation from "./Screen/Vaildation";
// import cpmindiamlogo from "../assets/CPM_Logo Primary_Black";
import Image from "next/image";
import cpmindiamlogo from "../public/assets/images/cpm_logo.png";

function Home() {
  const router = useRouter();
  //  Change slide sigin and signup sate
  const [state, setState] = useState(false);
  const [LockedUserCheck, setLockedUserCheck] = useState("");

  //  Login user details  state
  const [UserLogin, setUserLogin] = useState({
    UserId: "",
    Password: "",
  });

  // user check lockd and unloked service check
  const LockedUser = async (data) => {
    const LockedUsers = {
      OperationType: "ViewSingle",
      UserId: data,
    };
    const UpsertMasterLock = await axios
      .post(baseUrl + MethodNames.ViewMasterUsers, LockedUsers)
      .then((res) => {
        let resData =
          res &&
          res.data &&
          res.data.ViewMasterUsers &&
          res.data.ViewMasterUsers[0] &&
          res.data.ViewMasterUsers[0].LoginStatus;
        console.log("resData", resData);
        setLockedUserCheck(resData);
      })
      .catch((error) => {
        toast.error("Network Error", error);
      });
  };

  //  user Login submit  code
  const handelLogin = async (e) => {
    // e.preventDefault();
    // check locked user
    LockedUser(UserLogin.UserId);

    if (UserLogin.UserId === "") {
      toast.error("Username required");
      return;
    }
    if (UserLogin.Password === "") {
      toast.error("Password required");
      return;
    }
    if (LockedUserCheck === "Locked") {
      toast.error(
        "This user is locked. Please connect with the HR team for assistance"
      );
      return;
    }
    // const val = await Vaildation(UserLogin);
    //   if (!val) {
    //     return;
    //   }

    const loginUserData = {
      UserId: UserLogin.UserId,
      Password: UserLogin.Password,
    };
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UserLogin, loginUserData)
      .then((res) => {
        if (res.data.UserLogin[0].RecStatus === "Success") {
          console.log("response", res.data.UserLogin);
          sessionStorage.setItem("UserDetails", UserLogin.UserId);
          toast.success("Login Successful");
          setTimeout(() => {
            router.push("/Screen/Home");
          }, 1000);
        } else {
          toast.error("Please enter a valid password");
        }
      })
      .catch((error) => {
        toast.error("Network Error", error);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handelLogin();
    }
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <div className="w-100 h-100">
          <main className={styles.login_illustration}>
            <div class={`${styles.h100} container `}>
              <ToastContainer />
              <div
                className={`${styles.h100}  row justify-content-center align-items-center `}
              >
                <div class="col-sm-12 p-0 col-md-12 col-10">
                  <div class="row justify-content-center">
                    <div
                      class={`${styles.cards} ${styles.shadow}  col-sm-12 col-md-8 col-lg-6 col-xl-4`}
                    >
                      <Image
                        height={50}
                        width={300}
                        src={cpmindiamlogo}
                        alt="Description of the image"
                      />

                      <p class="text-center text-muted mt-3">
                        Sign in to your account
                      </p>
                      <div class="myForm mt-4 needs-validation" novalidate="">
                        <div class="form-group mb-3">
                          <label class="input w-100 ">
                            <Input
                              // value={useremail}
                              type="text"
                              value={UserLogin.UserId}
                              onChange={(e) =>
                                setUserLogin({
                                  ...UserLogin,
                                  UserId: e.target.value,
                                })
                              }
                              placeholder=" Username"
                              onKeyPress={handleKeyPress}
                            />
                          </label>
                        </div>
                        <div class="form-group">
                          <label class="input w-100">
                            <Input.Password
                              placeholder=" Password"
                              value={UserLogin.Password}
                              onKeyPress={handleKeyPress}
                              onChange={(e) =>
                                setUserLogin({
                                  ...UserLogin,
                                  Password: e.target.value,
                                })
                              }
                            />

                            <span class="input__label"></span>
                            <div class="invalid-feedback">
                              Please enter Password
                            </div>
                          </label>
                        </div>
                        <div class="form-group">
                          <p class="mb-0 mt-3">
                            {/* <a href="#" class="primary_color"> */}
                            Forgot Password?
                            {/* </a> */}
                          </p>
                        </div>
                        <div class="form-group">
                          <button
                            class="btn btn-primary w-100 mt-4  "
                            type="submit"
                            onClick={handelLogin}
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </MainContainer>
    </div>
  );
}

export default Home;
