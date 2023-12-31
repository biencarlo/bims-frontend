"use client";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { InputText } from "primereact/inputtext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faPlusSquare,
  faFileExcel,
  faAdd,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import { Dialog } from "primereact/dialog";

import "./styles.css";
import api_url from "@/components/api_conf";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import withLoading from "../../../components/withLoading";

interface Option {
  ID: number; // Change the type to match your actual data
  Description: string;
}

interface User {
  ID: number;
  FullName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  PositionID: number;
  PositionName: string;
  Email: string;
  Username: string;
  IsAdmin: boolean;
  ProfileLink: string;
}

const UserList: React.FC = () => {
  const toast = useRef<Toast>(null);

  const showSuccessFul = () => {
    toast.current!.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  const [UserName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("Username"));
    setUserID(localStorage.getItem("ID"));
    setFullName(localStorage.getItem("fullName"));
    setIsAdmin(localStorage.getItem("isAdmin"));
    setProfileLink(localStorage.getItem("profileLink"));
    CheckIfLoggedIn();
  }, []);

  function CheckIfLoggedIn() {
    console.log(localStorage.getItem("ID"));
    if (localStorage.getItem("ID") == null) {
      window.location.href = "/";
    }
  }

  const [CreateUpdateHeader, setCreateUpdateHeader] = useState("");
  const [UpdateformData, setUpdateFormData] = useState({
    userID: "0",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    userName: "",
    selectedOption: "",
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      userID: "0",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      userName: "",
      selectedOption: "1",
    });
    setSelectedOption("1");
  };
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log(name, value); // Check the values of name and value
    setUpdateFormData({
      ...UpdateformData,
      [name]: value,
    });
  };

  const [UserError, setUserError] = useState<string | null>(null);

  const [visible, setVisible] = useState(false);

  const footerContent = (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        className="py-2 px-10 rounded-lg bg-red-800 rounded-lg"
        style={{ color: "white" }}
        onClick={CreateUserAPI}
      >
        <FontAwesomeIcon icon={faAdd as IconProp} className="mr-2" />
        Submit
      </button>
    </div>
  );

  const [selectedOption, setSelectedOption] = useState<string>("");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [individualUsers, setindividualUsers] = useState<User | null>(null);

  const confirmDeleteUser = (individualUsers: any) => {
    setindividualUsers(individualUsers);
    console.log(individualUsers);
    setDeleteUserDialog(true);
  };

  const editUser = (individualUsers: any) => {
    setindividualUsers({ ...individualUsers });
    console.log(individualUsers);
    setVisible(true);
    setUpdateFormData({
      userID: individualUsers.ID,
      firstName: individualUsers.FirstName,
      middleName: individualUsers.MiddleName,
      lastName: individualUsers.LastName,
      email: individualUsers.Email,
      userName: individualUsers.Username,
      selectedOption: individualUsers.PositionID,
    });
    setSelectedOption(individualUsers.PositionID);

    console.log(individualUsers.ID);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <button
          type="button"
          className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2 hover:bg-gray-400 transition-all"
          onClick={() => {
            editUser(rowData);
            setCreateUpdateHeader("Update User");
          }}
        >
          <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
          Edit
        </button>
        <button
          type="button"
          className="text-xs py-2 px-5 mr-2 rounded-lg bg-red-800 rounded-lg text-white border-solid border-red-800 border-2 hover:bg-red-900 transition-all"
          onClick={() => confirmDeleteUser(rowData)}
        >
          <FontAwesomeIcon icon={faTrash as IconProp} className="mr-2" />
          Delete
        </button>
      </React.Fragment>
    );
  };

  async function CreateUserAPI() {
    var fname = (document.getElementById("first-name") as HTMLInputElement)
      .value;
    var mname = (document.getElementById("middle-name") as HTMLInputElement)
      .value;
    var lname = (document.getElementById("last-name") as HTMLInputElement)
      .value;
    var posID = (document.getElementById("position") as HTMLInputElement).value;
    var email = (document.getElementById("email") as HTMLInputElement).value;
    var username = (document.getElementById("user-name") as HTMLInputElement)
      .value;

    if (CreateUpdateHeader == "Create User") {
      if (
        fname == "" ||
        mname == "" ||
        lname == "" ||
        posID == "" ||
        email == "" ||
        username == ""
      ) {
        setUserError("Please complete the Details before submiting");
        setTimeout(() => {
          setUserError(null);
        }, 3000);
        return;
      }

      await axios
        .post(
          api_url + "users",
          {
            FullName: fname + " " + mname + " " + lname,
            FirstName: fname,
            MiddleName: mname,
            LastName: lname,
            PositionID: parseInt(posID),
            Email: email,
            Username: username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          if (response.data.Success) {
            setVisible(false);
            resetUpdateForm();
            showSuccessFul();
            await axios
              .get(api_url + "users")
              .then((response) => setUsers(response.data));
          } else {
            setUserError(response.data.Message || "An error occurred");
            setTimeout(() => {
              setUserError(null);
            }, 3000); // 3000 milliseconds = 3 second
          }
        });
    } else {
      var userID = (document.getElementById("userID") as HTMLInputElement)
        .value;
      await axios
        .put(
          api_url + "users",
          {
            ID: parseInt(userID),
            FullName: fname + " " + mname + " " + lname,
            FirstName: fname,
            MiddleName: mname,
            LastName: lname,
            PositionID: parseInt(posID),
            Email: email,
            Username: username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          if (response.data.Success) {
            setVisible(false);
            resetUpdateForm();
            showSuccessFul();
            await axios
              .get(api_url + "users")
              .then((response) => setUsers(response.data));
          } else {
            setUserError(response.data.Message || "An error occurred");
            setTimeout(() => {
              setUserError(null);
            }, 3000); // 3000 milliseconds = 3 second
          }
        });
    }
  }

  const DeleteUserApi = () => {
    var userIDTobeDeleted = individualUsers!.ID;
    console.log(individualUsers!.ID);
    axios
      .delete(api_url + "users", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ID: userIDTobeDeleted,
        },
      })
      .then(async (response) => {
        if (response.data.Success) {
          await axios
            .get(api_url + "users")
            .then((response) => setUsers(response.data));
          setDeleteUserDialog(false);
          showSuccessFul();
        }
      });
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={DeleteUserApi}
      />
    </React.Fragment>
  );

  const [userOptions, setUserOptions] = useState<Option[]>([]);

  const [users, setUsers] = useState();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    var getUsers = async () => {
      await axios
        .get(api_url + "users")
        .then((response) => setUsers(response.data));
      return;
    };

    var getPositions = async () => {
      await axios
        .get(api_url + "positions")
        .then((response) => setUserOptions(response.data));
      return;
    };

    getUsers();
    initFilters();
    getPositions();
  }, []);

  const onGlobalFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };
  const exportExcel = () => {
    import("xlsx").then(async (xlsx) => {
      const response = await axios.get(api_url + "users");
      const worksheet = xlsx.utils.json_to_sheet(response.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "user_list");
    });
  };

  const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2 ">
        User List
      </h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          color="text.primary"
        >
          User List
        </Typography>
      </Breadcrumbs>

      <Toast ref={toast} />
      <div className="flex justify-content-between gap-5 pb-4 pt-4">
        <InputText
          className="grow w-5/12"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
        <button
          type="button"
          className="py-2 px-10 rounded-lg bg-white hover:bg-red-900 hover:text-white border-2 border-red-900 text-red-900 font-bold transition-all"
          onClick={exportExcel}
        >
          <FontAwesomeIcon icon={faFileExcel as IconProp} className="mr-2" />
          Export .xlsx file
        </button>
        {IsAdmin == "false" ? null : (
          <button
            type="button"
            className="py-2 px-10 rounded-lg bg-red-800 text-white hover:text-red-900 hover:bg-white hover:border-red-900 hover:border-2 font-bold transition-all"
            onClick={() => {
              setVisible(true);
              setCreateUpdateHeader("Create User");
            }}
          >
            <FontAwesomeIcon icon={faPlusSquare as IconProp} className="mr-2" />
            Create Entry
          </button>
        )}
        
      </div>
      <div className="card flex justify-content-center hidden">
          <Dialog
            header={CreateUpdateHeader}
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => {
              setVisible(false);
              resetUpdateForm();
            }}
            footer={footerContent}
            position="top"
          >
            {UserError && (
              <div role="alert" className="login-error">
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  Error:
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p className="error-message">{UserError}</p>
                </div>
              </div>
            )}
            <form className="flex flex-col my-4 gap-2">
              <input
                type="hidden"
                id="userID"
                value={UpdateformData.userID}
                onChange={handleInputChange}
              ></input>
              <div className="flex gap-4 pb-4">
                <div className="pb-2 flex flex-col grow">
                  <label htmlFor="first-name" className="col-form-label">
                    First Name:
                  </label>
                  <input
                    type="text"
                    className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    id="first-name"
                    name="firstName"
                    value={UpdateformData.firstName}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div className="pb-2 flex flex-col grow">
                  <label htmlFor="middle-name" className="col-form-label">
                    Middle Name:
                  </label>
                  <input
                    type="text"
                    className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    id="middle-name"
                    name="middleName"
                    value={UpdateformData.middleName}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div className="pb-2 flex flex-col grow">
                  <label htmlFor="last-name" className="col-form-label">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    id="last-name"
                    name="lastName"
                    value={UpdateformData.lastName}
                    onChange={handleInputChange}
                  ></input>
                </div>
              </div>
              <div className="flex gap-4 pb-4">
                <div className="pb-2 flex flex-col grow">
                  <label htmlFor="email" className="col-form-label">
                    Email:
                  </label>
                  <input
                    type="text"
                    className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    id="email"
                    name="email"
                    value={UpdateformData.email}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div className="pb-2 flex flex-col grow">
                  <label htmlFor="user-name" className="col-form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    id="user-name"
                    name="userName"
                    value={UpdateformData.userName}
                    onChange={handleInputChange}
                  ></input>
                </div>
              </div>
              <div className="pb-2 flex flex-col grow">
                <label htmlFor="position" className="col-form-label">
                  Position:
                </label>
                <select
                  id="position"
                  className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                  name="position"
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  {userOptions.map((option) => (
                    <option key={option.ID} value={option.ID}>
                      {option.Description}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </Dialog>
        </div>
      <DataTable
        filters={filters}
        value={users}
        size="small"
        removableSort
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="ID" header="ID" sortable></Column>
        <Column field="FirstName" header="FirstName" sortable></Column>
        <Column field="MiddleName" header="MiddleName" sortable></Column>
        <Column field="LastName" header="LastName" sortable></Column>
        <Column field="PositionID" header="PositionID" sortable></Column>
        <Column field="PositionName" header="PositionName" sortable></Column>
        <Column field="Email" header="Email" sortable></Column>
        <Column field="Username" header="Username" sortable></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "15rem" }}
        ></Column>
      </DataTable>

      <Dialog
        visible={deleteUserDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {users && <span>Are you sure you want to delete ?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default withLoading(UserList);
