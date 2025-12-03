// frontend/src/pages/AnalysisPage/RecordPlayer.jsx

const EMOTION_MAP = {
    "기쁨": "joy",
    "슬픔": "sad",
    "화남": "angry",
    "보통": "neutral",
};

const EMOTION_GRADIENTS = {
    joy: "linear-gradient(135deg, #FFD892 0%, #F3B95F 100%)",
    sad: "linear-gradient(135deg, #A3C9E9 0%, #6AA9D8 100%)",
    angry: "linear-gradient(135deg, #FF8A8A 0%, #F26A6A 100%)",
    neutral: "linear-gradient(135deg, #C8F3B4 0%, #9EE693 100%)",
};

export default function RecordPlayer({ coverUrl, musicUrl, emotionName }) {
    const emotionKey = EMOTION_MAP[emotionName] || "neutral";
    const vinylGradient = EMOTION_GRADIENTS[emotionKey];

    return (
        <div
            className="
                relative w-44 h-44 mx-auto cursor-pointer 
                transition-transform duration-300 hover:scale-105
                rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                mt-3 mb-4
            "
            onClick={() => musicUrl && window.open(musicUrl, "_blank")}
        >

            {/* 회전하는 레코드 본체 */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden animate-spin"
                style={{ background: vinylGradient }}
            >
                {/* 빛 반사 */}
                <div
                    className="
                        absolute inset-0 rounded-full 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        animate-shine
                    "
                />
            </div>

            {/* 중앙 앨범 커버 */}
            <div
                className="
                    absolute top-1/2 left-1/2 w-16 h-16 
                    transform -translate-x-1/2 -translate-y-1/2
                    rounded-full border-4 border-white shadow-md
                    bg-center bg-cover z-10
                "
                style={{ backgroundImage: `url(${coverUrl})` }}
            />
        </div>
    );
}
