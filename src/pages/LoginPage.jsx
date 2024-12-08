import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
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
        
        // Log the URL and credentials being sent (remove password in production)
        console.log('Attempting to login with URL:', `${import.meta.env.VITE_API_URL}/api-token-auth/`);
        console.log('Username:', credentials.username);
        
        try {
            // Check if VITE_API_URL is defined
            if (!import.meta.env.VITE_API_URL) {
                throw new Error('API URL is not defined in environment variables');
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api-token-auth/`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            // Log response details
            console.log('Response received:', {
                status: response.status,
                ok: response.ok,
                statusText: response.statusText
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                window.localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                const errorMessage = data.detail || "Invalid username or password";
                alert(errorMessage);
            }
        } catch (err) {
            console.error('Detailed error:', {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
            
            // More user-friendly error message
            if (err.message.includes('Failed to fetch') || err.message.includes('ERR_NAME_NOT_RESOLVED')) {
                alert("Unable to connect to the server. Please check your internet connection and try again.");
            } else {
                alert("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 text-gray-700">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-gray-700">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                    Sign In
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;