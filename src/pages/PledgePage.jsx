import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function PledgePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pledgeData, setPledgeData] = useState({
        amount: "",
        comment: "",
        anonymous: false,
    });

    // Add confetti function
    const launchConfetti = () => {
        const colors = ['#7b5cff', '#5c86ff', '#b3c7ff'];
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '999';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const numberOfPieces = 100;

        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 15,
                vy: -Math.random() * 15 - 5,
                gravity: 0.5
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pieces.forEach(piece => {
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.vy += piece.gravity;

                ctx.beginPath();
                ctx.fillStyle = piece.color;
                ctx.arc(piece.x, piece.y, piece.size, 0, Math.PI * 2);
                ctx.fill();
            });

            if (pieces.some(piece => piece.y < canvas.height)) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(canvas);
            }
        }

        animate();
    };

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
                amount: Number(pledgeData.amount),
                comment: pledgeData.comment || "",
                anonymous: pledgeData.anonymous,
                project: Number(id),
                date_created: new Date().toISOString()
            };
            
            console.log('Token:', token);
            console.log('Payload:', pledgePayload);

            const response = await fetch(
                "https://fundee-app-8581d7ef280c.herokuapp.com/pledges/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    },
                    body: JSON.stringify(pledgePayload)
                }
            );

            const responseData = await response.json();
            console.log('Response:', responseData);

            if (!response.ok) {
                throw new Error(JSON.stringify(responseData));
            }

            // Show success message and launch confetti
            setShowSuccess(true);
            launchConfetti();

            // Wait 2 seconds before navigating
            setTimeout(() => {
                navigate(`/project/${id}`, { 
                    state: { pledgeSuccess: true },
                    replace: true
                });
            }, 2000);

        } catch (err) {
            console.error("Error details:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            {/* Success Message */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            🎉 Thank You! 🎉
                        </h2>
                        <p className="text-gray-700">
                            Your pledge has been received!
                        </p>
                    </div>
                </div>
            )}

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