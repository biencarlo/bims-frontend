"use client";
import Image from "next/image";

import Cards from "@/data/dashboard/Card";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import axios from "axios";
import api_url from "@/components/api_conf";
import md5 from "crypto-js/md5";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import withLoading from "../../../components/withLoading";

const Profile: React.FC = () => {
  const toast = useRef<Toast>(null);

  const showSuccessFul = () => {
    toast.current!.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current!.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  const [UserName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("Username"));
    setUserID(localStorage.getItem("ID"));
    setFullName(localStorage.getItem("fullName"));
    setIsAdmin(localStorage.getItem("isAdmin"));
    setProfileLink(localStorage.getItem("profileLink"));
    CheckIfLoggedIn();
  }, []);

  function CheckIfLoggedIn() {
    console.log(localStorage.getItem("ID"));
    if (localStorage.getItem("ID") == null) {
      window.location.href = "/";
    }
  }

  const [UpdateformData, setUpdateFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confimPassword: "",
  });

  const resetUpdateForm = () => {
    setUpdateFormData({
      currentPassword: "",
      newPassword: "",
      confimPassword: "",
    });
  };
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log(name, value); // Check the values of name and value
    setUpdateFormData({
      ...UpdateformData,
      [name]: value,
    });
  };

  const handleChangePassword = async () => {
    if (UpdateformData.newPassword == UpdateformData.confimPassword) {
      var hashedPassword = md5(UpdateformData.currentPassword).toString();
      var hashedNewPassword = md5(UpdateformData.newPassword).toString();
      await axios
        .post(
          api_url + "change_password",
          {
            Username: UserName,
            Password: hashedPassword,
            NewPassword: hashedNewPassword,
            ID: parseInt(UserID!),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          if (response.data.Successful) {
            showSuccessFul();
            resetUpdateForm();
          } else {
            showError(response.data.Message);
          }
        });
    } else {
      showError("New Password should be the same with the Confirm Password");
    }
  };

  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black my-6 text-red-900 tracking-[-0.5px]">
        Profile
      </h1>
      <div className="flex gap-4 pb-4">
        <div className="pb-2 flex flex-col grow">
          <label
            style={{ marginBottom: "10px" }}
            htmlFor="currentPassword"
            className="col-form-label"
          >
            Current Password:
          </label>
          <input
            style={{ marginBottom: "10px" }}
            type="password"
            className="p-2 mt-[-2px] rounded-md border-2 border-grey"
            id="currentPassword"
            name="currentPassword"
            value={UpdateformData.currentPassword}
            onChange={handleInputChange}
          ></input>
          <label
            style={{ marginBottom: "10px" }}
            htmlFor="newPassword"
            className="col-form-label"
          >
            New Password:
          </label>
          <input
            style={{ marginBottom: "10px" }}
            type="password"
            className="p-2 mt-[-2px] rounded-md border-2 border-grey"
            id="newPassword"
            name="newPassword"
            value={UpdateformData.newPassword}
            onChange={handleInputChange}
          ></input>
          <label
            style={{ marginBottom: "10px" }}
            htmlFor="confimPassword"
            className="col-form-label"
          >
            Confirm Password:
          </label>
          <input
            style={{ marginBottom: "10px" }}
            type="password"
            className="p-2 mt-[-2px] rounded-md border-2 border-grey"
            id="confimPassword"
            name="confimPassword"
            value={UpdateformData.confimPassword}
            onChange={handleInputChange}
          ></input>
          <button
            style={{ marginTop: "20px" }}
            type="button"
            className="py-2 px-10 rounded-lg bg-white "
            onClick={handleChangePassword}
          >
            <FontAwesomeIcon icon={faLock as IconProp} className="mr-2" />
            Update Password
          </button>
        </div>
        <div className="pb-2 flex flex-col grow"></div>

        <Toast ref={toast} />
      </div>
    </div>
  );
};

export default withLoading(Profile);
