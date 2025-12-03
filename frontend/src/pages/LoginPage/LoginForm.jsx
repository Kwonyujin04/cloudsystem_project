// frontend/src/pages/LoginPage/LoginForm.jsx

import { useState } from "react";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });

            const token = res.data.data.token;
            localStorage.setItem("token", token);

            alert("로그인 성공!");
            window.location.href = "/mypage";

        } catch (err) {
            setError("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6 min-w-[300px]">

            {/* Title */}
            <h1 className="text-3xl font-bold text-center">Login</h1>
            <p className="text-center text-gray-500">Welcome back to MoodTrack</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium py-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium py-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold 
                               transition-all duration-300 hover:bg-gray-800"
                >
                    Login
                </button>
            </form>

            {/* Links Section */}
            <div className="flex justify-between text-sm pt-2">

                {/* 아이디 찾기 */}
                <button
                    onClick={() => navigate("/find-id")}
                    className="text-gray-600 hover:text-black transition-colors duration-300"
                >
                    아이디 찾기
                </button>

                {/* 비밀번호 찾기 */}
                <button
                    onClick={() => navigate("/find-pw")}
                    className="text-gray-600 hover:text-black transition-colors duration-300"
                >
                    비밀번호 찾기
                </button>

            </div>

        </div>
    );
}