// src/components/MyPageField.jsx

import { useState, useRef, useEffect } from "react";
import DiaryList from "./DiaryList";

export default function MyPageField({ diaries }) {
    const [showGradient, setShowGradient] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
            setShowGradient(!isBottom);
        };

        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="relative">
            {/* 고정된 높이 + 스크롤 */}
            <div
                ref={scrollRef}
                className="
                    max-h-[420px]
                    overflow-y-auto
                    pr-1
                "
            >
                <DiaryList diaries={diaries} />
            </div>

            {/* 그라데이션 오버레이 */}
            <div
                className={`
                    pointer-events-none 
                    absolute bottom-0 left-0 w-full h-20 
                    bg-gradient-to-t from-white to-transparent
                    transition-opacity duration-300
                    ${showGradient ? "opacity-100" : "opacity-0"}
                `}
            />
        </div>
    );
}
