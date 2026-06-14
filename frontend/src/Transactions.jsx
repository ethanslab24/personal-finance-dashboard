import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Calendar, RotateCcw } from "lucide-react";
import { Plus } from "lucide-react";

function Transactions() {
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const activeFilterCount =
    (typeFilter !== "" ? 1 : 0) + (categoryFilter !== "" ? 1 : 0);

  function openAddModal() {
    setEditingId(null);
    setType("");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
    setShowModal(true);
  }

  function fetchTransactions() {
    const params = new URLSearchParams();

    if (typeFilter !== "") {
      params.append("type", typeFilter);
    }

    if (categoryFilter !== "") {
      params.append("category", categoryFilter);
    }

    if (startDateFilter !== "") {
      params.append("startDate", startDateFilter);
    }

    if (endDateFilter !== "") {
      params.append("endDate", endDateFilter);
    }

    const [sortBy, direction] = sortOption.split("-");

    params.append("sortBy", sortBy);
    params.append("direction", direction);

    fetch(`http://localhost:8080/transactions?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }

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
          fetchTransactions();
          clearModalForm();
          setShowModal(false);
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
        .then(() => {
          fetchTransactions();
          clearModalForm();
          setShowModal(false);
        });
    }
  }

  function openEditModal(transaction) {
    setEditingId(transaction.id);

    setType(transaction.type);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date);

    setShowModal(true);
  }

  function clearModalForm() {
    setType("");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
    setEditingId(null);
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
      fetchTransactions();
    });
  }

  function clearFilters() {
    setTypeFilter("");
    setCategoryFilter("");
    setSortOption("date-desc");
    setStartDateFilter("");
    setEndDateFilter("");

    fetch("http://localhost:8080/transactions?sortBy=date&direction=desc")
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter, startDateFilter, endDateFilter, sortOption]);

  function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const searchedTransactions = transactions.filter((transaction) => {
    const search = searchTerm.toLowerCase();

    return (
      transaction.category.toLowerCase().includes(search) ||
      transaction.description.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="page-header">
        <h1>Transactions</h1>

        <button className="add-transaction-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Transaction
        </button>
      </div>
      <section className="filter-card">
        <input
          type="text"
          placeholder="Search description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Transportation">Transportation</option>
          <option value="Pets">Pets</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Education">Education</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>

        <div className="date-range">
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => {
              setStartDateFilter(e.target.value);
              setEndDateFilter("");
            }}
          />

          <span className="date-arrow">→</span>

          <input
            type="date"
            value={endDateFilter}
            disabled={startDateFilter === ""}
            min={startDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>

        <button className="clear-filters-button" onClick={clearFilters}>
          <RotateCcw size={16} />
          Clear Filters
        </button>

        <div className="filter-chips">
          <button
            className={typeFilter === "" ? "all-chip active-chip" : "all-chip"}
            onClick={() => setTypeFilter("")}
          >
            All Transactions
          </button>
          <button
            className={
              typeFilter === "INCOME"
                ? "income-chip active-chip"
                : "income-chip"
            }
            onClick={() => setTypeFilter("INCOME")}
          >
            <span className="income-dot"></span>
            Income
          </button>
          <button
            className={
              typeFilter === "EXPENSE"
                ? "expense-chip active-chip"
                : "expense-chip"
            }
            onClick={() => setTypeFilter("EXPENSE")}
          >
            <span className="expense-dot"></span>
            Expense
          </button>
        </div>

        <div className="sort-control">
          <span>Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount High to Low</option>
            <option value="amount-asc">Amount Low to High</option>
          </select>
        </div>
      </section>

      <section className="content-card transactions-card">
        <div className="transaction-header">
          <span>Category</span>
          <span>Description</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {searchedTransactions.map((transaction) => (
          <div className="transaction-row" key={transaction.id}>
            <p className="category-description-and-date-text">
              {transaction.category}
            </p>

            <p className="category-description-and-date-text">
              {transaction.description}
            </p>
            <div className="type-cell">
              <span
                className={
                  transaction.type === "INCOME"
                    ? "income-badge"
                    : "expense-badge"
                }
              >
                {transaction.type}
              </span>
            </div>
            <p
              className={
                transaction.type === "INCOME"
                  ? "income-amount"
                  : "expense-amount"
              }
            >
              {transaction.type === "INCOME"
                ? `+${formatMoney(transaction.amount)}`
                : `-${formatMoney(transaction.amount)}`}
            </p>
            <p className="category-description-and-date-text">
              {transaction.date}
            </p>
            <div className="transaction-actions">
              <button
                className="edit-button"
                onClick={() => openEditModal(transaction)}
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => {
                  setTransactionToDelete(transaction.id);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              {editingId === null ? "Add Transaction" : "Edit Transaction"}
            </h2>

            <button
              className="modal-close-button"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <div className="modal-form">
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Grocery">Grocery</option>
                <option value="Transportation">Transportation</option>
                <option value="Pets">Pets</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Education">Education</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button
                className="save-transaction-button"
                onClick={addTransaction}
              >
                {editingId === null ? "Add Transaction" : "Update Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Transaction?</h2>

            <p>This action cannot be undone.</p>

            <div className="delete-modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

              <button
                className="confirm-delete-button"
                onClick={() => {
                  deleteTransaction(transactionToDelete);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Transactions;
