import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi.me()
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        setUser(data);
        return data;
    };

    const register = async (data) => {
        const result = await authApi.register(data);
        setUser(result);
        //console.log("Response: " , result);
        return result;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };
    const switchRole = async (targetRole) => {
        const data = await authApi.switchRole(targetRole);
        setUser(data);
        return data;
    };
    const hasRole = (role) => user?.roles?.includes(role);
    const activeRole  = user?.activeRole;
    const hasMultiple = user?.roles?.length > 1;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            switchRole,
            hasRole,
            activeRole,
            hasMultiple,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}