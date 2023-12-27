"use client";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
import {faFileCsv,faCalendar,faEdit,faArchive,faFile,faPrint } from '@fortawesome/free-solid-svg-icons';

import "./styles.css";                         
import api_url from "@/components/api_conf";


import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';


import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';

import { Tag } from 'primereact/tag';
import withLoading from '../../../components/withLoading';


interface Indigency {
  ID: number;
  ResidentID: number;
  DateCreated: string;
  DateUpdated: string;
  Reason: string;
  ValidUntil: string;
  IssuingOfficer: string;
  Remarks: string;
}
const Indigencies: React.FC = () =>{
  const toast = useRef<Toast>(null);

  const showSuccessFul = () => {
    toast.current!.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000});
  };

  
  
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [selectedDateValidity, setSelectedDateValidity] = useState<Date | null>(null);

  const handleDateChangeValidity = (date: Date | null) => {
    setSelectedDateValidity(date);
  };


  const [selectedOptionGender, setSelectedOptionGender] = useState<string>(''); 
  const handleSelectChangeGender = (event:ChangeEvent<HTMLSelectElement>) =>{
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
        style={{marginRight:"15px"}}
      />
    </div>
  );

  const CustomInputValidity = ({ value, onClick }: any) => (
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
        style={{marginRight:"55px"}}
      />
    </div>
  );

  const [selectedOptionDocumentStatus, setSelectedOptionDocumentStatus] = useState<string>('For Printing'); 
  const handleSelectChangeDocumentStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionDocumentStatus(event.target.value);
  };

  
  const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] = useState<string>(''); 
  const handleSelectChangeCivilStatus = (event:ChangeEvent<HTMLSelectElement>) =>{
    setSelectedOptionCivilStatus(event.target.value);
  };

  const [selectedOptionCategory, setSelectedOptionCategory] = useState<string>(''); 
  const handleSelectChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCategory(event.target.value);
  };

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);


  useEffect(() => {
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
    userID:'0',
    Purpose: '',
    ResidentLastName: '',
    ResidentFirstName: '',
    ResidentMiddleName: '',
    Remarks: '',
    ResidentID: '',
    PhilhealthNum: '',
    Address:'',
    HealthCardGGGNum:'',
    MobileNumber: '',
    BirthPlace: '',
    ParentName: '',
    CedulaNo: '',
    PrecintNo: '',
    ParentNumber: '',
    reasonForReferral: '',
    DocumentStatus: '',
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      userID: '0',
      Purpose: '',
      ResidentLastName: '',
      ResidentFirstName: '',
      ResidentMiddleName: '',
      Remarks: '',
      ResidentID: '',
      PhilhealthNum: '',
      Address:'',
      HealthCardGGGNum:'',
      MobileNumber: '',
      BirthPlace: '',
      ParentName: '',
      CedulaNo: '',
      PrecintNo: '',
      ParentNumber: '',
      reasonForReferral: '',
      DocumentStatus: '',
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
    

  const exportExcel = () => {
    import('xlsx').then(async (xlsx) => {
        const response = await axios.get(api_url+'indigenciesxl');
        const worksheet = xlsx.utils.json_to_sheet(response.data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'indigencies');
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

  
  const [individualResidents, setindividualResidents] = useState<Indigency |null>(null);
  const [deleteResidentDialog, setDeleteResidentDialog] = useState(false);

  const confirmDeleteResident = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    setDeleteResidentDialog(true);
  };

  const printRowData = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    var printDocumentURL =  api_url+"indigencies/"+individualResidents.ResidentID+"/"+individualResidents.ID +
    "/indigencies_"+individualResidents.ResidentID+"_"+individualResidents.ID+".pdf"
    console.log(printDocumentURL);
    window.location.href = printDocumentURL;
  };


  const hideDeleteUserDialog = () => {
    setDeleteResidentDialog(false);
  };

  const DeleteResidentApi = () =>{
    var userIDTobeDeleted = individualResidents!.ID;
    var ResID = individualResidents!.ResidentID;
    axios.delete(api_url+"indigencies", {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ID: userIDTobeDeleted,
        ResidentID: ResID,
      }
    }) 
    .then(async response => {
      if (response.data.Success){
        await axios.get(api_url+'indigencies')
        .then(response => setResidents(response.data));
        setDeleteResidentDialog(false);
        setVisible(false);
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
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const [UserError, setUserError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const footerContent = isFormDisabled ? null : (

    <div className="flex flex-row justify-end">
        <button type="button" className="py-2 px-10 rounded-lg bg-gray-800 rounded-lg" style={{color:'white'}} onClick={() => setDeleteResidentDialog(true)}>
              <FontAwesomeIcon icon={faArchive as IconProp} className="mr-2" />
              Archive
        </button>
        <button type="button" className="py-2 px-10 rounded-lg bg-red-800 rounded-lg" style={{color:'white'}} onClick={CreateUserAPI}>
              <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
              Update Record
        </button>
    </div>
  );

  
  const onRowSelect = (event: any) => {
    setIsFormDisabled(true);
    setindividualResidents({ ...event.data });
    setVisible(true);
    setUpdateFormData({
      userID: event.data.ID,
      Purpose: event.data.Reason,
      Remarks: event.data.Remarks,
      ResidentLastName: event.data.ResidentData.LastName,
      ResidentFirstName: event.data.ResidentData.FirstName,
      ResidentMiddleName: event.data.ResidentData.MiddleName,
      ResidentID: event.data.ResidentID,
      PhilhealthNum: '',
      Address: event.data.ResidentData.Address,
      HealthCardGGGNum:'',
      MobileNumber: event.data.ResidentData.ContactNumber,
      BirthPlace: event.data.ResidentData.BirthPlace,
      ParentName: event.data.ResidentData.GuardianName,
      CedulaNo: event.data.cedulaNo,
      PrecintNo: event.data.precintNo,
      ParentNumber: event.data.ResidentData.GurdianContactNumbers,
      reasonForReferral: '',
      DocumentStatus: event.data.DocumentStatus,
    });

    setSelectedOptionGender(event.data.ResidentData.Gender);
    setSelectedOptionCivilStatus(event.data.ResidentData.CivilStatus);
    setSelectedOptionDocumentStatus(event.data.DocumentStatus);
    //setSelectedOptionCategory(event.data.)

    var datePartsValidity = event.data.ValidUntil.split(/[\s:-]+/);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[0]),     // Year
      parseInt(datePartsValidity[1]) - 1, // Month
      parseInt(datePartsValidity[2]),     // Day
    );
    setSelectedDateValidity(dateObjectValidity);

    const dateParts = event.data.ResidentData.BirthDate.split("/");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; 
    const day = parseInt(dateParts[1], 10);
    var dateObject = new Date(year, month, day);
    setSelectedDate(dateObject);
  };

  const onRowView = (individualResident: any) => {
    setIsFormDisabled(true);
    setindividualResidents({ ...individualResident.data });
    setVisible(true);
    setUpdateFormData({
      userID: individualResident.ID,
      Purpose: individualResident.Reason,
      Remarks: individualResident.Remarks,
      ResidentLastName: individualResident.ResidentData.LastName,
      ResidentFirstName: individualResident.ResidentData.FirstName,
      ResidentMiddleName: individualResident.ResidentData.MiddleName,
      ResidentID: individualResident.ResidentID,
      PhilhealthNum: '',
      Address: individualResident.ResidentData.Address,
      HealthCardGGGNum:'',
      MobileNumber: individualResident.ResidentData.ContactNumber,
      BirthPlace: individualResident.ResidentData.BirthPlace,
      ParentName: individualResident.ResidentData.GuardianName,
      CedulaNo: individualResident.cedulaNo,
      PrecintNo: individualResident.precintNo,
      ParentNumber: individualResident.ResidentData.GurdianContactNumbers,
      reasonForReferral: '',
      DocumentStatus: individualResident.DocumentStatus,
    });

    setSelectedOptionGender(individualResident.ResidentData.Gender);
    setSelectedOptionCivilStatus(individualResident.ResidentData.CivilStatus);
    setSelectedOptionDocumentStatus(individualResident.DocumentStatus);
    //setSelectedOptionCategory(event.data.)

    // var datePartsValidity = individualResident.ValidUntil.split(/[\s:-]+/);
    // var dateObjectValidity = new Date(
    //   parseInt(datePartsValidity[0]),     // Year
    //   parseInt(datePartsValidity[1]) - 1, // Month
    //   parseInt(datePartsValidity[2]),     // Day
    // );
    // setSelectedDateValidity(dateObjectValidity);

    const dateParts = individualResident.ResidentData.BirthDate.split("/");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; 
    const day = parseInt(dateParts[1], 10);
    var dateObject = new Date(year, month, day);
    setSelectedDate(dateObject);
  };
  

  const editResident = (individualResident: any) => {
    setIsFormDisabled(false);
    setindividualResidents({ ...individualResident });
    console.log(individualResident);
    setVisible(true);
    setUpdateFormData({
      userID: individualResident.ID,
      Remarks: individualResident.Remarks,
      ResidentID: individualResident.ResidentID,
      ResidentLastName: individualResident.ResidentData.LastName,
      ResidentFirstName: individualResident.ResidentData.FirstName,
      ResidentMiddleName: individualResident.ResidentData.MiddleName,
      PhilhealthNum: '',
      Address: individualResident.ResidentData.Address,
      HealthCardGGGNum:'',
      MobileNumber: individualResident.ResidentData.ContactNumber,
      BirthPlace: individualResident.ResidentData.BirthPlace,
      ParentName: individualResident.ResidentData.GuardianName,
      CedulaNo: individualResident.cedulaNo,
      PrecintNo: individualResident.precintNo,
      ParentNumber: individualResident.ResidentData.GurdianContactNumbers,
      reasonForReferral: '',
      DocumentStatus: individualResident.DocumentStatus,
      Purpose: individualResident.Reason,
    });

    setSelectedOptionGender(individualResident.ResidentData.Gender);
    setSelectedOptionCivilStatus(individualResident.ResidentData.CivilStatus);
    setSelectedOptionDocumentStatus(individualResident.DocumentStatus);
    //setSelectedOptionCategory(event.data.)

    var datePartsValidity = individualResident.ValidUntil.split(/[\s:-]+/);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[0]),     // Year
      parseInt(datePartsValidity[1]) - 1, // Month
      parseInt(datePartsValidity[2]),     // Day
    );
    setSelectedDateValidity(dateObjectValidity);

    const dateParts = individualResident.ResidentData.BirthDate.split("/");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; 
    const day = parseInt(dateParts[1], 10);
    var dateObject = new Date(year, month, day);
    setSelectedDate(dateObject);

    console.log(individualResident.ID);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
        <React.Fragment>
          <button type="button" className="text-xs py-2 px-5 mr-2 rounded-lg bg-red-800 rounded-lg border-solid border-red-800 border-2" style={{color:'white'}} 
          onClick={() => printRowData(rowData)}>
                <FontAwesomeIcon icon={faPrint as IconProp} className="mr-2" />
                Print
          </button>
          <button type="button" className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2" onClick={() => {
              onRowView(rowData);
            }}>
                <FontAwesomeIcon icon={faFile as IconProp} className="mr-2" />
                View
          </button>
          <button type="button" className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2" onClick={() => {
              editResident(rowData);
            }}>
                <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
                Edit
          </button>
        </React.Fragment>
    );
  };

  
  const actionStatusTemplate = (rowData: any) => {

    return <Tag value={rowData.DocumentStatus== "Printing" ? "Printed" : rowData.DocumentStatus} severity={getSeverity(rowData)}></Tag>;
};

