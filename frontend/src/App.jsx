import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Wallet, LayoutDashboard, ReceiptText } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className="app-layout">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Wallet size={22} />
            </div>
            <h2>Finance</h2>
          </div>

          <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active-sidebar-link" : "sidebar-link"
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "sidebar-link active-sidebar-link" : "sidebar-link"
              }
            >
              <ReceiptText size={18} />
              Transactions
            </NavLink>
            <button onClick={logout}>Logout</button>
          </nav>
        </aside>
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
