import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postLogin from "../api/post-login.js";
import { useAuth }from "../hooks/use-auth.js";

function LoginForm() {
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();

  const [credentials, setCredentials] = useState({
      username: "",
      password: "",
  });
    
  const handleChange = (event) => {
      const { id, value } = event.target;
      setCredentials((prevCredentials) => ({
          ...prevCredentials,
          [id]: value,
      }));
  };

const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("username", credentials.username);
            window.localStorage.setItem("userId", data.user_id);
            setAuth({
                token: data.token,
                username: credentials.username,
                userId: data.user_id,
            });
            navigate("/");
        } else {
            setError(data.non_field_errors?.[0] || "Login failed");
        }
    } catch (err) {
        setError("Something went wrong. Please try again later.");
    }
};

    return (
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
          type="text"
          id="username"
          placeholder="Enter username"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Login
          </button>
      </form>
    );
  }
  
  export default LoginForm;