import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

function Dashboard() {
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  function fetchRecentTransactions() {
    fetch(`${import.meta.env.VITE_API_URL}/transactions/recent`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecentTransactions(data);
      });
  }

  function fetchSummary() {
    fetch(`${import.meta.env.VITE_API_URL}/summary`)
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      });
  }

  function fetchCategorySummary() {
    fetch(`${import.meta.env.VITE_API_URL}/summary/category`)
      .then((response) => response.json())
      .then((data) => setCategorySummary(data));
  }

  function fetchMonthlyTrend() {
    fetch(`${import.meta.env.VITE_API_URL}/summary/monthly-trend`)
      .then((response) => response.json())
      .then((data) => setMonthlyTrend(data));
  }

  useEffect(() => {
    fetchRecentTransactions();
    fetchSummary();
    fetchCategorySummary();
    fetchMonthlyTrend();
  }, []);

  function editTransaction(e) {
    e.preventDefault();

    const addedTransaction = {
      type,
      amount: Number(amount),
      category,
      description,
      date,
    };

    if (editingId !== null) {
      fetch(`${import.meta.env.VITE_API_URL}/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addedTransaction),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to edit transaction");
          }
          return response.json();
        })
        .then((savedTransaction) => {
          setRecentTransactions((current) =>
            current.map((transaction) =>
              transaction.id === savedTransaction.id
                ? savedTransaction
                : transaction,
            ),
          );
          fetchRecentTransactions();
          fetchSummary();
          clearForm();
        });
    }
  }
  function deleteTransaction(id) {
    fetch(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      setRecentTransactions((current) =>
        current.filter((recentTransaction) => recentTransaction.id !== id),
      );
      fetchRecentTransactions();
      fetchSummary();
    });
  }

  function editTransaction(recentTransaction) {
    setEditingId(recentTransaction.id);
    setType(recentTransaction.type);
    setCategory(recentTransaction.category);
    setAmount(recentTransaction.amount);
    setDescription(recentTransaction.description);
    setDate(recentTransaction.date);
  }

  function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function clearForm() {
    setType("");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
    setEditingId(null);
  }

  return (
    <>
      <h1>Dashboard</h1>
      <h3 className="dashboard-description">
        Overview of your personal finances
      </h3>

      <div className="summary-grid">
        <div className="summary-card income-summary">
          <div className="summary-icon income-icon">
            <TrendingUp size={24} />
          </div>

          <div>
            <div className="summary-title">Total Income</div>
            <div className="summary-value income-text">
              {formatMoney(summary.totalIncome)}
            </div>
          </div>
        </div>

        <div className="summary-card expense-summary">
          <div className="summary-icon expense-icon">
            <TrendingDown size={24} />
          </div>

          <div>
            <div className="summary-title">Total Expenses</div>
            <div className="summary-value expense-text">
              {formatMoney(summary.totalExpenses)}
            </div>
          </div>
        </div>

        <div className="summary-card balance-summary">
          <div className="summary-icon balance-icon">
            <Wallet size={24} />
          </div>

          <div>
            <div className="summary-title">Balance</div>
            <div
              className={
                summary.balance >= 0
                  ? "summary-value income-text"
                  : "summary-value expense-text"
              }
            >
              {formatMoney(summary.balance)}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-charts-grid">
        <section className="content-card chart-card">
          <h2>Spending by Category</h2>

          {categorySummary.length === 0 ? (
            <div className="empty-state">
              <h3>No chart data available</h3>
              <p>Add transactions to see spending by category.</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categorySummary} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />

                  <Tooltip formatter={(value) => formatMoney(value)} />

                  <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="content-card chart-card">
          <h2>Income vs Expenses Trend</h2>

          {monthlyTrend.length === 0 ? (
            <div className="empty-state">
              <h3>No trend data available</h3>
              <p>Add transactions to see income and expense trends.</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Legend verticalAlign="top" align="center" />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <section className="content-card recent-transactions-card">
        <h2>Recent Transactions</h2>

        <div className="recent-transaction-header">
          <span>Category</span>
          <span>Description</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        {recentTransactions.map((recentTransaction) => (
          <div className="recent-transaction-row" key={recentTransaction.id}>
            <p className="category-description-and-date-text">
              {recentTransaction.category}
            </p>
            <p className="category-description-and-date-text">
              {recentTransaction.description}
            </p>

            <div className="type-cell">
              <span
                className={
                  recentTransaction.type === "INCOME"
                    ? "income-badge"
                    : "expense-badge"
                }
              >
                {recentTransaction.type}
              </span>
            </div>
            <p
              className={
                recentTransaction.type === "INCOME"
                  ? "income-amount"
                  : "expense-amount"
              }
            >
              {recentTransaction.type === "INCOME"
                ? `+${formatMoney(recentTransaction.amount)}`
                : `-${formatMoney(recentTransaction.amount)}`}
            </p>
            <p className="category-description-and-date-text">
              {recentTransaction.date}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}

export default Dashboard;
