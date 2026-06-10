import { useEffect, useState } from "react";

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

  function fetchRecentTransactions() {
    fetch("http://localhost:8080/transactions/recent")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecentTransactions(data);
      });
  }

  function fetchSummary() {
    fetch("http://localhost:8080/summary")
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      });
  }

  useEffect(() => {
    fetchRecentTransactions();
    fetchSummary();
  }, []);

  function addTransaction(e) {
    e.preventDefault();

    const addedTransaction = {
      type,
      amount: Number(amount),
      category,
      description,
      date,
    };

    if (editingId === null) {
      fetch("http://localhost:8080/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addedTransaction),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add transaction.");
          }
          return response.json();
        })
        .then(() => {
          fetchRecentTransactions();
          fetchSummary();
          clearForm();
        });
    } else {
      fetch(`http://localhost:8080/transactions/${editingId}`, {
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
    fetch(`http://localhost:8080/transactions/${id}`, {
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
      <h1>My Finance Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-title">Total Income</div>

          <div className="summary-value">${summary.totalIncome}</div>
        </div>

        <div className="summary-card">
          <div className="summary-title">Total Expenses</div>

          <div className="summary-value">${summary.totalExpenses}</div>
        </div>

        <div className="summary-card">
          <div className="summary-title">Balance</div>

          <div className="summary-value">${summary.balance}</div>
        </div>
      </div>

      <section className="form-card">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {type === "" && <option value="">Select Type</option>}
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(event) => setDate(event.target.value)}
        />
        <button onClick={addTransaction}>
          {editingId === null ? "Add Transaction" : "Update Transaction"}
        </button>
      </section>

      <section className="content-card">
        <h2>Recent Transactions</h2>

        {recentTransactions.map((recentTransaction) => (
          <div className="transaction-row" key={recentTransaction.id}>
            <div>
              <strong>{recentTransaction.category}</strong>
              <p>{recentTransaction.description}</p>
            </div>

            <p>{recentTransaction.type}</p>
            <p>${recentTransaction.amount}</p>
            <p>{recentTransaction.date}</p>

            <div className="transaction-actions">
              <button onClick={() => editTransaction(recentTransaction)}>Edit</button>
              <button onClick={() => deleteTransaction(recentTransaction.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Dashboard;
