"use client";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import "primereact/resources/primereact.min.css";  
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import { InputText } from 'primereact/inputtext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faPlusSquare, faFileCsv,faAdd,faCalendar } from '@fortawesome/free-solid-svg-icons';

import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';

import "./styles.css";                         
import api_url from "@/components/api_conf";
import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

interface Resident {
  ID: number;
  DateCreated: string;
  DateUpdated: string;
  LastName: string;
  FirstName: string;
  MiddleName: string;
  Address: string;
  BirthDate: string;
  BirthPlace: string;
  Gender: string;
  CivilStatus: string;
  ContactNumber: string;
  GuardianName: string;
  GuardianContactNumbers: string;
  Religion: string;
  Occupation: string;
  IssuingOfficer: string;
  DocumentType: string;
  DocumentID: number;
}

export default function ResidentsList() {

  const toast = useRef<Toast>(null);

  const showSuccessFul = () => {
    toast.current!.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000});
  };

  const [selectedOptionGender, setSelectedOptionGender] = useState<string>(''); 
  const handleSelectChangeGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionGender(event.target.value);
  };

  const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] = useState<string>(''); 
  const handleSelectChangeCivilStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCivilStatus(event.target.value);
  };

  const [UserError, setUserError] = useState<string | null>(null);
  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);
  const [UserName, setUserName] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
    

  const CustomInput = ({ value, onClick }: any) => (
    <div className="relative p-2 mt-[-2px] rounded-md border-2 border-grey">
      <input
        className="" // Adjust padding as needed
        value={value}
        onClick={onClick}
        readOnly
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="absolute top-1/2 transform -translate-y-1/2 text-black right-px"
        style={{marginRight:"15px"}}
      />
    </div>
  );

  useEffect(() => {
    setUserName(localStorage.getItem('Username'));
    setUserID(localStorage.getItem('ID'));
    setFullName(localStorage.getItem('fullName'));
    setIsAdmin(localStorage.getItem('isAdmin'));
    setProfileLink(localStorage.getItem('profileLink'));
    CheckIfLoggedIn();
  }, []);

  function CheckIfLoggedIn() {
    console.log(localStorage.getItem('ID'));
    if (localStorage.getItem('ID') == null){
      window.location.href = '/';
    }
  }

  const [UpdateformData, setUpdateFormData] = useState({
    userID: '0',
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    birthPlace: "",
    contactNumber: "",
    guardianName: "",
    gurdianContactNumbers: "",
    religion: "",
    occupation: "",
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      userID: '0',
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      birthPlace: "",
      contactNumber: "",
      guardianName: "",
      gurdianContactNumbers: "",
      religion: "",
      occupation: "",
    });
  };
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    console.log(name, value); // Check the values of name and value
    setUpdateFormData({
      ...UpdateformData,
      [name]: value,
    });
  };


  const [residents, setResidents] = useState();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {

    var getResidents= async () =>{
      await axios.get(api_url+'residents')
      .then(response => setResidents(response.data));
      return;
    };

    getResidents();
    initFilters();
  }, []);

  const onGlobalFilterChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  }

  const exportExcel = () => {
    import('xlsx').then(async (xlsx) => {
        const response = await axios.get(api_url+'residents');
        const worksheet = xlsx.utils.json_to_sheet(response.data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'resident_list');
    });
};

