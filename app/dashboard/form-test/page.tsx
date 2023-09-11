'use client';

import * as React from "react";
import { useRouter } from 'next/navigation'
import "./styles.css";


function page() {
  const router = useRouter();

  React.useEffect(()=>{
    router.push('form-test/referrals');
  },[])
  return (
   <form>
   
   </form>
  );
}

export default page;
