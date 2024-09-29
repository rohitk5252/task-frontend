import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthContext } from './useAuthContext'
// import { useNavigate } from 'react-router-dom'
import { genConfig } from 'react-nice-avatar'

export const useGoogleAuth = () => {
    const { dispatch } = useAuthContext()
   
    const handleGoogleResponse = async (googleAuthResult) => {
        try {
            const authCode = googleAuthResult.code;
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ code: authCode , userAvatar: {...genConfig(), shirtColor: "#fff"}})  
          });
              const data = await res.json();
              if(res.ok) {
                localStorage.setItem('user', JSON.stringify(data))
                dispatch({ type: 'LOGIN', payload: data })
            }
              // console.log("Google Auth Success:", data);
        } catch (err) {
          console.error("googleAuthResult", err)
        }
      }
      const handleGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleResponse,
        onError: handleGoogleResponse,
        flow: 'auth-code'
      })


  return { 
    handleGoogleLogin
   }
}
