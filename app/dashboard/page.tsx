"use client";
import Image from "next/image";

import Cards from "@/data/dashboard/Card";
import { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import axios from "axios";
import api_url from "@/components/api_conf";
import { Label } from "@radix-ui/react-dropdown-menu";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faRefresh } from '@fortawesome/free-solid-svg-icons';


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
}

export default function Dashboard() {
  
  const [DataCounter, setDataCounter] = useState<DataCounts>({
    Clearance: 0,
    Indigencies: 0,
    Referrals: 0,
    Residents: 0,
  });

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [GetDataChart, setGetDataChart] = useState<LabelData>({
    Labels: [],
    DataSets: [
      {
        Label:'',
        Data:[],
      }
    ],
  });


  const [UserID, setUserID] = useState<string | null>(null);
  const [FullName, setFullName] = useState<string | null>(null);
  const [IsAdmin, setIsAdmin] = useState<string | null>(null);
  const [ProfileLink, setProfileLink] = useState<string | null>(null);

  const [UserName, setUserName] = useState<string | null>(null);

  useEffect(() => {

    var getChartDataPoints = async () => {
      try {
        const response = await axios.get(api_url + 'graph_data');
        const chartData = response.data;
        setGetDataChart(chartData)
        const d = GetDataChart;
        
        if (d && d.DataSets) {
          const asddatasets = d.DataSets.map((dataset,index) => ({
            label: dataset.Label,
            data: dataset.Data,
            fill: false,// To cycle through colors if there are more datasets than colors
            tension: 0.4,
          }));
    
          const DynamicData = {
            labels: d.Labels,
            datasets: asddatasets
          };
    
          const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
              legend: {
                labels: {
                  color: textColor
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary
                },
                grid: {
                  color: surfaceBorder
                }
              },
              y: {
                ticks: {
                  color: textColorSecondary
                },
                grid: {
                  color: surfaceBorder
                }
              }
            }
          };
    
          setChartData(DynamicData);
          setChartOptions(options);
        } else {
          console.error('Invalid chart data:', chartData);
        }
      } catch (error) {
        console.error('Error fetching graph_data:', error);
      }
    };
    
    var getTotalDataCounts= async () =>{
      await axios.get(api_url+'total_monthly_data')
      .then(response => setDataCounter(response.data));
      return;
    };

    getChartDataPoints();
    getTotalDataCounts();
    setUserName(localStorage.getItem('Username'));
    setUserID(localStorage.getItem('ID'));
    setFullName(localStorage.getItem('fullName'));
    setIsAdmin(localStorage.getItem('isAdmin'));
    setProfileLink(localStorage.getItem('profileLink'));
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    CheckIfLoggedIn();

    // Define the base colors for borderColor (you can customize as needed)
    const borderColorPalette = [
      documentStyle.getPropertyValue('--red-500'),
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--blue-500'),
    ];

  }, []);

  async function RefreshPage(){
    try {
      const response = await axios.get(api_url + 'graph_data');
      const chartData = response.data;
      setGetDataChart(chartData)
      const d = GetDataChart;
      
      if (d && d.DataSets) {
        const asddatasets = d.DataSets.map((dataset,index) => ({
          label: dataset.Label,
          data: dataset.Data,
          fill: false,// To cycle through colors if there are more datasets than colors
          tension: 0.4,
        }));
  
        const DynamicData = {
          labels: d.Labels,
          datasets: asddatasets
        };
  
        setChartData(DynamicData);
      } else {
        console.error('Invalid chart data:', chartData);
      }
    } catch (error) {
      console.error('Error fetching graph_data:', error);
    }
  }

  function CheckIfLoggedIn() {
    console.log(localStorage.getItem('ID'));
    if (localStorage.getItem('ID') == null){
      window.location.href = '/';
    }
  }

  
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
            <p className="text-[10pt] font-medium pt-1 tracking-[2px]">
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

      <h1 className="text-4xl font-black my-6 text-red-900 tracking-[-0.5px]" >
        Dashboard
      </h1>

      <div className="flex flex-col items-center justify-center pb-4">
        <button type="button" className="py-2 px-10 rounded-lg bg-red-800 rounded-lg" style={{color:'white'}} onClick={RefreshPage}>
              <FontAwesomeIcon icon={faRefresh as IconProp} className="mr-2" />
              Reload Dashboard
        </button>
      </div>

      <div className="flex gap-10">
          <div className="grow py-4 px-4 bg-white rounded-lg" key="Barangay Clearances">
            <h1 className="text-3xl font-medium">{DataCounter.Clearance}</h1>
            <p className="text-md font-medium">Barangay Clearances</p>
          </div>
          <div className="grow py-4 px-4 bg-white rounded-lg" key="Barangay Indigencies">
            <h1 className="text-3xl font-medium">{DataCounter.Indigencies}</h1>
            <p className="text-md font-medium">Barangay Indigencies</p>
          </div>
          <div className="grow py-4 px-4 bg-white rounded-lg" key="Health Center Referrals">
            <h1 className="text-3xl font-medium">{DataCounter.Referrals}</h1>
            <p className="text-md font-medium">Health Center Referrals</p>
          </div>
          <div className="grow py-4 px-4 bg-white rounded-lg" key="Residents Registered">
            <h1 className="text-3xl font-medium">{DataCounter.Clearance + DataCounter.Indigencies + DataCounter.Referrals}</h1>
            <p className="text-md font-medium">Total Documents Requested</p>
          </div>
      </div>
      <div className="card bg-white my-8">
        {GetDataChart ? (
          <Chart type="line" data={chartData} options={chartOptions} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}
