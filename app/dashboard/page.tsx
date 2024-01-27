"use client";
import Image from "next/image";

import Cards from "@/data/dashboard/Card";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import api_url from "@/components/api_conf";
import { Label } from "@radix-ui/react-dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import withLoading from "../../components/withLoading";

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
  LineChart,
} from "lucide-react";

interface LabelData {
  Labels: string[];
  DataSets: DataSet[];
}

interface DataSet {
  Label: string;
  Data: number[];
}

interface DataCounts {
  Indigencies: number;
  Referrals: number;
  Clearance: number;
  Residents: number;
  BDRRMC: number;
  Incidents: number;
}

interface DataCountsPie {
  Printting: number;
  Printted: number;
  Claimed: number;
}

interface MonthAndYear {
  month: string;
  year: number;
}

const Dashboard: React.FC = () => {
  const getCurrentMonthYear = (): MonthAndYear => {
    const monthNames: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create a new Date object
    const currentDate: Date = new Date();

    // Get the current month (months are zero-based)
    const currentMonthIndex: number = currentDate.getMonth();

    // Get the month name using the index
    const currentMonth: string = monthNames[currentMonthIndex];

    // Get the current year
    const currentYear: number = currentDate.getFullYear();

    return { month: currentMonth, year: currentYear };
  };
  const getCurrentMonth = (): string => {
    const monthNames: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create a new Date object
    const currentDate: Date = new Date();

    // Get the current month (months are zero-based)
    const currentMonthIndex: number = currentDate.getMonth();

    // Get the month name using the index
    const currentMonth: string = monthNames[currentMonthIndex];

    return currentMonth;
  };

  const getGreeting = (): string => {
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
      return "Good morning";
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const greeting: string = getGreeting();

  const [DataCounter, setDataCounter] = useState<DataCounts>({
    Clearance: 0,
    Indigencies: 0,
    Referrals: 0,
    Residents: 0,
    BDRRMC: 0,
    Incidents: 0,
  });

  const [DataCounterPie, setDataCounterPie] = useState<DataCountsPie>({
    Printting: 0,
    Printted: 0,
    Claimed: 0,
  });

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [GetDataChart, setGetDataChart] = useState<LabelData>({
    Labels: [],
    DataSets: [
      {
        Label: "",
        Data: [],
      },
    ],
  });

  const [chartDatapie, setChartDatapie] = useState({});
  const [chartOptionspie, setChartOptionspie] = useState({});
  const [GetDataChartpie, setGetDataChartpie] = useState<LabelData>({
    Labels: [],
    DataSets: [
      {
        Label: "",
        Data: [],
      },
    ],
  });

  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  const [UserName, setUserName] = useState<string | null>(null);

  const [formattedDateTime, setFormattedDateTime] = useState("");

  useEffect(() => {
    const formatDate = () => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      } as Intl.DateTimeFormatOptions;

      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", options);

      setFormattedDateTime(formattedDate);
    };

    var getChartDataPoints = async () => {
      try {
        const response = await axios.get(api_url + "graph_data");
        const chartData = response.data;
        setGetDataChart(chartData);
        const d = GetDataChart;

        if (d && d.DataSets) {
          const asddatasets = d.DataSets.map((dataset, index) => ({
            label: dataset.Label,
            data: dataset.Data,
            fill: false, // To cycle through colors if there are more datasets than colors
            tension: 0.4,
          }));

          const DynamicData = {
            labels: d.Labels,
            datasets: asddatasets,
          };

          const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                },
              },
              y: {
                beginAtZero: true, // Start the y-axis at 0
                ticks: {
                  precision: 0, // Display whole numbers only
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                },
              },
            },
          };

          setChartData(DynamicData);
          setChartOptions(options);
        } else {
          console.error("Invalid chart data:", chartData);
        }
      } catch (error) {
        console.error("Error fetching graph_data:", error);
      }
    };

    var getPieChartDataPoints = async () => {
      try {
        const response = await axios.get(api_url + "piechart_data");
        const chartData = response.data;

        const configPieChart = {
          type: "pie",
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Chart.js Pie Chart",
              },
            },
          },
        };

        setChartDatapie(chartData);
        setChartOptionspie(configPieChart);
      } catch (error) {
        console.error("Error fetching piechart_data:", error);
      }
    };

    var getTotalDataCounts = async () => {
      await axios
        .get(api_url + "total_monthly_data")
        .then((response) => setDataCounter(response.data));
      return;
    };

    var getTotalPiechartDataCounts = async () => {
      await axios
        .get(api_url + "piechart_counter")
        .then((response) => setDataCounterPie(response.data));
      return;
    };

    getPieChartDataPoints();
    getChartDataPoints();
    getTotalDataCounts();
    getTotalPiechartDataCounts();
    setUserName(localStorage.getItem("Username"));
    setUserID(localStorage.getItem("ID"));
    setFullName(localStorage.getItem("fullName"));
    setIsAdmin(localStorage.getItem("isAdmin"));
    setProfileLink(localStorage.getItem("profileLink"));
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    CheckIfLoggedIn();

    // Define the base colors for borderColor (you can customize as needed)
    const borderColorPalette = [
      documentStyle.getPropertyValue("--red-500"),
      documentStyle.getPropertyValue("--green-500"),
      documentStyle.getPropertyValue("--blue-500"),
    ];

    formatDate();
  }, []);

  async function RefreshPage() {
    try {
      const response = await axios.get(api_url + "graph_data");
      const chartData = response.data;
      setGetDataChart(chartData);
      const d = GetDataChart;

      if (d && d.DataSets) {
        const asddatasets = d.DataSets.map((dataset, index) => ({
          label: dataset.Label,
          data: dataset.Data,
          fill: false, // To cycle through colors if there are more datasets than colors
          tension: 0.4,
        }));

        const DynamicData = {
          labels: d.Labels,
          datasets: asddatasets,
        };
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        } as Intl.DateTimeFormatOptions;

        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-US", options);

        setFormattedDateTime(formattedDate);
        setChartData(DynamicData);
      } else {
        console.error("Invalid chart data:", chartData);
      }
    } catch (error) {
      console.error("Error fetching graph_data:", error);
    }

    try {
      const response = await axios.get(api_url + "piechart_data");
      const chartData = response.data;

      const configPieChart = {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Chart.js Pie Chart",
            },
          },
        },
      };

      setChartDatapie(chartData);
      setChartOptionspie(configPieChart);
    } catch (error) {
      console.error("Error fetching piechart_data:", error);
    }

    await axios
      .get(api_url + "total_monthly_data")
      .then((response) => setDataCounter(response.data));
    await axios
      .get(api_url + "piechart_counter")
      .then((response) => setDataCounterPie(response.data));
  }

  function CheckIfLoggedIn() {
    console.log(localStorage.getItem("ID"));
    if (localStorage.getItem("ID") == null) {
      window.location.href = "/";
    }
  }

  return (
    <div className="px-8 py-8 h-screen">
      <div className="flex bg-blue-950 text-white py-5 px-7 rounded-t-[12px] gap-3">
        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/sj-logo.png"} fill={true} alt="sjLogo" />
        </div>

        <div className="aspect-square relative w-full max-w-[60px]">
          <Image src={"/logo_zamora-1.png"} fill={true} alt="sjLogo" />
        </div>
        <div className="items-center pl-6">
          <div>
            <p className="text-[10pt] font-medium pt-1 tracking-[2px]">
              BARANGAY BATIS, SAN JUAN CITY
            </p>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              e-Nexus Barangay Information Management System
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-auto">
          <h1 className="text-4xl font-black my-6 text-red-900 tracking-[-0.5px]">
            {greeting}, {FullName}!
          </h1>
        </div>
        <div></div>
        <div className="flex my-5">
          <button
            type="button"
            className="py-2 px-10 rounded-lg bg-red-800 text-white hover:text-red-900 hover:bg-blue-950 hover:border-white hover:text-white font-bold transition-all"
            onClick={RefreshPage}
          >
            <FontAwesomeIcon icon={faRefresh as IconProp} className="mr-2" />
            Reload Dashboard
          </button>
        </div>
      </div>

      <div className="  border border-blue-950 rounded-lg p-4">
        <div className="flex flex-row">
          <div className="grow text-2xl font-black text-blue-950 pb-4">
            {getCurrentMonthYear().month} {getCurrentMonthYear().year} Dashboard{" "}
          </div>
          <div className="ml-3 flex-row-reverse text-blue-950 text-right text-lg italic">
            Updated {formattedDateTime}
          </div>
        </div>
        <div className="grid grid-cols-13 gap-4">
          <div className="col-span-2 row-span-1 py-4 px-4  bg-white rounded-lg">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="col-span-1 row-span-2 ">
                <FileText className="p-5 w-full h-full bg-red-900 rounded-lg text-white border-black"></FileText>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full hover:font-black hover:text-xl transition-all">
                  Barangay Clearances
                </p>
              </div>
              <div className="col-start-2 col-span-2">
                <h1 className="text-5xl font-semibold">
                  {DataCounter.Clearance}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 col-start-1 row-start-2 p-4 bg-white rounded-lg border-black  ">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="col-span-1 row-span-2">
                <MapPin className="p-5 w-full h-full bg-red-900 rounded-lg text-white border-black  "></MapPin>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full hover:font-black hover:text-xl transition-all">
                  Barangay Indigencies
                </p>
              </div>
              <div className="col-start-2 col-span-2">
                <h1 className="text-5xl font-semibold">
                  {DataCounter.Indigencies}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 col-start-3 row-start-1 p-4 bg-white rounded-lg border-black">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="col-span-1 row-span-2">
                <Cross className="p-5 w-full h-full bg-red-900 rounded-lg text-white border-black  "></Cross>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full hover:font-black hover:text-xl transition-all">
                  Health Center Referrals
                </p>
              </div>
              <div className="col-start-2 col-span-2">
                <h1 className="text-5xl font-medium">
                  {DataCounter.Referrals}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 col-start-3 row-start-2 p-4 bg-white rounded-lg border-black">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="col-span-1 row-span-2">
                <AlertTriangle className="p-5 w-full h-full bg-red-900 rounded-lg text-white border-black  "></AlertTriangle>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full hover:font-black hover:text-xl transition-all">
                  BDRRMC Records
                </p>
              </div>
              <div className="col-start-2 col-span-2">
                <h1 className="text-5xl font-medium">{DataCounter.BDRRMC}</h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 col-start-5 row-start-1 py-4 px-4  bg-white rounded-lg border-black  ">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="row-span-2 col-span-1">
                <BadgeAlert className="p-5 w-full h-full bg-red-900 rounded-lg text-white border-black  "></BadgeAlert>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full hover:font-black hover:text-xl transition-all">
                  Incident Reports
                </p>
              </div>
              <div className="col-start-2 col-span-2">
                <h1 className="text-5xl font-medium">
                  {DataCounter.Incidents}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 col-start-5 row-start-2 py-4 px-4  bg-red-900 rounded-lg border-black  ">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <div className="row-span-2 col-span-1">
                <LineChart className="p-5 w-full h-full bg-white rounded-lg text-red-900 border-black  "></LineChart>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-medium w-full text-white hover:font-black hover:text-xl transition-all">
                  Total Documents
                </p>
              </div>
              <div className="col-start-2">
                <h1 className="text-5xl font-medium text-white">
                  {DataCounter.Clearance +
                    DataCounter.Indigencies +
                    DataCounter.Referrals}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-span-4 row-span-2 col-start-7 row-start-1 py-4 px-4  bg-white rounded-lg border-black  ">
            <div className="grid grid-cols-3 grid-rows-1 gap-4">
              <div className="col-span-3">
                <h1 className="text-2xl font-black text-red-900">
                  Document status
                </h1>
              </div>
              <div className="col-span-3 row-span-3 row-start-2 ">
                <div className="grid grid-cols-3 grid-rows-3 gap-1">
                  <div className="card row-span-3 col-span-2">
                    <Chart
                      type="pie"
                      data={chartDatapie}
                      options={chartOptionspie}
                    />
                  </div>
                  <div className="col-start-3 row-start-1 col-span-1">
                    <div>
                      <h1 className="text-5xl font-medium text-red-900">
                        {DataCounterPie.Printted}
                      </h1>
                    </div>
                    <div className="">
                      <p className="text-sm font-medium w-full">
                        For print records
                      </p>
                    </div>
                  </div>
                  <div className="col-start-3 row-start-2 col-span-1">
                    <div>
                      <h1 className="text-5xl font-medium text-yellow-900">
                        {DataCounterPie.Printting}
                      </h1>
                    </div>
                    <div className="">
                      <p className="text-sm font-medium w-full">
                        Printed records
                      </p>
                    </div>
                  </div>
                  <div className="col-start-3 row-start-3 col-span-1">
                    <div>
                      <h1 className="text-5xl font-medium text-green-900">
                        {DataCounterPie.Claimed}
                      </h1>
                    </div>
                    <div>
                      <p className="text-sm font-medium w-full">
                        Claimed records
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg border-blue-950 p-4 mt-4">
        <h1 className="text-2xl font-black text-blue-950 pb-4">
          Processed Records History
        </h1>
        <div className="card bg-white rounded-lg">
          <Chart type="line" data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
export default withLoading(Dashboard);
