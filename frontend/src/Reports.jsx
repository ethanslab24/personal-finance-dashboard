import { useEffect, useState } from "react";

function Reports() {

const [category, setCategory] = useState([])

function fetchCategorySummary() {
    fetch("http://localhost:8080/summary/category")
      .then((response) => response.json())
      .then((data) => setCategorySummary(data));
  }



  return (
    <section className="content-card">
      <h2>Reports</h2>
      <p>Category summary will go here.</p>
    </section>
  );
}

export default Reports;