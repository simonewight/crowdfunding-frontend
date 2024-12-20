import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postSignup from "../api/post-signup.js";
import { useAuth }from "../hooks/use-auth.js";

function SignupForm() {
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();

  const [credentials, setCredentials] = useState({
      username: "",
      email: "",
      password: "",
  });
    
  const handleChange = (event) => {
      const { id, value } = event.target;
      setCredentials((prevCredentials) => ({
          ...prevCredentials,
          [id]: value,
      }));
  };

const handleSubmit = (event) => {
      event.preventDefault();
      if (credentials.username && credentials.email && credentials.password) {
          postSignup(
              credentials.username,
              credentials.email,
              credentials.password
          ).then((response) => {
            window.localStorage.setItem("token", response.token);
            setAuth({
      token: response.token,
  });
            navigate("/");
          });
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
          <label htmlFor="email">Email:</label>
          <input
          type="text"
          id="email"
          placeholder="Enter email"
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
  
  export default SignupForm;