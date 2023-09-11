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
} from "lucide-react";
import layout from "@/app/dashboard/layout";
import SidebarItems from "./SidebarItems";
import LogoutIcon from '@mui/icons-material/Logout';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
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
      icon: <List />,
      name: "Residents List",
      href: "/dashboard/residents-list",
      current: `/${segment}` === "/residents-list",
      parent: "      ",
    },
    {
      icon: <User />,
      name: "User List",
      href: "/dashboard/user-list",
      current: `/${segment}` === "/user-list",
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
            {sidebarOptions.map((option) => (
              <SidebarItems option={option}></SidebarItems>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 px-5">
          <div className="aspect-square bg-black w-10 rounded-full"></div>
          <h1>Admin</h1>
        </div>

        <button
          className="text-left py-3 px-4 border border-gray-400 rounded-md text-white hover:bg-[#bc6666] transition-all hover:border-transparent"
          type="button"
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
