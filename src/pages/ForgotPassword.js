import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import InputField from "../components/Common/InputField";
import Button from "../components/Common/Button";

function ForgotPassword () {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try{
            const response = await apiConnector("POST", AUTH_ENDPOINTS.FORGOT_PASSWORD_API, {email});
            toast.success("Password reset email has been sent. Check your email.");
            navigate("/login");
        }
        catch(error){
            toast.error(error.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                            Enter your email
                        </label>
                        <InputField
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
                <p className="text-sm text-gray-500 text-center mt-4">
                    Remembered your password?{' '}
                    <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
                        Login Here
                    </span>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword;