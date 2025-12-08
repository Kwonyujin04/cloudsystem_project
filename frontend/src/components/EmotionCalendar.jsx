// frontend/src/components/EmotionCalendar.jsx
import { useEffect, useMemo, useState } from "react";
import joyImg from "../assets/joy.png";
import sadImg from "../assets/sad.png";
import angryImg from "../assets/angry.png";
import neutralImg from "../assets/neutral.png";

const EMOTION_CANONICAL = {
    "행복": "joy",

    "슬픔": "sad",
    "공포": "sad",
    "놀람": "sad",

    "혐오": "angry",
    "분노": "angry",

    "중립": "neutral",
};

const EMOTION_ICON = {
    joy: joyImg,
    sad: sadImg,
    angry: angryImg,
    neutral: neutralImg,
};

const EMOTION_BG_CLASS = {
    joy: "#fde4b5ff",
    sad: "#c1ddf3ff",
    angry: "#faaaaaff",
    neutral: "#e1f7d6ff",
};

const EMOTION_LABEL = {
    joy: "행복",
    sad: "슬픔",
    angry: "분노",
    neutral: "중립",
};

export default function EmotionCalendar({ diaries, selectedDate, onDateSelect, onMonthChange }) {
    const [currentMonth, setCurrentMonth] = useState(() => selectedDate || new Date());

    useEffect(() => {
        if (selectedDate) setCurrentMonth(selectedDate);
    }, [selectedDate]);

    const diaryByDate = useMemo(() => {
        const map = {};
        (diaries || []).forEach((d) => {
            if (!d.date) return;
            map[d.date] = d;
        });
        return map;
    }, [diaries]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay(); // 0: 일요일
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(Date.UTC(year, month, day));

        const key = [
            dateObj.getUTCFullYear(),
            String(dateObj.getUTCMonth() + 1).padStart(2, "0"),
            String(dateObj.getUTCDate()).padStart(2, "0")
        ].join("-");

        const diary = diaryByDate[key] || null;

        cells.push({ dateObj, key, diary });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

    const isSameDate = (d1, d2) => {
        if (!d1 || !d2) return false;
        return (
            d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate()
        );
    };

    const handleMoveMonth = (offset) => {
        setCurrentMonth(
            (prev) => {
                const newMonth = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
                setCurrentMonth(newMonth);
                if (onMonthChange) {
                    onMonthChange(newMonth);
                }
                return newMonth;
            }
        );
    };

    return (
        <div className="w-full bg-white border rounded-xl shadow-sm p-4 space-y-3">
            {/* 상단 월 이동 */}
            <div className="flex items-center justify-between mb-1">
                <button
                    type="button"
                    onClick={() => handleMoveMonth(-1)}
                    className="px-2 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                >
                    ◀
                </button>
                <div className="text-sm font-semibold">
                    {year}년 {month + 1}월
                </div>
                <button
                    type="button"
                    onClick={() => handleMoveMonth(1)}
                    className="px-2 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                >
                    ▶
                </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {weekdayLabels.map((label) => (
                    <div key={label} className="py-1">
                        {label}
                    </div>
                ))}
            </div>

            {/* 날짜 + 감정 이미지 */}
            <div className="grid grid-cols-7 gap-1 text-sm">
                {cells.map((cell, index) => {
                    if (!cell) return <div key={index} className="h-12" />;

                    const { dateObj, key, diary } = cell;
                    const isSelected = isSameDate(selectedDate, dateObj);
                    const emotionRaw = diary?.emotion; // 백엔드에서 온 원래 감정 (한국어)
                    const emotionKey = emotionRaw ? EMOTION_CANONICAL[emotionRaw] || "neutral" : null;// 캘린더에서 쓸 대표 감정 키

                    const bgColor = emotionKey
                        ? EMOTION_BG_CLASS[emotionKey]
                        : "#f3f4f6";

                    const iconSrc = emotionKey ? EMOTION_ICON[emotionKey] : null;
                    const altLabel = emotionKey
                        ? EMOTION_LABEL[emotionKey]
                        : "감정";

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onDateSelect && onDateSelect(dateObj)}
                            className={`relative h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${isSelected ? "ring-2 ring-black ring-offset-1" : ""
                                } ${diary ? "hover:shadow-md hover:-translate-y-0.5" : ""}`}
                        >
                            <span className="text-[10px] absolute top-1 left-1 text-gray-500">
                                {dateObj.getDate()}
                            </span>

                            {diary && emotionKey && iconSrc && (
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    <img
                                        src={iconSrc}
                                        alt={`${altLabel} 아이콘`}
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-[11px] text-gray-400 mt-1">
                각 날짜의 아이콘/색은 그날의 대표 감정을 나타냅니다.
            </p>
        </div>
    );
}
