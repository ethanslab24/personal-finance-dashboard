import { useEffect, useState } from "react";

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

function Reports() {
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  function fetchCategorySummary() {
    fetch("http://localhost:8080/summary/category")
      .then((response) => response.json())
      .then((data) => setCategorySummary(data));
  }

  function fetchMonthlyTrend() {
    fetch("http://localhost:8080/summary/monthly-trend")
      .then((response) => response.json())
      .then((data) => setMonthlyTrend(data));
  }

  useEffect(() => {
    fetchCategorySummary();
    fetchMonthlyTrend();
  }, []);

  return (
    <>
      <h1>Reports</h1>
      <div className="reports-grid">
        <section className="content-card category-card">
          <h2>Category Summary</h2>

          <div className="category-header">
            <span>Category</span>
            <span>Total</span>
            <span>Transactions</span>
          </div>

          <div className="category-scroll">
          {categorySummary.map((item) => (
            <div className="category-row" key={item.category}>
              <p>{item.category}</p>
              <p>${item.total}</p>
              <p>{item.count}</p>
            </div>
          ))}
          </div>
        </section>

        <section className="content-card reports-card chart-card">
          <h2>Spending by Category</h2>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySummary}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb">
                  <LabelList
                    dataKey="total"
                    position="top"
                    offset={10}
                    formatter={(value) => `$${value}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="content-card monthlytrend-card">
          <h2>Monthly Trends</h2>

          <div className="monthlytrend-header">
            <span>Month</span>
            <span>Income</span>
            <span>Expenses</span>
            <span>Balance</span>
          </div>

          <div className="monthlytrend-scroll">
          {monthlyTrend.map((item) => (
            <div className="monthlytrend-row" key={item.month}>
              <p>{item.month}</p>
              <p>${item.income}</p>
              <p>${item.expenses}</p>
              <p>${item.balance}</p>
            </div>
          ))}
         </div>
        </section>

        <section className="content-card reports-card chart-card">
          <h2>Income vs Expenses Trend</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend
                  verticalAlign="top"
                  align="center"
                />
                <Line type="monotone" dataKey="income" stroke="#16a34a" />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" />
                <Line type="monotone" dataKey="balance" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}

export default Reports;
