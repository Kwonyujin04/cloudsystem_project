// src/components/DiaryList.jsx

import DiaryItem from "./DiaryItem";

export default function DiaryList({ diaries }) {
    return (
        <div className="flex flex-col space-y-4 mt-4">
            {diaries.map((item, index) => (
                <DiaryItem
                    key={index}
                    date={item.date}
                    content={item.content}
                    keywords={item.keywords}
                />
            ))}
        </div>
    );
}
