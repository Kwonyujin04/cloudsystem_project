// frontend/src/pages/DiaryPage/DiaryForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../../utils/axiosInstance";

export default function DiaryForm() {
    const [content, setContent] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("일기 내용을 입력해주세요!");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/api/diary/submit", {
                content,
            });

            const result = res.data.data;

            let music = {
                title: result.music.title,
                url: "",
                coverUrl:
                    "https://i.scdn.co/image/ab67616d0000b273e6cfbd918066c7f684bb6a53",
            };

            if (Array.isArray(result.musicList) && result.musicList.length > 0) {
                const m = result.musicList[0];
                music = {
                    title: m.trackTitle
                        ? `${m.artist ?? ""} - ${m.trackTitle}`
                        : "오늘의 기분에 맞는 음악",
                    url: m.spotifyUrl ?? "",
                    coverUrl:
                        m.coverUrl ??
                        "https://i.scdn.co/image/ab67616d0000b273e6cfbd918066c7f684bb6a53",
                };
            }

            navigate("/analysis", {
                state: {
                    diaryText: result.content,
                    analysis: result.analysis,
                    emotion: result.emotion,
                    keywords: result.keywords,
                    music,
                },
            });

        } catch (error) {
            console.error(error);
            alert("AI 분석 중 오류가 발생했습니다!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6 min-w-[300px]">

            {/* 날짜 선택 */}
            <div className="flex justify-center items-center">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-center 
                               focus:outline-none focus:ring-0 focus:border-black"
                />
            </div>

            <div className="text-center text-xl font-semibold mt-2">오늘의 일기</div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">

                {/* 본문 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/40"
                    placeholder="일기를 작성하세요..."
                    rows="6"
                    required
                />

                {/* 버튼 그룹 */}
                <div className="flex justify-between">

                    {/* 취소 */}
                    <button
                        type="button"
                        onClick={() => setContent("")}
                        className="w-1/3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg 
                                   hover:bg-gray-200 transition-colors duration-300"
                    >
                        Cancel
                    </button>

                    {/* 등록 */}
                    <button
                        type="submit"
                        className="w-1/3 py-2 text-sm bg-black text-white rounded-lg 
                                   hover:bg-gray-800 transition-all duration-300"
                    >
                        일기 등록
                    </button>
                </div>
            </form>

            {/* 🔄 AI 분석 로딩 모달 */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white px-8 py-6 rounded-lg shadow text-center space-y-4">
                        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full mx-auto"></div>
                        <p className="font-medium text-gray-700">AI가 분석 중입니다...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
