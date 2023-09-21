"use client";
import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'crypto-js/md5';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async () => {
    // Hash the password using MD5
    const hashedPassword = md5(password).toString();

    const response = await axios.post('http://192.168.254.170:8085/login', {
      username,
      password: hashedPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { success, response: userData, message } = response.data;

    console.log(success);
    console.log(userData);
    console.log(message);
    if (success) {
      // Store user data in session storage
      sessionStorage.setItem('ID', userData.ID);
      sessionStorage.setItem('fullName', userData.FullName);
      sessionStorage.setItem('isAdmin', userData.IsAdmin);
      sessionStorage.setItem('profileLink', userData.ProfileLink);
      // Redirect to /dashboard (you can add this once you have the navigate component)
      window.location.href = '/dashboard';
      
    } else {
      // Handle unsuccessful login by displaying the error message
      setLoginError(message || 'An error occurred during login.');
      setTimeout(() => {
        setLoginError(null);
      }, 3000); // 3000 milliseconds = 3 second
    }

  };

  return (
    <div>
      <form className="flex flex-col gap-4">
        {loginError && (
          <div role="alert" className="login-error">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
              Error:
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p className="error-message">{loginError}</p>
            </div>
          </div>
        )}
        <input
          className="px-2 py-2 rounded-md"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-2 py-2 rounded-md"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="uppercase px-2 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-800"
          type="button"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}