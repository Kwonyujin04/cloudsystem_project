// src/components/DiaryList.jsx
import { motion } from "framer-motion";
import DiaryItem from "./DiaryItem";

export default function DiaryList({ diaries }) {

    const container = {
        visible: {
            transition: { staggerChildren: 0.15 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-4 mt-4"
        >
            {diaries.map((entry, index) => (
                <motion.div key={index} variants={item}>
                    <DiaryItem
                        date={entry.date}
                        content={entry.content}
                        keywords={entry.keywords}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
