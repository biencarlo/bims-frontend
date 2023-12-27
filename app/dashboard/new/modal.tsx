import React, { useState } from 'react';
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './styles.css';
import "./modal";

interface UploadModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedOption: string;
  selectedOptionPhil: string;
  selectedOptionGender: string;
  selectedOptionCivilStatus: string;
  selectedDate: Date | null;
  updateSelectedOption: (newValue: string) => void;
  updateSelectedOptionPhil: (newValue: string) => void;
  updateSelectedOptionGender: (newValue: string) => void;
  updateSelectedOptionCivilStatus: (newValue: string) => void;
  updateSelectedDate: (newDate: Date | null) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onRequestClose,
  selectedOption,
  selectedOptionPhil,
  selectedOptionGender,
  selectedOptionCivilStatus,
  selectedDate,
  updateSelectedOption,
  updateSelectedOptionPhil,
  updateSelectedOptionGender,
  updateSelectedOptionCivilStatus,
  updateSelectedDate,
}) => {
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { data } = await Tesseract.recognize(file, 'eng', {
          logger: (m) => console.log(m),
        });

        console.log(data.text);
        var lines = data.text.split('\n');
        var keywords = [
          "Type of Document",
          "Last Name",
          "First Name",
          "Middle Name",
          "San Juan City Address",
          "Contact No",
          "Birthdate",
          "Birth Place",
          "Gender",
          "Cedula No.",
          "Precinct No.",
          "Civil Status",
          "Parent/Guardian Name",
          "Parent/Guardian No.",
          "Purpose"
        ];

        var docuType = "";
        var LastName = "";
        var FirstName = "";
        var MiddleName = "";
        var Address = "";
        var ContactNum = "";
        var Birthdate = "";
        var BirthPlace = "";
        var Gender = "";
        var Cedula = "";
        var Precint = "";
        var CivilStatus = "";
        var parentGuardianName = "";
        var parentGuardianNo = "";
        var Purpose ="";
        var IsInPurpose = false;


        for (var i = 0; i <= lines.length - 1; i++) {
          if (IsInPurpose) {
            Purpose += " " + lines[i];
          }
        
          for (var keyword of keywords) {
            if (lines[i].includes(keyword)) {
              // Find the position of the keyword within the line
              var keywordIndex = lines[i].indexOf(keyword);
        
              // Extract the value following the keyword
              var value = lines[i].substring(keywordIndex + keyword.length).trim();
        
              // Update the appropriate variable based on the keyword
              switch (keyword) {
                case "Type of Document":
                  docuType = value;
                  break;
                case "Last Name":
                  LastName = value;
                  break;
                case "First Name":
                  FirstName = value;
                  break;
                case "Middle Name":
                  MiddleName = value;
                  break;
                case "San Juan City Address":
                  Address = value;
                  break;
                case "Contact No":
                  var val = value.replace(".", '').trim();
                  var val1 = val.replace(".", '').trim();
                  var val2 = val1.replace(" ", '').trim();
                  ContactNum = val2;
                  break;
                case "Birthdate":
                  var splitBirthday = value.split(" ");
                  Birthdate = splitBirthday[0];
                  break;
                case "Birth Place":
                  BirthPlace = value;
                  break;
                case "Gender":
                  var splitGender = value.split(" ");
                  Gender = splitGender[0];
                  break;
                case "Cedula No.":
                  Cedula = value;
                  break;
                case "Precinct No.":
                  Precint = value;
                  break;
                case "Civil Status":
                  var splitCivilStatus = value.split(" ");
                  CivilStatus = splitCivilStatus[0];
                  break;
                case "Parent/Guardian Name":
                  parentGuardianName = value;
                  var guardianNumber = lines[i + 4].split(" ");
                  parentGuardianNo = guardianNumber[1];
                  break;
                case "Parent/Guardian":
                  break;
                case "Purpose":
                  const cntNum = "Contact No."
                  var keywordIndexNum = lines[i-1].indexOf(cntNum);
                  var guardianNum = lines[i-1].substring(keywordIndexNum + cntNum.length).trim();
                  parentGuardianNo = guardianNum;
                  Purpose = value;
                  IsInPurpose = true;
                  break;
              }
            }
          }
        }
        console.log(LastName);
        console.log(FirstName);
        console.log(MiddleName);
        console.log(docuType);
        console.log(Address);
        console.log(ContactNum);
        console.log(Birthdate);
        console.log(BirthPlace);
        console.log(Gender);
        console.log(Cedula);
        console.log(Precint);
        console.log(CivilStatus);
        console.log(parentGuardianName);
        console.log(parentGuardianNo);
        console.log(Purpose);


        var dateObject = null;
        if (isValidDate(Birthdate)){
          const dateParts = Birthdate.split("/");
          const year = parseInt(dateParts[2], 10);
          const month = parseInt(dateParts[0], 10) - 1; 
          const day = parseInt(dateParts[1], 10);
    
          dateObject = new Date(year, month, day);
        }
      


      if (Gender.toUpperCase() === "MALE"){
        Gender = "Male";
      }else if (Gender.toUpperCase() == "FEMALE"){
        Gender = "Female";
      }

      if (CivilStatus.toUpperCase() == "SINGLE"){
        CivilStatus = "Single";
      }else if (CivilStatus.toUpperCase() == "MARRIED"){
        CivilStatus = "Married";
      }else if (CivilStatus.toUpperCase() == "WIDOW"){
        CivilStatus = "Widow";
      }

      if (docuType.toUpperCase() == "BARANGAY INDIGENCY"){
        docuType = "Barangay Indigency";
      }else if (docuType.toUpperCase() == "BARANGAY CLEARANCE"){
        docuType = "Barangay Clearance";
      }else if (docuType.toUpperCase() == "REFERRAL SLIP"){
        docuType = "Referral Slip";
      }
      
      
      updateSelectedDate(dateObject);
      updateSelectedOption(docuType);
      updateSelectedOptionCivilStatus(CivilStatus);
      updateSelectedOptionGender(Gender);
      updateSelectedOptionPhil("");
      
      (document.getElementById('lastName') as HTMLInputElement).value = LastName;
      (document.getElementById('firstName') as HTMLInputElement).value = FirstName;
      (document.getElementById('middleName') as HTMLInputElement).value = MiddleName;
      (document.getElementById('address') as HTMLInputElement).value = Address;
      (document.getElementById('telNum') as HTMLInputElement).value = ContactNum;
      (document.getElementById('birthPlace') as HTMLInputElement).value = BirthPlace;
      (document.getElementById('parentName') as HTMLInputElement).value = parentGuardianName;
      (document.getElementById('cedulaNo') as HTMLInputElement).value = Cedula;
      (document.getElementById('precintNo') as HTMLInputElement).value = Precint;
      (document.getElementById('parentContactNumber') as HTMLInputElement).value = parentGuardianNo;
      (document.getElementById('purpose') as HTMLInputElement).value= Purpose; 



        onRequestClose();
      } catch (error) {
        console.error('OCR Error:', error);
        setOcrResult(null);
      }
    }
  };

  const handleSubmit = () => {
    // You can use the ocrResult state here, which contains the OCR text.
    console.log('OCR Result:', ocrResult);

    // Close the modal
    onRequestClose();
  };

  function isValidDate(dateString: string) {
    // Define a regular expression pattern to match "mm/dd/yyyy" format
    var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
  
    // Test if the input string matches the pattern
    if (!datePattern.test(dateString)) {
      return false;
    }
  
    // Attempt to create a Date object from the input string
    var date = new Date(dateString);
  
    // Check if the Date object is valid and its month and day match the input
    return (
      !isNaN(date.getTime()) &&
      date.getDate() == parseInt(dateString.split("/")[1]) &&
      date.getMonth() + 1 == parseInt(dateString.split("/")[0]) &&
      date.getFullYear() == parseInt(dateString.split("/")[2])
    );
  }

  return (
    
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          width: '75%', // Adjust width as needed
          maxWidth: '800px', // Set a maximum width
          height: 'auto', // Allow content to expand as needed
          margin: 'auto', // Center horizontally
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
        <div className="p-10" style={{borderRadius:'5px', border: '5px dashed grey', justifyContent: 'center', alignItems:'center', display:'flex',flexDirection: 'column', width:'500px', height:'500px'}}>
        <FontAwesomeIcon icon={faFileArrowUp as IconProp} className="mr-2 pb-10" style={{ height: '200px', width: '200px' }} />
        <h2 className="pb-2">Select a file or drag and drop here</h2>
        <h2 className="pb-10" style={{color:'grey'}}>JPG, or PNG, file size no more than 10MB</h2>
        <label htmlFor="myFileInput" className="select-file py-2 px-10 rounded-lg bg-white ">
          Select File
        </label>
        <input className="py-2 px-10 rounded-lg bg-white " id="myFileInput" type="file" accept="image/*;" onChange={handleFileChange} style={{display:'none'}}/>
        {ocrResult && <div>OCR Result: {ocrResult}</div>}
        </div>
    </Modal>
  );
};

export default UploadModal;