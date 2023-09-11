import * as React from "react";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CenterFocusStrong from "@mui/icons-material/CenterFocusStrong";
import "./styles.css";

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

const philc_types = [
  {
    value: "Dependent",
    label: "Dependent",
  },
  {
    value: "Senior",
    label: "Senior",
  },
  {
    value: "NHTs",
    label: "NHTs",
  },
  {
    value: "APs",
    label: "APs",
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
          <div className="w-full flex place-content-stretch mt-4">
            <TextField
              id="select-form-type"
              select
              label="Form Type"
              defaultValue="Health Center Referral"
              helperText="Please select form type"
              margin="normal"
              style={{ width: "100%" }}
              required
            >
              {formtypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              size="large"
              startIcon={<CenterFocusStrong sx={{ color: "black" }} />}
              variant="outlined"
              sx={{ height: 55, width: "600px" }}
              className="red-button mt-4 mr-5 py-2 px-10 hover:bg-red-800 hover:border-transparent rounded-sm transition-all "
            >
              Use OCR (Scan Document)
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={{ height: 55, width: "300px" }}
              className="mt-4 py-2 px-10 hover:bg-red-800 hover:border-transparent rounded-sm transition-all "
            >
              Create Document
            </Button>
          </div>
          <div className="flex-nowrap flex">
            <div className="w-1/5 pr-4">
              <TextField
                id="last-name"
                label="Last Name"
                margin="normal"
                variant="outlined"
                helperText="Please enter name"
                style={{ width: "100%" }}
                required
              />
            </div>
            <div className="w-1/5 pr-4">
              <TextField
                id="first-name"
                label="First Name"
                margin="normal"
                variant="outlined"
                required
                style={{ width: "100%" }}
              />
            </div>
            <div className="w-1/5 pr-4">
              <TextField
                id="middle-name"
                label="Middle Name"
                margin="normal"
                variant="outlined"
                required
                style={{ width: "100%" }}
              />
            </div>
            <div className="w-1/5 pr-4">
              <TextField
                id="philhealth-no"
                label="Philhealth No."
                margin="normal"
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>
            <div className="w-1/5">
              <TextField
                id="select-philc-type"
                select
                label="ID Category"
                defaultValue="Health Center Referral"
                helperText="Select ID category"
                margin="normal"
                style={{ width: "100%" }}
              >
                {philc_types.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className="flex-nowrap flex">
            <div className="w-2/3 pr-4">
              <TextField
                id="address"
                label="Address"
                margin="normal"
                variant="outlined"
                style={{ width: "100%" }}
                required
              />
            </div>
            <div className="w-1/3">
              <TextField
                id="hc-ggg-no"
                label="Healthcard GGG No."
                margin="normal"
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="flex-nowrap flex">
            <div className="w-3/5 pr-4">
              <TextField
                id="contact-no"
                label="Contact No."
                margin="normal"
                variant="outlined"
                style={{ width: "100%" }}
                required
              />
            </div>
            <div className="w-2/5">
              <TextField
                id="hc-ggg-no"
                label="Healthcard GGG No."
                margin="normal"
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default page;
