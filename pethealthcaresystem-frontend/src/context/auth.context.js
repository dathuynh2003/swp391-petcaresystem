import axios from "axios";
import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/me`, { withCredentials: true }).then((result) => {
            console.log("da co user")
            console.log(result.data)
            setUser(result.data);

            setIsLoading(false);

        }).catch(() => {
            console.log("loi nhe")
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('roleId')
            setIsLoading(false);
            navigate("/login")
        })
    }, [])

    return <AuthContext.Provider value={{ user, isLoading }}>{user && children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    const auth = useContext(AuthContext);

    if (!auth) {

    }

    return auth
};