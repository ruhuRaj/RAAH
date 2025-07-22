import React from "react";
import { X, Loader2 } from "lucide-react";

const LoginModal = ({showLoginModal, setShowLoginModal, handleLogin, loginForm, setLoginForm, loading}) => {
    if(!showLoginModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Login to RAAH</h2>
                    <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="........"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={20}/>}
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                {/* Error message is now handled by react-hot-toast in App.js */}
            </div>
        </div>
    );
};

export default LoginModal;