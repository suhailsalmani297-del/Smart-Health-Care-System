import React, { createContext, useState, useContext } from 'react'

// Auth Context
export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const session = sessionStorage.getItem('shs_s')
    return session ? JSON.parse(session) : null
  })

  const [doctor, setDoctor] = useState(() => {
    const session = sessionStorage.getItem('shs_doc_s')
    return session ? JSON.parse(session) : null
  })

  const [toasts, setToasts] = useState([])

  const getDoctors = () => JSON.parse(localStorage.getItem('shs_d') || '[]')
  const saveDoctors = (d) => localStorage.setItem('shs_d', JSON.stringify(d))

  const getUsers = () => JSON.parse(localStorage.getItem('shs_u') || '[]')
  const saveUsers = (u) => localStorage.setItem('shs_u', JSON.stringify(u))

  const initializeUsers = () => {
    const users = getUsers()
    if (users.length === 0) {
      users.push({ id: 1, name: 'Test User', email: 'test@example.com', pwd: 'password' })
      users.push({ id: 2, name: 'Rana', email: 'rana@gmail.com', pwd: '123456789' })
      saveUsers(users)
    }

    const doctors = getDoctors()
    if (doctors.length === 0) {
      doctors.push({ id: 1, name: 'Dr. Priya Sharma', email: 'priya@smartcare.com', pwd: 'password', spec: 'Cardiologist' })
      doctors.push({ id: 2, name: 'Dr. Rajesh Kumar', email: 'rajesh@smartcare.com', pwd: 'password', spec: 'Neurologist' })
      saveDoctors(doctors)
    }
  }

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

  const login = (email, password) => {
    const users = getUsers()
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.pwd === password)
    
    if (!foundUser) {
      return false
    }

    sessionStorage.setItem('shs_s', JSON.stringify(foundUser))
    setUser(foundUser)
    return true
  }

  const loginDoctor = (email, password) => {
    const doctors = getDoctors()
    const foundDoc = doctors.find((d) => d.email.toLowerCase() === email.toLowerCase() && d.pwd === password)
    
    if (!foundDoc) {
      return false
    }

    sessionStorage.setItem('shs_doc_s', JSON.stringify(foundDoc))
    setDoctor(foundDoc)
    return true
  }

  const register = (name, email, password) => {
    const users = getUsers()
    
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false
    }

    const newUser = { id: Date.now(), name, email, pwd: password }
    users.push(newUser)
    saveUsers(users)
    return true
  }

  const registerDoctor = (name, email, password, spec) => {
    const doctors = getDoctors()
    
    if (doctors.find((d) => d.email.toLowerCase() === email.toLowerCase())) {
      return false
    }

    const newDoc = { 
      id: Date.now(), name, email, pwd: password, spec,
      degree: "MBBS", exp: "5", fee: "500", hospital: "SmartCare Hospital", city: "Mumbai",
      desc: `Dr. ${name} is an experienced ${spec} dedicated to patient care.`,
      avail: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false }
    }
    doctors.push(newDoc)
    saveDoctors(doctors)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('shs_s')
    sessionStorage.removeItem('shs_doc_s')
    setUser(null)
    setDoctor(null)
  }

  const updateUser = (newData) => {
    if (!user) return
    const updatedUser = { ...user, ...newData }
    setUser(updatedUser)
    sessionStorage.setItem('shs_s', JSON.stringify(updatedUser))

    const users = getUsers()
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index] = updatedUser
      saveUsers(users)
    }
  }

  const updateDoctor = (newData) => {
    if (!doctor) return
    const updatedDoc = { ...doctor, ...newData }
    setDoctor(updatedDoc)
    sessionStorage.setItem('shs_doc_s', JSON.stringify(updatedDoc))

    const doctors = getDoctors()
    const index = doctors.findIndex((d) => d.id === doctor.id)
    if (index !== -1) {
      doctors[index] = updatedDoc
      saveDoctors(doctors)
    }
  }

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

  React.useEffect(() => {
    initializeUsers()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, doctor, setDoctor, toasts, addToast, removeToast, login, loginDoctor, register, registerDoctor, logout, updateUser, updateDoctor, getRecommendations, saveRecommendation }}>
      {children}
    </AuthContext.Provider>
  )
}
