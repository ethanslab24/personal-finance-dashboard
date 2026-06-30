import { useState } from "react";
import { API_URL } from "./api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const navigate = useNavigate();


  function register(e) {
    e.preventDefault();

    const registerRequest = {
      username,
      email,
      password,
    };

    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in registering. Try again.");
        }

        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      });
  }

  return (
    <>
      <form onSubmit={register}>
        <h2>Create Account</h2>

        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Type username here."
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Type email here."
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Type password here."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
  Already have an account? <Link to="/login">Sign In</Link>
</p>
    </>
  );
}

export default Register;
