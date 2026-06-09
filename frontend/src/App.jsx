import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")


  useEffect(() => {
    fetch("http://localhost:8080/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTransactions(data);
      });
  }, []);

  function addTransaction(e){
    e.preventDefault()
    
    const addedTransaction = {
      type,
      amount: Number(amount),
      category,
      description,
      date
    }

    fetch("http://localhost:8080/transactions", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(addedTransaction),
    })
      .then((response)=> {
        if(!response.ok){
          throw new Error("Failed to add transaction.");
        }
        return response.json();
      })
      .then((savedTransaction) => {
      setTransactions([...transactions, savedTransaction])
      clearForm()
      })
  }

  

  function clearForm(){
    setType("")
    setAmount("")
    setCategory("")
    setDescription("")
    setDate("")
  }

  return (
   <main>
<h1>My Finance Dashboard</h1>
   
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
        onChange={(event) => setDate(event.target.value)}
      />

      <button onClick={addTransaction}>Add Transaction</button>
   <section>
  
  <h2>Transactions</h2>

  {transactions.map((transaction) => (
    <div key={transaction.id}>
      <p>{transaction.category}</p>
      <p>{transaction.type}</p>
      <p>{transaction.amount}</p>
      <p>{transaction.description}</p>
      <p>{transaction.date}</p>
    </div>
  ))}
</section>
   </main>
  )
}


export default App
