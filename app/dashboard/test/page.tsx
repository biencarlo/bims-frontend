'use client';

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";

import axios from 'axios';
export default function Test(){
    const [token, setToken] = useState<string>();
    const [officers, setOfficers] = useState<[]>();

        //para mafetch yung token
    useEffect(()=>{

        axios.get('http://127.0.0.1:8000/token').then((res)=>{
        setToken(res.data);
        });

        axios.get('http://127.0.0.1:8000/api/users').then((res)=>{
            console.log(res.data)
            setOfficers(res.data);
        })
    }, []);
    
    // function to handle on submit 
    const handleSubmit = (e : React.SyntheticEvent)=>{
        e.preventDefault();
        
        // kinukuha  mga input fields
        const target = e.target as typeof e.target & {
          first_name: { value: string };
          middle_name: { value: string };
          last_name: { value: string };
          address: { value: string };
          birth_date: { value: string };
          birth_place: { value: string };
          gender: { value: string };
          civil_status: { value: string };
          contact_number: { value: number };
          guardian_name: { value: string };
          guardian_contact_number: { value: number };
          religion: { value: string };
          occupation: { value: string };
          issuing_officer_id: { value: string };
        };
        
        // sinesend sa server
        axios.post('http://127.0.0.1:8000/api/residents', {
                first_name: target.first_name.value,
                middle_name: target.middle_name.value,
                last_name: target.last_name.value,
                address: target.address.value,
                birth_date: target.birth_date.value,
                birth_place: target.birth_place.value,
                gender: target.gender.value,
                civil_status: target.civil_status.value,
                contact_number: target.contact_number.value,
                guardian_name: target.guardian_name.value,
                guardian_contact_number: target.guardian_contact_number.value,
                religion: target.religion.value,
                occupation: target.occupation.value,
                issuing_officer_id: target.issuing_officer_id.value,
            },
             {
                headers: {
                    'X-CSRF-TOKEN': token
                }
            }).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                    {/* IMPORTANT YUNG NAME SA INPUTS. DAPAT PAREHO SILA SA COLUMN NAME SA DB */}

                    {/* First Name */}
                    <Input type="text" className="w-42" placeholder="First Name" name="first_name"/>

                    {/* Middle Name */}
                    <Input type="text" className="w-42"  placeholder="Middle Name" name="middle_name"/>

                    {/* Last Name */}
                    <Input type="text" className="w-42"  placeholder="Last Name" name="last_name"/>

                    {/* Address */}
                    <Input type="text" className="w-42"  placeholder="Address" name="address"/>

                    {/* Birth Date */}
                    <Input type="date" className="w-42"  name="birth_date"/>

                    {/* Birth Place */}
                    <Input type="text" className="w-42"  placeholder="Birth Place" name="birth_place"/>

                    {/* Gender */}
                    <Select name="gender">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Civil Status */}
                    <Select name="civil_status">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Civil Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Civil Status</SelectLabel>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Contact Number */}
                    <Input type="text"  className="w-42" placeholder="Contact Number" name="contact_number"/>

                    {/* Guardian Name */}
                    <Input type="text"  className="w-42" placeholder="Guardian Name" name="guardian_name"/>

                    {/* Guardian Contact Number */}
                    <Input type="text" className="w-42"  placeholder="Guardian Contact Number" name="guardian_contact_number"/>

                    {/* Religion */}
                    <Input type="text" className="w-42"  placeholder="Religion" name="religion"/>

                    {/* Occupation */}
                    <Input type="text" className="w-42"  placeholder="Occupation" name="occupation"/>

                    {/* Issuing Officer */}
                    <Select name="issuing_officer_id">
                        <SelectTrigger className="w-[360px]">
                            <SelectValue placeholder="Issuing Officer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Issuing Officer</SelectLabel>
                            {officers?.map((officer)=><SelectItem value={officer.id}>{officer?.full_name}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    <Input type="submit" value={'Submit'} className="w-42" />
            </form>
        </>
    );
}