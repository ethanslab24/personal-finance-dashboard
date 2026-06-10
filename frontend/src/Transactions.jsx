import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  function fetchTransactions() {
    fetch("http://localhost:8080/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTransactions(data);
      });
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

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <>
      <section className="content-card transactions-card">
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
