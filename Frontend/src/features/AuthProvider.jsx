import React, { createContext, useState } from 'react'
import { loginApi, registerApi } from './auth/services/auth.api'
import { Flip, toast, Zoom } from 'react-toastify'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const userRegister = async(username,email,password)=>{
        setLoading(true)
        try {
            const response = await registerApi(username,email,password)
            setUser(response)
            toast.success("register SuccessFull",{
                theme:"dark",
                transition:Flip
            })
            return response
        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data.message,{
                theme:"dark",
                transition:Zoom
            })
        }
        finally{
            setLoading(false)
        }
    }


    const userLogin = async(email,password)=>{
        setLoading(true)
        try {
            const response = await loginApi(email,password)
            setUser(response)
            toast.success("Login SuccessFull",{
                theme:"dark",
                transition:Flip,
            })
            return response
        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data.message,{
                theme:"dark",
                transition:Zoom
            })
        }
        finally{
            setLoading(false)
        }
    }



  return (
    <AuthContext.Provider value={{user,loading,userRegister,userLogin}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
