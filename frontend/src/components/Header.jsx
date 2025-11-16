// src/components/Header.jsx

import { useState } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="w-8 h-8 bg-green-500 rounded-sm" />

                {/* Hamburger Button */}
                <button
                    className="flex flex-col justify-center items-center space-y-1"
                    onClick={() => setOpen(!open)}
                >
                    <span className="block w-6 h-0.5 bg-black"></span>
                    <span className="block w-6 h-0.5 bg-black"></span>
                    <span className="block w-6 h-0.5 bg-black"></span>
                </button>
            </div>

            {/* Dropdown Menu (모바일용) */}
            {open && (
                <div className="max-w-md mx-auto px-4 pb-4">
                    <nav className="bg-gray-100 p-4 rounded-lg shadow">
                        <ul className="space-y-3">
                            <li>
                                <a href="/" className="text-gray-700 hover:text-black">
                                    홈
                                </a>
                            </li>
                            <li>
                                <a href="/mypage" className="text-gray-700 hover:text-black">
                                    마이페이지
                                </a>
                            </li>
                            <li>
                                <a href="/analysis" className="text-gray-700 hover:text-black">
                                    분석페이지
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}
