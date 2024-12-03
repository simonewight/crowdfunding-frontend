import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import "./HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
    const { projects } = useProjects(); 

    return (
    <div id="project-list">
        {projects.map((projectData, key) => {
            return <ProjectCard key={key} projectData={projectData} />;  
            })}
            <Link to="/create-project">Create Project</Link>
            </div>
            );
        }

export default HomePage;