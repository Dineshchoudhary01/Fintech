import { createContext, useState, useContext } from "react";
import axiosInstance, { setAccessToken } from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    const login = async (email, password) => {
        const response = await axiosInstance.post('/auth/login', {email,password});
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
    };

    const register = async (name, email, password) => {
        const response = await axiosInstance.post('/auth/register', { name,email,password});
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
    };

    const logout = async () => {
        await axiosInstance.post('/auth/logout');
        setAccessToken(null);
        setUser(null);
    };

    return (
       <AuthContext.Provider value={{ user, login, register, loading}}>
         {children}
       </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}