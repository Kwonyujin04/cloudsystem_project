// frontend/src/components/Header.jsx

import { useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 헤더는 항상 full width */}
            <header className="w-full bg-white shadow-sm z-50 mb-4">

                {/* 모바일 + 데스크탑 공통: 전체 너비 flex 컨테이너 */}
                <div className="w-full px-4 my:px-2 md:px-8 h-20 flex items-center justify-between">

                    {/* Logo */}
                    <img src={logo} alt="logo.png" className="w-10 h-10 md:w-11 md:h-10"
                        onClick={() => window.open("/")} />

                    {/* 데스크탑 메뉴 */}
                    < nav className="hidden md:flex space-x-6 text-gray-700 font-medium" >
                        <a href="/" className="hover:text-black">홈</a>
                        <a href="/mypage" className="hover:text-black">마이페이지</a>
                        <a href="/diary" className="hover:text-black">일기작성</a>
                        <a href="/login" className="hover:text-black">로그인</a>
                    </nav>

                    {/* 모바일 햄버거 버튼 */}
                    <button
                        onClick={() => setOpen(true)}
                        className="flex flex-col justify-center items-center space-y-1 md:hidden"
                    >
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                    </button>
                </div>
            </header >

            {/* 모바일 오버레이 */}
            {
                open && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                )
            }

            {/* 모바일 Drawer */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}
                    md:hidden
                `}
            >
                <div className="p-6 space-y-6">
                    <button
                        className="text-gray-600 hover:text-black"
                        onClick={() => setOpen(false)}
                    >
                        ✕ 닫기
                    </button>

                    <nav className="space-y-4 text-gray-700 font-medium">
                        <a href="/" className="block hover:text-black">홈</a>
                        <a href="/mypage" className="block hover:text-black">마이페이지</a>
                        <a href="/diary" className="block hover:text-black">일기작성</a>
                        <a href="/login" className="block hover:text-black">로그인</a>
                    </nav>
                </div>
            </div>
        </>
    );
}
