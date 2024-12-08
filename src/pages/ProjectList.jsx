import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const difference = end - today;
        return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
    };

    // Calculate funding progress
    const getFundingProgress = (goal, pledges) => {
        const totalPledged = pledges?.reduce((sum, pledge) => sum + Number(pledge.amount), 0) || 0;
        if (!goal || !totalPledged) return 0;
        return Math.min((totalPledged / goal) * 100, 100);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-lg shadow-md p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-48 bg-gray-200 rounded"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-center text-red-600">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Projects</h1>
            
            {projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link 
                            key={project.id} 
                            to={`/project/${project.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {project.image && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        {project.title}
                                    </h2>
                                    {project.category && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                            {project.category}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getFundingProgress(project.goal, project.pledges)}%` }}
                                        ></div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <p className="font-bold text-indigo-600">
                                                {formatCurrency(project.pledges?.reduce((sum, pledge) => 
                                                    sum + Number(pledge.amount), 0) || 0)}
                                            </p>
                                            <p className="text-gray-500">pledged</p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {project.pledges?.length || 0}
                                            </p>
                                            <p className="text-gray-500">backers</p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {getDaysRemaining(project.date_end)}
                                            </p>
                                            <p className="text-gray-500">days left</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectList;