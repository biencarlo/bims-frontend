import React from 'react'
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


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

const page = () => {
  return (
    <> 
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
    </>
  )
}

export default page