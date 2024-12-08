import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

function NavBar() {
    const { auth, setAuth } = useAuth();

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        setAuth({ token: null });
    };

    return (
        <div>
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex space-x-7">
                            <div className="flex items-center space-x-4">
                                <Link to="/" className="text-lg font-semibold">
                                    Fundee
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.token ? (
                                <>
                                    <Link 
                                        to="/create-project" 
                                        className="hover:text-indigo-500"
                                    >
                                        Create Project
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:text-indigo-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="hover:text-indigo-500"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default NavBar;