// frontend/src/pages/SignupPage/SignupForm.jsx

import { useState } from "react";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            setError("비밀번호가 서로 다릅니다.");
            return;
        }

        try {
            await api.post("/api/auth/signup", {
                username,
                email,
                password,
            });

            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("회원가입에 실패했습니다. 입력하신 정보를 다시 확인해주세요.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6 min-w-[300px]">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center">Sign Up</h1>
            <p className="text-center text-gray-500">
                가입하고 나만의 감정 기록을 시작해보세요.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 이름 */}
                <div>
                    <label className="block text-sm font-medium py-2">이름</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="이름을 입력하세요"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium py-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="이메일을 입력하세요"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium py-2">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="비밀번호를 입력하세요"
                        required
                    />
                </div>

                {/* Password Confirm */}
                <div>
                    <label className="block text-sm font-medium py-2">비밀번호 확인</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                        placeholder="비밀번호를 다시 입력하세요"
                        required
                    />
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Signup Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold 
                               transition-all duration-300 hover:bg-gray-800"
                >
                    Sign Up
                </button>
            </form>

            {/* 이미 계정이 있을 때 */}
            <div className="text-sm text-center pt-2">
                <span className="text-gray-600">이미 계정이 있으신가요? </span>
                <button
                    onClick={() => navigate("/login")}
                    className="text-black font-semibold hover:underline"
                >
                    로그인
                </button>
            </div>
        </div>
    );
}
