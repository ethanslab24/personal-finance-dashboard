import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);

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

function fetchTransactions() {
  fetch("http://localhost:8080/transactions")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setTransactions(data);
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
  fetchTransactions();
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
        .then((savedTransaction) => {
          setTransactions((current) => [...current, savedTransaction]);
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
          setTransactions((current) =>
            current.map((transaction) =>
              transaction.id === savedTransaction.id
                ? savedTransaction
                : transaction,
            ),
          );
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
      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id),
        
      );
       fetchSummary();
    });
  }

  function editTransaction(transaction) {
    setEditingId(transaction.id);
    setType(transaction.type);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date);
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
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Finance</h2>
        <p>Dashboard</p>
        <p>Transactions</p>
        <p>Reports</p>
      </aside>
      <main className="main-content">
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
          <h2>Transactions</h2>

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
                <button onClick={() => editTransaction(transaction)}>
                  Edit
                </button>
                <button onClick={() => deleteTransaction(transaction.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
