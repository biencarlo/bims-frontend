'use client';

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

import axios from 'axios';
export default function Register(){
    useEffect(()=>{
            axios.get('http://127.0.0.1:8000/token').then((res)=>{
            setToken(res.data);
        });
    }, []);
    const [token, setToken] = useState<string>();
    console.log('first load', token);
    const handleSubmit = (e : React.SyntheticEvent)=>{
        e.preventDefault();
        
        const target = e.target as typeof e.target & {
          first_name: { value: string };
          middle_name: { value: string };
          last_name: { value: string };
          position_id: { value: number };
          email: { value: string };
          password: { value: string };
          password_confirmation: { value: string };
        };
        

        console.log('token >>', token);
        axios.post('http://127.0.0.1:8000/register', {
                first_name: target.first_name.value,
                middle_name: target.middle_name.value,
                last_name: target.last_name.value,
                position_id: target.position_id.value,
                email: target.email.value,
                password: target.password.value,
                password_confirmation: target.password_confirmation.value,
            }, {
                headers: {
                    'X-CSRF-TOKEN': token
                }
            });
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                    <Input type="text" className="w-42" placeholder="First Name" name="first_name"/>
                    <Input type="text" className="w-42"  placeholder="Middle Name" name="middle_name"/>
                    <Input type="text" className="w-42"  placeholder="Last Name" name="last_name"/>
                    <Input type="number"  className="w-42" placeholder="Position ID" name="position_id"/>
                    <Input type="email" className="w-42"  placeholder="Email" name="email"/>
                    <Input type="password" className="w-42"  placeholder="Password" name="password"/>
                    <Input type="password" className="w-42"  placeholder="Password" name="password_confirmation"/>
                    <Input type="submit" value={'Submit'} className="w-42" />
            </form>
        </>
    );
}