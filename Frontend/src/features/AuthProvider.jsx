import React, { createContext, useEffect, useState } from 'react'
import { getMe, loginApi, logoutApi, registerApi } from './auth/services/auth.api'
import { Flip, toast, Zoom } from 'react-toastify'

// ==============================================================================
// 🔐 AUTH CONTEXT - Poore app ke liye authentication state manage karta hai
// ==============================================================================
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    // Logged-in user ki information store karta hai (null = not logged in)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // Initial page load pe true

    // ==============================================================================
    // App start hone par user already logged in hai ya nahi, check karte hain
    // Hinglish: Yeh effect ek baar chalega aur cookie se user info retrieve karega
    // ==============================================================================
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMe()
                if (response && response.data) {
                    setUser(response.data)
                }
            } catch {
                // Cookie expired ya invalid hai - user null hi rahega
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    // ==============================================================================
    // User Registration
    // ==============================================================================
    const userRegister = async (username, email, password) => {
        setLoading(true)
        try {
            const response = await registerApi(username, email, password)
            if (response && response.data) {
                setUser(response.data)
            }
            toast.success("Registration Successful!", {
                theme: "dark",
                transition: Flip
            })
            return response
        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data?.message || "Registration failed", {
                theme: "dark",
                transition: Zoom
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    // ==============================================================================
    // User Login
    // ==============================================================================
    const userLogin = async (email, password) => {
        setLoading(true)
        try {
            const response = await loginApi(email, password)
            if (response && response.data) {
                setUser(response.data)
            }
            toast.success("Login Successful!", {
                theme: "dark",
                transition: Flip,
            })
            return response
        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data?.message || "Login failed", {
                theme: "dark",
                transition: Zoom
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    // ==============================================================================
    // User Logout - backend se httpOnly cookie clear karte hain
    // ==============================================================================
    const userLogout = async () => {
        try {
            // httpOnly cookie browser JS se delete nahi hoti, logout API zaroori hai.
            await logoutApi()
        } catch (error) {
            console.log(error.response?.data)
        } finally {
            setUser(null)
            toast.info("Logged out", { theme: "dark" })
        }
    }

    // Profile update ke baad locally user state update karne ke liye
    const updateUserState = (updatedUser) => {
        setUser(updatedUser)
    }

    // currentUser function - ProtectedLayouts ke liye backward compatibility
    const currentUser = async () => {
        try {
            const response = await getMe()
            if (response && response.data) {
                setUser(response.data)
                return response.data
            }
            return null
        } catch {
            return null
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                userRegister,
                userLogin,
                userLogout,
                currentUser,
                updateUserState,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
