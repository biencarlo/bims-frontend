import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] ">
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
                  Use OCR
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