const getSeverity = (rowData: any) => {
  switch (rowData.DocumentStatus) {
    case 'Claimed':
        return 'success';
    case 'Printing':
        return 'warning';
    case 'For Printing':
        return 'danger';
    default:
        return null;
  }
};

const getBackgroundColor = () => {
  switch (selectedOptionDocumentStatus) {
    case 'For Printing':
      return '#EF4444';
    case 'Printing':
      return '#F59E0B';
    case 'Claimed':
      return '#22C55E';
  }
};


  async function CreateUserAPI(){
    
    const BirthDateSelected =  selectedDate || new Date();
    var formatedBirthDate = format(BirthDateSelected, 'MM/dd/yyyy');

    //const DocumentValidityDate =  selectedDateValidity || new Date();
    //var formatedValidityDate = format(DocumentValidityDate, 'MM/dd/yyyy');

      await axios.put(api_url+'indigencies', {
        ID: parseInt(UpdateformData.userID),
        Remarks: UpdateformData.Remarks,
        ResidentID: parseInt(UpdateformData.ResidentID),
        CedulaNo: UpdateformData.CedulaNo,
        PrecintNo: UpdateformData.PrecintNo,
        DocumentStatus: selectedOptionDocumentStatus,
        Purpose: UpdateformData.Purpose,
        //ValidUntil: formatedValidityDate,
        ResidentData: {
          ID: parseInt(UpdateformData.ResidentID),
          LastName: UpdateformData.ResidentLastName,
          FirstName: UpdateformData.ResidentFirstName,
          MiddleName: UpdateformData.ResidentMiddleName,
          Address: UpdateformData.Address,
          BirthDate: formatedBirthDate,
          BirthPlace: UpdateformData.BirthPlace,
          Gender: selectedOptionGender,
          CivilStatus: selectedOptionCivilStatus,
          ContactNumber: UpdateformData.MobileNumber,
          GuardianName: UpdateformData.ParentName,
          GurdianContactNumbers: UpdateformData.ParentNumber,
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.data.Success){
          setVisible(false);
          resetUpdateForm();
          showSuccessFul();
          await axios.get(api_url+'indigencies')
          .then(response => setResidents(response.data));
        }else{
          setUserError(response.data.Message || 'An error occurred');
          setTimeout(() => {
            setUserError(null);
          }, 3000); // 3000 milliseconds = 3 second
        }
      });
    };

  
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
  useEffect(() => {

    var getIndigencies = async () =>{
      await axios.get(api_url+'indigencies')
      .then(response => setResidents(response.data));
      return;
    };

    getIndigencies();
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


  return(
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2">Indigency Records</h1>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          Indigency Records
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
          rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          selectionMode="single" selection={selectedProduct}
          onSelectionChange={(e) => setSelectedProduct(e.ID)} dataKey="ID"
                    onRowSelect={onRowSelect} metaKeySelection={false}
          >
            <Column field="ID" header="ID" sortable></Column>
            <Column field="DateCreated" header="Date Created" sortable></Column>
            <Column field="ResidentData.LastName" header="Last Name" sortable></Column>
            <Column field="ResidentData.LastName" header="First Name" sortable></Column>
            <Column field="ResidentData.LastName" header="Middle Name" sortable></Column>
            <Column field="Reason" header="Reason for Referral" sortable></Column>
            <Column field="IssuingOfficer" header="Issuing Officer" sortable></Column>
            <Column body={actionStatusTemplate} header="Status" style={{ minWidth: '8rem' }} sortable></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '20rem' }}></Column>
          </DataTable>

          <Dialog visible={deleteResidentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {residents && (
                        <span>
                         Are you sure you want to archive this record ?
                        </span>
                    )}
                </div>
          </Dialog>

          <div className="card flex justify-content-center">
              <Dialog header="Indigency Record" visible={visible} style={{ width: '70vw' }} 
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
                
                <div className="border-t-2 border-black pb-2"></div>
                <form className="flex flex-col my-4 gap-2">
                  <input type="hidden" id="userID" 
                  value={UpdateformData.userID}
                  onChange={handleInputChange}
                  ></input>
                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col grow">
                     <label htmlFor="ResidentLastName" className="col-form-label">Last Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentLastName" name="ResidentLastName"
                      value={UpdateformData.ResidentLastName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="ResidentFirstName" className="col-form-label">First Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentFirstName" name="ResidentFirstName"
                      value={UpdateformData.ResidentFirstName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="ResidentMiddleName" className="col-form-label">Middle Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentMiddleName" name="ResidentMiddleName"
                      value={UpdateformData.ResidentMiddleName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="PhilhealthNum" className="col-form-label">PhilHealth Member No.</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="PhilhealthNum" name="PhilhealthNum"
                      value={UpdateformData.PhilhealthNum}
                      onChange={handleInputChange}
                      disabled={true}
                      //disabled={isFormDisabled}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col w-8/12">
                      <label htmlFor="Address" className="col-form-label">Address:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="Address" name="Address"
                      value={UpdateformData.Address}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                    <label htmlFor="PhilhealthCategory" className="col-form-label">PhilhealthCategory</label>
                      <select id="category" className="p-2 mt-[-2px] rounded-md border-2 border-grey" 
                      disabled={true}
                      //disabled={isFormDisabled}
                    name="category" value={selectedOptionCategory} onChange={handleSelectChangeCategory}  >
                        <option value=""></option>
                        <option value="Dependent">Dependent</option>
                        <option value="Senior">Senior</option>
                        <option value="NHTs">NHTs</option>
                        <option value="APs">APs</option>
                      </select>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="HealthCardGGGNum" className="col-form-label">Health Card GGG Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="HealthCardGGGNum" name="HealthCardGGGNum"
                      value={UpdateformData.HealthCardGGGNum}
                      onChange={handleInputChange}
                      disabled={true}
                      //disabled={isFormDisabled}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="MobileNumber" className="col-form-label">Tel/Mobile Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="MobileNumber" name="MobileNumber"
                      value={UpdateformData.MobileNumber}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="flex flex-col">
                      <label className="col-form-label" htmlFor="birthDate">Birthdate
                      </label>
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
                          disabled={isFormDisabled}
                        />
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="BirthPlace" className="col-form-label">Birth Place:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="BirthPlace" name="BirthPlace"
                      value={UpdateformData.BirthPlace}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                    <label htmlFor="Gender" className="col-form-label">Gender</label>
                      <select id="Gender" className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    name="Gender" value={selectedOptionGender} onChange={handleSelectChangeGender}  
                    disabled={isFormDisabled}
                    >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="ParentName" className="col-form-label">Parent/Guardian Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ParentName" name="ParentName"
                      value={UpdateformData.ParentName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="CedulaNo" className="col-form-label">Cedula No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="CedulaNo" name="CedulaNo"
                      value={UpdateformData.CedulaNo}
                      onChange={handleInputChange}
                      disabled={true}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="PrecintNo" className="col-form-label">Precinct No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="PrecintNo" name="PrecintNo"
                      value={UpdateformData.PrecintNo}
                      onChange={handleInputChange}
                      disabled={true}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col w-3/12">
                    <label htmlFor="CivilStatus" className="col-form-label">Civil Status:</label>
                    <select id="CivilStatus" className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                    name="category" value={selectedOptionCivilStatus} onChange={handleSelectChangeCivilStatus}  
                    disabled={isFormDisabled}>
                        <option value=""></option>
                        <option value="Married">Married</option>
                        <option value="Single">Single</option>
                        <option value="Widow">Widow</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="ParentNumber" className="col-form-label">Parent/Guardian Contact No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ParentNumber" name="ParentNumber"
                      value={UpdateformData.ParentNumber}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="Purpose" className="col-form-label">Purpose:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="Purpose" name="Purpose"
                      value={UpdateformData.Purpose}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="flex flex-col">
                    <label className="col-form-label" htmlFor="DocumentValidity">(For Brgy. Staff) Document Validity
                    </label>
                      <DatePicker
                        name="DocumentValidity"
                        id="DocumentValidity"
                        selected={selectedDateValidity}
                        onChange={handleDateChangeValidity}
                        dateFormat="MM/dd/yyyy"
                        className="p-2 mt-[-2px] rounded-md border-2 border-grey"
                        customInput={<CustomInputValidity />}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex flex-col grow">
                      <label htmlFor="reasonForReferral">Reason for Referral:</label>
                      <textarea
                        className="rounded-md  border-2 border-grey"
                        name="reasonForReferral"
                        id="reasonForReferral"
                        cols={42}
                        rows={5}
                        value={UpdateformData.reasonForReferral}
                        disabled={true}
                        //disabled={isFormDisabled}
                      ></textarea>
                    </div>
                    <div className="flex flex-col grow">
                    <label htmlFor="Remarks">Remarks:</label>
                      <textarea
                        className="rounded-md  border-2 border-grey"
                        name="Remarks"
                        id="Remarks"
                        cols={70}
                        rows={5}
                        value={UpdateformData.Remarks}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <div className="pb-2 flex flex-row ">
                    <label htmlFor="DocumentStatus" className="pt-1 pr-12 col-form-label text-xl">Document Status: </label>
                      <select id="DocumentStatus" className="p-2 mt-[-2px] rounded-md border-5 w-60 text-white border-solid border-black"
                    name="DocumentStatus" value={selectedOptionDocumentStatus} onChange={handleSelectChangeDocumentStatus}
                    style={{ backgroundColor: getBackgroundColor() }}  
                    disabled={isFormDisabled}>
                        <option value="For Printing">For Printing</option>
                        <option value="Printing">Printed</option>
                        <option value="Claimed">Claimed</option>
                      </select>
                    </div>
                  </div>

              </form>
              </Dialog>
              </div>
          
          <Toast ref={toast} />
          <div className="">
        <p className="">Build 0.2 Alpha. Developed by PUP-SJ BSIT 4-1 Batch 2023-2024</p>
      </div>
    </div>
  )
}

export default withLoading(Indigencies);