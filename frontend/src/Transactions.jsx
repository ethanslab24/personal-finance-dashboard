import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [sortBy, direction] = sortOption.split("-");

  const activeFilterCount =
    (monthFilter !== "" ? 1 : 0) +
    (typeFilter !== "" ? 1 : 0) +
    (categoryFilter !== "" ? 1 : 0);

  function fetchTransactions() {
    const params = new URLSearchParams();

    if (monthFilter !== "") {
      params.append("month", monthFilter);
    }

    if (typeFilter !== "") {
      params.append("type", typeFilter);
    }

    if (categoryFilter !== "") {
      params.append("category", categoryFilter);
    }

    const [sortBy, direction] = sortOption.split("-");

    params.append("sortBy", sortBy);
    params.append("direction", direction);

    fetch(`http://localhost:8080/transactions?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }

  function deleteTransaction(id) {
    fetch(`http://localhost:8080/transactions/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id),
      );
      fetchSummary();
    });
  }

  function clearFilters() {
    setMonthFilter("");
    setTypeFilter("");
    setCategoryFilter("");
    setSortOption("date-desc");

    fetch("http://localhost:8080/transactions?sortBy=date&direction=desc")
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <>
      <section className="filter-card">
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <button onClick={fetchTransactions}>Apply Filters</button>
        <button onClick={clearFilters}>Clear Filters</button>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount High to Low</option>
          <option value="amount-asc">Amount Low to High</option>
        </select>
      </section>

      <section className="content-card transactions-card">
        <h2>Transactions</h2>

        <p>Active Filters: {activeFilterCount}</p>

        {transactions.map((transaction) => (
          <div className="transaction-row" key={transaction.id}>
            <div>
              <strong>{transaction.category}</strong>
              <p>{transaction.description}</p>
            </div>
            <p>{transaction.type}</p>
            <p>${transaction.amount}</p>
            <p>{transaction.date}</p>
            <div className="transaction-actions">
              <button onClick={() => deleteTransaction(transaction.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Transactions;
