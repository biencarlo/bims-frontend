"use client";
import Link from "next/link";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  LayoutGrid,
  FilePlus,
  FileText,
  MapPin,
  Cross,
  List,
  User,
  SettingsIcon,
  AlertTriangle,
  BadgeAlert,
} from "lucide-react";
import layout from "@/app/dashboard/layout";
import SidebarItems from "./SidebarItems";
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  const [UserName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('Username'));
    setUserID(localStorage.getItem('ID'));
    setFullName(localStorage.getItem('fullName'));
    setIsAdmin(localStorage.getItem('isAdmin'));
    setProfileLink(localStorage.getItem('profileLink'));
    CheckIfLoggedIn();
  }, []);


  function CheckIfLoggedIn() {
    console.log(localStorage.getItem('ID'));
    if (localStorage.getItem('ID') == null){
      window.location.href = '/';
    }
  }

  const handleSettings = () => {
    // Your custom logic here
    console.log('Settings Icon Clicked');
    window.location.href = '/dashboard/profile';
  };

  const handleSignOut = () =>{
    console.log('SignOut');
    localStorage.removeItem('ID');
    localStorage.removeItem('Username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('profileLink');
    window.location.href = '/';
  }

  const handleUserProfilePicture = () =>{
    console.log("handleProfilePicture");
  }

  const segment = useSelectedLayoutSegment();
  const sidebarOptions = [
    {
      icon: <LayoutGrid />,
      name: "Dashboard",
      href: "/dashboard",
      current: !segment,
      parent: "MENU",
    },
    {
      icon: <FilePlus />,
      name: "New",
      href: "/dashboard/new",
      current: `/${segment}` === "/new",
    },
    {
      icon: <FileText />,
      name: "Clearances",
      href: "/dashboard/clearances",
      current: `/${segment}` === "/clearances",
    },
    {
      icon: <MapPin />,
      name: "Indigencies",
      href: "/dashboard/indigencies",
      current: `/${segment}` === "/indigencies",
    },
    {
      icon: <Cross />,
      name: "HC Referrals",
      href: "/dashboard/hc-referrals",
      current: `/${segment}` === "/hc-referrals",
      parent: "BRGY HEALTH CENTER",
    },
    {
      icon: <AlertTriangle />,
      name: "BDRRMC Records",
      href: "/dashboard/bdrrmc",
      current: `/${segment}` === "/bdrrmc",
    },
    {
      icon: <BadgeAlert />,
      name: "Incident Reports",
      href: "/dashboard/incidents",
      current: `/${segment}` === "/incidents",
    },
    {
      icon: <List />,
      name: "Document Logs",
      href: "/dashboard/residents-requested-documents",
      current: `/${segment}` === "/residents-requested-documents",
      parent: "      ",
    },
    {
      icon: <User />,
      name: "User List",
      href: "/dashboard/user-list",
      current: `/${segment}` === "/user-list",
    },
  ];

  const sidebarOptionsNotAdmin = [
    {
      icon: <LayoutGrid />,
      name: "Dashboard",
      href: "/dashboard",
      current: !segment,
      parent: "MENU",
    },
    {
      icon: <FilePlus />,
      name: "New",
      href: "/dashboard/new",
      current: `/${segment}` === "/new",
    },
    {
      icon: <FileText />,
      name: "Clearances",
      href: "/dashboard/clearances",
      current: `/${segment}` === "/clearances",
    },
    {
      icon: <MapPin />,
      name: "Indigencies",
      href: "/dashboard/indigencies",
      current: `/${segment}` === "/indigencies",
    },
    {
      icon: <Cross />,
      name: "HC Referrals",
      href: "/dashboard/hc-referrals",
      current: `/${segment}` === "/hc-referrals",
      parent: "BRGY HEALTH CENTER",
    },
    {
      icon: <AlertTriangle />,
      name: "BDRRMC Records",
      href: "/dashboard/bdrrmc",
      current: `/${segment}` === "/bdrrmc",
    },
    {
      icon: <BadgeAlert />,
      name: "Incident Reports",
      href: "/dashboard/incidents",
      current: `/${segment}` === "/incidents",
    },
    {
      icon: <List />,
      name: "Document Logs",
      href: "/dashboard/residents-requested-documents",
      current: `/${segment}` === "/residents-requested-documents",
      parent: "      ",
    },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-red-900">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 border-r-2">
        <div className="flex h-16 shrink-0 items-center gap-4 mt-5 border border-white rounded-md py-9 px-4">
          <Image src={"/sj-logo.png"} height={55} width={55} alt="sjLogo" />
          <h1 className="text-sm font-bold text-white">
            Brgy. Batis
            <br /> Information MS
          </h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {/* {sidebarOptions.map((option) => (
              <SidebarItems option={option}></SidebarItems>
            ))} */}
            {IsAdmin === "true" ? (
              sidebarOptions.map((option) => (
                <SidebarItems key={option.href} option={option} />
              ))
            ) : (
              sidebarOptionsNotAdmin.map((option) => (
                <SidebarItems key={option.href} option={option} />
              ))
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-4 px-5">
        <div className="aspect-square w-10 rounded-full" style={{ position: 'relative' }}>
          <img
            src="/sj-logo.png" // Replace with the actual path to your image
            alt="Default Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
          <h1 className="pr-10 text-white">{UserName}</h1>
          <SettingsIcon  onClick={handleSettings} style={{ cursor: 'pointer', color:'white' }} />
        </div>

        <button
          className="text-left py-3 px-4 border border-gray-400 rounded-md text-white hover:bg-[#bc6666] transition-all hover:border-transparent"
          type="button"
          onClick={handleSignOut}
        >
          <div className="py-15 px-3 flex justify-between">
            <div>
              <p className="text-medium font-medium hover:font-black transition-all">
                Sign Out
              </p>
            </div>
            <div>
              <LogoutIcon />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
