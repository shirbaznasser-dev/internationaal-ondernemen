import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VakkeuzePage from './pages/VakkeuzePage'
import DashboardPage from './pages/DashboardPage'
import HoofdstukPage from './pages/HoofdstukPage'
import AdminPage from './pages/AdminPage'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/vakkeuze"
          element={<ProtectedRoute><VakkeuzePage /></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/hoofdstuk/:id"
          element={<ProtectedRoute><HoofdstukPage /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<AdminRoute><AdminPage /></AdminRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}
