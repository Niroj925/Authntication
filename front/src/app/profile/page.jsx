'use client'
import api from '@/component/api/api'
import React,{useState,useEffect} from 'react'
import { refreshTokenRequest } from '@/component/function/rtr';

function page() {

  const [hobbies,setHobbies]=useState([])
  
  const access_token = localStorage.getItem('access_token');

  const handleGet=async()=>{
    try{
     const response=await api.get('/user/hobbies',{
     headers:{
      'Authorization': `Bearer ${access_token}`,
     }},
     {
      method: 'GET',
      credentials: 'include' // Include cookies in cross-origin requests
    });
    console.log(response.data);
     if(response.status==200){
      setHobbies(response.data);
     }
    }catch(err){
      console.log(err)
      if(err.response.status===401){
      const access_token= await refreshTokenRequest();
      //  await handleGet();
      if(access_token){
        document.location.reload();
      }

      }else{
        console.error('error');
      }
    }
    };

  useEffect(()=>{
  handleGet();
},[access_token])

  
   
  return (
    <div>
      <button onClick={handleGet}>Get hobbies</button>
    </div>
  )
}

export default page