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
  LoginUserId,
  MasterEmployeeData,
  ViewMasterMenu,
} from "../api/AllApi";
import Vaildation from "./Vaildation";

import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faSquare,
  faChevronRight,
  faChevronDown,
  faPlusSquare,
  faMinusSquare,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

const UserDetails = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [ViewMasterDepartment, setViewMasterDepartment] = useState("");
  const [ViewMasterDesignation, setViewMasterDesignation] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [Render, setRender] = useState(false);

  //    get upadte user quary
  const updateUser = router.query.updateUser
    ? JSON.parse(router.query.updateUser)
    : {};
    const AddUserIds = router.query.AddUserId? JSON.parse(router.query.AddUserId): {};
    console.log("AddUserIds",AddUserIds)
    

  const [EditBtn, setEditBtn] = useState(false);
  const [UserEditData, setUserEditData] = useState(false);
  const [SelectMapping, setSelectMapping] = useState([]);
  const [ViewsEmployee, setViewsEmployee] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [ViewProjectMasterRole, setViewProjectMasterRole] = useState("");
 const [LoginUserIds, setLoginUserIds] = useState("");
 const [ProjectRole, setProjectRole] = useState([]);

 // Start role  create and update all code
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([2]);
    const [datass, setData] = useState([]);
    const [InsterRole, setInsterRole] = useState([]);
 



  // Create user functonlity
  const [CreateUser, setCreateUser] = useState({
    UserName: "",
    UserId: "",
    MobileNo: "",
    Email: "",
    DesignationName: "",
    DepartmentName: "",
    City: "",
    Password: "",
    ConfirmPassword: "",
    Active: 0,
    // CreateBy:"",
  });

  // LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const LoginUser = await LoginUserId();
      setLoginUserIds(LoginUser);
    };
    UserId();
  }, []);

  useEffect(() => {
    ViewProjectMasterRoleView(CreateUser.UserId);
    setUserEditData(AddUserIds.UserIdAdd)
  }, [CreateUser.UserId]);

  useEffect(() => {
    UpdateMasterMenu();

    // setCreateUser(newArray);
    if (Object.keys(updateUser).length > 0) {
      setDisableBtn(true);
      ViewMasterSingleUser(updateUser);
      setUserEditData(updateUser.UserEdit);


      // ViewProjectMasterRoleView(updateUser)
    }
  }, [Object.keys(updateUser).length > 0]);

  //  VIEW ALL USER LIST API CALL
  const ViewMasterSingleUser = async (updateUser) => {
    const ProjectUser = {
      OperationType: "ViewSingle",
      UserId: updateUser.UserId,
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterUsers, ProjectUser)
      .then((res) => {
        if (res && res.data && res.data.ViewMasterUsers[0]) {
          const resData =res.data.ViewMasterUsers[0]
          const { UserStatus,Mobile, DesignationId,DepartmentId, ...rest } = res.data.ViewMasterUsers[0]; // Destructure the lastName property and the rest of the object
           // Rename keys and create a new object
          const newArray = {
            ...rest,
            Active: UserStatus === "Active" ? 1 : 0,
            DesignationName: DesignationId,
            DepartmentName: DepartmentId,
            MobileNo: Mobile
          };



          console.log("vallldlkd", newArray )
          setCreateUser(newArray);
          setIsEmailValid(true);
        } else
          (error) => {
            console.log(error);
          };

        // setViewMasterAllUser(res.data.ViewMasterUsers);
      });
  };

  //VIEW  PROJECT MASTER API CALL
  const ViewProjectMasterRoleView = async (userid) => {

     let userIDdata = updateUser.UserEdit === true ? updateUser?.UserId : userid;
    let addUserId = AddUserIds.UserIdAdd === true  ? userid : updateUser?.UserId;
    
    const ProjectMastersAll = {
      UserId: addUserId !== undefined ? addUserId : userIDdata
    };
    // if(!Boolean(userIDdata)){
    //   return false
    // }

    console.log("ProjectMastersAll-----------0000099",ProjectMastersAll)

    await axios
      .post(baseUrl + MethodNames.ViewUserProjectMapped, ProjectMastersAll)
      .then(async (res) => {
        //  checked mapped project role
        let MappedValue = res?.data?.ViewUserProjectMapped || [];
        let filterss = await MappedValue.filter((item) => item.IsMapped == 1);

        let mappedData = filterss?.map((item) => {
          let data = {
            UserId: CreateUser?.UserId || updateUser?.UserId,
            ProjectId: String(item.ProjectId),
            CreateBy: LoginUserIds,
          };
          return data;
        });

        // end checked mapped project role

        setViewProjectMasterRole(res.data.ViewUserProjectMapped);
        setUserEditData(true);
        if (mappedData.length > 0) {
          setProjectRole([...mappedData]);
          setRender(!Render);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // CREATE NEW USER HR/ ADMIN

  const handleSubmit = async (e) => {
    e.preventDefault();

    const val = await Vaildation(CreateUser);
    if (!val) {
      return;
    }
    if (CreateUser.MobileNo.length < 9) {
      toast.error("Please enter a 10-digit mobile number.");
      return;
    }
    if (isEmailValid === false) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (CreateUser.DesignationName === "0") {
      toast.error("Please enter Designation");
      return;
    }
    if (CreateUser.DepartmentId === "0") {
      toast.error("Please enter Department");
      return;
    }
    if (isValid === false) {
      toast.error("Please enter a valid   Password");
      return;
    }

    if (CreateUser.Password !== CreateUser.ConfirmPassword) {
      toast.warning("The password entered do not match");
      return;
    }

    const userData = {
      UserId: CreateUser.UserId,
      UserName: CreateUser.UserName,
      City: CreateUser.City,
      DesignationId: CreateUser.DesignationName,
      DepartmentId: CreateUser.DepartmentName,
      Mobile: CreateUser.MobileNo,
      Email: CreateUser.Email,
      PasswordHash: CreateUser.Password,
      Active: CreateUser.Active,
      CreateBy: LoginUserIds,
    };

    const CreateUserData = JSON.stringify(userData);
    const CreateUserDataAdd = {
      OperationType: "Add",
      JsonData: CreateUserData,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterUsers, CreateUserDataAdd)
      .then((res) => {
        if (res.data.UpsertMasterUsers) {
          toast.success("User added successfully.");
          setDisableBtn(true);
        }
      }).catch((err) => {
        console.log(err);
      });
  };

  // UPDATE USER DATA HR/ADMIN
  const UpdateSubmit = async (e) => {
    e.preventDefault();

    const UpdateUserData = {
      UserId: CreateUser.UserId,
      UserName: CreateUser.UserName,
      City: CreateUser.City,
      DesignationId: CreateUser.DesignationName,
      DepartmentId: CreateUser.DepartmentName,
      Mobile: CreateUser.MobileNo,
      Email: CreateUser.Email,
      // PasswordHash: CreateUser.Password,
      Active: CreateUser.Active,
      CreateBy: LoginUserIds,
    };
    const val = await Vaildation(UpdateUserData);
    if (!val) {
      return;
    }
    console.log("user list update data",UpdateUserData)
    if (CreateUser.MobileNo.length < 9) {
      toast.error("Please enter a 10-digit mobile number.");
      return;
    }
    // email validation
    let emailrejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailVal = emailrejex.test(
      String(CreateUser.Email).toLocaleLowerCase()
    );

    if (emailVal === false) {
      toast.error("Please insert a valid email address");
      return;
    }
    const CreUpdateUser = JSON.stringify(UpdateUserData);
    const CreateUserDataUpdate = {
      OperationType: "Update",
      JsonData: CreUpdateUser,
    };

    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterUsers, CreateUserDataUpdate)
      .then((res) => {
        if (res.data.UpsertMasterUsers) {
          toast.success("User updated successfully.");
          // setDisableBtn(true);
        }
      }).catch((err) => {
        console.log("User updated error.",err);
      });
  };



  //  password validation
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setCreateUser({ ...CreateUser, Password: newPassword });
    // Regular expression to validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    setIsValid(regex.test(newPassword));
  };

  //  meneu list checked upadte
  const UpdateMasterMenu = async () => {
    const UpdateMasterMenus = {
      OperationType: "ViewAll",
      UserId: updateUser.UserId || "",
    };

    const response = await axios
      .post(baseUrl + MethodNames.ViewMasterMenu, UpdateMasterMenus)
      .then((res) => {
        const val = res.data.ViewMasterMenu;
        let checkedMenu = [];
         val.forEach((e) => {
          if (e.Checked === 1) {
            checkedMenu.push(e.Id);
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

  const handleExpand = (newExpanded) => {
    setExpanded(newExpanded);
  };
  const backbtn = () => {
    router.push("/Screen/CreateUser");
  };

  //   Get menu list  for all api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewMasterMenu();
        const menuList = response.data.ViewMasterMenu;

        getData(menuList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //   tree Chcekbox str
  function getData(menuList) {
    const data =menuList &&
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

    const UpsertMaster = JSON.stringify(InsterRole);
    if (InsterRole.length <= 0) {
      toast.error("Please assign user roles");
      return;
    }

    if (ProjectRole.length <= 0) {
      toast.error("Please assign project role");
      return;
    }
    //  project role data
    const updateProjectRole = JSON.stringify(ProjectRole);
    const ProjectRoleData = {
      UserId: CreateUser.UserId,
      JsonData: updateProjectRole,
    };
    const RoleData = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };

    if (checked.length > 0) {
      try {
        const response = await axios.post(
          baseUrl + MethodNames.UpsertMappingUserRoles,
          RoleData
        );

        // Add further processing or return here if needed
      } catch (error) {
        console.error("Error in upserting mapping user roles", error);
        // Handle error, display message, etc.
      }
    } else {
      toast.success("Please select a user role");
      return;
    }

    //  insert proeject role

    try {
      const response = await axios.post(
        baseUrl + MethodNames.UpsertUserProjectMapped,
        ProjectRoleData
      );

      if (response.data.UpsertUserProjectMapped) {
        toast.success("Successfully updated ");
        setTimeout(() => {
          router.push("/Screen/CreateUser");
        }, 1000);
      }
    } catch (error) {
      console.log("Project role update error", error);
      // Handle error as needed
    }

    //  ViewProjectPayComponents()
  };

  const UpdateRole = async (e) => {
    e.preventDefault();

    console.log("InsterRole.length <= 0",InsterRole.length )
  
    if (ProjectRole.length <= 0) {
      toast.error("Please assign project role");
      return;
    }

    const updateProjectRole = JSON.stringify(ProjectRole);
    const ProjectRoleData = {
      UserId: CreateUser.UserId,
      JsonData: updateProjectRole,
    };
    const UpsertMaster = JSON.stringify(InsterRole);
    const RoleData = {
      OperationType: "Update",
      JsonData: UpsertMaster,
    };

    try {
      const response = await axios.post(
        baseUrl + MethodNames.UpsertMappingUserRoles,
        RoleData
      );
      // console.log("RoleData-update success", response.data);
    } catch (error) {
      console.error("RoleData-update error", error);
    }
    //  insert proeject role
    try {
      const response = await axios.post(
        baseUrl + MethodNames.UpsertUserProjectMapped,
        ProjectRoleData
      );
      // console.log("Project role update success", response.data);

      if (response.data.UpsertUserProjectMapped) {
        toast.success("Successfully updated");
        setTimeout(() => {
          router.push("/Screen/CreateUser");
        }, 1000);
      }
    } catch (error) {
      console.error("Project role update error", error);
    }
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
              <div className="modal-content  ">
                <div className="modal-header m-0 p-0 p-3 back-color table_ref_head">
                  {EditBtn == false ? (
                    <h6
                      className="modal-title m-0 p-0 fs_14 "
                      id="exampleModalLabel"
                    >
                      Create User
                    </h6>
                  ) : (
                    <h6
                      className="modal-title m-0 p-0 fs_14 "
                      id="exampleModalLabel"
                    >
                      Edit User
                    </h6>
                  )}
                </div>

                <div className="row   ">
                  <div className="col-md-7 col-12">
                    <div className="cardd m-2 role_scroo ">
                      <h6 className="p-2 py-2 ps-3 bg_gray m-0 p-0">
                        User Role
                      </h6>
                      <div className="d-flex justify-content-center w-100">
                        <div className="row p-3  px-4 ">
                          <div className="col-md-6 col-12">
                            <div className="p-1 mt-2 ">
                              <p className="mb-1">User Name</p>
                              <Input
                                // placeholder="input User Name"
                                value={CreateUser.UserName}
                                onChange={(e) => {
                                  // let TextInput = e.target.value.replace(/[^A-Za-z\s']/g,"");
                                  const TextInput = e.target.value.replace(/[^A-Za-z\s\t]/g,"");
                                  // let TextInput = e.target.value.replace(/\D/g, '');
                                  setCreateUser({
                                    ...CreateUser,
                                    UserName: TextInput,
                                  });
                                }}
                                type="text "
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="p-1 mt-2">
                              <p className="mb-1">User Id</p>
                              <Input
                               disabled={Object.keys(updateUser).length > 0 ? true :false}
                                value={CreateUser.UserId}
                                onChange={(e) => {
                                  let TextInput = e.target.value.replace(/[^A-Za-z0-9\s]/g,"");
                                  setCreateUser({
                                    ...CreateUser,
                                    UserId: TextInput,
                                  });
                                }}
                                type="text "
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="p-1">
                              <p className="mb-1">Mobile No</p>
                              <Input
                                value={CreateUser.MobileNo}
                                onChange={(e) => {
                                  const newValue = e.target.value.replace(/\D/g, "").slice(0, 10); // Limit the input to 10 characters
                                  setCreateUser({
                                    ...CreateUser,
                                    MobileNo: newValue,
                                  });
                                }}
                                type="tel"
                                maxlength="10"
                                // className="w-100 mt-1 inputs inputss "
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="p-1">
                              <p className="mb-1">Email</p>
                              <Input
                                value={CreateUser.Email}
                                // placeholder="input Email"

                                onChange={(e) => {
                                  setCreateUser({ ...CreateUser,Email: e.target.value });
                                  let emailrejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                  let emailVal = emailrejex.test(String(e.target.value || CreateUser.Email).toLocaleLowerCase());

                                  setIsEmailValid(emailVal);
                                }}
                                type="email"
                                // className="w-100 mt-1 inputs inputss  "
                              />

                            { isEmailValid == false &&
                              CreateUser.Email != "" ? (
                                <p className="text-danger ">
                                  <span className="fs_15 me-2 text-danger ">
                                    *
                                  </span>
                                  Please enter a vaild Email
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="p-1 ">
                              <p className="mb-1">Designation Name</p>

                              <select
                                className="form-select w "
                                value={CreateUser.DesignationName}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    DesignationName: e.target.value,
                                  })
                                }
                                aria-label="Default select example"
                              >
                                <option disabled value="">
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
                            <div className="p-1 ">
                              <p className="mb-1">Department Name</p>

                              <select
                                className="form-select w "
                                value={CreateUser.DepartmentName}
                                onChange={(e) =>
                                  setCreateUser({
                                    ...CreateUser,
                                    DepartmentName: e.target.value,
                                  })
                                }
                                aria-label="Default select example"
                              >
                                <option disabled value="">
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
                            <div className="p-1 ">
                              <p className="mb-1"> City</p>
                              <Input
                                value={CreateUser.City}
                                onChange={(e) => {
                                  const TextInput = e.target.value.replace(/[^A-Za-z\s\t]/g,"");
                                 setCreateUser({
                                    ...CreateUser,
                                    City: TextInput,
                                  });
                                }}
                                type="text "
                                // className="w-100 mt-1 inputs inputss  "
                              />
                            </div>
                          </div>
                          {Object.keys(updateUser).length > 0 ? (
                            ""
                          ) : (
                            <>
                              <div className="col-md-6 col-12">
                                <div className="p-1 ">
                                  <p className="mb-1">Password</p>
                                  {/* <Input.Password placeholder="input password" /> */}
                                  <Input.Password
                                    placeholder="input password"
                                    value={CreateUser.Password}
                                    onChange={handlePasswordChange}
                                    // onChange={(e) =>
                                    //   setCreateUser({
                                    //     ...CreateUser,
                                    //     ConfirmPassword: e.target.value,
                                    //   })
                                    // }
                                    type="password "
                                    // className="w-100 mt-1 inputs"
                                  />

                                  {!isValid &&
                                  CreateUser.Password != "" ? (
                                    <p className="text-danger ">
                                      <span className="fs_15 me-2 text-danger ">
                                        *
                                      </span>
                                      Password must contain at least 8
                                      characters, one uppercase letter, one
                                      lowercase letter, one number, and one
                                      special character.
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

                              <div className="col-md-6 col-12">
                                <div className="p-1 ">
                                  <p className="mb-1">Confirm Password</p>
                                  <Input.Password
                                    value={CreateUser.ConfirmPassword}
                                    onChange={(e) =>
                                      setCreateUser({
                                        ...CreateUser,
                                        ConfirmPassword: e.target.value,
                                      })
                                    }
                                    type="text "
                                    // className="w-100 mt-1 inputs "
                                    placeholder="Confirm password"
                                  />
                                </div>
                                {CreateUser.Password &&
                                CreateUser.Password !==
                                  CreateUser.ConfirmPassword &&
                                CreateUser.ConfirmPassword != "" ? (
                                  <p className="text-danger ms-2">
                                    Password is not match
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </>
                          )}
                          <div className="col-md-6 col-12">
                            <div className="modal-body  pt-0 mt-1 d-flex">
                              <input
                                className="form-check-inpu "
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
                      <div className=" w-100 p-2 mb-4">
                        {Object.keys(updateUser).length > 0 ? (
                          <>
                            <button
                              type="button"
                              className="btn w_150 btn-secondary float-end fs_12 ms-2 "
                              // data-bs-dismiss="modal"
                            >
                              <a
                                className="text-white"
                                href="/Screen/CreateUser"
                              >
                                Cancel
                              </a>
                            </button>

                            <button
                              data-bs-dismiss="modal"
                              onClick={UpdateSubmit}
                              type="button"
                              className="btn w_150 btn-primary float-end fs_12 ms-3 "
                            >
                              Update
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn w_150 btn-secondary float-end fs_12 ms-2 "
                              // data-bs-dismiss="modal"
                              // href="/Screen/CreateUser"
                              onClick={backbtn}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSubmit}
                              type="button"
                              disabled={disableBtn == false ? false : true}
                              className="btn w_150 btn-primary float-end fs_12 ms-3 "
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
                        <div className=" ">
                          <div className="cardd px-   m-0 p-0">
                            <div className="row m-0 p-0">
                              <div className="col-md-6 col-6 m-0 p-0">
                                <h6 className="p-2 py-2  ps-4 bg_gray m-0 p-0 w-100 mb-2">
                                  User Role
                                </h6>
                                <div className="role_scrool">
                                  <CheckboxTree
                                    nodes={datass}
                                    checked={checked}
                                    expanded={expanded}
                                    disabled={
                                      disableBtn == false ? true : false
                                    }
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
                                </div>
                              </div>
                              <div className="col-md-6 col-6 m-0 p-0">
                                <h6 className="p-2 py-2 ps-4 bg_gray m-0 p-0 mb-2">
                                  Project Role
                                </h6>
                                <div className="role_scrool">
                                  {UserEditData === true &&
                                    ViewProjectMasterRole &&
                                    ViewProjectMasterRole.map((item) => {
                                      return (
                                        <>
                                          <ul>
                                            <p>
                                            
                                              <input
                                                className={disableBtn == false? "me-3 no-drop": "me-3 "}
                                                disabled={disableBtn == false? true: false}
                                                defaultChecked={item?.IsMapped == 1}
                                                // checked={ProjectRole?.ProjectId === 1 ? true : false}

                                                onChange={(e) => {
                                                  let value = e.target.value;
                                                  let isChecked =e.target.checked;

                                                  if (isChecked) {
                                                    let data = {
                                                      UserId: CreateUser.UserId,
                                                      ProjectId: value,
                                                      CreateBy: LoginUserIds,
                                                    };
                                                    setProjectRole([
                                                      ...ProjectRole,
                                                      data,
                                                    ]);
                                                  } else {
                                                    let filterss =
                                                      ProjectRole.filter(
                                                        (item) =>
                                                          item.ProjectId !=
                                                          value
                                                      );
                                                    setProjectRole(filterss);
                                                  }
                                                  setRender(!Render);
                                                }}
                                                value={item.ProjectId}
                                                type="checkbox"
                                              />{" "}
                                              {item.ProjectName}
                                            </p>
                                          </ul>
                                        </>
                                      );
                                    })}
                                </div>
                              </div>
                              <div className=" col-md-12  p-2 mt-2">
                                {Object.keys(updateUser).length > 0 ? (
                                  <>
                                    <button
                                      type="button"
                                      className="btn w_150 btn-secondary float-end fs_12 ms-2 "
                                      data-bs-dismiss="modal"
                                    >
                                      <a
                                        className="text-white"
                                        href="/Screen/CreateUser"
                                      >
                                        Cancel
                                      </a>
                                    </button>
                                    <button
                                      data-bs-dismiss="modal"
                                      onClick={UpdateRole}
                                      type="button"
                                      // disabled={disableBtn == false ? true : false}
                                      className="btn w_150 btn-primary float-end fs_12 ms-3 "
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
                                      className="btn w_150 btn-primary float-end fs_12 ms-3 "
                                    >
                                      Insert
                                    </button>
                                    <button
                                      type="button"
                                      className="btn w_150 btn-secondary float-end fs_12 ms-2 "
                                      data-bs-dismiss="modal"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div></div>
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
