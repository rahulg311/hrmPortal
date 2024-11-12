import React, { useEffect, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps} from  "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { MethodNames } from "../../src/constants/methodNames";
import { baseUrl } from "../../src/constants/constants";
import ErrorPage from "./ErrorPage";
import { LoginUserId } from "../api/AllApi";

const ProjectMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [SearchFliter, setSearchFliter] = useState("");
  const [ViewProjectMaster, setViewProjectMaster] = useState("");
  const [loding, setLoding] = useState(true);
  // const[UserId,setUserId]= useState("")


  // LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserIds = async () => {
      const userid = await LoginUserId();
      ViewProjectMasters(userid);
    };
    UserIds();
  }, []);






  //VIEW  PROJECT MASTER API CALL 
  const ViewProjectMasters = async (userid) => {
    setLoding(true)
    const ProjectMastersAll = {
      OperationType: "ViewAll",
      ProjectId: 0,
      UserId:userid
    };
    await axios
      .post(baseUrl + MethodNames.ViewMasterProject, ProjectMastersAll)
      .then((res) => {
        console.log("response DATA----", res.data);
        setViewProjectMaster(res.data.ViewMasterProject);
        setLoding(false);
      }).catch(()=>{
        setLoding(false);
      });
  };

 //  ViewProjectMasters click by id edit
  const UserUpdate = (user) => {
    router.push(
      {
        pathname: "/Screen/ProjectMasterEdit",
        query: { UpdateProjectMaster: JSON.stringify(user) },
      },
      undefined,
      { shallow: true }
    );
  };

  // serach ViewProjectMasters  user
  const searchItems = (searchValue1, searchValue2) => {
    console.log("searchValue1", searchValue1, searchValue2);
    setSearchInput(searchValue1);
    setSearchInput2(searchValue2);
    if (searchValue1 !== "" || searchValue2 !== "") {
      const filterDepartment = ViewProjectMaster.filter((item) => {
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
                          Project Master
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15 fw-bold table_ref_head ">
                      <a
                            className="link_name text-white"
                            href="./ProjectMasterAdd"
                          >
                        <button
                          type="button"
                          className="btn btn-primary btn_size fs_12  btn_h_36 m-1 ms-2 m-0 p-0 " >
                        
                            <i className="bx bx-plus ms-1 mt-1"></i> Add New Project
                          
                        </button>
                        </a>
                      </div>
                    </div>
                  </div>
                  {
                    loding ? null :
                  
                  <div className="table-responsive">
                  {
                    ViewProjectMaster.length>0  ?
                  

                    <table className="">
                      <tbody>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">Project Id</th>
                          <th className="text-center">Project Name</th>
                          <th className="text-center">Company Name</th>
                          <th className="text-center">Approved Strength</th>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175"
                              type="number"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(e.target.value, searchInput2)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                          <td>
                            <input
                              class="input-grey-rounded fs_10 w_175 "
                              type="text"
                              placeholder="Search ......."
                              onChange={(e) =>
                                searchItems(searchInput, e.target.value)
                              }
                            ></input>
                          </td>
                        </tr>

                        {searchInput.length != "" ||
                        searchInput2.length != "" ? (
                          <>
                            {SearchFliter &&
                              SearchFliter.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => UserUpdate(i.ProjectId)}
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
                                      <td>{i.ProjectId}</td>
                                      <td>{i.ProjectName}</td>
                                      <td>{i.CompanyName}</td>
                                      <td>{i.ApprovedStrength}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {ViewProjectMaster &&
                              ViewProjectMaster.map((i, key) => {
                                return (
                                  <>
                                    <tr key={key}>
                                      <td>
                                        <p className="m-0 ms-2">
                                          <a
                                            onClick={() => UserUpdate(i.ProjectId)}
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

                                      <td>{i.ProjectId}</td>
                                      <td>{i.ProjectName}</td>
                                      <td>{i.CompanyName}</td>
                                      <td>{i.ApprovedStrength}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                    : <ErrorPage/>}
                  </div>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectMaster);
