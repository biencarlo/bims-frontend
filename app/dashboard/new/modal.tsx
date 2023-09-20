import React, { useState } from 'react';
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './styles.css';

interface UploadModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onRequestClose }) => {
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { data } = await Tesseract.recognize(file, 'eng', {
          logger: (m) => console.log(m),
        });
        setOcrResult(data.text);
        //make the element change its value
        (document.getElementById('remarks') as HTMLInputElement).value = data.text
        //close modal
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