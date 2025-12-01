// src/components/DiaryItem.jsx
import { motion } from "framer-motion";

export default function DiaryItem({ date, content, keywords }) {
    return (
        <motion.div
            layout
            className="w-full bg-white border rounded-lg p-4 shadow-sm flex flex-col space-y-2"
        >
            <p className="text-gray-600 text-sm">{date}</p>
            <p className="text-gray-800">{content}</p>
            {keywords && (
                <p className="text-gray-500 text-sm">
                    키워드: {keywords.join(", ")}
                </p>
            )}
        </motion.div>
    );
}