const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    });
};

  
  const [individualResidents, setindividualResidents] = useState<Resident | null>(null);
  const [deleteResidentDialog, setDeleteResidentDialog] = useState(false);

  const confirmDeleteResident = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    setDeleteResidentDialog(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteResidentDialog(false);
  };

  const DeleteResidentApi = () =>{
    var userIDTobeDeleted = individualResidents!.ID;
    var docID = individualResidents!.DocumentID;
    var docType = individualResidents!.DocumentType;
    axios.delete(api_url+"residents", {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ID: userIDTobeDeleted,
        DocumentID: docID,
        DocumentType: docType
      }
    }) 
    .then(async response => {
      if (response.data.Success){
        await axios.get(api_url+'residents')
        .then(response => setResidents(response.data));
        setDeleteResidentDialog(false);
        showSuccessFul();
      }
    });
  };

  const deleteUserDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog}/>
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={DeleteResidentApi}/>
    </React.Fragment>
  );

  
  const [visible, setVisible] = useState(false);

  const footerContent = (
    <div className="flex flex-col items-center justify-center">
        <button type="button" className="py-2 px-10 rounded-lg bg-red-800 rounded-lg" style={{color:'white'}} onClick={CreateUserAPI}>
              <FontAwesomeIcon icon={faAdd as IconProp} className="mr-2" />
              Submit
        </button>
    </div>
  );

  

  const editResident = (individualResident: any) => {
    setindividualResidents({ ...individualResident });
    console.log(individualResident);
    setVisible(true);
    setUpdateFormData({
      userID: individualResident.ID,
      firstName: individualResident.FirstName,
      middleName: individualResident.MiddleName,
      lastName: individualResident.LastName,
      address: individualResident.Address,
      birthPlace: individualResident.BirthPlace,
      contactNumber: individualResident.ContactNumber,
      guardianName: individualResident.GuardianName,
      gurdianContactNumbers: individualResident.GurdianContactNumbers,
      religion: individualResident.Religion,
      occupation: individualResident.Occupation,
    });
    setSelectedOptionGender(individualResident.Gender);
    setSelectedOptionCivilStatus(individualResident.CivilStatus);

    const dateParts = individualResident.BirthDate.split("/");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; 
    const day = parseInt(dateParts[1], 10);

    const dateObject = new Date(year, month, day);

    setSelectedDate(dateObject);

    console.log(individualResident.ID);
  };
  const actionBodyTemplate = (rowData: any) => {
    console.log(IsAdmin);

    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
            onClick={() => {
              editResident(rowData);
            }}/>
          {IsAdmin=="false" ? (
            // Render nothing (Delete button is not shown)
            null
          ) : (
            // Render the Delete button
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              onClick={() => confirmDeleteResident(rowData)}
            />
          )}
        </React.Fragment>
    );
  };

  async function CreateUserAPI(){

    const newDate =  selectedDate || new Date();;
    var formatedDate = format(newDate, 'MM/dd/yyyy');

      await axios.put(api_url+'residents', {
        ID: parseInt(UpdateformData.userID),
        LastName: UpdateformData.lastName,
        FirstName: UpdateformData.firstName,
        MiddleName: UpdateformData.middleName,
        Address: UpdateformData.address,
        BirthPlace: UpdateformData.birthPlace, 
        ContactNumber: UpdateformData.contactNumber, 
        GuardianName: UpdateformData.guardianName, 
        GurdianContactNumbers: UpdateformData.gurdianContactNumbers, 
        Religion: UpdateformData.religion,
        Occupation: UpdateformData.occupation, 
        BirthDate: formatedDate, 
        Gender: selectedOptionGender,
        CivilStatus: selectedOptionCivilStatus, 
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.data.Success){
          setVisible(false);
          resetUpdateForm();
          showSuccessFul();
          await axios.get(api_url+'residents')
          .then(response => setResidents(response.data));
        }else{
          setUserError(response.data.Message || 'An error occurred');
          setTimeout(() => {
            setUserError(null);
          }, 3000); // 3000 milliseconds = 3 second
        }
      });
    };

  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2 ">
        Residents Requested Documents
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
          Residents Requested Documents
        </Typography>
      </Breadcrumbs>

      <div className="flex justify-content-between gap-8 pb-4 pt-4">
              <InputText className="w-9/12" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
              <button type="button" className="py-2 px-10 rounded-lg bg-white " onClick={exportExcel}>
               <FontAwesomeIcon icon={faFileCsv as IconProp} className="mr-2"  />
                Export .csv file
              </button>
          </div>
          <DataTable filters={filters} value={residents} size="small" removableSort stripedRows paginator rows={10} 
          rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column field="ID" header="ID" sortable></Column>
            <Column field="DateCreated" header="Date Created" sortable></Column>
            <Column field="DateUpdated" header="Date Updated" sortable></Column>
            <Column field="LastName" header="Last Name" sortable></Column>
            <Column field="FirstName" header="First Name" sortable></Column>
            <Column field="MiddleName" header="Middle Name" sortable></Column>
            <Column field="Address" header="Address" sortable></Column>
            <Column field="BirthDate" header="Birth Date" sortable></Column>
            <Column field="BirthPlace" header="Birth Place" sortable></Column>
            <Column field="Gender" header="Gender" sortable></Column>
            <Column field="CivilStatus" header="Civil Status" sortable></Column>
            <Column field="ContactNumber" header="Contact Number" sortable></Column>
            <Column field="GuardianName" header="Guardian Name" sortable></Column>
            <Column field="GurdianContactNumbers" header="Guardian Contact Numbers" sortable></Column>
            <Column field="Religion" header="Religion" sortable></Column>
            <Column field="Occupation" header="Occupation" sortable></Column>
            <Column field="IssuingOfficer" header="Issuing Officer" sortable></Column>
            <Column field="DocumentType" header="DocumentType" sortable></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          </DataTable>
          
          <Dialog visible={deleteResidentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {residents && (
                        <span>
                            Are you sure you want to delete ?
                        </span>
                    )}
                </div>
          </Dialog>

          <div className="card flex justify-content-center">
              <Dialog header="Update Resident" visible={visible} style={{ width: '50vw' }} 
              onHide={() => {
                setVisible(false);
                resetUpdateForm(); 
              }}
              footer={footerContent} position="top">
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
                  <input type="hidden" id="userID" 
                  value={UpdateformData.userID}
                  onChange={handleInputChange}
                  ></input>
                  <div className="flex gap-4 pb-4">
                    <div className="pb-2 flex flex-col grow">
                     <label htmlFor="first-name" className="col-form-label">First Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="first-name" name="firstName"
                       value={UpdateformData.firstName}
                        onChange={handleInputChange}
                       ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="middle-name" className="col-form-label">Middle Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="middle-name" name="middleName"
                      value={UpdateformData.middleName}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="last-name" className="col-form-label">Last Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="last-name" name="lastName"
                        value={UpdateformData.lastName}
                        onChange={handleInputChange}
                        ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4">
                    <div className="pb-2 flex flex-col grow">
                     <label htmlFor="address" className="col-form-label">Address:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="address" name="address"
                      value={UpdateformData.address}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="birthPlace" className="col-form-label">Birth Place:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="birthPlace" name="birthPlace"
                      value={UpdateformData.birthPlace}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4">
                  <div className="pb-2 flex flex-col grow">
                    <label className="col-form-label" htmlFor="birthDate">Birthdate:</label>
                      <DatePicker
                        name="birthDate"
                        id="birthDate"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                        customInput={<CustomInput />}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                      />
                    </div>
                  <div className="pb-2 flex flex-col grow">
                    <label htmlFor="gender" className="col-form-label">Gender:</label>
                    <select id="gender" className="p-2 mt-[-2px] rounded-md border-2 border-grey" 
                    name="gender" value={selectedOptionGender} onChange={handleSelectChangeGender}  >
                      <option selected>Please select one...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="pb-2 flex flex-col grow">
                    <label htmlFor="civilstatus" className="col-form-label">Civil Status:</label>
                    <select id="civilstatus" className="p-2 mt-[-2px] rounded-md border-2 border-grey" 
                    name="civilstatus" value={selectedOptionCivilStatus} onChange={handleSelectChangeCivilStatus}  >
                      <option selected>Please select one...</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widow">Widow</option>
                    </select>
                  </div>
                  </div>
                  <div className="flex gap-4 pb-4">
                    <div className="pb-2 flex flex-col grow">
                     <label htmlFor="contactNumber" className="col-form-label">Contact Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="contactNumber" name="contactNumber"
                      value={UpdateformData.contactNumber}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="guardianName" className="col-form-label">Guardian Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="guardianName" name="guardianName"
                      value={UpdateformData.guardianName}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="gurdianContactNumbers" className="col-form-label">Guardian Contact Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="gurdianContactNumbers" name="gurdianContactNumbers"
                      value={UpdateformData.gurdianContactNumbers}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4">
                    <div className="pb-2 flex flex-col grow">
                     <label htmlFor="religion" className="col-form-label">Religion:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="religion" name="religion"
                      value={UpdateformData.religion}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="occupation" className="col-form-label">Occupation:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="occupation" name="occupation"
                      value={UpdateformData.occupation}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                  </div>
              </form>
              </Dialog>
              </div>
              <Toast ref={toast} />
    </div>
  );
}
