// src/pages/MyPage/MyPage.jsx
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MyPageField from ".//MypageField";
import EmotionGraph from ".//EmotionGraph";
import ProfileImage from ".//ProfileImage";
import SwitchButton from ".//SwitchButton";
import { AnimatePresence, motion } from "framer-motion";

export default function MyPage() {
    const [isOn, setIsOn] = useState(false);

    const diaries = [
        {
            date: "2025.01.01.Fri",
            content: "오늘은 기쁘고 즐거운 하루였다.",
            keywords: ["기쁘다", "즐겁다", "맛있다"],
            emotion: "joy",
        },
        {
            date: "2025.01.02.Sat",
            content: "날씨가 흐려서 조금 우울했다.",
            keywords: ["우울하다", "조용하다"],
            emotion: "sad",
        },
        {
            date: "2025.01.03.Sun",
            content: "오늘은 평범한 하루였다.",
            keywords: ["조용하다"],
            emotion: "neutral",
        },
        {
            date: "2025.01.01.Fri",
            content: "오늘은 기쁘고 즐거운 하루였다.",
            keywords: ["기쁘다", "즐겁다", "맛있다"],
            emotion: "joy",
        },
        {
            date: "2025.01.02.Sat",
            content: "날씨가 흐려서 조금 우울했다.",
            keywords: ["우울하다", "조용하다"],
            emotion: "sad",
        },
        {
            date: "2025.01.03.Sun",
            content: "오늘은 평범한 하루였다.",
            keywords: ["조용하다"],
            emotion: "neutral",
        },
    ];

    return (
        <div className=" w-full min-h-screen bg-gray-100 min-w-[360px]">
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

            </div>
            <Footer />
        </div >
    );
}
