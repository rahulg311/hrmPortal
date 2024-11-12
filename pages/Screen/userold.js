import React, { useEffect, useRef, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {mapStateToProps,mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";

import { Button, Input, Space } from "antd";
import {
  Departmentmaster,
  Designationmaster,
  MasterEmployeeData,
  ViewMasterMenu,
} from "../api/AllApi";
import Vaildation from "./Vaildation";

import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare,faChevronRight,faChevronDown,faPlusSquare,faMinusSquare,faFolderOpen,} from "@fortawesome/free-solid-svg-icons";

const UserDetails = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [ViewMasterDepartment, setViewMasterDepartment] = useState("");
  const [ViewMasterDesignation, setViewMasterDesignation] = useState("");

  const [EditBtn, setEditBtn] = useState(false);
  const [loding, setLoding] = useState(true);
  const [SelectMapping, setSelectMapping] = useState([]);
  const [ViewsEmployee, setViewsEmployee] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  // Create user functonlity
  const [CreateUser, setCreateUser] = useState({
    UserName: "",
    UserId: "",
    City: "",
    DesignationId: "",
    DepartmentId: "",
    Mobile: "",
    Email: "",
    PasswordHash: "",
    confirmPassword: "",
    Active: 0,
    CreateBy: "admin",
  });

  //    get upadte user quary
  const updateUser = router.query.updateUser? JSON.parse(router.query.updateUser): {};
  useEffect(() => {
    UpdateMasterMenu();
    // console.log("updateddd----", updateUser.UserStatus);
    // const { UserStatus, ...rest } = updateUser; // Destructure the lastName property and the rest of the object

    // const newArray = {...CreateUser,...rest, Active: UserStatus == "Active" ? 1 : 0};
    // console.log("newArray", newArray);

    // setCreateUser(newArray);
    ViewMasterSingleUser(updateUser)
    if (updateUser) {
      setDisableBtn(true);
    }
    // setViewsEmployee(updateUser.EmpId)
    console.log("update  updateUser", updateUser);
  }, [updateUser]);

  console.log("CreateUser-gggg", CreateUser);


 //  VIEW ALL USER LIST API CALL
  const ViewMasterSingleUser = async (updateUser) => {
    const ProjectUser = {
      OperationType: "ViewSingle",
      UserId: updateUser,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterUsers, ProjectUser)
      .then((res) => {
        if(res && res.data && res.data.ViewMasterUsers[0]){
          const { UserStatus, ...rest } = res.data.ViewMasterUsers[0]; // Destructure the lastName property and the rest of the object

        const newArray = {...CreateUser,...rest, Active: UserStatus == "Active" ? 1 : 0};
        console.log("newArray", newArray);
    
        setCreateUser(newArray);

        }

        
        // setViewMasterAllUser(res.data.ViewMasterUsers);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (CreateUser.PasswordHash !== CreateUser.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    const val = await Vaildation(CreateUser);
    console.log("valerr--------------", val, CreateUser);
    if (!val) {
      return;
    }

    const userData = {
      UserId: CreateUser.UserId,
      UserName: CreateUser.UserName,
      City: CreateUser.City,
      DesignationId: CreateUser.DesignationId,
      DepartmentId: CreateUser.DepartmentId,
      Mobile: CreateUser.Mobile,
      Email: CreateUser.Email,
      PasswordHash: CreateUser.PasswordHash,
      Active: CreateUser.Active,
      CreateBy: CreateUser.CreateBy,
    };
    console.log("CreateUserDataAdd----", userData);
    const CreateUserData = JSON.stringify(userData);
    const CreateUserDataAdd = {
      OperationType: "Add",
      JsonData: CreateUserData,
    };
    console.log("CreateUserDataAdd", CreateUserDataAdd);
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterUsers, CreateUserDataAdd)
      .then((res) => {
        if (res.data.UpsertMasterUsers) {
          toast.success("User added successfully.");
          setDisableBtn(true);
        }
      });
  };
  const UpdateSubmit = async (e) => {
    e.preventDefault();

    // if (CreateUser.PasswordHash !== CreateUser.confirmPassword) {
    //   toast.warning("Passwords do not match");
    //   return;
    // }

    const UpdateUserData = {
      UserId: CreateUser.UserId,
      UserName: CreateUser.UserName,
      City: CreateUser.City,
      DesignationId: CreateUser.DesignationId,
      DepartmentId: CreateUser.DepartmentId,
      Mobile: CreateUser.Mobile,
      Email: CreateUser.Email,
      // PasswordHash: CreateUser.PasswordHash,
      Active: CreateUser.Active,
      CreateBy: CreateUser.CreateBy,
    };
    const val = await Vaildation(UpdateUserData);
    console.log("valerr--------------", UpdateUserData);
    if (!val) {
      return;
    }
    console.log("updatedatata", UpdateUserData);
    const CreUpdateUser = JSON.stringify(UpdateUserData);
    const CreateUserDataUpdate = {
      OperationType: "Update",
      JsonData: CreUpdateUser,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterUsers, CreateUserDataUpdate)
      .then((res) => {
        if (res.data.UpsertMasterUsers) {
          toast.success("Sucessfull Update User");
          // setDisableBtn(true);
        }
      });
  };

  // Start role  create and update all code

  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([2]);
  const [datass, setData] = useState([]);
  const [InsterRole, setInsterRole] = useState([]);
  console.log("datass", datass);

  //   //  meneu list checked upadte
  const UpdateMasterMenu = async () => {
    const UpdateMasterMenus = {
      OperationType: "ViewAll",
      UserId: updateUser || "",
    };
    console.log("UpdateMasterMenus", UpdateMasterMenus);
    const response = await axios
      .post(baseUrl + MethodNames.ViewMasterMenu, UpdateMasterMenus)
      .then((res) => {
        // setChecked(res.data.ViewMasterMenu)
        const val = res.data.ViewMasterMenu;
        console.log("res.data.ViewMasterMenu", res.data.ViewMasterMenu);
        let checkedMenu = [];

        val.forEach((e) => {
          if (e.Checked === 1) {
            checkedMenu.push(e.Id);
            console.log("checkkkk", e.Id);
          }
          // setChecked(7)
        });
        setChecked(checkedMenu);

      });
  };

  //   handle and expend checkbox
  const handleCheck = (newChecked) => {
    setChecked(newChecked);
    let selecetData = []; // Initialize the array to store the values
    newChecked.forEach((element) => {
      if (element > 0) {
        let selecetItem = {
          UserId: CreateUser.UserId,
          Id: element,
        };
        selecetData.push(selecetItem);
      }
    });

    setInsterRole(selecetData);
  };
  useEffect(() => {
    console.log("insert adata-----2", InsterRole); // Output the updated array
  }, [InsterRole]);

  const handleExpand = (newExpanded) => {
    setExpanded(newExpanded);
  };

  //   Get menu for all api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewMasterMenu();
        const menuList = response.data.ViewMasterMenu;
        console.log("menuList", menuList);
        getData(menuList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //   tree Chcekbox str
  function getData(menuList) {
    console.log("value", menuList);
    const data =
      menuList &&
      menuList
        .filter((i) => i.ParentId === 0)
        .map((item) => {
          const hasChildrens = menuList.some(
            (child) => child.ParentId === item.Id
          );
          return {
            value: item.Id,
            label: item.Name,
            id: item.Id,
            parentId: item.ParentId,
            children:
              menuList &&
              menuList
                .filter((child) => child.ParentId === item.Id)
                .map((i) => ({
                  id: i.Id,
                  parentId: i.ParentId,
                  value: i.Id,
                  label: i.Role,
                })),
          };
        });

    setData(data);
  }

  const SubmitRole = async (e) => {
    e.preventDefault();
    console.log("CreateUser0000000------3", InsterRole);
    const UpsertMaster = JSON.stringify(InsterRole);
    console.log("CreateUser0000000------3", UpsertMaster);
    const RoleData = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };
    console.log("RoleData", RoleData, checked);
    if (checked.length > 0) {
      await axios
        .post(baseUrl + MethodNames.UpsertMappingUserRoles, RoleData)
        .then((res) => {
          console.log("payload------ sucess", res.data);

          if (res.data.UpsertMappingUserRoles) {
            toast.success("User added successfully. Right");
            router.push("/Screen/CreateUser");
          }
        });
    } else {
      toast.success("Please Select User Role");
      return;
    }

    //  ViewProjectPayComponents()
  };
  const UpdateRole = async (e) => {
    e.preventDefault();

    const UpsertMaster = JSON.stringify(InsterRole);
    const RoleData = {
      OperationType: "Update",
      JsonData: UpsertMaster,
    };
    console.log("RoleData-update", RoleData);

    await axios
      .post(baseUrl + MethodNames.UpsertMappingUserRoles, RoleData)
      .then((res) => {
        console.log("RoleData-update sucess", res.data);

        if (res.data.UpsertMappingUserRoles) {
          router.push("/Screen/CreateUser");
        }
      });
    //  ViewProjectPayComponents()
  };

  // End role create and update all code

  // End  create create user all code
  useEffect(() => {
    // ViewMasterUser();
    ViewEmplyee();
  }, []);

  const ViewEmplyee = async () => {
    const ViewDepartmentmaster = await Departmentmaster();
    const ViewDesignationmaster = await Designationmaster();
    setViewMasterDepartment(ViewDepartmentmaster.data.ViewMasterDepartment);
    setViewMasterDesignation(ViewDesignationmaster.data.ViewMasterDesignation);
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
                  {EditBtn == false ? (
                    <h6
                      class="modal-title m-0 p-0 fs_14 "
                      id="exampleModalLabel"
                    >
                      Create User
                    </h6>
                  ) : (
                    <h6
                      class="modal-title m-0 p-0 fs_14 "
                      id="exampleModalLabel"
                    >
                      Edit User
                    </h6>
                  )}
                  {/* <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button> */}
                </div>

                <div className="row   ">
                  <div className="col-md-7 col-12">
                    <div className="cardd m-2 role_scroo ">
                      {/* <div className=" row ">
                  <div className="col-sm-12 col-12 col-md-12   ">
                    <div className=" w-100 back-color table_ref_head">
                      <h3 className="fs_15 back-color table_ref_head text-white p-3">Create User</h3>
                    </div>
                  </div>
                </div> */}
                      <h6 className="p-2 py-2 ps-3 bg_gray m-0 p-0">
                        {" "}
                        User Role
                      </h6>
                      <div className="d-flex justify-content-center w-100">
                        <div className="row p-3  px-4 ">
                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2 ">
                              <p className="mb-1">User Name</p>
                              <Input
                                placeholder="input User Name"
                                value={CreateUser.UserName}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    UserName: e.target.value,
                                  })
                                }
                                type="text "
                              />

                              {/* <select
                                  class="form-select w "
                                  value={CreateUser.EmpId}
                                  onChange={(e) =>
                                    setCreateUser({
                                      ...CreateUser,
                                      EmpId: e.target.value,
                                    })
                                  }
                                  aria-label="Default select example"
                                >
                                  <option  value="" disabled>
                                    Please Select Employee{" "}
                                  </option>
                                  {ViewsEmployee &&
                                    ViewsEmployee.map((i, key) => (
                                      <option value={i.EmpId}>
                                        {i.EmpName}
                                      </option>
                                    ))}
                                </select> */}
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">User Id</p>
                              <Input
                                placeholder="input User Name"
                                value={CreateUser.UserId}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    UserId: e.target.value,
                                  })
                                }
                                type="text "
                                // className="w-100 mt-1 inputs inputss "
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2 mt-2">
                              <p className="mb-1">Mobile No</p>
                              <Input
                                placeholder="input Mobile No"
                                value={CreateUser.Mobile}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    Mobile: e.target.value,
                                  })
                                }
                                min="1"
                                max="5"
                                // className="w-100 mt-1 inputs inputss "
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">Email</p>
                              <Input
                                value={CreateUser.Email}
                                placeholder="input Email"
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    Email: e.target.value,
                                  })
                                }
                                type="email "
                                // className="w-100 mt-1 inputs inputss  "
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">DesignationId Name</p>

                              <select
                                class="form-select w "
                                value={CreateUser.DesignationId}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    DesignationId: e.target.value,
                                  })
                                }
                                aria-label="Default select example"
                              >
                                <option  value="" disabled>
                                  Please Select Designation Name
                                </option>
                                {ViewMasterDesignation &&
                                  ViewMasterDesignation.map((i, key) => (
                                    <option key={key} value={i.DesignationId}>
                                      {i.DesignationName}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">DepartmentId Name</p>

                              <select
                                class="form-select w "
                                value={CreateUser.DepartmentId}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    DepartmentId: e.target.value,
                                  })
                                }
                                aria-label="Default select example"
                              >
                                <option  value="" disabled>
                                  Please Select Department Name
                                </option>
                                {ViewMasterDepartment &&
                                  ViewMasterDepartment.map((i, key) => (
                                    <option key={key} value={i.DepartmentId}>
                                      {i.DepartmentName}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1"> City</p>
                              <Input
                                value={CreateUser.City}
                                placeholder="input Email"
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    City: e.target.value,
                                  })
                                }
                                type="text "
                                // className="w-100 mt-1 inputs inputss  "
                              />
                            </div>
                          </div>
                          {updateUser=="" && updateUser==undefined  ? "" :
                          <>
                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">Password</p>
                              {/* <Input.Password placeholder="input password" /> */}
                              <Input.Password
                                placeholder="input password"
                                value={CreateUser.confirmPassword}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                type="password "
                                // className="w-100 mt-1 inputs"
                              />
                            </div>
                          </div>
                          
                          <div className="col-md-6 col-12">
                            <div class="p-1 mt-2">
                              <p className="mb-1">Confirm Password</p>
                              <Input.Password
                                value={CreateUser.PasswordHash}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    PasswordHash: e.target.value,
                                  })
                                }
                                type="text "
                                // className="w-100 mt-1 inputs "
                                placeholder="Confirm password"
                              />
                            </div>
                            {CreateUser.confirmPassword &&
                            CreateUser.confirmPassword !==
                              CreateUser.PasswordHash ? (
                              <p className="text-danger ms-2">
                                Password is not match
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          </>
                          }
                          <div className="col-md-6 col-12">
                            <div class="modal-body  pt-0 mt-1 d-flex">
                              <input
                                class="form-check-inpu "
                                checked={CreateUser.Active === 1 ? true : false}
                                // checked={CreateUser.Active == "Active"? true :false}
                                // defaultChecked={updateUser.UserStatus == "Active"? true :false}
                                onChange={(e) => {
                                  setCreateUser({
                                    ...CreateUser,
                                    Active: e.target.checked == true ? 1 : 0,
                                  });
                                }}
                                type="checkbox"
                              />

                              <p className="ms-2 ">Active</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class=" w-100 p-2 mb-4">
                        {updateUser=="" && updateUser==undefined ? (
                          <>
                            <button
                              type="button"
                              class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                              // data-bs-dismiss="modal"
                            >
                              <a
                                className="text-white"
                                href="/Screen/CreateUser"
                              >
                                {" "}
                                Cancel
                              </a>
                            </button>

                            <button
                              data-bs-dismiss="modal"
                              onClick={UpdateSubmit}
                              type="button"
                              class="btn w_150 btn-primary float-end fs_12 ms-3 "
                            >
                              Update
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSubmit}
                              type="button"
                              disabled={disableBtn == false ? false : true}
                              class="btn w_150 btn-primary float-end fs_12 ms-3 "
                            >
                              Insert
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 col-12">
                    <div className="car">
                      <div className="col-sm-12  p-2   ">
                        {/* <div className=" row ">
                  <div className="col-sm-12 col-12 col-md-12   ">
                    <div className=" w-100 back-color table_ref_head">
                      <h3 className="fs_15 back-color table_ref_head text-white p-3">Role</h3>
                    </div>
                  </div>
                </div> */}
                        <div className=" ">
                          <h6 className="p-2 py-2 ps-3 bg_gray m-0 p-0">
                            {" "}
                            User Role
                          </h6>
                          <div className="cardd px-2 role_scrool">
                            <CheckboxTree
                              nodes={datass}
                              checked={checked}
                              expanded={expanded}
                              disabled={disableBtn == false ? true : false}
                              icons={{
                                check: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-check"
                                    icon={faCheckSquare}
                                  />
                                ),
                                uncheck: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-uncheck"
                                    icon={faSquare}
                                  />
                                ),
                                halfCheck: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-half-check"
                                    icon={faCheckSquare}
                                  />
                                ),
                                expandClose: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-expand-close"
                                    icon={faChevronRight}
                                  />
                                ),
                                expandOpen: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-expand-open"
                                    icon={faChevronDown}
                                  />
                                ),
                                expandAll: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-expand-all"
                                    icon={faPlusSquare}
                                  />
                                ),
                                collapseAll: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-collapse-all"
                                    icon={faMinusSquare}
                                  />
                                ),
                                parentClose: (
                                  <FontAwesomeIcon className="rct-icon rct-icon-parent-close" />
                                ),
                                parentOpen: (
                                  <FontAwesomeIcon
                                    className="rct-icon rct-icon-parent-open"
                                    icon={faFolderOpen}
                                  />
                                ),
                                leaf: (
                                  <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" />
                                ),
                              }}
                              onCheck={handleCheck}
                              onExpand={handleExpand}
                            />
                            <div class=" w-100 p-2 mt-5">
                              {updateUser ? (
                                <>
                                  <button
                                    type="button"
                                    class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                                    data-bs-dismiss="modal"
                                  >
                                    <a
                                      className="text-white"
                                      href="/Screen/CreateUser"
                                    >
                                      {" "}
                                      Cancel
                                    </a>
                                  </button>
                                  <button
                                    data-bs-dismiss="modal"
                                    onClick={UpdateRole}
                                    type="button"
                                    // disabled={disableBtn == false ? true : false}
                                    class="btn w_150 btn-primary float-end fs_12 ms-3 "
                                  >
                                    Update
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    data-bs-dismiss="modal"
                                    onClick={SubmitRole}
                                    type="button"
                                    disabled={
                                      disableBtn == false ? true : false
                                    }
                                    class="btn w_150 btn-primary float-end fs_12 ms-3 "
                                  >
                                    Insert
                                  </button>
                                  <button
                                    type="button"
                                    class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                                    data-bs-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
