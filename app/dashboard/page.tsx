import Image from "next/image";

import Cards from "@/data/dashboard/Card";

export default function Dashboard() {
  return (
    <div className="px-8 py-4">
      <div className="flex bg-gray-600 text-white py-5 px-4 rounded-lg gap-3">
        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/sj-logo.png"} fill={true} alt="sjLogo" />
        </div>

        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/logo_zamora-1.png"} fill={true} alt="sjLogo" />
        </div>
        <div>
          <h1 className="text-lg font-medium">Barangay Batis, San Juan City</h1>
          <h1 className="text-2xl font-semibold">
            Information Management System
          </h1>
        </div>
      </div>

      <h1 className="text-4xl font-bold my-6">Dashboard</h1>

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
