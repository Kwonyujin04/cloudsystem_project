// src/pages/MyPage/MyPage.jsx
import { useState } from "react";
import { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MyPageField from ".//MypageField";
import EmotionGraph from ".//EmotionGraph";
import ProfileImage from ".//ProfileImage";
import SwitchButton from ".//SwitchButton";
import AnalysisResult from "../AnalysisPage/AnalysisResult";
import EmotionCalendar from "../../components/EmotionCalendar";
import Neutral from "../../assets/neutral.png";
import { AnimatePresence, motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/axiosInstance";

function normalizeDiaryFromServer(item) {
    const date = item.createdAt
        ? String(item.createdAt).split("T")[0]
        : "";

    const diaryText = item.content || ""; // Diary.content
    const analysis = item.summary || ""; // Diary.summary
    const emotion = item.label || "중립"; // Diary.label (감정 레이블)
    const keywords = Array.isArray(item.keywords) ? item.keywords : [];

    let music = {
        title: "오늘의 기분에 맞는 음악",
        url: "",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b273e6cfbd918066c7f684bb6a53",
    };

    if (Array.isArray(item.musicTitles) && item.musicTitles.length > 0) {
        music = {
            title: `${item.musicArtists[0]} - ${item.musicTitles[0]}`,
            url: item.musicUrls?.[0] ?? "",
            coverUrl: item.musicCovers?.[0] ??
                "https://i.scdn.co/image/ab67616d0000b273e6cfbd918066c7f684bb6a53",
        };
    }

    return {
        id: item.id,
        date, // "yyyy-MM-dd"
        diaryText,
        analysis,
        emotion,
        keywords,
        music,
    };
}

export default function MyPage() {
    const [isGraphMode, setIsGraphMode] = useState(false);
    const [diaries, setDiaries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const userName = localStorage.getItem("userName") || "이름";

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await api.get("/api/diary/info", {
                    params: { page: 0, size: 100 },
                });

                const page = res.data.data;
                const items = page.content || [];

                const mapped = items
                    .map(normalizeDiaryFromServer)
                    .filter((d) => d.date);

                setDiaries(mapped);
            } catch (e) {
                console.error(e);
                setError("일기 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiaries();
    }, []);

    const selectedDateKey = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : null;

    const selectedDiary = selectedDateKey
        ? diaries.find((d) => d.date === selectedDateKey)
        : null;

    const periodText = (() => {
        if (!diaries.length) return "아직 기록이 없습니다";
        const sorted = [...diaries].sort((a, b) =>
            a.date.localeCompare(b.date)
        );
        return `${sorted[0].date} ~ ${sorted[sorted.length - 1].date}`;
    })();

    return (
        <div className=" w-full min-h-screen bg-gray-100 min-w-[360px] min-h-[670px]">
            < Header />
            <div className="w-full max-w-md px-4 py-6 space-y-6 justify-center mx-auto">


                <div className="flex items-center space-x-4">
                    <ProfileImage src={Neutral} />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">{userName}</span>
                        <span className="text-sm text-gray-600">{periodText}</span>
                    </div>
                </div>

                <div>
                    <SwitchButton onClick={() => setIsGraphMode((prev) => !prev)} />
                </div>

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                {!isGraphMode && (
                    <>
                        <EmotionCalendar
                            diaries={diaries}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />

                        <AnimatePresence mode="wait">
                            {selectedDiary ? (
                                <motion.div
                                    key={selectedDateKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AnalysisResult
                                        diaryText={selectedDiary.diaryText}
                                        analysis={selectedDiary.analysis}
                                        emotion={selectedDiary.emotion}  // "기쁨" / "슬픔" / "보통" / "화남"
                                        music={selectedDiary.music}
                                        keywords={selectedDiary.keywords}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow text-center text-gray-500">
                                        이 날짜에는 아직 기록된 일기가 없어요.
                                        <br />
                                        일기를 작성하고 AI 분석을 완료하면,
                                        <br />
                                        여기에서 분석 결과를 다시 볼 수 있어요.
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}


                {isGraphMode && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="graph"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <EmotionGraph diaries={diaries} />
                        </motion.div>
                    </AnimatePresence>
                )}
            </div >

            {loading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
                    <div className="bg-white px-6 py-4 rounded-lg shadow text-gray-700">
                        일기 목록을 불러오는 중입니다...
                    </div>
                </div>
            )}

            <Footer />
        </div >
    );
}
