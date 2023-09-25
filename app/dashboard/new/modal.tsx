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
          "Religion",
          "Occupation",
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
        var Religion = "";
        var Occupation = "";
        var CivilStatus = "";
        var parentGuardianName = "";
        var parentGuardianNo = "";
        var Purpose ="";
        var IsInPurpose = false;


        for (var i= 0; i<= lines.length - 1; i++) {

          if(IsInPurpose){
            Purpose += " " + lines[i];
          }

          for (var keyword of keywords) {
            if (lines[i].includes(keyword)) {
              // Extract the value following the keyword
              var value = lines[i].replace(keyword, '').trim();
              if (keyword == "Last Name"){
                LastName = value;
              }
              if (keyword == "First Name"){
                FirstName = value;
              }
              if (keyword == "Middle Name"){
                MiddleName = value;
              }
              if (keyword == "Type of Document"){
                docuType = value;
              }
              if (keyword == "San Juan City Address"){
                Address = value;
              }
              if (keyword == "Contact No"){
                var val = value.replace(".", '').trim();
                var val1 = val.replace(".", '').trim();
                var val2 = val1.replace(" ", '').trim();
                ContactNum = val2;
              }
              if (keyword == "Birthdate"){
                var splitBirthday = value.split(" ");
                Birthdate=splitBirthday[0];
              }
              if (keyword == "Birth Place"){
                BirthPlace = value;
              }
              if (keyword == "Gender"){
                var splitGender= value.split(" ");
                Gender = splitGender[0];
              }
              if (keyword == "Religion"){
                Religion = value;
              }
              if (keyword == "Occupation"){
                Occupation = value;
              }
              if (keyword == "Civil Status"){
                var splitCivilStatus = value.split(" ");
                CivilStatus = splitCivilStatus[0];
              }
              if (keyword == "Parent/Guardian Name"){
                parentGuardianName=value;
                var guardianNumber = lines[i+4].split(" ");
                parentGuardianNo = guardianNumber[1];
              }
              if (keyword == "Parent/Guardian"){
              }
              if (keyword == "Purpose"){
                Purpose = value;
                IsInPurpose = true;
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
        console.log(Religion);
        console.log(Occupation);
        console.log(CivilStatus);
        console.log(parentGuardianName);
        console.log(parentGuardianNo);
        console.log(Purpose);
      
      const dateParts = Birthdate.split("/");
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[0], 10) - 1; 
      const day = parseInt(dateParts[1], 10);

      const dateObject = new Date(year, month, day);

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
      (document.getElementById('religion') as HTMLInputElement).value = Religion;
      (document.getElementById('occupation') as HTMLInputElement).value = Occupation;
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