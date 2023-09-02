import Sidebar from "@/components/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div className="">
      <Sidebar />
      <main className="pl-72">{children}</main>
    </div>
  );
}
