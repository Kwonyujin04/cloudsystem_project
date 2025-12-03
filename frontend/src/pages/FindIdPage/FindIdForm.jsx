// frontend/src/FindIdPage/FindIdForm.jsx

import { useState } from "react";

export default function FindIdForm() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("아이디 찾기 기능은 API 연결 후 작동합니다.");
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6 min-w-[300px]">
            <h1 className="text-3xl font-bold text-center">아이디 찾기</h1>
            <p className="text-center text-gray-500">가입 시 등록한 이메일을 입력하세요</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium py-2">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/40"
                        placeholder="가입한 이메일 입력"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold 
                               transition-all duration-300 hover:bg-gray-800"
                >
                    아이디 찾기
                </button>
            </form>
        </div>
    );
}
