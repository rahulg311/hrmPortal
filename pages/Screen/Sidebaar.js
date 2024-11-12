import React, { useState, useEffect } from "react";

import Footer from "../footer";
import MainContainer from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { LoginUserId, ViewMasterMenu } from "../api/AllApi";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

// import logos from "../../"
const Sidebaar = (props) => {
  const dispatch = useDispatch();
  const [UserDetails, setUserDetails] = useState("");
  const router = useRouter();
  const currentPath = router.asPath;
  const pathname = router.pathname;

  const pathArray = pathname.split('/');
  const currentPage = pathArray[pathArray.length - 1];

  let words = currentPage.split(/(?=[A-Z])/);
  let CurrentPages = words.join(" ")
  console.log("currentPage----", CurrentPages);

  //   const currentPage = pathArray[pathArray.length - 1];

  // user id get in login
  useEffect(() => {
    // router.replace(currentPage, undefined, { shallow: true })
    const UserId = async () => {
      const userid = await LoginUserId();
      UserLoginDetsils(userid);
    };
    UserId();
  }, []);

  //     capitalizeFirstLetter user name
  function capitalizeFirstLetter(text) {
    if (!text || text.length === 0) {
      return text; // Return empty texting or null if input is empty or null
    }

    const words = text.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  }
  //  useEffect(()=>{
  //    Logout()
  //    router.push("/")
  //  },[])

  const Logout = () => {
    sessionStorage.clear();
    toast.warning("Please selected PayComponentCode");
    router.push("/");
  };

  const [ViewMasterMenus, setViewMasterMenu] = useState("");
  const open = useSelector((state) => state.projectR.sideClick);
  const showProject = useSelector((state) => state.projectR.sideClick);
  let usershow = props.show || false;
  //  user profile in login icon and name

  //  View MasterUsers
  const UserLoginDetsils = async (userid) => {
    const ProjectUser = {
      OperationType: "ViewSingle",
      UserId: userid,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterUsers, ProjectUser)
      .then((res) => {
        setUserDetails(
          res &&
            res.data &&
            res.data.ViewMasterUsers[0] &&
            res.data.ViewMasterUsers[0].UserName
        );
      });
  };

  useEffect(() => {
    ViewMaster();
    console.log("openSidebar---", open);
  }, [open]);

  useEffect(() => {
    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
      });
    }
  });
  //  view master menu list on api  call
  const ViewMaster = async () => {
    const data = await ViewMasterMenu();
    console.log("data.data.ViewMasterMenu", data.data.ViewMasterMenu);
    setViewMasterMenu(data.data.ViewMasterMenu);
  };

  // menu list item code
  const MenuItem = ({ item }) => {
    const hasChildrens = ViewMasterMenus.some(
      (child) => child.ParentId === item.Id
    );

   //  console.log("item.ImagePathu+item.ImagePath", item.IconUrl, item.ImagePath);
    return (
      <li className="text-danger ">
        <div className="icon-link  ">
          <a className="me-4" href={item.URL}>
            <i className="bx ">
           
              <img
                className="bx bx-bulb"
                width={16}
                height={16}
                src={item.IconUrl + item.ImagePath}
              />
            </i>

            <span className="link_name" href={item.URL}>
              {item.Name}
            </span>
          </a>
          {/* <img width={16} height={16} src={item.IconUrl+item.ImagePath}/> */}
          <i className="bx bxs-chevron-down arrow"></i>
        </div>
        <ul className="sub-menu   p-0 m-0  "
//          style={{    height: "300px" , background:"ffff",
//     overflowY: "scroll"
// }}
>
          <li className="  p-0 m-0 mt_10 ">
            <a className="link_name ms-4 ps-1  me-5   " href={item.URL}>
              {item.Name}
            </a>
            <ul className="bg-dange slider_bg  mt_10 m-0 p-0"       
//                 style={{    maxHeight: "700px" , background:"ffff",
//    overflowY: "scroll"
//  }}
 >
              {hasChildrens && (
                <>
                  {ViewMasterMenus.map((child, key) => {
                    if (child.ParentId === item.Id && child.Checked === 1) {
                      return (
                        <li className="pe-4  " key={key}>
                          {/* chlid_icon */}
                          <a className=" ms-2" href={child.URL}>
                            <i className="bx bx-bar-char">
                              {" "}
                              <img
                                className="m-2 me-3"
                                width={16}
                                height={16}
                                src={child.IconUrl + child.ImagePath}
                              />
                            </i>

                            {child.Name}
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </ul>
          </li>
        </ul>
      </li>
    );
  };
  return (
    <MainContainer>
      <div id="wrapper">
        <ToastContainer />
        <div className="navbar-custom">
          <div className="container-fluid">
            <div className={open ? "width_0" : "logo-box "}>
              <a href="#" className="logo logo-dark text-center"></a>
              <a href="#" className="logo logo-light text-center">
                <span className="logo-lg logo-lgs ">
                  <img
                    className={open ? "logo_none" : "logo-bos my-2 ml-0"}
                    src="https://www.in.cpm-int.com/hubfs/CPM_Theme_2021/images/home_Page/CPM%20Logo.svg"
                    alt=""
                  />
                </span>
              </a>
            </div>
            <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
              <li>
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
              </li>
              <li className=" d-none d-xl-block">
                <span className="nav-link waves-effect waves-light">
                  {CurrentPages}
                  <i className="mdi mdi-chevron-down" />
                </span>
              </li>

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
            <p
              className="float-end me-4 mt-1 btn btn-primary fss_11 m-0 p-0 px-3 py-1"
              onClick={() => Logout()}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="fw-none ms-1 mt-3">Logout</span>
            </p>
            <p className="float-end me-4 mt-2 fs_1 ">
              <FontAwesomeIcon icon={faUser} />
              <span className="fw-none ms-1 mt-3">
                {capitalizeFirstLetter(UserDetails)}
              </span>
            </p>
          </div>
        </div>
        <div className={open ? "sidebar close" : "sidebar"}>
          <ul className="nav-links mt-5">
            {ViewMasterMenus &&
              ViewMasterMenus.filter((item) => item.ParentId === 0) // Filter top-level menu items
                .sort((a, b) => a.SortOrder - b.SortOrder) // Sort based on SortOrder
                .map((item) => <MenuItem key={item.Id} item={item} />)}
          </ul>
        </div>
      </div>
    </MainContainer>
  );
};
export default Sidebaar;
