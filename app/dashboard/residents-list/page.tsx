"use client";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import "primereact/resources/primereact.min.css";  
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import { InputText } from 'primereact/inputtext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faPlusSquare, faFileCsv } from '@fortawesome/free-solid-svg-icons';

import "./styles.css";                         
import api_url from "@/components/api_conf";

export default function ResidentsList() {

  const [users, setUsers] = useState();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {

    var getUsers = async () =>{
      await axios.get(api_url+'users')
      .then(response => setUsers(response.data));
      return;
    };

    getUsers();
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

  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-2 ">
        Residents List
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
          Residents List
        </Typography>
      </Breadcrumbs>
      <div className="flex justify-content-between gap-8 pb-4 pt-4">
              <InputText className="w-9/12" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
              <button type="button" className="py-2 px-10 rounded-lg bg-white ">
               <FontAwesomeIcon icon={faFileCsv as IconProp} className="mr-2"  />
                Export .csv file
              </button>
          </div>
          <DataTable filters={filters} value={users} size="small" removableSort stripedRows paginator rows={10} 
          rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column field="ID" header="ID" sortable ></Column>
            <Column field="FullName" header="FullName" sortable ></Column>
            <Column field="FirstName" header="FirstName" sortable ></Column>
            <Column field="MiddleName" header="MiddleName" sortable ></Column>
            <Column field="LastName" header="LastName" sortable ></Column>
            <Column field="PositionID" header="PositionID" sortable ></Column>
            <Column field="PositionName" header="PositionName" sortable ></Column>
            <Column field="Email" header="Email" sortable ></Column>
            <Column field="Username" header="Username" sortable ></Column>
            <Column field="IsAdmin" header="IsAdmin" sortable ></Column>
            <Column field="ProfileLink" header="ProfileLink" sortable ></Column>
          </DataTable>
    </div>
  );
}
