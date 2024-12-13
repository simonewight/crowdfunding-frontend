import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

function EditProjectPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        image: "",
        date_end: "",
        is_open: true,
    });

    useEffect(() => {
        // Fetch the project data
        const fetchProject = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch project");
                }
                const data = await response.json();
                
                // Format the date to YYYY-MM-DD for the input field
                const date_end = data.date_end ? data.date_end.split('T')[0] : '';
                
                setFormData({
                    title: data.title,
                    description: data.description,
                    goal: data.goal,
                    image: data.image,
                    date_end: date_end,
                    is_open: data.is_open ?? true,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format the date to include time
            const endDate = formData.date_end 
                ? new Date(formData.date_end).toISOString()
                : null;

            const dataToSend = {
                ...formData,
                goal: Number(formData.goal),
                date_end: endDate  // Use the formatted date
            };

            console.log('Sending data to API:', dataToSend);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${auth.token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (!response.ok) {
                const errorMessage = responseData.detail || 
                    Object.entries(responseData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                throw new Error(errorMessage);
            }

            navigate(`/project/${id}`, { 
                state: { editSuccess: true } 
            });
        } catch (err) {
            console.error('Error updating project:', err);
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto mt-10 px-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                        Goal Amount ($)
                    </label>
                    <input
                        type="number"
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="date_end" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="date_end"
                        name="date_end"
                        value={formData.date_end}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_open"
                        name="is_open"
                        checked={formData.is_open}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_open" className="ml-2 block text-sm text-gray-900">
                        Project is open for funding
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/project/${id}`)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProjectPage;