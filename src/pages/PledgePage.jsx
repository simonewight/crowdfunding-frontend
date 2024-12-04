import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function PledgePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [pledgeData, setPledgeData] = useState({
        amount: "",
        comment: "",
        anonymous: false,
    });

    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        setPledgeData((prevPledgeData) => ({
            ...prevPledgeData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = window.localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            
            const pledgePayload = {
                project: Number(id),
                amount: Number(pledgeData.amount),
                comment: pledgeData.comment || "",
                anonymous: pledgeData.anonymous,
            };
            
            console.log('Submitting pledge with data:', pledgePayload);

            const response = await fetch(
                `https://fundee-app-8581d7ef280c.herokuapp.com/pledges/`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(pledgePayload),
                }
            );

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(
                    responseData.detail || 
                    Object.values(responseData).flat().join(', ') || 
                    "Failed to create pledge"
                );
            }

            // Success! Redirect to project page
            navigate(`/project/${id}`, {
              state: { pledgeSuccess: true }
            });
        } catch (err) {
            console.error("Error details:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                                    Support this Project
                                </h2>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="amount" className="block mb-2 text-gray-700 font-medium">
                                            Pledge Amount ($)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="amount"
                                                value={pledgeData.amount}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                                min="1"
                                                step="1"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="comment" className="block mb-2 text-gray-700 font-medium">
                                            Comment (Optional)
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={pledgeData.comment}
                                            onChange={handleChange}
                                            rows="4"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Leave a message of support"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="anonymous"
                                            checked={pledgeData.anonymous}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                                            Make this pledge anonymous
                                        </label>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm 
                                                ${isSubmitting 
                                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                                }`}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Complete Pledge'}
                                        </button>
                                    </div>

                                    <p className="mt-4 text-center text-sm text-gray-500">
                                        By pledging, you agree to support this project.
                                        <br />
                                        Your card will only be charged if the project reaches its funding goal.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PledgePage;