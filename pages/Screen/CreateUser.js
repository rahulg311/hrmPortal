import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import { Button, Input, Popconfirm, Space } from "antd";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { Icon } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import KeyIcon from "@mui/icons-material/Key";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Link from "next/link";

const CreateUser = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewMasterAllUser, setViewMasterAllUser] = useState("");

  useEffect(() => {
    ViewMasterUser();
  }, []);

  //  SINGLE USER UNLOCK
  const LockUser = async (userId) => {
    const LockUserId = {
      UserId: userId,
    };
    await axios
      .post(baseUrl + MethodNames.UpsertUnlockUser, LockUserId)
      .then((res) => {
        console.log(
          "response unlock uuser",
          res.data.UpsertUnlockUser[0].RecordStatus
        );
        if (res.data.UpsertUnlockUser[0].RecordStatus === "Success") {
          toast.success("Successful Unlock this User ");
          ViewMasterUser();
        }
      })
      .catch((error) => console.log("error user list ", error));
  };

  //  VIEW ALL USER LIST API CALL
  const ViewMasterUser = async () => {
    const ProjectUser = {
      OperationType: "ViewAll",
      UserId: 0,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterUsers, ProjectUser)
      .then((res) => {
        setViewMasterAllUser(res.data.ViewMasterUsers);
      }).catch((error) => console.log("error user list ViewAll ", error));
  };

  // CHANGE SIGNLE USER PASSWORD POPUP CODE
  const openModel = (user) => {
    router.push(
      {
        pathname: "/Screen/ChangePassword",
        query: { UserChnagePassword: JSON.stringify(user) },
      },
      undefined
    );
  };

  // EDIT SIGNLE USER DETAILS
  const openModelUser = (user) => {
    router.push(
      {
        pathname: "/Screen/UserDetails",
        query: {
          updateUser: JSON.stringify({ UserId: user.UserId, UserEdit: true }),
        },
      },
      undefined
    );
  };

  // Add SIGNLE USER DETAILS
  const addModelUser = () => {
    router.push(
      {
        pathname: "/Screen/UserDetails",
        query: { AddUserId: JSON.stringify({ UserIdAdd: true }) },
      },
      undefined
    );
  };

  // SEARCH  USER DETAILS
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewMasterAllUser.filter((item) => {
        return (
          Object.values(item).splice(0, 1).join("").includes(searchValue1) &&
          Object.values(item)
            .join("")
            .toLocaleLowerCase()
            .includes(searchValue2.toLocaleLowerCase())
        );
      });
      setSearchFliter(filterDepartment);
    }
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2 vh-100" : "content-page"}>
          <div className="content  ">
            <div className="container-fluid">
              <div className="cardd">
                <div className="col-sm-12  p-2   ">
                  <div className=" row ">
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className=" w-100 back-color table_ref_head">
                        <h3 className="fs_15 back-color table_ref_head text-white p-3">
                          User List
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15  table_ref_head ">
                        <button
                          type="button"
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 "
                        >
                          <a
                            className="link_name text-white"
                            // href="./UserDetails"
                            onClick={() => addModelUser({ UserIdAdd: true })}
                          >
                            <i className="bx bx-plus ms-1 mt-1"></i> Add New
                            User
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">User Id</th>
                          <th className="text-center">User Name</th>
                          <th className="text-center">Designation Name</th>
                          <th className="text-center">Department Name </th>

                          <th className="text-center">City </th>
                          <th className="text-center">User Status </th>
                          <th className="text-center">Change Password </th>
                          <th className="text-center">Lock User </th>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            {/* <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            /> */}
                          </td>
                          <td></td>
                          <td></td>
                        </tr>

                        {searchInput.length != "" ||
                        searchInput2.length != "" ? (
                          <>
                            {SearchFliter &&
                              SearchFliter.map((i, key) => {
                                const isActive = i.UserStatus === "Active";

                                const isLocked = i.LoginStatus === "Locked";
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() =>
                                              openModelUser(i.UserId)
                                            }
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
                                      <td>{i.UserId}</td>
                                      <td>{i.UserName}</td>
                                      <td>{i.DesignationName}</td>
                                      <td>{i.DepartmentName}</td>

                                      <td>{i.City}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <Icon
                                          className={`material-icons ${
                                            isActive
                                              ? "link-success"
                                              : "link-error"
                                          }`}
                                          style={{ fontSize: "17px" }}
                                        >
                                          {isActive ? "check_circle" : "cancel"}
                                        </Icon>
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        <Popconfirm
                                          // style={{width:":200px"}}
                                          // className="me-5"
                                          title="Confirm password change?"
                                          okText="Yes"
                                          cancelText="No"
                                          onConfirm={() => openModel(i)}
                                        >
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="Change Password"
                                          >
                                            <KeyIcon
                                              style={{ fontSize: "17px" }}
                                              className="material-icons link-success "
                                            >
                                              lock
                                            </KeyIcon>
                                          </a>
                                        </Popconfirm>
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        {" "}
                                        {isLocked ? (
                                          <Popconfirm
                                            title="Are you sure UnLock this User?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => LockUser(i.UserId)}
                                            // onClick={() => openModel(i)}
                                          >
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#exampleModal"
                                              data-bs-whatever="@mdo"
                                              href="#"
                                              className=" p-1"
                                              title="Lock"
                                            >
                                              <LockPersonIcon
                                                style={{ fontSize: "17px" }}
                                                className={`material-icons ${
                                                  isLocked
                                                    ? "link-success"
                                                    : "link-error"
                                                }`}
                                              />
                                            </a>
                                          </Popconfirm>
                                        ) : (
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="Unlock"
                                          >
                                            <LockOpenIcon
                                              className="material-icons link-success "
                                              style={{ fontSize: "17px" }}
                                            />
                                          </a>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewMasterAllUser &&
                              ViewMasterAllUser.map((i, key) => {
                                const isActive = i.UserStatus === "Active";
                                const isLocked = i.LoginStatus === "Locked";

                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() =>
                                              openModelUser({
                                                UserId: i.UserId,
                                              })
                                            }
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
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
                                      <td>{i.UserId}</td>
                                      <td>{i.UserName}</td>
                                      <td>{i.DesignationName}</td>
                                      <td>{i.DepartmentName}</td>

                                      <td>{i.City}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <Icon
                                          className={`material-icons ${
                                            isActive
                                              ? "link-success"
                                              : "link-error"
                                          }`}
                                          style={{ fontSize: "17px" }}
                                        >
                                          {isActive ? "check_circle" : "cancel"}
                                        </Icon>
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        <Popconfirm
                                          // style={{width:":200px"}}
                                          // className="me-5"
                                          title="Confirm password change?"
                                          okText="Yes"
                                          cancelText="No"
                                          onConfirm={() => openModel(i)}
                                          // onClick={() => openModel(i)}
                                        >
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="Change Password"
                                          >
                                            <KeyIcon
                                              style={{ fontSize: "17px" }}
                                              className="material-icons link-success "
                                            >
                                              lock
                                            </KeyIcon>
                                          </a>
                                        </Popconfirm>
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        {" "}
                                        {isLocked ? (
                                          <Popconfirm
                                            title="Are you sure UnLock this User?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => LockUser(i.UserId)}
                                            // onClick={() => openModel(i)}
                                          >
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#exampleModal"
                                              data-bs-whatever="@mdo"
                                              href="#"
                                              className=" p-1"
                                              title="Lock"
                                            >
                                              <LockPersonIcon
                                                style={{ fontSize: "17px" }}
                                                className={`material-icons ${
                                                  isLocked
                                                    ? "link-success"
                                                    : "link-error"
                                                }`}
                                              />
                                            </a>
                                          </Popconfirm>
                                        ) : (
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            data-bs-whatever="@mdo"
                                            href="#"
                                            className=" p-1"
                                            title="Unlock"
                                          >
                                            <LockOpenIcon
                                              className="material-icons link-success "
                                              style={{ fontSize: "17px" }}
                                            />
                                          </a>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
