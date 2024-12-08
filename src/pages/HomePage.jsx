import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { Button } from "../components/ui/button";
import { Heart, Search, TrendingUp, Users, Menu } from 'lucide-react';

function HomePage() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            
            const data = await response.json();
            console.log('Raw project data:', data);
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Calculate totals
    const totalFunding = projects.reduce((total, project) => {
        const projectPledges = project.pledges || [];
        return total + projectPledges.reduce((sum, pledge) => sum + Number(pledge.amount), 0);
    }, 0);

    const totalBackers = projects.reduce((total, project) => {
        const projectPledges = project.pledges || [];
        return total + projectPledges.length;
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-indigo-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Fund Your Dreams, <br />
                            <span className="text-indigo-600">Change the World</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join our community of changemakers and bring your ideas to life through the power of crowdfunding.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/create-project">
                                <Button size="lg">
                                    Start Your Campaign
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg">
                                Browse Projects
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-2xl font-bold text-indigo-600">
                                ${totalFunding.toLocaleString()}
                            </div>
                            <div className="text-gray-600">Total Funded</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-indigo-600">
                                {projects.length}+
                            </div>
                            <div className="text-gray-600">Active Projects</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-indigo-600">
                                {totalBackers}+
                            </div>
                            <div className="text-gray-600">Total Backers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-indigo-600">95%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Current Projects</h2>
                        <p className="text-gray-600 mt-2">Support these amazing projects making a difference</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((projectData) => (
                            <ProjectCard key={projectData.id} projectData={projectData} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-indigo-100 rounded-full">
                                <TrendingUp className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">High Success Rate</h3>
                            <p className="text-gray-600">95% of projects reach their funding goals</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-indigo-100 rounded-full">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Strong Community</h3>
                            <p className="text-gray-600">Join our community of passionate changemakers</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-indigo-100 rounded-full">
                                <Heart className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Support & Guidance</h3>
                            <p className="text-gray-600">Expert support throughout your campaign</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <h3 className="text-white text-lg font-bold">Fundee</h3>
                            <p className="text-sm">
                                Empowering creators and innovators to bring their projects to life through community support.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/create-project" className="hover:text-white transition-colors">Start a Project</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Categories</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Arts & Culture</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Education</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Environment</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <span>Email: support@fundee.com</span>
                                </li>
                                <li className="flex items-center">
                                    <span>Phone: (+61) 403 055 258</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                        <p>&copy; {new Date().getFullYear()} Fundee. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;