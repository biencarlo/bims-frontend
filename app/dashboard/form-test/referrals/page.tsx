"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

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

const gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const civil_status = [
  {
    value: "Single",
    label: "Single",
  },
  {
    value: "Married",
    label: "Married",
  },
  {
    value: "Widowed",
    label: "Widowed",
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
            margin="dense"
            variant="filled"
            helperText="Please enter name"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-1/5 pr-4">
          <TextField
            id="first-name"
            label="First Name"
            margin="dense"
            variant="filled"
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="w-1/5 pr-4">
          <TextField
            id="middle-name"
            label="Middle Name"
            margin="dense"
            variant="filled"
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="w-1/5 pr-4">
          <TextField
            id="philhealth-no"
            label="Philhealth No."
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
          />
        </div>
        <div className="w-1/5">
          <TextField
            id="select-philc-type"
            select
            label="ID Category"
            helperText="Select ID category"
            margin="dense"
            style={{ width: "100%" }}
            variant="filled"
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
            helperText="Please enter address"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-1/3">
          <TextField
            id="hc-ggg-no"
            label="Healthcard GGG No."
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="flex-nowrap flex">
        <div className="w-3/5 pr-4">
          <TextField
            id="contact-no"
            label="Contact No."
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
            }}
          />
        </div>
        <div className="w-2/5 pr-4">
          <TextField
            id="birthdate"
            label="Birthdate"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-3/5 pr-4">
          <TextField
            id="birthplace"
            label="Birth Place"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-1/5">
          <TextField
            id="select-gender"
            select
            label="Gender"
            helperText="Select Gender"
            margin="dense"
            style={{ width: "100%" }}
            required
            variant="filled"
          >
            {gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <div className="flex-nowrap flex">
        <div className="w-3/5 pr-4">
          <TextField
            id="guardian-name"
            label="Parent/Guardian Name"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-2/5 pr-4">
          <TextField
            id="religion"
            label="Religion"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-3/5 pr-4">
          <TextField
            id="occupation"
            label="Occupation"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="w-2/5">
          <TextField
            id="select-civil-status"
            select
            label="Civil Status"
            helperText="Select Civil Status"
            margin="dense"
            style={{ width: "100%" }}
            required
            variant="filled"
          >
            {civil_status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <div className="flex-nowrap flex">
        <div className="w-2/5 pr-4">
          <TextField
            id="guardian-contact-no"
            label="Parent/Guardian Contact No."
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            helperText="Please enter contact number"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
            }}
          />
        </div>
        <div className="w-3/5">
          <TextField
            id="purpose"
            label="Purpose"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            disabled
          />
        </div>
      </div>
      <div className="flex-nowrap flex">
        <div className="w-3/5 pr-4">
          <TextField
            id="reason"
            label="Reason for Referral"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            required
            multiline
            maxrows={4}
          />
        </div>
        <div className="w-3/5">
          <TextField
            id="remarks"
            label="Remarks"
            margin="dense"
            variant="filled"
            style={{ width: "100%" }}
            multiline
            maxrows={4}
          />
        </div>
      </div>
    </>
  );
};

export default page;
