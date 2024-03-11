// components/Navbar.js
"use client"

import Link from 'next/link';
import styles from "./nav.module.css"
import { useRouter } from 'next/navigation';
import api from '../api/api';

const Navbar = () => {

  const router=useRouter();

  async function handleLogout() {
      // Usage
      const res=await api.post('/auth/logout');
      console.log(res.data);
  const accessToken = getAccessTokenCookie();
  console.log(accessToken); 

    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'; 
 
    router.push('/'); 
  }
  function getAccessTokenCookie() {
    // Get all cookies
    const cookies = document.cookie.split(';');
  
    // Find the access_token cookie
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return decodeURIComponent(value); // Return the decoded value
      }
    }
  
    return null; // Return null if access_token cookie is not found
  }
  

  return (
    <div>
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/">
            Home
            {/* <a>Home</a> */}
          </Link>
        </li>
        <li>
          <Link href="/about">
            About
          </Link>
        </li>
        <li>
          <Link href="/login">
            Login
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Navbar;
