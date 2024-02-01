"use client";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { Construction } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { InputText } from "primereact/inputtext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFileCsv,
  faCalendar,
  faEdit,
  faArchive,
  faFile,
  faPrint,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

import "./styles.css";
import api_url from "@/components/api_conf";

import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

import withLoading from "../../../components/withLoading";

interface BDRRMC {
  ID: number;
  TypeOfRecord: string;
  PartiesInvolved: string;
  DateTime: string;
  Location: string;
  RecordDetails: string;
  IssuingOfficer: string;
}

const Bdrrmc: React.FC = () => {
  const toast = useRef<Toast>(null);

  const showSuccessFul = () => {
    toast.current!.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [selectedDateValidity, setSelectedDateValidity] = useState<Date | null>(
    null
  );

  const handleDateChangeValidity = (date: Date | null) => {
    setSelectedDateValidity(date);
  };

  const [selectedOptionGender, setSelectedOptionGender] = useState<string>("");
  const handleSelectChangeGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionGender(event.target.value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const CustomInput = ({ value, onClick }: any) => (
    <div className="relative">
      <input
        className="p-2 mt-[-2px] rounded-md border-2 border-grey" // Adjust padding as needed
        value={value}
        onClick={onClick}
        readOnly
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="absolute top-1/2 transform -translate-y-1/2 text-black right-px"
        style={{ marginRight: "15px" }}
      />
    </div>
  );

  const CustomInputValidity = ({ value, onClick }: any) => (
    <div className="relative">
      <input
        className="p-2 mt-[-2px] rounded-md border-2 border-grey w-full" // Adjust padding as needed
        value={value}
        onClick={onClick}
        readOnly
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="absolute top-1/2 transform -translate-y-1/2 text-black right-px"
        style={{ marginRight: "15px" }}
      />
    </div>
  );

  const [selectedOptionCategory, setSelectedOptionCategory] =
    useState<string>("");
  const handleSelectChangeCategory = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCategory(event.target.value);
  };

  const [selectedOptionDocumentStatus, setSelectedOptionDocumentStatus] =
    useState<string>("For Printing");
  const handleSelectChangeDocumentStatus = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionDocumentStatus(event.target.value);
  };

  const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] =
    useState<string>("");
  const handleSelectChangeCivilStatus = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCivilStatus(event.target.value);
  };

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BATIS e-Nexus - Blotter Records";
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

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    var getclearance = async () => {
      await axios
        .get(api_url + "bdrrmc")
        .then((response) => setResidents(response.data));
      return;
    };

    getclearance();
    initFilters();
  }, []);

  const [UpdateformData, setUpdateFormData] = useState({
    ID: "0",
    TypeOfRecord: "",
    PartiesInvolved: "",
    DateTime: "",
    Location: "",
    RecordDetails: "",
    IssuingOfficer: "",
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      ID: "0",
      TypeOfRecord: "",
      PartiesInvolved: "",
      DateTime: "",
      Location: "",
      RecordDetails: "",
      IssuingOfficer: "",
    });
  };
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log(name, value); // Check the values of name and value
    setUpdateFormData({
      ...UpdateformData,
      [name]: value,
    });
  };

  const [residents, setResidents] = useState();

  const exportExcel = () => {
    import("xlsx").then(async (xlsx) => {
      const response = await axios.get(api_url + "bdrrmc");
      const worksheet = xlsx.utils.json_to_sheet(response.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "bdrrmc");
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

  const [individualResidents, setindividualResidents] = useState<BDRRMC | null>(
    null
  );
  const [deleteResidentDialog, setDeleteResidentDialog] = useState(false);

  const printRowData = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    var printDocumentURL =
      api_url +
      "bdrrmc/" +
      individualResidents.ID +
      "/bdrrmc_" +
      individualResidents.ID;
    console.log(printDocumentURL);
    window.open(printDocumentURL, "_blank");
  };

  const confirmDeleteResident = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    setDeleteResidentDialog(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteResidentDialog(false);
  };

  const DeleteResidentApi = () => {
    var userIDTobeDeleted = individualResidents!.ID;
    axios
      .delete(api_url + "bdrrmc", {
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
            .get(api_url + "bdrrmc")
            .then((response) => setResidents(response.data));
          setDeleteResidentDialog(false);
          setVisible(false);
          showSuccessFul();
        }
      });
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
        onClick={DeleteResidentApi}
      />
    </React.Fragment>
  );

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [UserError, setUserError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [modalState, setmodalState] = useState("");

  const [shouldShowButton, setshouldShowButton] = useState(false);

  const footerContent = isFormDisabled ? null : (
    <div className="flex flex-row justify-end">
      {shouldShowButton && (
        <button
          type="button"
          className="py-2 px-10 rounded-lg bg-gray-800 rounded-lg"
          style={{ color: "white" }}
          onClick={() => setDeleteResidentDialog(true)}
        >
          <FontAwesomeIcon icon={faArchive as IconProp} className="mr-2" />
          Archive
        </button>
      )}
      <button
        type="button"
        className="py-2 px-10 rounded-lg bg-red-800 rounded-lg"
        style={{ color: "white" }}
        onClick={shouldShowButton ? CreateUserAPI : AddNewRecord}
      >
        <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
        {modalState} Record
      </button>
    </div>
  );

  const onRowSelect = (event: any) => {
    setIsFormDisabled(true);
    setindividualResidents({ ...event.data });
    setVisible(true);
    setUpdateFormData({
      ID: event.data.ID,
      TypeOfRecord: event.data.TypeOfRecord,
      PartiesInvolved: event.data.PartiesInvolved,
      DateTime: event.data.DateTime,
      Location: event.data.Location,
      RecordDetails: event.data.RecordDetails,
      IssuingOfficer: event.data.IssuingOfficer,
    });

    setSelectedOptionCategory(event.data.TypeOfRecord);

    var datePartsValidity = event.data.DateTime.split(/[\/\s:-]+/);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[2]), // Year
      parseInt(datePartsValidity[0]) - 1, // Month
      parseInt(datePartsValidity[1]) // Day
    );
    setSelectedDateValidity(dateObjectValidity);
  };

  const onRowView = (individualResident: any) => {
    setindividualResidents({ ...individualResident.data });
    setVisible(true);
    setUpdateFormData({
      ID: individualResident.ID,
      TypeOfRecord: individualResident.TypeOfRecord,
      PartiesInvolved: individualResident.PartiesInvolved,
      DateTime: individualResident.DateTime,
      Location: individualResident.Location,
      RecordDetails: individualResident.RecordDetails,
      IssuingOfficer: individualResident.IssuingOfficer,
    });

    setSelectedOptionCategory(individualResident.TypeOfRecord);

    var datePartsValidity = individualResident.DateTime.split(/[\/\s:-]+/);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[2]), // Year
      parseInt(datePartsValidity[0]) - 1, // Month
      parseInt(datePartsValidity[1]) // Day
    );
    setSelectedDateValidity(dateObjectValidity);
  };

  const editResident = (individualResident: any) => {
    setIsFormDisabled(false);
    setindividualResidents({ ...individualResident });
    console.log(individualResident);
    setVisible(true);
    setmodalState("Update");
    setUpdateFormData({
      ID: individualResident.ID,
      TypeOfRecord: individualResident.TypeOfRecord,
      PartiesInvolved: individualResident.PartiesInvolved,
      DateTime: individualResident.DateTime,
      Location: individualResident.Location,
      RecordDetails: individualResident.RecordDetails,
      IssuingOfficer: individualResident.IssuingOfficer,
    });

    setSelectedOptionCategory(individualResident.TypeOfRecord);

    var datePartsValidity = individualResident.DateTime.split(/[\/\s:-]+/);
    console.log(datePartsValidity[2]);
    console.log(datePartsValidity[0]);
    console.log(datePartsValidity[1]);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[2]), // Year
      parseInt(datePartsValidity[0]) - 1, // Month
      parseInt(datePartsValidity[1]) // Day
    );
    setSelectedDateValidity(dateObjectValidity);

    console.log(individualResident.ID);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <button
          type="button"
          className="text-xs py-2 px-5 mr-2 rounded-lg bg-red-800 rounded-lg border-solid border-red-800 border-2 hover:bg-red-900 transition-all"
          style={{ color: "white" }}
          onClick={() => printRowData(rowData)}
        >
          <FontAwesomeIcon icon={faPrint as IconProp} className="mr-2" />
          Print
        </button>
        <button
          type="button"
          className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2 hover:bg-gray-400 transition-all"
          onClick={() => {
            setIsFormDisabled(true);
            onRowView(rowData);
          }}
        >
          <FontAwesomeIcon icon={faFile as IconProp} className="mr-2" />
          View
        </button>
        <button
          type="button"
          className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2 hover:bg-gray-400 transition-all"
          onClick={() => {
            setshouldShowButton(true);
            editResident(rowData);
          }}
        >
          <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
          Edit
        </button>
      </React.Fragment>
    );
  };

  const actionStatusTemplate = (rowData: any) => {
    return (
      <Tag value={rowData.DocumentStatus} severity={getSeverity(rowData)}></Tag>
    );
  };

  const getSeverity = (rowData: any) => {
    switch (rowData.DocumentStatus) {
      case "Claimed":
        return "success";
      case "Printing":
        return "warning";
      case "For Printing":
        return "danger";
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (selectedOptionDocumentStatus) {
      case "For Printing":
        return "#EF4444";
      case "Printing":
        return "#F59E0B";
      case "Claimed":
        return "#22C55E";
    }
  };

  async function CreateUserAPI() {
    const DocumentValidityDate = selectedDateValidity || new Date();
    var formatedValidityDate = format(DocumentValidityDate, "MM/dd/yyyy");

    await axios
      .put(
        api_url + "bdrrmc",
        {
          ID: parseInt(UpdateformData.ID),
          TypeOfRecord: selectedOptionCategory,
          PartiesInvolved: UpdateformData.PartiesInvolved,
          DateTime: formatedValidityDate,
          Location: UpdateformData.Location,
          RecordDetails: UpdateformData.RecordDetails,
          IssuingOfficer: UpdateformData.IssuingOfficer,
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
            .get(api_url + "bdrrmc")
            .then((response) => setResidents(response.data));
        } else {
          setUserError(response.data.Message || "An error occurred");
          setTimeout(() => {
            setUserError(null);
          }, 3000); // 3000 milliseconds = 3 second
        }
      });
  }

  async function AddNewRecord() {
    const DocumentValidityDate = selectedDateValidity || new Date();
    var formatedValidityDate = format(DocumentValidityDate, "MM/dd/yyyy");

    await axios
      .post(
        api_url + "bdrrmc",
        {
          ID: parseInt(UpdateformData.ID),
          TypeOfRecord: selectedOptionCategory,
          PartiesInvolved: UpdateformData.PartiesInvolved,
          DateTime: formatedValidityDate,
          Location: UpdateformData.Location,
          RecordDetails: UpdateformData.RecordDetails,
          IssuingOfficer: FullName,
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
            .get(api_url + "bdrrmc")
            .then((response) => setResidents(response.data));
        } else {
          setUserError(response.data.Message || "An error occurred");
          setTimeout(() => {
            setUserError(null);
          }, 3000); // 3000 milliseconds = 3 second
        }
      });
  }

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

  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2 ">
        Blotter Records
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
          Blotter Records
        </Typography>
      </Breadcrumbs>
      <div className="flex justify-content-between gap-5 pb-4 pt-4">
        <InputText
          className="grow w-5/12"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
        <button
          type="button"
          className="py-2 px-10 rounded-lg bg-red-800 text-white hover:text-red-900 hover:bg-white hover:border-red-900 hover:border-2 font-bold transition-all"
          onClick={() => {
            setVisible(true);
            setshouldShowButton(false);
            setmodalState("Add");
            setSelectedDateValidity(null);
          }}
        >
          <FontAwesomeIcon
            icon={faFileCirclePlus as IconProp}
            className="mr-2"
          />
          Add New Record
        </button>
        <button
          type="button"
          className="py-2 px-10 rounded-lg bg-white hover:bg-red-900 hover:text-white border-2 border-red-900 text-red-900 font-bold transition-all"
          onClick={exportExcel}
        >
          <FontAwesomeIcon icon={faFileCsv as IconProp} className="mr-2" />
          Export .csv file
        </button>
      </div>
      <div className="mt-20 items-center content-center self-center place-self-center">
        <div className=" flex flex-col items-center content-center self-center place-self-center">
        <Construction className="p-5 w-50 h-50 bg-red-900 rounded-lg text-white border-black  ">  </Construction>
        <p className="font-bold text-3xl">
          Page under Construction
        </p>
        </div>

      </div>
    </div>
  );
};

export default withLoading(Bdrrmc);
