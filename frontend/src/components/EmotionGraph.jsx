import EmotionDonutChart from "./EmotionDonutChart";

export default function EmotionGraph({ diaries }) {

    const emotionCount = {
        joy: 0,
        sad: 0,
        angry: 0,
        neutral: 0,
    };

    diaries.forEach(diary => {
        if (emotionCount[diary.emotion] !== undefined) {
            emotionCount[diary.emotion]++;
        }
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
