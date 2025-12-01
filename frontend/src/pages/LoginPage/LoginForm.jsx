// frontend/src/pages/LoginPage/LoginForm.jsx

import { useState } from "react";
import api from "../../utils/axiosInstance";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6">

            <h1 className="text-3xl font-bold text-center">Login</h1>
            <p className="text-center text-gray-500">Welcome back!</p>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
