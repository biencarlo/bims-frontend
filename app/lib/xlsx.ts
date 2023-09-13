import xlsx, { IJsonSheet } from "json-as-xlsx";
import { Person } from "@/app/people";

export function downloadToExcel() {
  let columns: IJsonSheet[] = [
    {
      sheet: "Persons",
      columns: [
        { label: "Indigency ID", value: "ID" },
        { label: "Resident ID", value: "resident_id" },
        { label: "Date Created", value: "date_created" },
        { label: "Valid Until", value: "valid_until" },
        { label: "Last Name", value: "last_name" },
        { label: "First Name", value: "first_name" },
        { label: "Middle Name", value: "middle_name" },
        { label: "Reason", value: "reason" },
        { label: "Remarks", value: "remarks" },
        { label: "Issuing Officer", value: "issuing_officer" },
      ],
      content: people,
    },
  ];

  let settings = {
    fileName: "People Excel",
  };

  xlsx(columns, settings);
}
