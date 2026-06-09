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

  useEffect(() => {
    fetch("http://localhost:8080/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTransactions(data);
      });
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
    <main>
      <h1>My Finance Dashboard</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {" "}
        {type === "" && <option value="">Select Type</option>}{" "}
        <option value="INCOME">Income</option>{" "}
        <option value="EXPENSE">Expense</option>{" "}
      </select>{" "}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />{" "}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />{" "}
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />{" "}
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />{" "}
      <button onClick={addTransaction}>
        {" "}
        {editingId === null ? "Add Transaction" : "Update Transaction"}{" "}
      </button>{" "}
      <section>
        {" "}
        <h2>Transactions</h2>{" "}
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            {" "}
            <p>{transaction.category}</p> <p>{transaction.type}</p>{" "}
            <p>{transaction.amount}</p> <p>{transaction.description}</p>{" "}
            <p>{transaction.date}</p>{" "}
            <button onClick={() => editTransaction(transaction)}>Edit</button>{" "}
            <button onClick={() => deleteTransaction(transaction.id)}>
              {" "}
              Delete{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </section>
    </main>
  );
}

export default App;
