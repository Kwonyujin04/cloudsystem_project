// frontend/src/pages/AnalysisPage/AnalysisResult.jsx

import RecordPlayer from ".//RecordPlayer";
import { useState } from "react";

export default function AnalysisResult({ diaryText, emotion, analysis, music }) {

    const [showDiary, setShowDiary] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const MAX_LENGTH = 120;

    const shorten = (text) =>
        text && text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) + "..." : text;

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-6">

            <h2 className="text-2xl font-bold text-center">AI 분석 결과</h2>
            <p className="text-center text-gray-500">오늘의 일기와 감정 분석</p>

            {/* 오늘의 일기 */}
            <div>
                <label className="block text-lg font-semibold">오늘의 일기</label>

                <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-gray-700 whitespace-pre-line">
                    {showDiary ? diaryText : shorten(diaryText)}
                </div>

                {diaryText.length > MAX_LENGTH && (
                    <button
                        className="text-sm text-gray-600 hover:text-black mt-2"
                        onClick={() => setShowDiary(!showDiary)}
                    >
                        {showDiary ? "▲" : "▼"}
                    </button>
                )}
            </div>

            {/* 분석 결과 */}
            <div>
                <label className="block text-lg font-semibold">분석 결과</label>

                <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-gray-700">
                    {showAnalysis ? analysis : shorten(analysis)}
                </div>

                {analysis.length > MAX_LENGTH && (
                    <button
                        className="text-sm text-gray-600 hover:text-black mt-2"
                        onClick={() => setShowAnalysis(!showAnalysis)}
                    >
                        {showAnalysis ? "접기 ▲" : "더보기 ▼"}
                    </button>
                )}
            </div>

            {/* 감정 */}
            <div>
                <label className="block text-lg font-semibold">감정</label>
                <div className="mt-2 p-3 rounded-lg bg-gray-100 text-center text-lg font-medium">
                    {emotion}
                </div>
            </div>

            {/* 추천 음악 */}
            <div>
                <label className="block text-lg font-semibold">추천 음악</label>
                {/* 레코드 */}
                <div className="flex justify-center">
                    <RecordPlayer
                        coverUrl={music.coverUrl ?? "https://i.scdn.co/image/ab67616d0000b273e6cfbd918066c7f684bb6a53"}
                        musicUrl={music.url}
                        emotionName={emotion}
                    />
                </div>
                <button
                    className="mt-3 w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                    onClick={() => window.open(music.url, "_blank")}
                >
                    {music.title}
                </button>
            </div>
        </div>
    );
}
