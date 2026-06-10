import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import Reports from "./Reports";
import Transactions from "./Transactions";

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Finance</h2>
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/reports">Reports</Link>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
