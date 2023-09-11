import * as React from "react";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

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
      <div>
        <form noValidate autoComplete="off" width="100%">
          <TextField
            id="last-name"
            label="Last Name"
            margin="normal"
            style = {{width: "40%"}}
            variant = "filled"
          />
          <TextField
            id="last-name"
            label="Last Name"
            margin="normal"
            style = {{width: "40%"}}
            variant = "filled"
          />
                    <TextField
            id="last-name"
            label="Last Name"
            margin="normal"
            style = {{width: "40%"}}
            variant = "filled"
          />
        </form>
      </div>
    </div>
  );
}

export default page;
