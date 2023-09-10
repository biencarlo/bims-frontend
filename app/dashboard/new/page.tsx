import React from "react";


interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  name: string;
  details?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type,
  name,
  details,
  ...props
}) => (
  <div className={`flex flex-col ${name !== "signatory" ? "grow" : ""}`}>
    <label htmlFor={id}>{label}</label>
    <input
      className={`${details ? "h-48" : ""} rounded-md`}
      id={id}
      type={type}
      name={name}
      {...props}
    />
  </div>
);

const New = () => {
  return (
    <div className="px-8 py-4 w-full">
      <h1 className="text-3xl font-bold">Create Document</h1>

      <form className="flex flex-col my-4 gap-2">
        <label htmlFor="docuTitle">Document Title</label>
        <input
          className="rounded-md"
          type="text"
          name="docuTitle"
          id="docuTitle"
        />

        <div className="flex gap-4">
          <FormField
            label="Document Type"
            id="docuType"
            type="text"
            name="docuType"
          />
          <FormField
            label="Action to be taken"
            id="action"
            type="text"
            name="action"
          />
        </div>

        {
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label htmlFor="details">Details</label>
              <textarea
                className="rounded-md"
                name="details"
                id="details"
                cols={65}
                rows={10}
              ></textarea>
            </div>
            <div className="flex flex-col grow">
              <FormField
                label="Signatory"
                id="signatory"
                type="text"
                name="signatory"
              />

              <div className="flex gap-4 my-4">
                <button className="py-2 px-10 bg-red-800 rounded-lg ">
                  User OCR
                </button>
                <button className="py-2 px-4 grow rounded-lg bg-white">
                  Create Document
                </button>
              </div>
              <div>
                <label className="text-xs text-">
                  Tip: To autofill data fields, click the Use OCR button to scan
                  a PDF/JPG file of a document
                </label>
              </div>
            </div>
          </div>
        }
      </form>
    </div>
  );
};

export default New;
