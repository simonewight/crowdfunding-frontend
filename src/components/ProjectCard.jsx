import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Users } from 'lucide-react';
import { Link } from "react-router-dom";

function ProjectCard({ projectData }) {
    return (
        <Link to={`/project/${projectData.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="h-48 bg-gray-200 rounded-t-lg mb-4">
                        {projectData.image && (
                            <img 
                                src={projectData.image} 
                                alt={projectData.title}
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        )}
                    </div>
                    <CardTitle className="text-xl">{projectData.title}</CardTitle>
                    <CardDescription>{projectData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{
                                    width: `${(projectData.amount_pledged / projectData.goal) * 100}%`
                                }}
                            ></div>
                        </div>
                        {/* Funding info */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Raised: ${projectData.amount_pledged}
                            </span>
                            <span className="text-gray-600">
                                Goal: ${projectData.goal}
                            </span>
                        </div>
                        {/* Additional info */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {projectData.pledges?.length || 0} backers
                            </span>
                            <span>{projectData.date_end} deadline</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ProjectCard;