# React Router v6 Architecture Diagrams

## Component Hierarchy

```
main.jsx
└── <StrictMode>
    └── <BrowserRouter>
        └── <AuthProvider>
            └── <App>
                └── <Routes>
                    ├── <Route path="/" element={<Home />} />
                    ├── <Route path="/login" element={<Login />} />
                    ├── <Route path="/register" element={<Register />} />
                    └── <Route path="/dashboard/:page?" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                        } />
```

---

## Application Flow Diagram

```
┌─────────────────────────────────────┐
│     User Visits Application         │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Check sessionStorage │
    │   for auth token     │
    └──────────┬───────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   User Found?    No User?
        │             │
        │             ▼
        │        Show Home Page
        │        (Public Routes)
        │             │
        │             ├─► /login → Login Form
        │             ├─► /register → Register Form
        │             └─► / → Home (Hero Section)
        │
        ▼
   Show Dashboard
   (Protected Routes)
        │
        ├─► /dashboard/overview → Overview
        ├─► /dashboard/diet → Diet Plans
        ├─► /dashboard/exercise → Exercise
        ├─► /dashboard/appointments → Appointments
        ├─► /dashboard/predict → Risk Prediction
        └─► /dashboard/chatbot → AI Chatbot
```

---

## Navigation Flow

```
Home Page
   ├─ [Get Started] ──────────► Register Page
   │                              │
   │                              ▼
   │                        [Create Account]
   │                              │
   │                              ▼
   │                        Login Page (auto-redirect)
   │
   └─ [Sign In] ──────────► Login Page
                               │
                               ├─ [Invalid Credentials]
                               │      ▼
                               │    Show Error Toast
                               │      │
                               └──────┘
                               
                               ├─ [Valid Credentials]
                               │      ▼
                               │  Save to sessionStorage
                               │      │
                               │      ▼
                               │  Redirect to Dashboard
                               │      │
                               ▼──────┴────────────────┐
                                                       │
                        Dashboard (Protected)           │
                               │                       │
                    ┌──────────┼──────────┬─────────┬──┘
                    │          │          │         │
                    ▼          ▼          ▼         ▼
                Overview    Diet Plans Exercise Appointments
                    │          │          │         │
                    └──────────┼──────────┴─────────┘
                               │
                               ▼
                        [Sign Out]
                               │
                               ├─ Clear sessionStorage
                               ├─ Show Toast
                               │
                               ▼
                        Redirect to Home Page
```

---

## Auth Context Hierarchy

```
AuthProvider
└── user (state)
│   ├─ user.id
│   ├─ user.name
│   ├─ user.email
│   └─ user.pwd
│
├── toasts (state)
│   └─ Toast[]
│       ├─ id
│       ├─ msg
│       └─ type ('ok', 'err', 'info')
│
└── Functions
    ├─ login(email, password)
    │   ├─ Validate credentials
    │   ├─ Save to sessionStorage
    │   ├─ Update user state
    │   └─ Return true/false
    │
    ├─ register(name, email, password)
    │   ├─ Check if email exists
    │   ├─ Add new user to localStorage
    │   └─ Return true/false
    │
    ├─ logout()
    │   ├─ Clear sessionStorage
    │   └─ Clear user state
    │
    ├─ addToast(msg, type)
    │   ├─ Add to toasts array
    │   ├─ Auto-remove after 3.5s
    │   └─ Return void
    │
    └─ removeToast(id)
        ├─ Remove from toasts array
        └─ Return void
```

---

## URL Structure

