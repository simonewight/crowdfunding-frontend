import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postPledge from "../api/post-pledge.js";
import { useAuth }from "../hooks/use-auth.js";

function PledgeForm() {
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();

  const [credentials, setCredentials] = useState({
      amount: "",
      comment: "",
      anonymous: "",
      project: "",
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
      if (credentials.amount && credentials.comment && credentials.anonymous && credentials.project) {
          postPledge(
              credentials.amount,
              credentials.comment,
              credentials.anonymous,
              credentials.project
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
          <label htmlFor="amount">Amount:</label>
          <input
          type="text"
          id="amount"
          placeholder="Enter amount"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <input
          type="text"
          id="comment"
          placeholder="Enter comment"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="anonymous">Anonymous:</label>
          <input
          type="text"
          id="anonymous"
          placeholder="Enter anonymous"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="project">Project:</label>
          <input
          type="text"
          id="project"
          placeholder="Enter project"
          onChange={handleChange}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Submit
          </button>
      </form>
    );
  }
  
  export default PledgeForm;