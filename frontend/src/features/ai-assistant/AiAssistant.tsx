import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { askQuestion, clearAnswer } from "./aiAssistantSlice";
import { useNavigate } from "react-router";



const AIAssistant = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const { isAuth } = useSelector((state: RootState) => state.auth);

    const { answer, loading, error } = useSelector((state: RootState) => state.aiAssistant);

    const [question, setQuestion] = useState("");

    useEffect(() => {
        dispatch(clearAnswer());
    }, [dispatch]);

    const handleAsk = () => {
        if (!question.trim()) return;
        if (isAuth) {
            dispatch(askQuestion(question));
        } else {
            navigate(`/login`);
        }
    };


    const hasResponse = answer || error;

    return (
        <div className="max-w-3xl mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-start">

                {/* INPUT */}
                <div className="w-full sm:flex-1">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask Ai about your events..."
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2">
                    <button
                        onClick={handleAsk}
                        className="flex-1 sm:flex-none px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Thinking...
                            </span>
                        ) : (
                            "Ask"
                        )}
                    </button>


                </div>
            </div>

            {/* ANSWER */}
            {hasResponse && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-800 shadow-sm animate-fadeIn">
                    {error ? error : answer}
                </div>
            )}


        </div>
    );
};

export default AIAssistant;