```
Application Root
│
├── Public Pages
│   ├── / (Home)
│   │   └─ Hero, Features, CTA
│   │
│   ├── /login (Login)
│   │   └─ Email + Password form
│   │
│   └── /register (Register)
│       └─ Name + Email + Password form
│
└── Protected Pages (/dashboard/:page)
    │
    ├── /dashboard (default to overview)
    │   └─ Redirect to /dashboard/overview
    │
    ├── /dashboard/overview
    │   └─ Dashboard Overview & Health Stats
    │
    ├── /dashboard/predict
    │   └─ AI Risk Prediction
    │
    ├── /dashboard/diet
    │   └─ Diet Plans & Recommendations
    │
    ├── /dashboard/exercise
    │   └─ Exercise Plans & Routines
    │
    ├── /dashboard/appointments
    │   └─ Book & Manage Appointments
    │
    └── /dashboard/chatbot
        └─ AI Health Chatbot

Any other URL
└── Redirect to /
```

---

## State Management

```
Global State (AuthContext)
├── User (sessionStorage)
│   └─ survives: refresh, back/forward
│   └─ cleared: on logout, browser close
│
├── Toasts (in-memory)
│   └─ temporary: 3.5 seconds
│   └─ cleared: on timeout
│
└── Route State (React Router)
    └─ Current URL (browser address bar)
    └─ History (browser history stack)
    └─ survives: refresh, back/forward

Local State (per component)
├── Modal open/close states
├── Form input values
├── Filtered lists
└── etc. (unchanged from original)

Persistent Storage (localStorage)
├── shs_u → Users list (all users)
├── appointments → Booked appointments
└── [any custom data]
```

---

## Data Flow: User Login

```
1. User enters credentials
   │
   ▼
2. Form submitted
   │
   ▼
3. useAuth().login(email, password) called
   │
   ▼
4. Check localStorage for matching user
   │
   ├─ Found?
   │  ├─ YES → Continue
   │  └─ NO → Return false (show error toast)
   │
   ▼
5. Save to sessionStorage
   ├─ Key: 'shs_s'
   └─ Value: JSON stringified user object
   │
   ▼
6. Update user state in AuthContext
   │
   ▼
7. Return true (success)
   │
   ▼
8. Component receives true, calls:
   ├─ addToast('Success!', 'ok')
   ├─ navigate('/dashboard/overview')
   └─ (with 400ms delay for toast animation)
   │
   ▼
9. Route changes to /dashboard/:page?
   │
   ▼
10. ProtectedRoute checks user (not null)
    │
    ▼
11. Dashboard renders with user data
```

---

## Data Flow: Page Navigation

```
User clicks "Diet Plans" button
   │
   ▼
onClick handler triggered
   │
   ▼
navigate('/dashboard/diet') called
   │
   ▼
BrowserRouter updates URL
   ├─ URL: /dashboard/diet
   └─ Added to browser history
   │
   ▼
React Router matches route
   │
   ▼
Dashboard component re-renders
   │
   ▼
useParams() reads 'page' param
   ├─ page = 'diet'
   │
   ▼
pageMap['diet'] returns <Diet />
   │
   ▼
Sidebar re-renders
   │
   ▼
useLocation() detects current URL
   │
   ▼
Sidebar highlights "Diet Plans" as active
   │
   ▼
Page complete (smooth, no reload)
```

---

## Protection Flow

```
User tries to access /dashboard/diet

1. Route handler checks:
   └─ <ProtectedRoute>
        └─ <Dashboard />

2. ProtectedRoute component:
   │
   ├─ Checks: const { user } = useAuth()
   │
   ├─ Is user null?
   │  ├─ YES → Return <Navigate to="/" replace />
   │  └─ NO → Return children (Dashboard)
   │
   ▼
If logged out:
   └─ Silently redirects to /
   └─ Preserves URL history

If logged in:
   └─ Renders Dashboard
   └─ Shows requested page
```

---

## Sidebar Active State Detection

```
Sidebar Component
│
├─ useLocation() hook
│  └─ Returns: { pathname: '/dashboard/diet', ... }
│
├─ getActivePage() function
│  └─ Regex match: /\/dashboard\/(\w+)/
│     └─ Returns: 'diet'
│
├─ Compare with NAV_ITEMS
│  ├─ { id: 'diet', label: 'Diet Plans' }
│  ├─ Is activePage === 'diet'?
│  │  ├─ YES → Add 'active' class
│  │  └─ NO → Skip
│
└─ Render highlighted button
```

