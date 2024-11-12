import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import MainContainer from "../components/Container";
import Sidebaar from "./Sidebaar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { TiTick } from "react-icons/ti"; // Import the icon for checked state
import { TiMinus } from "react-icons/ti"; // Import the icon for partially checked state
import { TiPlus } from "react-icons/ti"; // Import the icon for unchecked state
import { IoIosCheckbox } from "react-icons/io"; // Import the icon for unchecked state
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faSquare,
  faChevronRight,
  faChevronDown,
  faPlusSquare,
  faMinusSquare,
  faFolder,
  faFolderOpen,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { ViewMasterMenu } from "../api/AllApi";
import axios from "axios";
import { baseUrl } from "../../src/constants/constants";
import { MethodNames } from "../../src/constants/methodNames";

const nodes = [
  {
    value: "mars",
    label: "Mars",
    children: [
      { value: "phobos", label: "Phobos" },
      { value: "deimos", label: "Deimos" },
    ],
  },
];

function Role() {
  const open = useSelector((state) => state.projectR.sideClick);
  const show = useSelector((state) => state.projectR.showProject);
  const router = useRouter();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [datass, setData] = useState([]);
  const [InsterRole, setInsterRole] = useState([]);

  const handleCheck = (newChecked) => {
    setChecked(newChecked);
    const selecetData = []; // Initialize the array to store the values
    newChecked.forEach((element) => {
      if (element > 0) {
        const selecetItem = {
          UserId: "hr",
          Id: element,
        };
        selecetData.push(selecetItem);
      }
    });

    setInsterRole(selecetData);
    console.log("rahh", selecetData); // Output the updated array
  };

  const handleExpand = (newExpanded) => {
    setExpanded(newExpanded);
  };

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

  const SubmitData = async (e) => {
    e.preventDefault();

    const UpsertMaster = JSON.stringify(InsterRole);
    const RoleData = {
      OperationType: "Add",
      JsonData: UpsertMaster,
    };
    console.log("RoleData", RoleData);

    await axios
      .post(baseUrl + MethodNames.UpsertMappingUserRoles, RoleData)
      .then((res) => {
        console.log("payload------ sucess", res.data);

        if (res.data.UpsertMappingUserRoles) {
          toast.success("Sucessfull Add ");
          router.push("/Screen/EmployeeDetails");
        }
      });
    //  ViewProjectPayComponents()
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
                          Role
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className=" ">
                    <h6 className="p-2 ps-3 bg_gray m-0 p-0"> User Role</h6>
                    <div className="cardd px-2">
                      <CheckboxTree
                        nodes={datass}
                        checked={checked}
                        expanded={expanded}
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
                      <div class=" w-100 p-2 ">
                        <button
                          type="button"
                          class="btn w_150 btn-secondary float-end fs_12 ms-2 "
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button
                          data-bs-dismiss="modal"
                          onClick={SubmitData}
                          type="button"
                          class="btn w_150 btn-primary float-end fs_12 ms-3 "
                        >
                          Insert
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
    </div>
  );
}

export default Role;
