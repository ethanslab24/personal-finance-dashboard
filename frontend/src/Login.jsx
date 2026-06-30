import { useState } from "react";
import { API_URL } from "./api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

   const navigate = useNavigate();


  function login(e) {
    e.preventDefault();

    const loginRequest = {
      username,
      password,
    };

    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Incorrect username or password. Try again.");
        }

        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/");
      });
  }

  return (
    <>
      <form onSubmit={login}>
        <h2>Login</h2>

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
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Type password here."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </>
  );
}

export default Login;
