import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./features/auth/useAuth"

// pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

function App() {
  const { isAuthenticated, token } = useAuth()
  console.log("data",isAuthenticated, token)
  const isLoggedIn = Boolean(isAuthenticated && token)

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/home" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? <Navigate to="/home" replace /> : <Register />
        }
      />

      {/* Protected route */}
      <Route
        path="/home"
        element={
          isLoggedIn ? <Home /> : <Navigate to="/login" replace />
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate to={isLoggedIn ? "/home" : "/login"} replace />
        }
      />
    </Routes>
  )
}

export default App
