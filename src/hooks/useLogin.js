import { useState } from "react";
import { useAuthContext } from './useAuthContext'
// import { useNavigate } from 'react-router-dom'


export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const { dispatch } = useAuthContext()
    // const navigate = useNavigate()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        setIsSuccess(false)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({email, password}) 
        })

        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            // Save the user ( JWT and Email ) to LocalStorage
            localStorage.setItem('user', JSON.stringify(json))
            // Update the AUthContext
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
            setIsSuccess(true) 

            // back to homepage
            // navigate('/')
            
            
        }

    }
  return { 
    login, 
    isLoading,
    isSuccess,
    error
   }
}
