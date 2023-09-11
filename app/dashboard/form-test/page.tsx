import * as React from "react";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const formtypes = [
  {
    value: "Barangay Clearance",
    label: "Barangay Clearance",
  },
  {
    value: "Barangay Indigency",
    label: "Barangay Indigency",
  },
  {
    value: "Health Center Referral",
    label: "Health Center Referral",
  },
];

function page() {
  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] ">
        Create New Entry
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
          New
        </Typography>
      </Breadcrumbs>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mr: 2, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="select-form-type"
            select
            label="Select"
            defaultValue="Health Center Referral"
            helperText="Please select form type"
          />
          {formtypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          <TextField
            id="last-name"
            label="Last Name"
            margin="normal"
            style={{ width: "40%" }}
            variant="filled"
          />
          <TextField
            id="last-name"
            label="Last Name"
            margin="normal"
            style={{ width: "40%" }}
            variant="filled"
          />
        </div>
      </Box>
    </div>
  );
}

export default page;
