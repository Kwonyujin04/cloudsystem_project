import EmotionDonutChart from "./EmotionDonutChart";

const EMOTION_TO_KEY = {
    "행복": "joy",

    "슬픔": "sad",
    "공포": "sad",
    "놀람": "sad",

    "혐오": "angry",
    "분노": "angry",

    "중립": "neutral",
};

export default function EmotionGraph({ diaries }) {
    const emotionCount = {
        joy: 0,
        sad: 0,
        angry: 0,
        neutral: 0,
    };

    diaries.forEach(diary => {
        const raw = diary.emotion;
        const key = EMOTION_TO_KEY[raw] ?? "neutral";
        emotionCount[key]++;
    });

    const data = [
        { name: "기쁨", value: emotionCount.joy },
        { name: "슬픔", value: emotionCount.sad },
        { name: "화남", value: emotionCount.angry },
        { name: "보통", value: emotionCount.neutral },
    ];

    return (
        <div className="w-full flex justify-center items-center">
            <EmotionDonutChart data={data} />
        </div>
    );
}
