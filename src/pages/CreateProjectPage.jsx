import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProjectPage() {
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        goal: "",
        image: "",
        date_end: "",
        category: "",
        is_open: true,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);

    const categories = [
        "Technology",
        "Arts",
        "Film",
        "Games",
        "Music",
        "Food",
        "Publishing",
        "Fashion",
        "Design",
        "Other"
    ];

    const handleChange = (event) => {
        const { id, value } = event.target;
        
        if (id === 'goal') {
            setProjectData((prev) => ({
                ...prev,
                [id]: Number(value)
            }));
        } else {
            setProjectData((prev) => ({
                ...prev,
                [id]: value
            }));
        }

        if (id === 'image' && value) {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        const token = window.localStorage.getItem("token");

        const formattedData = {
            ...projectData,
            goal: Number(projectData.goal),
            is_open: true
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`,
                    },
                    body: JSON.stringify(formattedData),
                }
            );

            const data = await response.json();
            if (response.ok) {
                navigate("/");
            } else {
                const errorMessage = typeof data === 'object' 
                    ? Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
                    : data.toString();
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Error details:', err);
            setError('Network error or server not responding');
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 py-10">
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create a New Project</h2>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 whitespace-pre-line">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block mb-2 text-gray-700 font-medium">
                            Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={projectData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            placeholder="Enter your project title"
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label htmlFor="category" className="block mb-2 text-gray-700 font-medium">
                            Category
                        </label>
                        <select
                            id="category"
                            value={projectData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block mb-2 text-gray-700 font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={projectData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                            required
                            placeholder="Describe your project"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="image" className="block mb-2 text-gray-700 font-medium">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="image"
                            value={projectData.image}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter the URL for your project image"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 rounded-lg"
                                    onError={() => setImagePreview(null)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Funding Goal */}
                    <div>
                        <label htmlFor="goal" className="block mb-2 text-gray-700 font-medium">
                            Funding Goal ($)
                        </label>
                        <input
                            type="number"
                            id="goal"
                            value={projectData.goal}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                            placeholder="Enter your funding goal"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="date_end" className="block mb-2 text-gray-700 font-medium">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="date_end"
                            value={projectData.date_end}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProjectPage;