import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // First validate the username format
        const usernameRegex = /^[\w.@+-]+$/;  // Matches letters, numbers, and @/./+/-/_
        if (!usernameRegex.test(credentials.username)) {
            setError("Username can only contain letters, numbers, and @/./+/-/_ characters (no spaces)");
            return;
        }
        
        try {
            console.log("Attempting to register with:", credentials);
            
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/users/`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                }
            );

            console.log("Response status:", response.status);
            
            const rawResponse = await response.text();
            console.log("Raw response:", rawResponse);
            
            if (response.ok) {
                navigate("/login");
            } else {
                try {
                    const data = JSON.parse(rawResponse);
                    const errorMessage = typeof data === 'object' 
                        ? Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
                        : data.toString();
                    setError(errorMessage);
                } catch (parseError) {
                    setError(rawResponse || "Server error occurred. Please try again.");
                }
            }
        } catch (err) {
            console.error("Error details:", err);
            setError("Something went wrong while trying to sign up");
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create an account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={credentials.username}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;