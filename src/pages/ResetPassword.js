import React, {useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import InputField from "../components/Common/InputField";
import Button from "../components/Common/Button";

function ResetPassword() {
    const {token} = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try{
            const response = await apiConnector("PUT", `${AUTH_ENDPOINTS.RESET_PASSWORD_API}/${token}`, {
                newPassword,
                confirmPassword,
            });
            toast.success("Password has been reseted. Please login now.");
            navigate("/login");
        }
        catch(error){
            toast.error(error.message || "Reset failed. Please try again.");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">New Password</label>
                        <InputField
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                        <InputField
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;