import { useState } from "react";
import apiCall from "../services/apiCall";
import PageNavBar from "../components/ui/PageNavBar";
import { FaHeartbeat, FaCookieBite, FaShieldAlt } from "react-icons/fa";

function HealthCheck() {
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRequest = async (apiCallFn, name) => {
        setIsLoading(true);
        setResponseData({ status: "Loading...", type: name });
        try {
            const response = await apiCallFn();
            setResponseData({
                type: name,
                status: response.status,
                data: response.data
            });
        } catch (error) {
            setResponseData({
                type: name,
                status: error.response?.status || "Error",
                error: error.response?.data || error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const healthCheck = () => handleRequest(() => apiCall.checkHealthPing(), "Health Ping");
    const sendCookie = () => handleRequest(() => apiCall.checkHealthSendCookie(), "Send Cookie");
    const cookieCheck = () => handleRequest(() => apiCall.checkHealthCors(), "CORS Check");

    return (
        <>
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
                    <div className="border-b border-gray-100 pb-5">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaHeartbeat className="text-red-500" /> System Health Check
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Diagnostic tools to verify backend connectivity, cookie transmission, and CORS configurations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
                        <button
                            disabled={isLoading}
                            className="flex flex-col items-center gap-3 bg-gray-800 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-6 px-4 rounded-xl transition-all shadow-sm active:scale-95 group"
                            onClick={() => healthCheck()}
                        >
                            <FaHeartbeat className="text-2xl text-gray-400 group-hover:text-red-400 transition-colors" />
                            <span>Health Ping</span>
                        </button>
                        <button
                            disabled={isLoading}
                            className="flex flex-col items-center gap-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-6 px-4 rounded-xl transition-all shadow-sm active:scale-95 group"
                            onClick={() => sendCookie()}
                        >
                            <FaCookieBite className="text-2xl text-blue-200 group-hover:text-yellow-300 transition-colors" />
                            <span>Send Cookie</span>
                        </button>
                        <button
                            disabled={isLoading}
                            className="flex flex-col items-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-6 px-4 rounded-xl transition-all shadow-sm active:scale-95 group"
                            onClick={() => cookieCheck()}
                        >
                            <FaShieldAlt className="text-2xl text-green-200 group-hover:text-white transition-colors" />
                            <span>CORS Check</span>
                        </button>
                    </div>

                    {responseData && (
                        <div className="mt-4 border border-gray-800 rounded-xl overflow-hidden bg-gray-900 shadow-inner">
                            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                                <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                                    {responseData.type} Response
                                </span>
                            </div>
                            <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap word-break">
                                    {JSON.stringify(responseData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default HealthCheck