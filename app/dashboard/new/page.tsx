"use client";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Tesseract from 'tesseract.js';
import React, { useState, useEffect , ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFile, faCameraAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

import "./styles.css";
import UploadModal from "./modal";

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  name: string;
  details?: boolean;
  disabled?: boolean;
  required?: boolean;
  width?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type,
  name,
  details,
  required,
  width,
  disabled,
  ...props
}) => (
  <div className={`flex flex-col ${width} ${name !== "signatory" ? "grow" : ""}`}>
    <label className="pb-1.5" htmlFor={id}>{label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <input
      className={`${details ? "h-48" : ""} p-2 mt-[-2px] rounded-md`}
      id={id}
      type={type}
      name={name}
      {...props}
      { ...(required ? { required: true } : {}) }
      { ...(disabled ? { disabled: true } : {}) }
    />
  </div>
);


interface FormFieldSelectProps {
  label: string;
  id: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  required?: boolean;
  width?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormFieldSelect: React.FC<FormFieldSelectProps> = ({
  label,
  id,
  name,
  options,
  value,
  required,
  width,
  disabled,
  onChange,
}) => {
  return (
    <div className={`form-field flex flex-col ${width}`} >
      <label className="pb-1.5" htmlFor={id}>{label}
      {required && <span className="text-red-500"> *</span>}
      </label>
      <select id={id} name={name} value={value} onChange={onChange} className="p-2 mt-[-2px] rounded-md"
      { ...(required ? { required: true } : {}) }
      { ...(disabled ? { disabled: true } : {}) }
      >  
        <option value=""></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const New = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(''); 
  const [selectedOptionPhil, setSelectedOptionPhil] = useState<string>(''); 
  const [selectedOptionGender, setSelectedOptionGender] = useState<string>(''); 
  const [selectedOptionCivilStatus, setSelectedOptionCivilStatus] = useState<string>(''); 
  const [isTextFieldDisabledPurpose, setTextFieldDisabledPurpose] = useState(false);
  const [isTextFieldDisabledIndigency, setTextFieldDisabledIndigency] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
    

  const CustomInput = ({ value, onClick }: any) => (
    <div className="relative">
      <input
        className="p-2 mt-[-2px] rounded-md " // Adjust padding as needed
        value={value}
        onClick={onClick}
        readOnly
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pr-1"
      />
    </div>
  );

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    if (event.target.value === 'Referal Slip') {
      setTextFieldDisabledPurpose(true);
    } else {
      setTextFieldDisabledPurpose(false);
    }

    if (event.target.value == 'Barangay Indigency' || event.target.value === 'Barangay Clearance' ){
      setTextFieldDisabledIndigency(true);
    } else {
      setTextFieldDisabledIndigency(false);
    }

  };
  const handleSelectChangePhil = (event:ChangeEvent<HTMLSelectElement>) =>{
    setSelectedOptionPhil(event.target.value);
  };
  const handleSelectChangeGender = (event:ChangeEvent<HTMLSelectElement>) =>{
    setSelectedOptionGender(event.target.value);
  };
  const handleSelectChangeCivilStatus = (event:ChangeEvent<HTMLSelectElement>) =>{
    setSelectedOptionCivilStatus(event.target.value);
  };


  useEffect(() => {
    const handleClick = () => {

      setIsModalOpen(true);
      // Tesseract.recognize(
      //   'https://tesseract.projectnaptha.com/img/eng_bw.png',
      //   'eng',
      //   { logger: m => console.log(m) }
      // ).then(({ data: { text } }) => {
      //   console.log(text);
      // });
    };

    const ocrBtn = document.querySelector(".ocr-btn");

    ocrBtn?.addEventListener('click', handleClick);

    return () => {
      ocrBtn?.removeEventListener('click', handleClick);
    };
  }, []);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Define a function to handle the "Create Entry" button click
  const handleCreateEntryClick = () => {
    console.log((document.getElementById('docuTitle') as HTMLInputElement).value);
    console.log((document.getElementById('lastName') as HTMLInputElement).value);
    console.log((document.getElementById('firstName') as HTMLInputElement).value);
    console.log((document.getElementById('middleName') as HTMLInputElement).value);
    console.log((document.getElementById('philHealthNumber') as HTMLInputElement).value);
    console.log((document.getElementById('philHealthCategory') as HTMLInputElement).value);
    console.log((document.getElementById('address') as HTMLInputElement).value);
    console.log((document.getElementById('healthCardGGGNumber') as HTMLInputElement).value);
    console.log((document.getElementById('telNum') as HTMLInputElement).value);
    console.log((document.getElementById('birthPlace') as HTMLInputElement).value);
    console.log((document.getElementById('gender') as HTMLInputElement).value);
    console.log((document.getElementById('parentName') as HTMLInputElement).value);
    console.log((document.getElementById('religion') as HTMLInputElement).value);
    console.log((document.getElementById('occupation') as HTMLInputElement).value);
    console.log((document.getElementById('civilStatus') as HTMLInputElement).value);
    console.log((document.getElementById('parentContactNumber') as HTMLInputElement).value);
    console.log((document.getElementById('purpose') as HTMLInputElement).value);
    console.log((document.getElementById('reasonForReferral') as HTMLInputElement).value);
    console.log((document.getElementById('remarks') as HTMLInputElement).value);
    console.log(selectedDate);
    const newDate =  selectedDate || new Date();;
    var formatedDate = format(newDate, 'MM/dd/yyyy');
    console.log(formatedDate);


  };

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] pb-4">
        Create Document
      </h1>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
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
          New
        </Typography>
      </Breadcrumbs>

      <form className="flex flex-col my-4 gap-2 ">
        <label htmlFor="docuTitle">Type of Entry 
          <span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-8 pb-8">
          <select id="docuTitle" className="rounded-md p-2 mt-[-2px] w-6/12" name="docuTitle" value={selectedOption} onChange={handleSelectChange} required>
            <option value=""></option>
            <option value="Barangay Indigency">Barangay Indigency</option>
            <option value="Barangay Clearance">Barangay Clearance</option>
            <option value="Referal Slip">Referal Slip</option>
          </select>
          <button type="button" className="py-2 px-6 bg-red-800 rounded-lg ocr-btn">
            <FontAwesomeIcon icon={faCameraAlt as IconProp} className="mr-2" />
            Use OCR (Scan Document)
          </button>
          <button type="button" className="py-2 px-10 rounded-lg bg-white " onClick={handleCreateEntryClick}>
            <FontAwesomeIcon icon={faFile as IconProp} className="mr-2" />
            Create Entry
          </button>
          <UploadModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
        
        <div className="flex gap-4 pb-4">
          <FormField
            label="Last Name"
            id="lastName"
            type="text"
            name="lastName"
            required={true}
          />
          <FormField
            label="First Name"
            id="firstName"
            type="text"
            name="firstName"
            required={true}
          />
          <FormField
            label="Middle Name"
            id="middleName"
            type="text"
            name="middleName"
            required={true}
          />
          <FormField
            label="PhilHealth Member No."
            id="philHealthNumber"
            type="text"
            name="philHealthNumber"
            disabled={isTextFieldDisabledIndigency}
          />
          <FormFieldSelect
            label="PhilHealth Category"
            id="philHealthCategory"
            name="philHealthCategory"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            value={selectedOptionPhil} // Pass your selected value here
            onChange={handleSelectChangePhil}
            disabled={isTextFieldDisabledIndigency}
          />
        </div>


        <div className="flex gap-4 pb-4">
          <FormField
            label="Address"
            id="address"
            type="text"
            name="address"
            required={true}
            width="w-9/12"
          />
          <FormField
            label="Health Card GGG Number"
            id="healthCardGGGNumber"
            type="text"
            name="healthCardGGGNumber"
            disabled={isTextFieldDisabledIndigency}
          />
        </div>

        <div className="flex gap-4 pb-4">
          <FormField
            label="Tel/Mobile Number"
            id="telNum"
            type="text"
            name="telNum"
            required={true}
            width="w-4/12"
          />
          <div className="flex flex-col w-36 grow">
            <label className="pb-1.5" htmlFor="birthDate">Birthdate
              <span className="text-red-500"> *</span>
            </label>
              <DatePicker
                name="birthDate"
                id="birthDate"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                className="p-2 mt-[-2px] rounded-md"
                customInput={<CustomInput />}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
              />
          </div>

          <FormField
            label="Birth Place"
            id="birthPlace"
            type="text"
            name="birthPlace"
            required={true}
          />
          <FormFieldSelect
            label="Gender"
            id="gender"
            name="gender"
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ]}
            value={selectedOptionGender} // Pass your selected value here
            onChange={handleSelectChangeGender}
            required={true}
          />
        </div>

        <div className="flex gap-4 pb-4">
          <FormField
            label="Parent/Guardian Name"
            id="parentName"
            type="text"
            name="parentName"
            required={true}
            width="w-4/12"
          />
          <FormField
            label="Religion"
            id="religion"
            type="text"
            name="religion"
            required={true}
            width="w-36"
          />
          <FormField
            label="Occupation"
            id="occupation"
            type="text"
            name="occupation"
            required={true}
          />

          <FormFieldSelect
            label="Civil Status"
            id="civilStatus"
            name="civilStatus"
            options={[
              { value: 'Married', label: 'Married' },
              { value: 'Single', label: 'Single' },
            ]}
            value={selectedOptionCivilStatus} // Pass your selected value here
            onChange={handleSelectChangeCivilStatus}
            width="w-2/12"
            required={true}
          />
        </div>

        <div className="flex gap-4 pb-4">
          <FormField
            label="Parent/Guardian Contact No."
            id="parentContactNumber"
            type="text"
            name="parentContactNumber"
            required={true}
            width="w-4/12"
          />
          <FormField
            label="Purpose"
            id="purpose"
            type="text"
            name="purpose"
            width="w-7/12"
            disabled={isTextFieldDisabledPurpose}
          />
        </div>

          <div className="flex gap-6">
            <div className="flex flex-col">
              <label htmlFor="reasonForReferral">Reason for Referral:</label>
              <textarea
                className="rounded-md"
                name="reasonForReferral"
                id="reasonForReferral"
                cols={42}
                rows={5}
                disabled={isTextFieldDisabledIndigency}
              ></textarea>
            </div>
            <div className="flex flex-col">
            <label htmlFor="remarks">Reason for Referral:</label>
              <textarea
                className="rounded-md"
                name="remarks"
                id="remarks"
                cols={70}
                rows={5}
              ></textarea>
            </div>
          </div>
      </form>
    </div>
  );
};

export default New;
