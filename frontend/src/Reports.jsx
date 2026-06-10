import { useEffect, useState } from "react";

function Reports() {
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  function fetchCategorySummary() {
    fetch("http://localhost:8080/summary/category")
      .then((response) => response.json())
      .then((data) => setCategorySummary(data));
  }
  
  function fetchMonthlyTrend(){
    fetch("http://localhost:8080/summary/monthly-trend")
      .then((response) => response.json())
      .then((data) => setMonthlyTrend(data));
  }

  useEffect(() => {
    fetchCategorySummary();
    fetchMonthlyTrend()
  }, []);

  return (
    <>
      <h1>Reports</h1>

      <section className="content-card category-card">
        <h2>Category Summary</h2>

        <div className="category-header">
          <span>Category</span>
          <span>Total</span>
          <span>Transactions</span>
        </div>

        {categorySummary.map((item) => (
          <div className="category-row" key={item.category}>
            <p>{item.category}</p>
            <p>${item.total}</p>
            <p>{item.count}</p>
          </div>
        ))}
      </section>  
      

      <section className="content-card monthlytrend-card">
        <h2>Monthly Trends</h2>

        <div className="monthlytrend-header">
          <span>Month</span>
          <span>Income</span>
          <span>Expenses</span>
          <span>Balance</span>
        </div>
        
          {monthlyTrend.map((item) => (
          <div className="monthlytrend-row" key={item.month}>
            <p>{item.month}</p>
            <p>${item.income}</p>
            <p>${item.expenses}</p>
            <p>${item.balance}</p>
          </div>
        ))}
      </section>

    
    </>
  );
}

export default Reports;
