// src/pages/Profile.jsx

import { useState } from "react";
import ProfileImage from "../components/ProfileImage";
import SwitchButton from "../components/SwitchButton";
import DiaryList from "../components/DiaryList";

export default function MyPage() {
    // 예시 데이터 (향후 API 연동 가능)
    const [diaries, setDiaries] = useState([
        {
            date: "2025.01.01.Fri",
            content: "오늘은 기쁘고 즐거운 하루였다.",
            keywords: ["기쁘다", "즐겁다", "맛있다"],
        },
        {
            date: "2025.01.02.Sat",
            content: "날씨가 흐려서 조금 우울했다.",
            keywords: ["우울하다", "조용하다"],
        },
    ]);

    const handleSwitch = () => {
        console.log("스위치 버튼 클릭됨!");
    };

    return (
        <div className="w-full min-h-screen bg-gray-100">
            {/* 페이지 전체 wrapper */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-6">

                {/* 프로필 영역 */}
                <div className="flex items-center space-x-4">
                    <ProfileImage src="https://via.placeholder.com/150" />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800">이름</span>
                        <span className="text-sm text-gray-600">기록한 기간</span>
                    </div>
                </div>

                {/* 스위치 버튼 */}
                <SwitchButton text="switch button" onClick={handleSwitch} />

                {/* 날짜 + 빈칸 입력 + 키워드 박스 등은 향후 info_field 컴포넌트로 분리 가능 */}

                {/* 게시글 리스트 */}
                <DiaryList diaries={diaries} />

                {/* 하단 푸터 */}
                <footer className="text-center text-xs text-gray-500 pt-6">
                    Cloud System 2025 Project · Team 1
                </footer>
            </div>
        </div>
    );
}
