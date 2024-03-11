"use client"

import React, { useState } from 'react'
import styles from './login.module.css'
import { useRouter } from 'next/navigation';
import api from '@/component/api/api';


function LoginPage() {

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [clicked,setClicked]=useState(false);
 const [isButtonDisabled, setIsButtonDisabled] = useState(false);
 

    const router=useRouter()

    

    const handleClick=async(event)=>{
      setIsButtonDisabled(true);
      setClicked(true);
		const data={
		  "email":email,
		  "password":password
		}

	  try{
		const res=await api.post('auth/signin',data,{
      withCredentials:true
    });
  
    console.log(res.data);
    if(res.status===200){
     localStorage.setItem('access_token',res.data.access_token);
     router.push('/profile');
    }else{
      router.push('/login')
    }
  }catch(err){
 console.log(err)

  }finally{
    setClicked(false);
    setIsButtonDisabled(false);
  }
    }



  const handleChangeEmail=(e)=>{
    setEmail(e.target.value);
  }

  const handleChangePassword=(e)=>{
    setPassword(e.target.value);
  }

  const handleForgotClick=()=>{
    router.push('/forgotpass');
  }

  return (
    <div className={styles.container}> 
      <div className={styles.formContainer}>
        <h2 className={styles.login}>LogIn</h2>
        <form action="" className={styles.form}>
          <input 
          type='text' 
          placeholder='Email Address'
          name='email'
          value={email}
          onChange={handleChangeEmail}
          /> 
          <input 
          type='password'
           placeholder='password'
           name='password'
           value={password}
           onChange={handleChangePassword}
           />
           <p className={styles.forgot} onClick={()=>handleForgotClick()}>Forgot Password?</p>
          <button type="button" 
          className={clicked?styles.clicked:styles.unclick} 
          onClick={()=>handleClick()} 
           disabled={isButtonDisabled} 
          >Login</button>
        </form>
      </div>
     </div>
  )
}

export default LoginPage