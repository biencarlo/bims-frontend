import Image from "next/image";

import Cards from "@/data/dashboard/Card";

export default function Dashboard() {
  return (
    <div className="px-8 py-4">
      <div className="flex bg-blue-950 text-white py-5 px-7 rounded-t-[12px] gap-3">
        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/sj-logo.png"} fill={true} alt="sjLogo" />
        </div>

        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/logo_zamora-1.png"} fill={true} alt="sjLogo" />
        </div>
        <div className="items-center pl-6">
          <div>
            <p className="text-[10pt] font-medium pt-2 tracking-[2px]">
              BARANGAY BATIS, SAN JUAN CITY
            </p>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Information Management System
            </h1>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-black my-6 text-red-900 tracking-[-0.5px]">
        Dashboard
      </h1>

      <div className="flex gap-10">
        {Cards.map((card) => (
          <div className="grow py-4 px-4 bg-white rounded-lg" key={card.name}>
            <h1 className="text-3xl font-medium">12</h1>
            <p className="text-md font-medium">{card.name}</p>
          </div>
        ))}
      </div>

      <div className="w-full h-96 bg-white my-8"></div>
    </div>
  );
}
