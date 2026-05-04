import React, { createContext, useState, useContext, useEffect } from 'react'

// Auth Context
export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

// API Base URL - change if your backend runs on different port
// API Base URL - matching your browser's localhost
const API_URL = 'http://localhost:5001/api/auth'



export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage
    const session = sessionStorage.getItem('shs_user')
    const token = localStorage.getItem('shs_token')
    if (session && token) {
      try {
        return JSON.parse(session)
      } catch {
        return null
      }
    }
    return null
  })

  const [doctor, setDoctor] = useState(() => {
    const session = sessionStorage.getItem('shs_doc')
    const token = localStorage.getItem('shs_doc_token')
    if (session && token) {
      try {
        return JSON.parse(session)
      } catch {
        return null
      }
    }
    return null
  })

  const [toasts, setToasts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addToast = (msg, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // =====================
  // LOGIN - Patient
  // =====================
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role: 'patient' })
      })

      const data = await response.json()

      if (data.success) {
        // Store user and token
        setUser(data.data.user)
        sessionStorage.setItem('shs_user', JSON.stringify(data.data.user))
        localStorage.setItem('shs_token', data.data.token)
        return true
      } else {
        addToast(data.message || 'Login failed', 'err')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      addToast('Unable to connect to server. Please try again.', 'err')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // =====================
  // LOGIN - Doctor
  // =====================
  const loginDoctor = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role: 'doctor' })
      })

      const data = await response.json()

      if (data.success) {
        // Store doctor and token
        setDoctor(data.data.user)
        sessionStorage.setItem('shs_doc', JSON.stringify(data.data.user))
        localStorage.setItem('shs_doc_token', data.data.token)
        return true
      } else {
        addToast(data.message || 'Doctor login failed', 'err')
        return false
      }
    } catch (error) {
      console.error('Doctor login error:', error)
      addToast('Unable to connect to server. Please try again.', 'err')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // =====================
  // OTP FUNCTIONS
  // =====================
  const sendOtp = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!data.success) {
        addToast(data.message || 'Failed to send OTP', 'err');
      }
      return data.success;
    } catch (error) {
      console.error('Send OTP error:', error);
      addToast('Unable to connect to server. Please try again.', 'err');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!data.success) {
        addToast(data.message || 'Invalid or expired OTP', 'err');
      }
      return data.success;
    } catch (error) {
      console.error('Verify OTP error:', error);
      addToast('Unable to connect to server. Please try again.', 'err');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // =====================
  // REGISTER - Patient
  // =====================
  const register = async (name, email, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role: 'patient' })
      })

      const data = await response.json()

      if (data.success) {
        addToast('Account created successfully. You can now sign in.', 'ok')
        return true
      } else {
        addToast(data.message || 'Registration failed', 'err')
        return false
      }
    } catch (error) {
      console.error('Register error:', error)
      addToast('Unable to connect to server. Please try again.', 'err')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // =====================
  // REGISTER - Doctor
  // =====================
  const registerDoctor = async (name, email, password, spec) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role: 'doctor', spec })
      })

      const data = await response.json()

      if (data.success) {
        addToast('Doctor account created successfully!', 'ok')
        return true
      } else {
        addToast(data.message || 'Doctor registration failed', 'err')
        return false
      }
    } catch (error) {
      console.error('Register doctor error:', error)
      addToast('Unable to connect to server. Please try again.', 'err')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    // Clear patient session
    sessionStorage.removeItem('shs_user')
    localStorage.removeItem('shs_token')
    setUser(null)

    // Clear doctor session
    sessionStorage.removeItem('shs_doc')
    localStorage.removeItem('shs_doc_token')
    setDoctor(null)
  }

  // =====================
  // UPDATE USER
  // =====================
  const updateUser = (newData) => {
    if (!user) return
    const updatedUser = { ...user, ...newData }
    setUser(updatedUser)
    sessionStorage.setItem('shs_user', JSON.stringify(updatedUser))
  }

  // =====================
  // UPDATE DOCTOR (also sync to doctor list for patient visibility)
  // =====================
  const updateDoctor = (newData) => {
    if (!doctor) return
    const updatedDoc = { ...doctor, ...newData }
    setDoctor(updatedDoc)
    sessionStorage.setItem('shs_doc', JSON.stringify(updatedDoc))
    
    // Also save to shs_doctors list so patients can see the updated doctor
    const doctorsList = JSON.parse(localStorage.getItem('shs_doctors') || '[]')
    const existingIndex = doctorsList.findIndex(d => d.email === doctor.email)
    if (existingIndex !== -1) {
      doctorsList[existingIndex] = { ...doctorsList[existingIndex], ...updatedDoc }
    } else {
      doctorsList.push({ ...updatedDoc })
    }
    localStorage.setItem('shs_doctors', JSON.stringify(doctorsList))
  }

  // =====================
  // GET/SAVE RECOMMENDATIONS (keep existing functionality)
  // =====================
  const getRecommendations = (type, email) => {
    const all = JSON.parse(localStorage.getItem(`shs_${type}_plans`) || '[]')
    return all.find(r => r.patientEmail === email)
  }

  const saveRecommendation = (type, data) => {
    const all = JSON.parse(localStorage.getItem(`shs_${type}_plans`) || '[]')
    const index = all.findIndex(r => r.patientEmail === data.patientEmail)
    if (index !== -1) {
      all[index] = data
    } else {
      all.push(data)
    }
    localStorage.setItem(`shs_${type}_plans`, JSON.stringify(all))
  }

  // Provide context value
  const value = {
    user,
    setUser,
    doctor,
    setDoctor,
    toasts,
    addToast,
    removeToast,
    login,
    loginDoctor,
    sendOtp,
    verifyOtp,
    register,
    registerDoctor,
    logout,
    updateUser,
    updateDoctor,
    getRecommendations,
    saveRecommendation,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
