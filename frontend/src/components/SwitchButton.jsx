// src/components/SwitchButton.jsx

import { useState } from "react";

export default function SwitchButton({ text, onClick }) {
    const [isOn, setIsOn] = useState(false);

    const handleClick = () => {
        setIsOn(!isOn);
        if (onClick) onClick();
    };

    return (
        <button
            onClick={handleClick}
            className={`
            w-full bg-black py-3 
            text-center active:opacity-80
            px-4 rounded-md font-semibold
            text-white
            hover:bg-gray-300 hover:text-black
            transition-all duration-300`}
        >
            {isOn ? "나의 글" : "감정 그래프"}
        </button>
    );
}