"use client";
import Link from "next/link";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const segment = useSelectedLayoutSegment();
  const sidebarOptions = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: !segment,
      border: true,
      parent: "Menu",
    },
    {
      name: "New",
      href: "/dashboard/new",
      current: `/${segment}` === "/new",
      border: true,
    },
    {
      name: "Clerances",
      href: "/dashboard/clearances",
      current: `/${segment}` === "/clearances",
    },
    {
      name: "Indigencies",
      href: "/dashboard/indigencies",
      current: `/${segment}` === "/indigencies",
      border: true,
    },
    {
      name: "HC Referrals",
      href: "/dashboard/hc-referrals",
      current: `/${segment}` === "/hc-refferals",
      parent: "Brgy Health Center",
    },
  ];
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-red-900">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 border-r-2">
        <div className="flex h-16 shrink-0 items-center gap-4 mt-5 border border-white rounded-md py-9 px-4">
          <Image src={"/sj-logo.png"} height={55} width={55} alt="sjLogo" />
          <h1 className="text-sm font-bold text-white">
            Brgy. Batis <br /> Information MS
          </h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {sidebarOptions.map((option) => (
              <li key={option.name}>
                <h1
                  className={`${
                    option.parent ? "block" : "hidden"
                  } text-sm text-white pl-6 pb-2 ${
                    option.parent === "Brgy Health Center" ? "pt-3" : ""
                  }`}
                >
                  {option.parent}
                </h1>
                <ul role="list" className="-mx-2 space-y-4">
                  <li
                    className={`rounded-md py-2 px-2
              ${
                option.current
                  ? "bg-[#ffbbbb] text-[#5a0000]"
                  : "text-white hover:text-white hover:bg-[#bc6666]"
              }
            `}
                  >
                    <Link href={option.href}>{option.name}</Link>
                  </li>
                  {/* Add the border div here */}
                  {option.border && <div className="border-b-2"></div>}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 px-5">
          <div className="aspect-square bg-black w-10 rounded-full"></div>
          <h1>Admin</h1>
        </div>

        <button
          className="text-left py-3 px-4 border border-gray-400 rounded-md text-white"
          type="button"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
