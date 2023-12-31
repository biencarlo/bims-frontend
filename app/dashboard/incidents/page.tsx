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
import {faFileCsv,faCalendar,faEdit,faArchive,faFile,faPrint, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

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


interface Incident {
    ID: number;
    CompliantFullName: string;
    Respondent: string;
    IncidentStatus: string;
    IncidentDateTime: string;
    IncidentLocation: string;
    IncidentNarration: string;
    IssuingOfficer: string;
  }

const Incidents: React.FC = () => {

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
          className="p-2 mt-[-2px] rounded-md border-2 border-grey w-full" // Adjust padding as needed
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
  
    const [selectedOptionCategory, setSelectedOptionCategory] = useState<string>(''); 
    const handleSelectChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedOptionCategory(event.target.value);
    };
  
    const [selectedOptionDocumentStatus, setSelectedOptionDocumentStatus] = useState<string>('Active'); 
    const handleSelectChangeDocumentStatus = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedOptionDocumentStatus(event.target.value);
    };
  
    
    const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] = useState<string>(''); 
    const handleSelectChangeCivilStatus = (event:ChangeEvent<HTMLSelectElement>) =>{
      setSelectedOptionCivilStatus(event.target.value);
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
    
  
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
  
    useEffect(() => {
  
      var getclearance = async () =>{
        await axios.get(api_url+'incidents')
        .then(response => setResidents(response.data));
        return;
      };
  
      getclearance();
      initFilters();
    }, []);
  
    const [UpdateformData, setUpdateFormData] = useState({
      ID: '0',
      CompliantFullName: '',
      Respondent: '',
      IncidentStatus:'',
      IncidentDateTime:'',
      IncidentLocation:'',
      IncidentNarration:'',
      IssuingOfficer: '',
    });
  
    const resetUpdateForm = () => {
      setUpdateFormData({
        ID: '0',
        CompliantFullName: '',
        Respondent: '',
        IncidentStatus:'',
        IncidentDateTime:'',
        IncidentLocation:'',
        IncidentNarration:'',
        IssuingOfficer: '',
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
          const response = await axios.get(api_url+'incidents');
          const worksheet = xlsx.utils.json_to_sheet(response.data);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
          });
  
          saveAsExcelFile(excelBuffer, 'incidents');
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
  
    
    const [individualResidents, setindividualResidents] = useState<Incident | null>(null);
    const [deleteResidentDialog, setDeleteResidentDialog] = useState(false);
  
    const printRowData = (individualResidents: any) => {
      setindividualResidents(individualResidents);
      console.log(individualResidents);
      var printDocumentURL =  api_url+"incidents/"+individualResidents.ID+
      "/incidents_"+individualResidents.ID;
      console.log(printDocumentURL);
      window.open(printDocumentURL, '_blank');
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
      axios.delete(api_url+"incidents", {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ID: userIDTobeDeleted,
        }
      }) 
      .then(async response => {
        if (response.data.Success){
          await axios.get(api_url+'incidents')
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
    const [modalState, setmodalState] = useState('');

    const [shouldShowButton, setshouldShowButton] = useState(false);
  
    const footerContent = isFormDisabled ? null : (
  
      <div className="flex flex-row justify-end">
            {shouldShowButton && (
              <button
                type="button"
                className="py-2 px-10 rounded-lg bg-gray-800 rounded-lg"
                style={{ color: 'white' }}
                onClick={() => setDeleteResidentDialog(true)}
              >
                <FontAwesomeIcon icon={faArchive as IconProp} className="mr-2" />
                Archive
              </button>
            )}
          <button type="button" className="py-2 px-10 rounded-lg bg-red-800 rounded-lg" style={{color:'white'}} onClick={ shouldShowButton ? CreateUserAPI : AddNewRecord}>
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
        CompliantFullName: event.data.CompliantFullName,
        Respondent: event.data.Respondent,
        IncidentStatus:event.data.IncidentStatus,
        IncidentDateTime:event.data.IncidentDateTime,
        IncidentLocation:event.data.IncidentLocation,
        IncidentNarration:event.data.IncidentNarration,
        IssuingOfficer: event.data.IssuingOfficer,
      });
  
      //setSelectedOptionCategory(event.data.TypeOfRecord);
      setSelectedOptionDocumentStatus(event.data.IncidentStatus);
  
      var datePartsValidity = event.data.IncidentDateTime.split(/[\/\s:-]+/);
      var dateObjectValidity = new Date(
        parseInt(datePartsValidity[2]),     // Year
        parseInt(datePartsValidity[0]) - 1, // Month
        parseInt(datePartsValidity[1]),     // Day
      );
      setSelectedDateValidity(dateObjectValidity);
  
    };
  
    const onRowView = (individualResident: any) => {
      setindividualResidents({ ...individualResident.data });
      setVisible(true);
      setUpdateFormData({
        ID: individualResident.ID,
        CompliantFullName: individualResident.CompliantFullName,
        Respondent: individualResident.Respondent,
        IncidentStatus:individualResident.IncidentStatus,
        IncidentDateTime:individualResident.IncidentDateTime,
        IncidentLocation:individualResident.IncidentLocation,
        IncidentNarration:individualResident.IncidentNarration,
        IssuingOfficer: individualResident.IssuingOfficer,
      });
  
      //setSelectedOptionCategory(individualResident.TypeOfRecord);
      
      setSelectedOptionDocumentStatus(individualResident.IncidentStatus);
  
      var datePartsValidity = individualResident.IncidentDateTime.split(/[\/\s:-]+/);
      var dateObjectValidity = new Date(
        parseInt(datePartsValidity[2]),     // Year
        parseInt(datePartsValidity[0]) - 1, // Month
        parseInt(datePartsValidity[1]),     // Day
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
        CompliantFullName: individualResident.CompliantFullName,
        Respondent: individualResident.Respondent,
        IncidentStatus:individualResident.IncidentStatus,
        IncidentDateTime:individualResident.IncidentDateTime,
        IncidentLocation:individualResident.IncidentLocation,
        IncidentNarration:individualResident.IncidentNarration,
        IssuingOfficer: individualResident.IssuingOfficer,
      });
    
     // setSelectedOptionCategory(individualResident.TypeOfRecord);
     setSelectedOptionDocumentStatus(individualResident.IncidentStatus);
  
      var datePartsValidity = individualResident.IncidentDateTime.split(/[\/\s:-]+/);
      console.log(datePartsValidity[2]);
      console.log(datePartsValidity[0]);
      console.log(datePartsValidity[1]);
      var dateObjectValidity = new Date(
        parseInt(datePartsValidity[2]),     // Year
        parseInt(datePartsValidity[0]) - 1, // Month
        parseInt(datePartsValidity[1]),     // Day
      );
      setSelectedDateValidity(dateObjectValidity);

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
              
                setIsFormDisabled(true);
                onRowView(rowData);
              }}>
                  <FontAwesomeIcon icon={faFile as IconProp} className="mr-2" />
                  View
            </button>
            <button type="button" className="text-xs py-2 px-5 mr-2 rounded-lg bg-white-800 rounded-lg text-red-800 border-solid border-red-800 border-2" onClick={() => {
                setshouldShowButton(true);
                editResident(rowData);
              }}>
                  <FontAwesomeIcon icon={faEdit as IconProp} className="mr-2" />
                  Edit
            </button>
          </React.Fragment>
      );
    };
  
    const actionStatusTemplate = (rowData: any) => {
  
        return <Tag value={rowData.IncidentStatus} severity={getSeverity(rowData)}></Tag>;
    };
  
    const getSeverity = (rowData: any) => {
      switch (rowData.IncidentStatus) {
        case 'Settled':
            return 'success';
        case 'Scheduled':
            return 'warning';
        case 'Active':
            return 'danger';
        default:
            return null;
      }
    };
  
    const getBackgroundColor = () => {
      switch (selectedOptionDocumentStatus) {
        case 'Active':
          return '#EF4444';
        case 'Scheduled':
          return '#F59E0B';
        case 'Settled':
          return '#22C55E';
        default:
          return '#EF4444';
      }
    };
  
    async function CreateUserAPI(){
  
      const DocumentValidityDate =  selectedDateValidity || new Date();
      var formatedValidityDate = format(DocumentValidityDate, 'MM/dd/yyyy');
  
        await axios.put(api_url+'incidents', {
          ID: parseInt(UpdateformData.ID),
          CompliantFullName: UpdateformData.CompliantFullName,
          Respondent: UpdateformData.Respondent,
          IncidentStatus: selectedOptionDocumentStatus,
          IncidentDateTime:formatedValidityDate,
          IncidentLocation:UpdateformData.IncidentLocation,
          IncidentNarration:UpdateformData.IncidentNarration,
          IssuingOfficer: UpdateformData.IssuingOfficer,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async response => {
          if (response.data.Success){
            setVisible(false);
            resetUpdateForm();
            showSuccessFul();
            await axios.get(api_url+'incidents')
            .then(response => setResidents(response.data));
          }else{
            setUserError(response.data.Message || 'An error occurred');
            setTimeout(() => {
              setUserError(null);
            }, 3000); // 3000 milliseconds = 3 second
          }
        });
      };

        
    async function AddNewRecord(){
  
      const DocumentValidityDate =  selectedDateValidity || new Date();
      var formatedValidityDate = format(DocumentValidityDate, 'MM/dd/yyyy');
  
        await axios.post(api_url+'incidents', {
          ID: parseInt(UpdateformData.ID),
          CompliantFullName: UpdateformData.CompliantFullName,
          Respondent: UpdateformData.Respondent,
          IncidentStatus: selectedOptionDocumentStatus,
          IncidentDateTime:formatedValidityDate,
          IncidentLocation:UpdateformData.IncidentLocation,
          IncidentNarration:UpdateformData.IncidentNarration,
          IssuingOfficer: FullName,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async response => {
          if (response.data.Success){
            setVisible(false);
            resetUpdateForm();
            showSuccessFul();
            await axios.get(api_url+'incidents')
            .then(response => setResidents(response.data));
          }else{
            setUserError(response.data.Message || 'An error occurred');
            setTimeout(() => {
              setUserError(null);
            }, 3000); // 3000 milliseconds = 3 second
          }
        });
      };
  
    
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
  
  
    return (
      <div className="px-8 py-4">
        <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2 ">
          Incident Reports
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
            Incident Reports
          </Typography>
        </Breadcrumbs>
            <div className="flex justify-content-between gap-8 pb-4 pt-4">
                <InputText className="w-9/12" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                <button type="button" className="py-2 px-10 mr-2 rounded-lg bg-red-800 rounded-lg border-solid border-red-800 border-2" style={{color:'white'}} onClick={() => {
                  setVisible(true);
                  setshouldShowButton(false);
                  setmodalState("Add");
                  setSelectedDateValidity(null);
                }}>
                 <FontAwesomeIcon icon={faFileCirclePlus as IconProp} className="mr-2"  
                 />
                  Add New Record
                </button>
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
              <Column field="ID" header="Case ID" sortable></Column>
              <Column field="IncidentDateTime" header="Date Filed" sortable></Column>
              <Column field="CompliantFullName" header="Complainant" sortable></Column>
              <Column field="Respondent" header="Respondent" sortable></Column>
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
                <Dialog header={modalState+" Incident Report"}  visible={visible} style={{ width: '50vw' }} 
                onHide={() => {
                  setVisible(false);
                  setIsFormDisabled(false);
                  resetUpdateForm(); 
                  setSelectedOptionCategory('');
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
                    value={UpdateformData.ID}
                    onChange={handleInputChange}
                    ></input>
                    <div className="flex gap-4 pb-2">
                      <div className="pb-2 flex flex-col grow">
                        <label htmlFor="CompliantFullName" className="pb-2 col-form-label">Complainant Full Name <span className="text-red-500">*</span></label>
                          <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="CompliantFullName" name="CompliantFullName"
                          value={UpdateformData.CompliantFullName}
                          onChange={handleInputChange}
                          disabled={isFormDisabled}
                          ></input>
                        </div>
                      <div className="pb-2 flex flex-col grow">
                        <label htmlFor="Respondent" className="pb-2 col-form-label">Respondent:</label>
                        <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="Respondent" name="Respondent"
                        value={UpdateformData.Respondent}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        ></input>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-1 gap-4">
                      <div className="grid grid-cols-1 grid-rows-4 gap-4" style={{ maxWidth: '300px' }}>
                      <div className="flex flex-col">
                        <label className="pb-2 col-form-label" htmlFor="IncidentStatus">Incident Status <span className="text-red-500">*</span>
                        </label>
                          <select id="IncidentStatus" className="p-2 mt-[-2px] rounded-md border-5 w-60 text-white border-solid border-black w-full"
                        name="IncidentStatus" value={selectedOptionDocumentStatus} onChange={handleSelectChangeDocumentStatus}
                        style={{ backgroundColor: getBackgroundColor() }}  
                        disabled={isFormDisabled}>
                            <option value="Active">Active</option>
                            <option value="Settled">Settled</option>
                            <option value="Scheduled">Scheduled</option>
                          </select>
                        </div>
                        <div className="flex flex-col">
                        <label className="pb-2 col-form-label" htmlFor="DocumentValidity">Date and Time of Incident <span className="text-red-500">*</span>
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
                            disabled={isFormDisabled}
                          />
                        </div>
                        <div className="pb-2 flex flex-col row-span-2 ">
                          <label htmlFor="IncidentLocation" className="pb-2 col-form-label">Incident Location <span className="text-red-500">*</span></label>
                          <textarea
                            className="rounded-md  border-2 border-grey"
                            name="IncidentLocation"
                            id="IncidentLocation"
                            cols={12}
                            rows={5}
                            value={UpdateformData.IncidentLocation}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                          ></textarea>
                        </div>              
                      </div>
                        <div className="flex flex-col col-span-2">
                        <label htmlFor="IncidentNarration">Incident Narration<span className="text-red-500">*</span></label>
                          <textarea
                            className="rounded-md  border-2 border-grey"
                            name="IncidentNarration"
                            id="IncidentNarration"
                            cols={120}
                            rows={13}
                            value={UpdateformData.IncidentNarration}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                          ></textarea>
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
  
  export default withLoading(Incidents);