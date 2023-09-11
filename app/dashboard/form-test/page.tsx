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
  {
    value: "Residence",
    label: "Residence",
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
   <></>
  );
}

export default page;
