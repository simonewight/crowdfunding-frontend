import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postProject from "../api/post-project.js";
import { useAuth } from "../hooks/use-auth.js";

function CreateProjectForm() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        
        // Store current location
        const currentPath = window.location.pathname;
        console.log("Current path:", currentPath);

        postProject(
            credentials.title,
            credentials.description,
            credentials.goal,
            credentials.image
        )
        .then((response) => {
            console.log("Project created successfully");
            
            // Update auth
            window.localStorage.setItem("token", response.token);
            setAuth({
                token: response.token,
            });

            // Create success element
            const successDiv = document.createElement('div');
            successDiv.style.position = 'fixed';
            successDiv.style.top = '50%';
            successDiv.style.left = '50%';
            successDiv.style.transform = 'translate(-50%, -50%)';
            successDiv.style.backgroundColor = '#4CAF50';
            successDiv.style.color = 'white';
            successDiv.style.padding = '20px';
            successDiv.style.borderRadius = '10px';
            successDiv.style.zIndex = '9999';
            successDiv.textContent = '🎉 Project Created Successfully! 🎉';
            
            // Add to body
            document.body.appendChild(successDiv);

            // Navigate after delay
            setTimeout(() => {
                document.body.removeChild(successDiv);
                window.location.href = '/';  // Using direct location change instead of navigate
            }, 2000);
        })
        .catch((error) => {
            console.error("Error creating project:", error);
        });
    };

    return (
        <div className="create-project-form" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Create New Project</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter title"
                        onChange={handleChange}
                        value={credentials.title}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Enter description"
                        onChange={handleChange}
                        value={credentials.description}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="goal">Goal:</label>
                    <input
                        type="text"
                        id="goal"
                        placeholder="Enter goal"
                        onChange={handleChange}
                        value={credentials.goal}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="image">Image:</label>
                    <input
                        type="text"
                        id="image"
                        placeholder="Enter image"
                        onChange={handleChange}
                        value={credentials.image}
                        required
                    />
                </div>
                <button 
                    type="submit"
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Create Project
                </button>
            </form>
        </div>
    );
}

export default CreateProjectForm;