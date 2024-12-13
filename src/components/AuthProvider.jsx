import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const token = window.localStorage.getItem("token");
        const username = window.localStorage.getItem("username");
        const userId = window.localStorage.getItem("userId");
        
        console.log("AuthProvider initializing with:", {
            token,
            username,
            userId
        });
        
        return {
            token,
            username,
            userId
        };
    });

    // Debug log whenever auth changes
    useEffect(() => {
        console.log("Auth state changed:", auth);
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}