import Login from "@/components/Login";
import Image from "next/image";
export default function page() {

  return (
    <main className="h-screen ">
      <Image
        className="absolute -z-20"
        src={"/login-bg.png"}
        fill={true}
        objectFit="cover"
        alt="bg-login"
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-36 h-screen">
        <div className="aspect-square w-full max-w-md relative hidden md:block ">
          <Image src={"/login-left.png"} fill={true} alt="LoginLeft" />
        </div>

        <div className="w-full max-w-sm ">
          <div className="aspect-square w-full max-w-[120px] md:max-w-[140px] relative m-auto mb-5">
            <Image src={"/sj-logo.png"} fill={true} alt="SjLogo" />

            <Image
              className="absolute bottom-0 -right-2 md:-right-5  lg:-right-10 w-full max-w-[55px] md:max-w-[70px]"
              src={"/logo_zamora-1.png"}
              height={80}
              width={80}
              alt="zamora"
            />
          </div>

          <div className="mb-5 text-center">
            <h1 className="font-medium text-lg">Barangay Batis</h1>
            <h1 className="font-semibold text-xl">
              Information Management System
            </h1>
          </div>
          <Login />
        </div>
      </div>
    </main>
  );
}
