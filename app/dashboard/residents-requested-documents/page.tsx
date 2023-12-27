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
import {faFileCsv,faCalendar,faEdit,faArchive,faFile,faPrint } from '@fortawesome/free-solid-svg-icons';

import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';

import "./styles.css";                         
import api_url from "@/components/api_conf";
import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

import { Tag } from 'primereact/tag';
import withLoading from '../../../components/withLoading';

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
const ResidentsList: React.FC = () =>{

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

  const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] = useState<string>(''); 
  const handleSelectChangeCivilStatus = (event:ChangeEvent<HTMLSelectElement>) =>{
    setSelectedOptionCivilStatus(event.target.value);
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

  const [selectedOptionCategory, setSelectedOptionCategory] = useState<string>(''); 
  const handleSelectChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCategory(event.target.value);
  };

  const [selectedOptionDocumentStatus, setSelectedOptionDocumentStatus] = useState<string>('For Printing'); 
  const handleSelectChangeDocumentStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionDocumentStatus(event.target.value);
  };

  const [UserError, setUserError] = useState<string | null>(null);
  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);
  const [UserName, setUserName] = useState<string | null>(null);

  const [isTextFieldDisabledPurpose, setTextFieldDisabledPurpose] = useState(false);
  const [isTextFieldDisabledIndigency, setTextFieldDisabledIndigency] = useState(false);
  
  const [isDocumentValidityDisabled, setisDocumentValidityDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(''); 


  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

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
    gender: '',
    civilStatus: '',
    issuingOfficer: '',
    documentID: '0',
    documentType: '',
    residentID: '0',
    validUntil: '',
    remarks: '',
    documentStatus: '',
    purpose: '',
    cedulaNo: '',
    precintNo: '',
    hCGGGNumber: '',
    philHealthID: '',
    philHealthCategory: '',
    reasonForReferral: '',
    reason:'',
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
      gender: '',
      civilStatus: '',
      issuingOfficer: '',
      documentID: '0',
      documentType: '',
      residentID: '0',
      validUntil: '',
      remarks: '',
      documentStatus: '',
      purpose: '',
      cedulaNo: '',
      precintNo: '',
      hCGGGNumber: '',
      philHealthID: '',
      philHealthCategory: '',
      reasonForReferral: '',
      reason:'',
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
        const response = await axios.get(api_url+'residentsxl');
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


  const printRowData = (individualResidents: any) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    
    var docuTypeUrl1 = '';
    var docuTypeUrl2 = '';
    if(individualResidents.DocumentType === "Barangay Clearance"){
      docuTypeUrl1 = 'clearances/';
      docuTypeUrl2 = '/clearances_';
    }else if (individualResidents.DocumentType === "Referral Slip"){
      docuTypeUrl1 = 'referrals/';
      docuTypeUrl2 = '/referrals_';
    }else if (individualResidents.DocumentType === "Barangay Indigency"){
      docuTypeUrl1 = 'indigencies/';
      docuTypeUrl2 = '/indigencies_';

    }

    var printDocumentURL =  api_url+ docuTypeUrl1+individualResidents.ID+"/"+individualResidents.DocumentID +
    docuTypeUrl2 + individualResidents.ID+"_"+individualResidents.DocumentID+".pdf"
    console.log(printDocumentURL);
    window.location.href = printDocumentURL;
  };

  
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
      firstName: event.data.FirstName,
      middleName: event.data.MiddleName,
      lastName: event.data.LastName,
      address: event.data.Address,
      birthPlace: event.data.BirthPlace,
      contactNumber: event.data.ContactNumber,
      guardianName: event.data.GuardianName,
      gurdianContactNumbers: event.data.GurdianContactNumbers,
      gender: event.data.Gender,
      civilStatus: event.data.CivilStatus,
      issuingOfficer: event.data.IssuingOfficer,
      documentID: event.data.DocumentID,
      documentType: event.data.DocumentType,
      residentID: event.data.DocumentData.ResidentID,
      validUntil: event.data.DocumentData.ValidUntil,
      remarks: event.data.DocumentData.Remarks,
      documentStatus: event.data.DocumentData.DocumentStatus,
      purpose: event.data.DocumentData.Purpose,
      cedulaNo: event.data.DocumentData.cedulaNo,
      precintNo: event.data.DocumentData.precintNo,
      hCGGGNumber: event.data.DocumentData.HCGGGNumber,
      philHealthID: event.data.DocumentData.PhilHealthID,
      philHealthCategory: event.data.DocumentData.PhilHealthCategory,
      reasonForReferral: event.data.DocumentData.ReasonForReferral,
      reason: event.data.DocumentData.Reason,
    });

    setSelectedOptionGender(event.data.Gender);
    setSelectedOptionCivilStatus(event.data.CivilStatus);
    setSelectedOptionDocumentStatus(event.data.DocumentData.DocumentStatus);
    setSelectedOptionCategory(event.data.DocumentData.PhilHealthCategory);
    setSelectedOption(event.data.DocumentType);

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
      firstName: individualResident.FirstName,
      middleName: individualResident.MiddleName,
      lastName: individualResident.LastName,
      address: individualResident.Address,
      birthPlace: individualResident.BirthPlace,
      contactNumber: individualResident.ContactNumber,
      guardianName: individualResident.GuardianName,
      gurdianContactNumbers: individualResident.GurdianContactNumbers,
      gender: individualResident.Gender,
      civilStatus: individualResident.CivilStatus,
      issuingOfficer: individualResident.IssuingOfficer,
      documentID: individualResident.DocumentID,
      documentType: individualResident.DocumentType,
      residentID: individualResident.DocumentData.ResidentID,
      validUntil: individualResident.DocumentData.ValidUntil,
      remarks: individualResident.DocumentData.Remarks,
      documentStatus: individualResident.DocumentData.DocumentStatus,
      purpose: individualResident.DocumentData.Purpose,
      cedulaNo: individualResident.DocumentData.cedulaNo,
      precintNo: individualResident.DocumentData.precintNo,
      hCGGGNumber: individualResident.DocumentData.HCGGGNumber,
      philHealthID: individualResident.DocumentData.PhilHealthID,
      philHealthCategory: individualResident.DocumentData.PhilHealthCategory,
      reasonForReferral: individualResident.DocumentData.ReasonForReferral,
      reason: individualResident.DocumentData.Reason,
    });

    setSelectedOptionGender(individualResident.Gender);
    setSelectedOptionCivilStatus(individualResident.CivilStatus);
    setSelectedOptionDocumentStatus(individualResident.DocumentData.DocumentStatus);
    setSelectedOptionCategory(individualResident.DocumentData.PhilHealthCategory);
    setSelectedOption(individualResident.DocumentType);

    if (individualResident.DocumentType === "Barangay Clearance"){
      var datePartsValidity = individualResident.DocumentData.ValidUntil.split(/[\s:-]+/);
      var dateObjectValidity = new Date(
        parseInt(datePartsValidity[0]),     // Year
        parseInt(datePartsValidity[1]) - 1, // Month
        parseInt(datePartsValidity[2]),     // Day
      );
      setSelectedDateValidity(dateObjectValidity);
    }

    const dateParts = individualResident.BirthDate.split("/");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; 
    const day = parseInt(dateParts[1], 10);
    var dateObject = new Date(year, month, day);
    setSelectedDate(dateObject);
  };


  const editResident = (individualResident: any) => {
    setindividualResidents({ ...individualResident });
    console.log(individualResident);

    if (individualResident.DocumentType === 'Referral Slip') {
      setTextFieldDisabledPurpose(true);
      setisDocumentValidityDisabled(true);
      setTextFieldDisabledIndigency(false);
    } 

    if (individualResident.DocumentType == 'Barangay Indigency'){
      setTextFieldDisabledIndigency(true);
      setisDocumentValidityDisabled(true);
    } 

    if (individualResident.DocumentType === 'Barangay Clearance'){
      setTextFieldDisabledIndigency(true);
      setisDocumentValidityDisabled(false);
    } 

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
      gender: individualResident.Gender,
      civilStatus: individualResident.CivilStatus,
      issuingOfficer: individualResident.IssuingOfficer,
      documentID: individualResident.DocumentID,
      documentType: individualResident.DocumentType,
      residentID: individualResident.DocumentData.ResidentID,
      validUntil: individualResident.DocumentData.ValidUntil,
      remarks: individualResident.DocumentData.Remarks,
      documentStatus: individualResident.DocumentData.DocumentStatus,
      purpose: individualResident.DocumentData.Purpose,
      cedulaNo: individualResident.DocumentData.cedulaNo,
      precintNo: individualResident.DocumentData.precintNo,
      hCGGGNumber: individualResident.DocumentData.HCGGGNumber,
      philHealthID: individualResident.DocumentData.PhilHealthID,
      philHealthCategory: individualResident.DocumentData.PhilHealthCategory,
      reasonForReferral: individualResident.DocumentData.ReasonForReferral,
      reason: individualResident.DocumentData.Reason,
    });
    setSelectedOptionGender(individualResident.Gender);
    setSelectedOptionCivilStatus(individualResident.CivilStatus);
    setSelectedOptionDocumentStatus(individualResident.DocumentData.DocumentStatus);
    setSelectedOptionCategory(individualResident.DocumentData.PhilHealthCategory);
    setSelectedOption(individualResident.DocumentType);

    var datePartsValidity = individualResident.DocumentData.ValidUntil.split(/[\s:-]+/);
    var dateObjectValidity = new Date(
      parseInt(datePartsValidity[0]),     // Year
      parseInt(datePartsValidity[1]) - 1, // Month
      parseInt(datePartsValidity[2]),     // Day
    );
    setSelectedDateValidity(dateObjectValidity);

    const dateParts = individualResident.BirthDate.split("/");
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

    return <Tag value={rowData.DocumentData.DocumentStatus} severity={getSeverity(rowData)}></Tag>;
};

  const getSeverity = (rowData: any) => {
    switch (rowData.DocumentData.DocumentStatus) {
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

    const DocumentValidityDate =  selectedDateValidity || new Date();
    var formatedValidityDate = format(DocumentValidityDate, 'MM/dd/yyyy');

      await axios.put(api_url+'residents', {
        ID: parseInt(UpdateformData.userID),
        LastName: UpdateformData.lastName,
        FirstName: UpdateformData.firstName,
        MiddleName: UpdateformData.middleName,
        Address: UpdateformData.address,
        BirthDate: formatedBirthDate,
        BirthPlace: UpdateformData.birthPlace,
        Gender: selectedOptionGender,
        CivilStatus: selectedOptionCivilStatus,
        ContactNumber: UpdateformData.contactNumber,
        GuardianName: UpdateformData.guardianName,
        GurdianContactNumbers: UpdateformData.gurdianContactNumbers,
        ResidentID: parseInt(UpdateformData.residentID),
        Purpose: UpdateformData.purpose,
        ValidUntil: formatedValidityDate,
        Remarks: UpdateformData.remarks,
        DocumentStatus: selectedOptionDocumentStatus,
        HCGGGNumber: UpdateformData.hCGGGNumber,
        PhilHealthID: UpdateformData.philHealthID,
        PhilHealthCategory: selectedOptionCategory,
        ReasonForReferral: UpdateformData.reasonForReferral,
        Reason: UpdateformData.reason,
        CedulaNo: UpdateformData.cedulaNo,
        PrecintNo: UpdateformData.precintNo,
        DocumentID: parseInt(UpdateformData.documentID),
        DocumentType: UpdateformData.documentType,
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
        Document Logs
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
          Document Logs
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
            <Column field="DateUpdated" header="Date Updated" sortable></Column>
            <Column field="DocumentType" header="DocumentType" sortable></Column>
            <Column field="LastName" header="Last Name" sortable></Column>
            <Column field="FirstName" header="First Name" sortable></Column>
            <Column field="MiddleName" header="Middle Name" sortable></Column>
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
              <Dialog header="Document Log Record" visible={visible} style={{ width: '70vw' }} 
              onHide={() => {
                setVisible(false);
                setIsFormDisabled(false);
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
                     <label htmlFor="lastName" className="col-form-label">Last Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="lastName" name="lastName"
                      value={UpdateformData.lastName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="firstName" className="col-form-label">First Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="firstName" name="firstName"
                      value={UpdateformData.firstName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="middleName" className="col-form-label">Middle Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="middleName" name="middleName"
                      value={UpdateformData.middleName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="philHealthID" className="col-form-label">PhilHealth Member No.</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="philHealthID" name="philHealthID"
                      value={UpdateformData.philHealthID}
                      onChange={handleInputChange}
                      //disabled={true}
                      disabled={isFormDisabled || isTextFieldDisabledIndigency}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col w-8/12">
                      <label htmlFor="address" className="col-form-label">Address:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="address" name="address"
                      value={UpdateformData.address}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                    <label htmlFor="PhilhealthCategory" className="col-form-label">PhilhealthCategory</label>
                      <select id="category" className="p-2 mt-[-2px] rounded-md border-2 border-grey" 
                      //disabled
                      disabled={isFormDisabled || isTextFieldDisabledIndigency}
                    name="category" value={selectedOptionCategory} onChange={handleSelectChangeCategory}  >
                        <option value=""></option>
                        <option value="Dependent">Dependent</option>
                        <option value="Senior">Senior</option>
                        <option value="NHTs">NHTs</option>
                        <option value="APs">APs</option>
                      </select>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="hCGGGNumber" className="col-form-label">Health Card GGG Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="hCGGGNumber" name="hCGGGNumber"
                      value={UpdateformData.hCGGGNumber}
                      onChange={handleInputChange}
                      //disabled={true}
                      disabled={isFormDisabled || isTextFieldDisabledIndigency}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-2">
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="contactNumber" className="col-form-label">Tel/Mobile Number:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="contactNumber" name="contactNumber"
                      value={UpdateformData.contactNumber}
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
                      <label htmlFor="birthPlace" className="col-form-label">Birth Place:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="birthPlace" name="birthPlace"
                      value={UpdateformData.birthPlace}
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
                      <label htmlFor="guardianName" className="col-form-label">Parent/Guardian Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="guardianName" name="guardianName"
                      value={UpdateformData.guardianName}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="cedulaNo" className="col-form-label">Cedula No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="cedulaNo" name="cedulaNo"
                      value={UpdateformData.cedulaNo}
                      onChange={handleInputChange}
                      disabled={isFormDisabled || isDocumentValidityDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col w-3/12">
                      <label htmlFor="precintNo" className="col-form-label">Precinct No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="precintNo" name="precintNo"
                      value={UpdateformData.precintNo}
                      onChange={handleInputChange}
                      disabled={isFormDisabled || isDocumentValidityDisabled}
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
                      <label htmlFor="gurdianContactNumbers" className="col-form-label">Parent/Guardian Contact No:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="gurdianContactNumbers" name="gurdianContactNumbers"
                      value={UpdateformData.gurdianContactNumbers}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor={UpdateformData.documentType === "Barangay Indigency" ? "reason" : "purpose"} className="col-form-label">Purpose:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id={UpdateformData.documentType === "Barangay Indigency" ? "reason" : "purpose"}  name={UpdateformData.documentType === "Barangay Indigency" ? "reason" : "purpose"} 
                      value={UpdateformData.documentType === "Barangay Indigency" ? UpdateformData.reason : UpdateformData.purpose}
                      onChange={handleInputChange}
                      disabled={isFormDisabled || isTextFieldDisabledPurpose}
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
                        disabled={isFormDisabled || isDocumentValidityDisabled}
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
                        //disabled={true}
                        disabled={isFormDisabled || isTextFieldDisabledIndigency}
                      ></textarea>
                    </div>
                    <div className="flex flex-col grow">
                    <label htmlFor="remarks">Remarks:</label>
                      <textarea
                        className="rounded-md  border-2 border-grey"
                        name="remarks"
                        id="remarks"
                        cols={70}
                        rows={5}
                        value={UpdateformData.remarks}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-2 justify-between">
                    <div className="pb-1 flex flex-row ">
                    <label htmlFor="DocumentStatus" className="pt-1 pr-12 col-form-label text-xl">Document Status: </label>
                      <select id="DocumentStatus" className="p-2 mt-[-2px] rounded-md border-5 w-60 text-white border-solid border-black"
                    name="DocumentStatus" value={selectedOptionDocumentStatus} onChange={handleSelectChangeDocumentStatus}
                    style={{ backgroundColor: getBackgroundColor() }}  
                    disabled={isFormDisabled}>
                        <option value="For Printing">For Printing</option>
                        <option value="Printing">Printing</option>
                        <option value="Claimed">Claimed</option>
                      </select>
                    </div>
                    <div className="flex flex-row ">
                      <label htmlFor="DocumentType" className="pt-1 pr-12 col-form-label text-xl">Document Type: </label>
                        <select id="DocumentType" className="p-2 mt-[-2px] rounded-md border-5 w-60 text-white border-solid border-black"
                      name="DocumentType" value={selectedOption} onChange={handleSelectChange} 
                      style={{ backgroundColor: '#1E40AF' }}  
                      disabled={true}>
                        <option value="Barangay Indigency">Barangay Indigency</option>
                        <option value="Barangay Clearance">Barangay Clearance</option>
                        <option value="Referral Slip">Referral Slip</option>
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
  );
}

export default withLoading(ResidentsList);