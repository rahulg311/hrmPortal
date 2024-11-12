import React, { useState } from "react";
import Sidebaar from "./Sidebaar";
import { mapStateToProps, mapDispatchToProps} from "../../src/constants/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../components/Container";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";
import Vaildation from "./Vaildation";
import { LoginUserId } from "../api/AllApi";

const CompanyMasterAddUser = (props) => {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(true);
  const [UserId, setUserId] = useState("");

// LOGIN USERID GET BY LOGIN USER
  useEffect(() => {
    const UserId = async () => {
      const userid = await LoginUserId();
      setUserId(userid);
    };
    UserId();
  }, []);

// COMPANY MASTER STATE INPUT DATA
  const [addUser, setAddUser] = useState({
    CompanyId: "",
    CompanyName: "",
    Address: "",
    City: "",
    State: "",
    Pincode: "",
    Phone: "",
    Email: "",
    Fax: "",
    PF_StatusCode: "",
    PF_Prefix: "",
    PF_EstCode: "",
    ESIC_EmployerCode: "",
    PAN: "",
    TAN: "",
    Person: "",
    FatherName: "",
    Designation: "",
    TDS_Circle: "",
    // UserId: "testmer",
  });

 // COMPANY MASTER SUBMIT DATA  
  const sumbitUser = async (e) => {
    e.preventDefault();
    const AddData = {
      CompanyId: addUser.CompanyId,
      CompanyName: addUser.CompanyName,
      Address: addUser.Address,
      City: addUser.City,
      State: addUser.State,
      Pincode: addUser.Pincode,
      Phone: addUser.Phone,
      Email: addUser.Email,
      Fax: addUser.Fax,
      PF_StatusCode: addUser.PF_StatusCode,
      PF_Prefix: addUser.PF_Prefix,
      PF_EstCode: addUser.PF_EstCode,
      ESIC_EmployerCode: addUser.ESIC_EmployerCode,
      PAN: addUser.PAN,
      TAN: addUser.TAN,
      Person: addUser.Person,
      FatherName: addUser.FatherName,
      Designation: addUser.Designation,
      TDS_Circle: addUser.TDS_Circle,
      UserId: UserId,
    };

    let val = await Vaildation(AddData);
    if (!val) {
      return;
    }

    const CompanyMasterUser = JSON.stringify(AddData);
    const CompanyMasterAdd = {
      OperationType: "Add",
      JsonData: CompanyMasterUser,
    };
    const UpsertMasterCompany = await axios
      .post(baseUrl + MethodNames.UpsertMasterCompany, CompanyMasterAdd)
      .then((res) => {
        console.log("response", res.data.UpsertMasterCompany[0]);
        if (res.data.UpsertMasterCompany[0]) {
          toast.success("User added successfully.");
        }
        router.push("/Screen/CompanyMaster");
      });
  };
  const back = () => {
    router.push("/Screen/CompanyMaster");
  };

  return (
    <div className="h100">
      <ToastContainer />
      <MainContainer>
        <Sidebaar show={show} />

        <div className={open ? "content-page2 vh-100" : "content-page vh-100"}>
          <div className="content  ">
            <div className="container-fluid ">
              <div className="cardd">
                <div className="p-2 row ">
                  <div className="col-sm-12 col-12 col-md-12  ">
                    <div
                      className="fs_15 back-color table_ref_head text-white "
                      colSpan={7}
                    >
                      <p className="p-2">Prtoject Master Info</p>
                    </div>
                  </div>
                  <div className="col-sm-12 col-12 col-md-12   ">
                    <div
                      className="fs_15 back-colo table_ref_Main text-white  "
                      colSpan={7}
                    >
                      <p className="p-2 ps-3 text-dark fw-bold fs_15 ">
                        Basic Info
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <ToastContainer />
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Companycode :</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="number"
                      value={addUser.CompanyId}
                      onChange={(e) =>
                        setAddUser({ ...addUser, CompanyId: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> CompanyName:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.CompanyName}
                      onChange={(e) =>
                        setAddUser({ ...addUser, CompanyName: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Address :</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.Address}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Address: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> State:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.State}
                      onChange={(e) =>
                        setAddUser({ ...addUser, State: e.target.value })
                      }
                    />
                    <br />
                  </div>

                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> City :</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.City}
                      onChange={(e) =>
                        setAddUser({ ...addUser, City: e.target.value })
                      }
                    />

                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Pincode:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="number"
                      value={addUser.Pincode}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Pincode: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Email</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="email"
                      value={addUser.Email}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Email: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Phone:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.Phone}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Phone: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Fax:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.Fax}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Fax: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="w-100 p-2 my-3  ">
                  <div
                    className="fs_15 back-colo table_ref_Main text-white  "
                    colSpan={7}
                  >
                    <p className="p-2 ps-3 text-dark fw-bold fs_15 ">PF</p>
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Status Code :</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.PF_StatusCode}
                      onChange={(e) =>
                        setAddUser({
                          ...addUser,
                          PF_StatusCode: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Prefix :</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.PF_Prefix}
                      onChange={(e) =>
                        setAddUser({ ...addUser, PF_Prefix: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PF Est Code:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.PF_EstCode}
                      onChange={(e) =>
                        setAddUser({ ...addUser, PF_EstCode: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">ESIC Emp Code:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.ESIC_EmployerCode}
                      onChange={(e) =>
                        setAddUser({
                          ...addUser,
                          ESIC_EmployerCode: e.target.value,
                        })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> PAN:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.PAN}
                      onChange={(e) =>
                        setAddUser({ ...addUser, PAN: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> TAN:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.TAN}
                      onChange={(e) =>
                        setAddUser({ ...addUser, TAN: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> Person:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.Person}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Person: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Father Name:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.FatherName}
                      onChange={(e) =>
                        setAddUser({ ...addUser, FatherName: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">Designation:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.Designation}
                      onChange={(e) =>
                        setAddUser({ ...addUser, Designation: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="row mt-1 ms-1 me-1 ">
                  <div className="col-md_2 col-6 mb-1">
                    <p className=""> TDS_Circle</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.TDS_Circle}
                      onChange={(e) =>
                        setAddUser({ ...addUser, TDS_Circle: e.target.value })
                      }
                    />
                    <br />
                  </div>
                  <div className="col-md_2 col-6 mb-1">
                    <p className="">UserId:</p>
                  </div>
                  <div className="col-md_3 col-6 mb-1">
                    <input
                      className="w_90"
                      type="text"
                      value={addUser.UserId}
                      onChange={(e) =>
                        setAddUser({ ...addUser, UserId: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>

                <div className="w-100 h-100 d-flex justify-content-end p-2">
                  <button
                    className="btn btn-primary h-100 w_100 btn_size_h   ps-4 pe-4"
                    onClick={sumbitUser}
                  >
                    Save
                  </button>
                  <button
                    onClick={back}
                    className="btn btn-primary bg-danger border-0 h-100 w_100 btn_size_h  ms-2  ps-4 pe-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)(CompanyMasterAddUser);
