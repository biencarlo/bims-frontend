'use client';

import * as React from "react";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CenterFocusStrong from "@mui/icons-material/CenterFocusStrong";
import { useRouter } from 'next/navigation'
import "./styles.css";


type Props = {
  children: React.ReactNode;
};

const formtypes = [
  {
    value: "clearance",
    label: "Barangay Clearance",
  },
  {
    value: "indigency",
    label: "Barangay Indigency",
  },
  {
    value: "referrals",
    label: "Health Center Referral",
  },
  {
    value: "residence",
    label: "Residence",
  },
];

const handleSubmit = async (e :React.FormEvent)=>{
  e.preventDefault();
  console.log(e.target)
}


export default function layout({ children }: Props) {
  const router = useRouter();
  const [hover, setHover] = React.useState('black');
  const handleChange= (e: React.SyntheticEvent)=>{
    router.replace(e.target.value);
    console.log(e.target.value)
  }
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
        <form id="form" onSubmit={handleSubmit}>
          <div className="w-full flex place-content-stretch mt-4">
            <TextField
              onChange={handleChange}
              id="select-form-type"
              select
              label="Form Type"
              defaultValue="referrals"
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
              startIcon={<CenterFocusStrong sx={{ color: {hover} }} />}
              variant="outlined"
              sx={{ height: 55, width: "600px" }}
              className="red-button mt-4 mr-5 py-2 px-10 hover:bg-red-800 hover:border-transparent rounded-sm transition-all "
            >
              Use OCR (Scan Document)
            </Button>
            <Button
              size="large"
              type="submit"
              variant="outlined"
              sx={{ height: 55, width: "300px" }}
              className="mt-4 py-2 px-10 hover:bg-red-800 hover:border-transparent hover:text-white rounded-sm transition-all "
            >
              Create Document
            </Button>
          </div>
          <div>
            {children}

          </div>
          </form>
          </Box>
          </div>

  );
}