---

## Refresh Persistence Flow

```
User on /dashboard/diet

User presses F5 (refresh)
   │
   ▼
Page reloads (browser default)
   │
   ▼
main.jsx executes again
   │
   ▼
AuthProvider component initializes
   │
   ├─ useState(() => {
   │    const session = sessionStorage.getItem('shs_s')
   │    return session ? JSON.parse(session) : null
   │  })
   │
   ├─ sessionStorage has 'shs_s'?
   │  ├─ YES → user = { ...savedUser }
   │  └─ NO → user = null
   │
   ▼
BrowserRouter restores URL
   ├─ URL: /dashboard/diet
   └─ React Router matches route
   │
   ▼
<ProtectedRoute> checks user
   │
   ├─ user is not null?
   │  └─ YES → Render Dashboard
   │
   ▼
Dashboard renders with 'page' = 'diet'
   │
   ▼
User still sees Diet Plans page!
✅ Refresh persistence works!
```

---

## Error Handling Flow

```
Application Error
│
├─ React catches error
├─ Browser console shows error
├─ User sees error boundary (if configured)
└─ Navigation broken?
   │
   ├─ Check browser console for error
   ├─ Check that Routes are defined
   ├─ Check that components are imported
   └─ Try hard refresh: Ctrl+Shift+R
```

---

## Storage Persistence

```
sessionStorage (Cleared on browser close)
│
├─ Key: 'shs_s'
└─ Value: { id, name, email, pwd }
   └─ Used for: Current user auth
   └─ Lifetime: Until logout or browser close
   └─ Checked: On app load (AuthProvider)

localStorage (Permanent, user-accessible)
│
├─ Key: 'shs_u'
└─ Value: [{ id, name, email, pwd }, ...]
   └─ Used for: All registered users
   └─ Lifetime: Until manually cleared
   └─ Checked: On login (auth)

localStorage (Permanent, user-accessible)
│
├─ Key: 'appointments'
└─ Value: [{ date, doctor, ... }, ...]
   └─ Used for: Booked appointments
   └─ Lifetime: Until manually cleared
   └─ Checked: On dashboard load
```

---

## Toast Notification Lifecycle

```
Toast Created
│
├─ addToast(msg, type)
│  ├─ Generate ID: Date.now()
│  ├─ Add to state: [...toasts, { id, msg, type }]
│  ├─ Render: SVG icon + message text
│  │
│  └─ Schedule timeout: setTimeout(() => {
│     removeToast(id)
│  }, 3500)
│
├─ Toast Visible
│  ├─ CSS animation: fade in
│  ├─ Position: bottom-right
│  ├─ Duration: 3.5 seconds
│  │
│  └─ Types:
│     ├─ 'ok' → Green checkmark
│     ├─ 'err' → Red X
│     └─ 'info' → Blue circle
│
▼
Toast Hidden
├─ removeToast(id) called
├─ Filter from state: toasts.filter(t => t.id !== id)
├─ CSS animation: fade out
└─ Component unmounts
```

---

## Summary: Everything Flows Through React Router

```
┌─────────────────────────────────────────────────────────┐
│                   React Router v6                       │
│                                                         │
│  ✅ Handles URL changes                               │
│  ✅ Manages browser history                           │
│  ✅ Coordinates navigation                            │
│  ✅ Protects routes                                   │
│  ✅ Manages page rendering                           │
│  ✅ Supports deep linking                            │
│  ✅ Enables browser back/forward                      │
│  ✅ Persists on refresh (with sessionStorage)         │
│                                                         │
└─────────────────────────────────────────────────────────┘
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
    AuthContext         Components           Navigation
    (user/auth)         (pages)              (sidebar)
```

---

**These diagrams show the complete flow of your React Router v6 implementation!**
