# React Router v6 Best Practices - Code Examples

This file shows best practices for using React Router v6 in your app.

## 1. Navigation with useNavigate Hook

### ✅ DO: Use useNavigate for programmatic navigation
```jsx
import { useNavigate } from 'react-router-dom'

export default function MyComponent() {
  const navigate = useNavigate()
  
  const handleViewDiet = () => {
    navigate('/dashboard/diet')
  }
  
  const handleGoBack = () => {
    navigate(-1)  // Go back one page
  }
  
  return (
    <>
      <button onClick={handleViewDiet}>View Diet Plans</button>
      <button onClick={handleGoBack}>Go Back</button>
    </>
  )
}
```

### ❌ DON'T: Use window.location (causes full page reload)
```jsx
// BAD - This reloads the entire app!
onClick={() => window.location.href = '/dashboard/diet'}

// GOOD - This uses client-side routing
onClick={() => navigate('/dashboard/diet')}
```

---

## 2. Checking Current Route with useLocation

### ✅ DO: Use useLocation to detect current page
```jsx
import { useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  
  // Check if on diet page
  const isDietPage = location.pathname === '/dashboard/diet'
  
  // Get the page slug from URL
  const getActivePage = () => {
    const match = location.pathname.match(/\/dashboard\/(\w+)/)
    return match ? match[1] : 'overview'
  }
  
  return (
    <nav>
      <button className={isDietPage ? 'active' : ''}>Diet Plans</button>
    </nav>
  )
}
```

---

## 3. Using Auth Context

### ✅ DO: Use useAuth hook for authentication
```jsx
import { useAuth } from '../AuthContext'

export default function LoginForm() {
  const { login, addToast } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    
    if (login(email, password)) {
      addToast('Login successful!', 'ok')
      navigate('/dashboard/overview')
    } else {
      addToast('Invalid email or password', 'err')
    }
  }
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### ✅ DO: Check user before rendering protected content
```jsx
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  
  if (!user) {
    return <p>Please log in first</p>
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

---

## 4. Sidebar Navigation Pattern

### ✅ CORRECT: Modern sidebar with useNavigate
```jsx
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ onLogout, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const getActivePage = () => {
    const match = location.pathname.match(/\/dashboard\/(\w+)/)
    return match ? match[1] : 'overview'
  }
  
  const activePage = getActivePage()
  
  const menuItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'diet', label: 'Diet Plans' },
    { id: 'exercise', label: 'Exercise' },
  ]
  
  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? 'active' : ''}
          onClick={() => navigate(`/dashboard/${item.id}`)}
        >
          {item.label}
        </button>
      ))}
      <button onClick={() => { onLogout(); navigate('/'); }}>
        Sign Out
      </button>
    </aside>
  )
}
```

---

## 5. Toast Notifications Pattern

### ✅ DO: Use useAuth for toast notifications
```jsx
import { useAuth } from '../AuthContext'

export default function MyComponent() {
  const { addToast } = useAuth()
  
  const handleAction = () => {
    try {
      // Do something
      addToast('Success!', 'ok')
    } catch (error) {
      addToast('Something went wrong', 'err')
    }
  }
  
  return <button onClick={handleAction}>Take Action</button>
}
```

### Toast Types
- `'ok'` - Success message (green checkmark)
- `'err'` - Error message (red X)
- `'info'` - Info message (blue circle)

---

## 6. Protected Route Pattern

### ✅ DO: Wrap routes that need authentication
```jsx
import { ProtectedRoute } from './ProtectedRoute'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected dashboard route */}
      <Route
        path="/dashboard/:page?"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

The ProtectedRoute component automatically redirects to home if user is not logged in.

---

## 7. URL Parameters Pattern

### ✅ DO: Use useParams for dynamic routes
```jsx
import { useParams } from 'react-router-dom'

// Route: /dashboard/:page?
export default function Dashboard() {
  const { page } = useParams()
  
  console.log(page) // 'diet', 'exercise', etc.
  
  // Default to 'overview' if no page specified
  const currentPage = page || 'overview'
  
  return <div>Now showing: {currentPage}</div>
}
```

---

## 8. Avoiding Common Mistakes

### ❌ DON'T: Update state manually on route change
```jsx
// BAD - State goes out of sync with URL
const [currentPage, setCurrentPage] = useState('diet')
const handleNavigate = (page) => {
  setCurrentPage(page)
  // URL doesn't change!
}
```

### ✅ DO: Let React Router handle the URL
```jsx
// GOOD - URL is the source of truth
const navigate = useNavigate()
const handleNavigate = (page) => {
  navigate(`/dashboard/${page}`)
  // URL automatically updated!
}
```

---

## 9. Form Submission with Navigation

### ✅ DO: Navigate after successful form submission
```jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function BookAppointmentForm() {
  const navigate = useNavigate()
  const { addToast } = useAuth()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save appointment to localStorage
    const appointment = {
      date: e.target.date.value,
      doctor: e.target.doctor.value,
    }
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    appointments.push(appointment)
    localStorage.setItem('appointments', JSON.stringify(appointments))
    
    // Show success and navigate
    addToast('Appointment booked!', 'ok')
    setTimeout(() => navigate('/dashboard/appointments'), 800)
  }
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

---

## 10. Passing Data Between Routes

### ✅ DO: Use URL parameters or context
```jsx
import { useNavigate } from 'react-router-dom'

// Option 1: URL Parameter
const navigate = useNavigate()
navigate(`/dashboard/diet?filter=vegetarian`)

// Option 2: State in navigate
navigate('/dashboard/appointments', {
  state: { selectedDoctor: 'Dr. Smith' }
})

// Retrieve in destination:
import { useLocation } from 'react-router-dom'
const location = useLocation()
const selectedDoctor = location.state?.selectedDoctor
```

### ❌ DON'T: Try to pass data as props
```jsx
// This doesn't work - routes don't get props
<Route path="/diet" element={<Diet filter="vegetarian" />} />
```

---

## Summary: Best Practices Checklist

✅ Use `useNavigate()` for programmatic navigation
✅ Use `useLocation()` to detect current page
✅ Use `useParams()` to read URL parameters
✅ Use `useAuth()` for authentication and toasts
✅ Let URL be the source of truth
✅ Use ProtectedRoute for auth-required pages
✅ Navigate after form submission
✅ Never use `window.location.href` for client-side routing
✅ Keep state in context, not component state
✅ Use localStorage for persisting data (appointments, etc.)

---

## Useful Links

- [React Router v6 Docs](https://reactrouter.com/en/main)
- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
- [useLocation](https://reactrouter.com/en/main/hooks/use-location)
- [useParams](https://reactrouter.com/en/main/hooks/use-params)
- [React Context API](https://react.dev/reference/react/useContext)
