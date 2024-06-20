import axios from "axios";
import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/getuser`, { withCredentials: true }).then((result) => {
            setUser(result.data);
            setIsLoading(false);
        }).catch(() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('roleId')
            setIsLoading(false);
            navigate("/login")
        })
    }, [])

    return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    const auth = useContext(AuthContext);

    if (!auth) {
        
    }

    return auth
};