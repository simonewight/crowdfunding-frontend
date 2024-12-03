import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postProject from "../api/post-project.js";
import { useAuth }from "../hooks/use-auth.js";

function CreateProjectForm() {
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();

  const [credentials, setCredentials] = useState({
      title: "",
      description: "",
      goal: "",
      image: "",
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
      if (credentials.title && credentials.description && credentials.goal && credentials.image) {
          postProject(
              credentials.title,
              credentials.description,
              credentials.goal,
              credentials.image,
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
          <label htmlFor="title">Title:</label>
          <input
          type="text"
          id="title"
          placeholder="Enter title"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
          type="text"
          id="description"
          placeholder="Enter description"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="goal">Goal:</label>
          <input
          type="text"
          id="goal"
          placeholder="Enter goal"
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
          type="text"
          id="image"
          placeholder="Enter image"
          onChange={handleChange}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Create Project
          </button>
      </form>
    );
  }
  
  export default CreateProjectForm;