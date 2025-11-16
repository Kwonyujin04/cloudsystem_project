// src/components/DiaryItem.jsx

export default function DiaryItem({ date, content, keywords }) {
    return (
        <div className="w-full bg-white border rounded-lg p-4 shadow-sm flex flex-col space-y-2">

            {/* 날짜 */}
            <p className="text-gray-600 text-sm">{date}</p>

            {/* 내용 */}
            <p className="text-gray-800">{content}</p>

            {/* 키워드 */}
            {keywords && (
                <p className="text-gray-500 text-sm">
                    키워드: {keywords.join(", ")}
                </p>
            )}

        </div>
    );
}
