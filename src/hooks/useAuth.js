import { useState, useEffect } from "react";
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('raahToken');
        const storedUser = localStorage.getItem('raahUser');

        if(token && storedUser){
            try{
                setUser(JSON.parse(storedUser));
            }
            catch(e){
                console.log("Failed to parse user from localStorage:", e);
                // clear invalid data
                localStorage.removeItem('raahToken');
                localStorage.removeItem('raahUser');
                localStorage.removeItem('raahAccountType');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('Login attempt in useAuth hook (placeholder)');
    };

    const logout = () => {
        console.log('Logout attempt in useAuth hook (placeholder)');
        setUser(null);
        localStorage.removeItem('raahToken');
        localStorage.removeItem('raahUserId');
        localStorage.removeItem('raahAccountType');
        localStorage.removeItem('raahUser');
    };

    return {user, loading, login, logout};
};

export default useAuth;