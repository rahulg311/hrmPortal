import React, { useEffect, useState } from "react";
import Footer from "../footer";
import Sidebaar from "./Sidebaar";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../src/constants/contextProvider";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import axios from "axios";
import Loader from "./Loader";

const CompanyMaster = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [masterLists, setmasterLists] = useState("");

  useEffect(() => {
    UpsertMasterCompany();
  }, []);

  // GET  COMPANY DATA  IN API SERVICES
  const CompanyViewSingle = {
    OperationType: "ViewSingle",
    CompanyId: 1,
  };
  const UpsertMasterCompany = async () =>
    await axios
      .post(baseUrl + MethodNames.ViewMasterCompany, CompanyViewSingle)
      .then((res) => {
        console.log("response DATA----", res.data.ViewMasterCompany);
        setmasterLists(res.data.ViewMasterCompany);
        setLoding(false);
      })
      .catch((error) => console.log(" COMPANY DATA  IN API SERVICES", error));

  // COMPANY DATA  UPDATE ROUTE CHANGE
  const UserUpdate = (CompanyId) => {
    router.push(
      {
        pathname: "/Screen/CompanyMasterUpdateUser",
        query: { CompanyId: CompanyId.CompanyId },
      },
      undefined,
      { shallow: false }
    );
  };

  return (
    <div className="h100">
      <MainContainer>
        <Sidebaar show={show} />
        <div className={open ? "content-page2  vh-100" : "content-page"}>
          <div className="content  ">
            <div className="container-fluid">
              <div className="cardd">
                <div className="col-sm-12 table-responsiv p-2 vh_90  ">
                  <div className=" row ">
                    <div className="col-sm-12 col-12 col-md-12  ">
                      <div className=" w-100 back-color table_ref_head">
                        <p className="">Company Master Info</p>
                        {masterLists.length == 0 ? (
                          <button className="btn btn-primary float-end mt-1 me-1 btn_size fs_12  btn_h_36 ">
                            <a
                              className="link_name text-white"
                              href="./CompanyMasterAddUser"
                            >
                              <i className="bx bx-plus ms-1 mt-1"></i> Add New
                              Master
                            </a>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-sm-12 col-12 col-md-12   ">
                      <div className="fs_15 back-colo table_ref_Main text-white  ">
                        <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                          Basic Info
                        </p>
                      </div>
                    </div>
                  </div>
                  <table>
                    <tbody>
                      {loding ? (
                        <Loader />
                      ) : (
                        <>
                          {masterLists &&
                            masterLists.map((i) => {
                              return (
                                <>
                                  <tr>
                                    <th>Company Id</th>
                                    <td>{i.CompanyId}</td>
                                    <th>Company Name</th>
                                    <td>{i.CompanyName}</td>
                                  </tr>
                                  <tr colSpan={2}>
                                    <th>Address</th>
                                    <td colSpan={0}>{i.Address}</td>
                                    <th>Phone</th>
                                    <td>{i.Phone}</td>
                                    {/* <th>Address2</th>
                              <td>{i.Address2}</td> */}
                                  </tr>
                                  <tr>
                                    {/* <th>Address3</th>
                              <td>{i.Address3}</td> */}
                                    <th>City</th>
                                    <td colSpan={3}>{i.City}</td>
                                  </tr>
                                  <tr>
                                    <th>State</th>
                                    <td>{i.State}</td>
                                    <th>Pin code</th>
                                    <td>{i.Pincode}</td>
                                  </tr>
                                  <tr>
                                    <th>Email</th>
                                    <td>{i.Email}</td>
                                    <th>Fax</th>
                                    <td>{i.Fax}</td>
                                  </tr>

                                  <tr>
                                    <th
                                      className="fs_15 fw-bold table_ref_head "
                                      colSpan={4}
                                    >
                                      Statutory Info{" "}
                                    </th>
                                  </tr>

                                  <tr>
                                    <th>PF Status Code</th>
                                    <td>{i.PF_StatusCode}</td>
                                    <th>PF Est Code</th>
                                    <td>{i.PF_EstCode}</td>
                                  </tr>
                                  <tr>
                                    <th>PAN</th>
                                    <td>{i.PAN}</td>
                                    <th>Person</th>
                                    <td>{i.Person}</td>
                                  </tr>
                                  <tr>
                                    <th>Designation</th>
                                    <td>{i.Designation}</td>
                                    <th>PF Prefix</th>
                                    <td>{i.PF_Prefix}</td>
                                  </tr>
                                  <tr>
                                    <th>ESIC Emp Code </th>
                                    <td>{i.ESIC_EmployerCode}</td>
                                    <th>TAN</th>
                                    <td>{i.TAN}</td>
                                  </tr>
                                  <tr>
                                    <th>Father Name</th>
                                    <td>{i.FatherName}</td>
                                    <th>TD Circle</th>
                                    <td>{i.TDS_Circle}</td>
                                  </tr>
                                  <tr>
                                    <th colSpan={3} className=""></th>
                                    <th className=" float-end h-100">
                                      {/* <Link href={`/Screen/CompanyMasterUpdateUser/${i.CompanyId}`}> */}
                                      <button
                                        className="btn btn-primary h-100 w_100 btn_size_h ps-4 pe-4"
                                        onClick={() => UserUpdate(i)}
                                      >
                                        Edit
                                      </button>

                                      {/* </Link>  */}
                                    </th>
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
      </MainContainer>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyMaster);
