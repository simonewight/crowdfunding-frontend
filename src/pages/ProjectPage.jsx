import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function ProjectPage() {
    const [project, setProject] = useState({ pledges: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const location = useLocation();
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch project data
    const fetchProject = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            
            const data = await response.json();
            console.log('Project data:', data);
            setProject(data);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and pledge success handling
    useEffect(() => {
        fetchProject();
        
        if (location.state?.pledgeSuccess) {
            setShowSuccess(true);
            // Fetch once more after a short delay to get updated data
            setTimeout(fetchProject, 1000);
            // Hide success message after 5 seconds
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [id, location]);

    // Calculate total pledges
    const calculateTotalPledges = (pledges) => {
        return pledges.reduce((total, pledge) => total + Number(pledge.amount), 0);
    };

    // Calculate days remaining
    const getDaysRemaining = () => {
        if (!project.date_end) return 0;
        const endDate = new Date(project.date_end);
        const today = new Date();
        const difference = endDate - today;
        return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
    };

    // Calculate funding progress
    const getFundingProgress = () => {
        const totalPledged = project.sum_pledges || calculateTotalPledges(project.pledges);
        if (!project.goal || !totalPledged) return 0;
        return Math.min((totalPledged / project.goal) * 100, 100);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto mt-10 px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-48 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10 px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-center text-red-600">Error: {error}</p>
                    <button 
                        onClick={() => fetchProject()} 
                        className="text-indigo-600 hover:text-indigo-500 block text-center mt-4"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const totalPledged = project.sum_pledges || calculateTotalPledges(project.pledges);

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4 mb-10">
            {/* Success Message */}
            {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md flex justify-between items-center">
                    <p>Thank you for your pledge! Your support means a lot.</p>
                    <button 
                        onClick={() => setShowSuccess(false)}
                        className="text-green-700 hover:text-green-900"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {project.image && (
                    <div className="w-full h-96 relative">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                
                <div className="p-6">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        {project.category && (
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {project.category}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                                {typeof project.owner === 'string' 
                                    ? project.owner.charAt(0)?.toUpperCase() 
                                    : project.owner?.username?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                By {typeof project.owner === 'string' 
                                    ? project.owner 
                                    : project.owner?.username || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Created {new Date(project.date_created).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-8">
                        <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm text-gray-500">Pledged</h3>
                            <p className="text-2xl font-bold text-indigo-600">
                                {formatCurrency(totalPledged)}
                            </p>
                            <p className="text-sm text-gray-500">
                                of {formatCurrency(project.goal)} goal
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500">Backers</h3>
                            <p className="text-2xl font-bold">{project.pledges?.length || 0}</p>
                            <p className="text-sm text-gray-500">total supporters</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500">Days Left</h3>
                            <p className="text-2xl font-bold">{getDaysRemaining()}</p>
                            <p className="text-sm text-gray-500">
                                ends {new Date(project.date_end).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${getFundingProgress()}%` }}
                            ></div>
                        </div>
                    </div>

                    <Link 
                        to={`/pledge/${id}`}
                        className="inline-block w-full md:w-auto text-center bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
                    >
                        Back this project
                    </Link>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Recent Supporters</h2>
                {project.pledges?.length > 0 ? (
                    <div className="space-y-4">
                        {project.pledges.map((pledge, key) => (
                            <div 
                                key={key}
                                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {pledge.anonymous ? "Anonymous Supporter" : pledge.supporter}
                                        </p>
                                        {pledge.comment && (
                                            <p className="text-gray-600 mt-1">{pledge.comment}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(pledge.date_pledged).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="font-bold text-indigo-600">
                                        {formatCurrency(pledge.amount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No pledges yet. Be the first to support this project!</p>
                )}
            </div>
        </div>
    );
}

export default ProjectPage;