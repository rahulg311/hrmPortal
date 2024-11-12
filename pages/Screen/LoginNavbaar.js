import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import MainContainer from "../components/Container";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const LoginNavbaar = () => {
  // const [open, setOpen] = useState(false);
  //  let  functions={[open, setOpen]}
  const dispatch = useDispatch();
  //   const open = useSelector((state) => state.projectR.sideClick);

  //   useEffect(() => {
  //     console.log("openSidebar---", open);
  //   }, [open]);

  return (
    <MainContainer>
      <div id="wrapper">
        <div className="navbar-custom ">
          <div className="container-fluid">
            <ul className="list-unstyled topnav-menu float-end mb-0">
              <li className="d-none d-lg-block">
                <form className="app-search">
                  <div className="app-search-box dropdown">
                    <div
                      className="dropdown-menu dropdown-lg"
                      id="search-dropdown"
                    >
                      <div className="dropdown-header noti-title">
                        <h5 className="text-overflow mb-2">Found 22 results</h5>
                      </div>
                      <a className="dropdown-item notify-item">
                        <i className="fe-home me-1" />
                        <span>Analytics Report</span>
                      </a>
                      <a className="dropdown-item notify-item">
                        <i className="fe-aperture me-1" />
                        <span>How can I help you?</span>
                      </a>
                      <a className="dropdown-item notify-item">
                        <i className="fe-settings me-1" />
                        <span>User profile settings</span>
                      </a>
                      <div className="dropdown-header noti-title">
                        <h6 className="text-overflow mb-2 text-uppercase">
                          Users
                        </h6>
                      </div>
                      <div className="notification-list">
                        <a className="dropdown-item notify-item">
                          <div className="d-flex align-items-start">
                            <img
                              className="d-flex me-2 rounded-circle"
                              src="images/user-2.jpg"
                              alt="Generic placeholder image"
                              height={32}
                            />
                            <div className="w-100">
                              <h5 className="m-0 font-14">Erwin E. Brown</h5>
                              <span className="font-12 mb-0">UI Designer</span>
                            </div>
                          </div>
                        </a>
                        <a className="dropdown-item notify-item">
                          <div className="d-flex align-items-start">
                            <img
                              className="d-flex me-2 rounded-circle"
                              src="images/user-5.jpg"
                              alt="Generic placeholder image"
                              height={32}
                            />
                            <div className="w-100">
                              <h5 className="m-0 font-14">Jacob Deo</h5>
                              <span className="font-12 mb-0">Developer</span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </li>
              <li className="dropdown d-inline-block d-lg-none">
                <a
                  className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="fe-search noti-icon" />
                </a>
                <div className="dropdown-menu dropdown-lg dropdown-menu-end p-0">
                  <form className="p-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                      aria-label="Recipient's username"
                    />
                  </form>
                </div>
              </li>

              <li className="dropdown notification-list d-flex">
                <a className="nav-link  nav-user me-0 waves-effect waves-light">
                  <img
                    src="https://mttest.parinaam.in/images/nykaa_logo.svg"
                    alt="user-image"
                    className="rounded-circle bg-white"
                  />
                </a>
                <select
                  class="form-selects form-select"
                  aria-label="Default select example"
                >
                  <option selected>Nyakaa</option>
                  <span class="navbar-toggler-icon"></span>
                  <option value="1">
                    <a class="dropdown-item text-center" href="#">
                      Nestle
                    </a>
                  </option>
                  <option value="2">
                    <a class="dropdown-item text-center" href="#">
                      Abbott
                    </a>
                  </option>
                  <option value="3">
                    <a class="dropdown-item text-center" href="#">
                      Nyakaa
                    </a>
                  </option>
                </select>
              </li>
              <li className="dropdown notification-list topbar-dropdown">
                <a
                  className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <img
                    src="https://mttest.parinaam.in/images/user-1.jpg"
                    alt="user-image"
                    className="rounded-circle"
                  />
                  <span className="pro-user-name ms-1">
                    Mohsin Ansari
                    {/* <span className="material-icons">expand_more</span> */}
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Welcome !</h6>
                  </div>
                  <a className="dropdown-item notify-item">
                    <span className="material-icons me-2">person</span>
                    <span className="fs_12">My Account</span>
                  </a>
                  <a className="dropdown-item notify-item">
                    <span className="material-icons me-2">settings</span>
                    <span className="fs_12">Settings</span>
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item notify-item">
                    <span className="material-icons fs_12 me-2">logout</span>
                    <span className="fs_12">Logout</span>
                  </a>
                </div>
              </li>
              {/* <li className="dropdown notification-list">
                <a className="nav-link waves-effect waves-light">
                  <span className="material-icons">dark_mode</span>
                </a>
              </li> */}
            </ul>
            {/* <div className={open ? "width_0" : "logo-box"}> */}
            <div className="logo-box">
              <a href="#" className="logo logo-dark text-center">
                <span className="logo-sm">
                  <img
                    src="https://mttest.parinaam.in/images/nestle_logo.svg"
                    alt=""
                    height={22}
                  />
                </span>
                <span className="logo-lg">
                  <img
                    src="https://mttest.parinaam.in/images/nestle_logo.svg"
                    alt=""
                    height={20}
                  />
                </span>
              </a>
              <a href="#" className="logo logo-light text-center">
                <span className="logo-sm">
                  <img src="../images/logo-sm.png" alt="" height={22} />
                </span>
                <span className="logo-lg logo-lgs ">
                  <img
                    // className={open ? "logo_none" : "logo-bos"}
                    className="logo-bos"
                    // src="https://mttest.parinaam.in/images/nestle_logo.svg"
                    src={"/assets/images/parinaam_tag_line.png"}
                    alt=""
                    height={40}
                  />
                </span>
              </a>
            </div>
            <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
              {/* <li>
                <button
                  className="button-menu-mobile waves-effect waves-light"
                  onClick={() => {
                    dispatch({
                      type: "SIDE_CLICK",
                      payload: !open,
                    });
                  }}
                >
                  <span className="material-icons">menu</span>
                </button>
              </li> */}
              {/* <li className=" d-none d-xl-block">
                <span className="nav-link waves-effect waves-light">
                  Dashboard
                  <i className="mdi mdi-chevron-down" />
                </span>
              </li> */}
              <li>
                <a
                  className="navbar-toggle nav-link"
                  data-bs-toggle="collapse"
                  data-bs-target="#topnav-menu-content"
                >
                  <div className="lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default LoginNavbaar;
