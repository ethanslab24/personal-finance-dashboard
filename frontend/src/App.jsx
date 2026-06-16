import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Wallet, LayoutDashboard, ReceiptText } from "lucide-react";
import { NavLink } from "react-router-dom";

import Dashboard from "./Dashboard";
import Transactions from "./Transactions";

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <h2>Finance</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
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
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
