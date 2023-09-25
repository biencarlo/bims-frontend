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
import {faPlusSquare, faFileCsv,faAdd } from '@fortawesome/free-solid-svg-icons';

import "./styles.css";                         
import api_url from "@/components/api_conf";


import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';


import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';


export default function Clearances() {

  const toast = useRef(null);

  const showSuccessFul = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000});
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
      await axios.get(api_url+'clearance')
      .then(response => setResidents(response.data));
      return;
    };

    getclearance();
    initFilters();
  }, []);

  const [UpdateformData, setUpdateFormData] = useState({
    userID:'0',
    ResidentLastName: '',
    ResidentFirstName: '',
    ResidentMiddleName: '',
    Remarks: '',
    Purpose: '',
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      userID:'0',
      ResidentLastName: '',
      ResidentFirstName: '',
      ResidentMiddleName: '',
      Remarks: '',
      Purpose: '',
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
        const response = await axios.get(api_url+'clearance');
        const worksheet = xlsx.utils.json_to_sheet(response.data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'clearance');
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

  
  const [individualResidents, setindividualResidents] = useState(null);
  const [deleteResidentDialog, setDeleteResidentDialog] = useState(false);

  const confirmDeleteResident = (individualResidents: React.SetStateAction<null>) => {
    setindividualResidents(individualResidents);
    console.log(individualResidents);
    setDeleteResidentDialog(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteResidentDialog(false);
  };

  const DeleteResidentApi = () =>{
    var userIDTobeDeleted = individualResidents?.ID;
    axios.delete(api_url+"clearance", {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ID: userIDTobeDeleted
      }
    }) 
    .then(async response => {
      if (response.data.Success){
        await axios.get(api_url+'clearance')
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

  
  const [UserError, setUserError] = useState<string | null>(null);
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
      Purpose: individualResident.Purpose,
      Remarks: individualResident.Remarks,
      ResidentLastName: individualResident.ResidentLastName,
      ResidentFirstName: individualResident.ResidentFirstName,
      ResidentMiddleName: individualResident.ResidentMiddleName,
    });
  

    console.log(individualResident.ID);
  };
  const actionBodyTemplate = (rowData: any) => {
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
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteResident(rowData)} />
          )}
        </React.Fragment>
    );
  };

  async function CreateUserAPI(){
      await axios.put(api_url+'clearance', {
        ID: parseInt(UpdateformData.userID),
        ResidentLastName: UpdateformData.ResidentLastName,
        ResidentFirstName: UpdateformData.ResidentFirstName,
        ResidentMiddleName: UpdateformData.ResidentMiddleName,
        Purpose: UpdateformData.Purpose,
        Remarks: UpdateformData.Remarks,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.data.Success){
          setVisible(false);
          resetUpdateForm();
          showSuccessFul();
          await axios.get(api_url+'clearance')
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
        Clearance Records
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
          Clearances
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
            <Column field="ResidentID" header="Resident ID" sortable></Column>
            <Column field="DateCreated" header="Date Created" sortable></Column>
            <Column field="DateUpdated" header="Date Updated" sortable></Column>
            <Column field="ValidUntil" header="Valid Until" sortable></Column>
            <Column field="IssuingOfficer" header="Issuing Officer" sortable></Column>
            <Column field="Remarks" header="Remarks" sortable></Column>
            <Column field="ResidentLastName" header="Resident Last Name" sortable></Column>
            <Column field="ResidentFirstName" header="Resident First Name" sortable></Column>
            <Column field="ResidentMiddleName" header="Resident Middle Name" sortable></Column>
            <Column field="Purpose" header="Purpose" sortable></Column>
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
                     <label htmlFor="ResidentLastName" className="col-form-label">Last Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentLastName" name="ResidentLastName"
                      value={UpdateformData.ResidentLastName}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="ResidentFirstName" className="col-form-label">First Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentFirstName" name="ResidentFirstName"
                      value={UpdateformData.ResidentFirstName}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="ResidentMiddleName" className="col-form-label">Middle Name:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="ResidentMiddleName" name="ResidentMiddleName"
                      value={UpdateformData.ResidentMiddleName}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4">
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="Purpose" className="col-form-label">Purpose:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="Purpose" name="Purpose"
                      value={UpdateformData.Purpose}
                      onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="pb-2 flex flex-col grow">
                      <label htmlFor="Remarks" className="col-form-label">Remarks:</label>
                      <input type="text" className="p-2 mt-[-2px] rounded-md border-2 border-grey" id="Remarks" name="Remarks"
                      value={UpdateformData.Remarks}
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
