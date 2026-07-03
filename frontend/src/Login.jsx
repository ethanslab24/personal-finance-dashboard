import { useState } from "react";
import { API_URL } from "./api";
import { useNavigate, Link } from "react-router-dom";
import { Wallet } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function login(e) {
    e.preventDefault();

    setError("");

    const loginRequest = {
      username,
      password,
    };

    setLoading(true);

    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            setError(errorData.message || "Incorrect username or password.");
            throw new Error("Login failed");
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
    <div className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <div className="auth-logo">
          <Wallet size={28} />
        </div>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">Sign in to manage your finances.</p>

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
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="auth-link-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
