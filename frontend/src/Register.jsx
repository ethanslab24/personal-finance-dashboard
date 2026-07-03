import { useState } from "react";
import { API_URL } from "./api";
import { useNavigate, Link } from "react-router-dom";
import { Wallet } from "lucide-react";
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function register(e) {
    e.preventDefault();

    const registerRequest = {
      username,
      email,
      password,
    };

    setError("");

    setLoading(true);

    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            setError(errorData.message || "Register failed. Try again.");
            throw new Error("Registration failed");
          });
        }

        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      })
      .catch(() => {
        // Error message already displayed with setError()
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="auth-page">
        <form className="auth-card" onSubmit={register}>
          <div className="auth-logo">
            <Wallet size={28} />
          </div>

          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Start tracking your income and expenses.
          </p>

          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              placeholder="Type username here."
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Type email here."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Type password here."
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="auth-link-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
