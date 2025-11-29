// src/pages/MyPage.jsx

import { useState } from "react";
import MyPageField from "../components/MypageField";
import EmotionGraph from "../components/EmotionGraph";
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
    ];

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md px-4 py-6">
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
                            <MyPageField
                                profileImg="https://via.placeholder.com/150"
                                diaries={diaries}
                                onSwitch={() => setIsOn(true)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
