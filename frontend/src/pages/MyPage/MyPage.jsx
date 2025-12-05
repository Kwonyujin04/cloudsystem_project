// src/pages/MyPage/MyPage.jsx
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MyPageField from ".//MypageField";
import EmotionGraph from ".//EmotionGraph";
import ProfileImage from ".//ProfileImage";
import SwitchButton from ".//SwitchButton";
import AnalysisResult from "../AnalysisPage/AnalysisResult";
import RecordPlayer from "../AnalysisPage/RecordPlayer";
import EmotionCalendar from "../../components/EmotionCalendar";
import { AnimatePresence, motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";

export default function MyPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isOn, setIsOn] = useState(false);

    const diaries = [
        {
            date: "2025-12-01",
            diaryText: "오늘은 기쁘고 즐거운 하루였다.",
            analysis: "전반적으로 긍정적인 정서가 강하게 나타난 하루였습니다.",
            keyword: ["기쁘다", "즐겁다", "맛있다"],
            emotion: "joy",
            music: {
                title: "Happy Vibes",
                url: "https://example.com/happy",
                coverUrl: "https://via.placeholder.com/300x300.png?text=Happy",
            },
        },
        {
            date: "2025-12-02",
            diaryText: "날씨가 흐려서 조금 우울했다.",
            analysis: "날씨로 인해 기분이 다소 가라앉았지만 회복 가능성이 보입니다.",
            keyword: ["우울하다", "조용하다"],
            emotion: "sad",
            music: {
                title: "Rainy Day Mood",
                url: "https://example.com/sad",
                coverUrl: "https://via.placeholder.com/300x300.png?text=Rainy",
            },
        },
        {
            date: "2025-12-03",
            diaryText: "오늘은 평범한 하루였다.",
            analysis: "안정적이고 차분한 감정이 유지된 하루였습니다.",
            keywords: ["조용하다"],
            emotion: "neutral",
            music: {
                title: "Chill Evening",
                url: "https://example.com/neutral",
                coverUrl: "https://via.placeholder.com/300x300.png?text=Chill",
            },
        },
    ];

    const selectedDateKey = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : null;

    const selectedDiary = selectedDateKey
        ? diaries.find((d) => d.date === selectedDateKey)
        : null;

    return (
        <div className=" w-full min-h-screen bg-gray-100 min-w-[360px] min-h-[670px]">
            < Header />
            <div className="w-full max-w-md px-4 py-6 space-y-6 justify-center mx-auto">


                <div className="flex items-center space-x-4">
                    <ProfileImage src="https://via.placeholder.com/150" />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">이름</span>
                        <span className="text-sm text-gray-600">기록한 기간</span>
                    </div>
                </div>

                <div>
                    <SwitchButton onClick={() => setIsOn(!isOn)} />
                </div>

                {!isOn && (
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


                {isOn && (
                    <AnimatePresence mode="wait">
                        {isOn ? (
                            <motion.div
                                key="graph"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <EmotionGraph diaries={diaries} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="field"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MyPageField diaries={diaries} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div >

            <Footer />
        </div >
    );
}
