import Link from "next/link";

export default function SidebarItems({ option }) {
  return (
    <li key={option.name}>
      <p 
        className={`${
          option.parent ? "block" : "hidden"
        } text-[8pt] text-white pt-2 pl-20 pb-2 tracking-[.30em] ${
          option.parent === "Brgy Health Center" ? "pt-1" : ""
        }`}
      >
        {option.parent}
      </p>
      <ul role="list" className=" space-y-1">
        <Link href={option.href}>
          <li
            className={`rounded-md py-2 px-7 flex space-x-1
    ${
      option.current
        ? "bg-[#ffbbbb] text-[#5a0000] font-black transition-all"
        : "text-white hover:text-white hover:bg-[#bc6666] hover:font-black transition-all "
    }
  `}
          >
            {option.icon}
            <span className={`pl-6`}>{option.name}</span>
          </li>
        </Link>

        {/* Add the border div here */}
        {option.border && <div className="border-b pt-1"></div>}
      </ul>
    </li>
  );
}
