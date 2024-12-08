import { Link } from "react-router-dom";

export default function ProjectCard({ projectData }) {
    const pledges = projectData.pledges || [];
    const totalPledged = pledges.reduce((sum, pledge) => sum + Number(pledge.amount), 0);
    const goal = Number(projectData.goal);
    const progressPercentage = goal > 0 ? (totalPledged / goal) * 100 : 0;
    const backerCount = pledges.length;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/project/${projectData.id}`}>
                <div className="relative h-48">
                    <img
                        src={projectData.image}
                        alt={projectData.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{projectData.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{projectData.description}</p>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <div>
                            <p className="font-semibold">${totalPledged.toLocaleString()}</p>
                            <p className="text-gray-600">pledged of ${goal.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{backerCount}</p>
                            <p className="text-gray-600">backers</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}