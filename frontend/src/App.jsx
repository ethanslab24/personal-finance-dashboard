import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Wallet, LayoutDashboard, ReceiptText } from "lucide-react";
import { LogOut } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const showSidebar =
    location.pathname === "/dashboard" || location.pathname === "/transactions";

  return (
    <div className="app-layout">
      {showSidebar && (
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
            <button className="sidebar-link logout-button" onClick={logout}>
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>
      )}

      <main className={isAuthPage ? "auth-main" : "main-content"}>
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
